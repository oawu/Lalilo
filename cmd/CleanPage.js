
const Path = require('path')
const FileSystem = require('fs')
const Process = require('child_process')

const { argv, println, scanDir, access, isDirectory, exists, mkdir } = require('@oawu/helper')
const Queue = require('@oawu/queue')
const Config = require('./config/Serve.js')

const ENV = argv(['--env'])
const baseURL = argv(['--base-url'])
const dirRoot = argv(['--dir'])
const dirEntry = argv(['--entry'])

const EXT = ENV === 'Production' ? '.html' : ''

const dirPage = dirEntry + (Config.dir.html !== '' ? Config.dir.html + Path.sep : '')
const dirApi = dirEntry + 'api' + Path.sep
const dirArticles = dirRoot + 'articles' + Path.sep

const errorHandler = error => {
  println(error instanceof Error ? error.message : error)
  process.exit(1)
}

const isMenu = name => {
  const match = /^(?<index>\d{3})(\s*_\|_\s*)(?<key>[^\/(_\|_)]+)(\s*_\|_\s*)(?<text>[^\/(_\|_)]+)(\s*_\|_\s*)(?<order>[^\/(_\|_)]+)\s*$/.exec(name)
  return match && match.groups && match.groups.index && match.groups.key && match.groups.text && match.groups.order
    ? { index: parseInt(match.groups.index, 10), menu: { key: match.groups.key, text: match.groups.text, order: match.groups.order.toUpperCase() } }
    : null
}

const isArticle = name => {
  const match = /^(?<index>\d{3})(\s*_\|_\s*)(?<tip>[^\/]*)\s*\.json\s*?$/.exec(name)
  return match && match.groups && match.groups.index && match.groups.tip
    ? { index: parseInt(match.groups.index, 10), tip: match.groups.tip }
    : null
}

const menuHTML = dir => require(dirApi + 'menu.json')
  .map(({ key, text, count, isDir }) => {
    return `a(span('${text}')${count > 0 ? `->count(${count})` : ''})->href('${baseURL + (isDir ? key + '/pages/index' : key) + EXT}')${ key == dir ? "->class('active')" : ''}`
  }).map(t => "\n" + ' '.repeat(8) + t) + "\n" + ' '.repeat(6)

const articleHTML = (article, dir) => {
  const href = (baseURL + dir + '/' + article.key + EXT).replace("'", "\\'")

  const lines = []
  lines.push("div(")
  lines.push("  div(")
  lines.push("    a(")
  lines.push(`      b('${article.title.replace("'", "\\'")}'),`)
  lines.push(`      p('${article.subtitle.replace("'", "\\'")}'),`)

  const metas = []
  article.tags.length && metas.push("div(\n" + article.tags.map(tag => "a('" + tag.replace("'", "\\'") + "')->href('')").map(t => ' '.repeat(18) + t).join(",\n") + "\n" + ' '.repeat(16) + ")->class('tags')")
  article.at && metas.push("time('" + article.at.replace("'", "\\'") + "')")
  metas ? lines.push("    )->href('" + href + "'),", "    div(\n" + metas.map(t => ' '.repeat(16) + t).join(",\n"), "    )->class('meta')") : lines.push("    )->href('" + href + "')")
  
  if (article.cover) {
    const cover = /^\//.exec(article.cover) ? baseURL + article.cover.replace(/^\//, '') : article.cover

    lines.push("  )->class('info'),")
    lines.push("  a(")
    lines.push("    figure(")
    lines.push("      img()->src('" + cover + "')")
    lines.push("    )->style(\"background-image: url('" + cover.replace("'", "\\'") + "');\")")
    lines.push("  )->href('" + href + "')")
  } else {
    lines.push("  )->class('info')")  
  }

  lines.push(")->class('article')")
  return lines.map(t => ' '.repeat(10) + t).join("\n")
}

const pagination = (pages, limit = 3) => {
  const nowIndex = pages.map(({ active }) => active).indexOf(true)
  const p1 = pages.splice(0, nowIndex + limit)

  nowIndex + 1 < p1.length && p1.push({ ...p1[nowIndex + 1], type: 'next' })
  pages.length && p1.push({ ...pages.pop(), type: 'last' })

  const p0 = p1.splice(0, nowIndex)
  const p3 = p0.splice(-(limit - 1))

  p3.length && p1.unshift({...p3[p3.length - 1], type: 'prev' }, ...p3)
  p0.length && p1.unshift({...p0.shift(), type: 'first' })

  return p1
}

const writeArticles = (file, text, articles, dir, pages) => {

  pages = pagination(pages).map(({ index, name, active, type, href }) => ({ index, name, active, type, href }))

  const footerHTML = pages.length > 1 ? ["footer(\n" + pages.map(page => `a(${page.type ? `i()->class('${page.type}')` : `'${page.index + 1}'`})${page.active ? "->class('active')" : `->href('${page.href.replace("'", "\\'")}')`}`).map(t => ' '.repeat(12) + t).join(",\n"), ')'].map(t => ' '.repeat(10) + t).join("\n") : null

  articles = articles.map(require).map(({ key, cover = null, title = '', subtitle = '', at = null, tags = [] }) => ({ key, cover, title, subtitle, at, tags }))

  const lines = []
  lines.push('<?php', '', '/**', ' * @author      OA Wu <oawu.tw@gmail.com>', ' * @copyright   Copyright (c) 2015 - 2022, LaliloCore', ' * @license     http://opensource.org/licenses/MIT  MIT License', ' * @link        https://www.ioa.tw/', ' */', '', 'namespace HTML;', '', '')
  
  lines.push("echo html(")
  lines.push("  head(")
  lines.push("    meta()->attr('http-equiv', 'Content-Language')->content('zh-tw'),")
  lines.push("    meta()->attr('http-equiv', 'Content-type')->content('text/html; charset=utf-8'),")
  lines.push("    meta()->name('viewport')->content('width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui'),")
  lines.push("")
  lines.push("    title(TITLE),")
  lines.push("")
  lines.push("    asset()")
  lines.push("      ->css('icon.css')")
  lines.push("      ->css('public.css')")
  lines.push("      ->css('layout.css')")
  lines.push("      ->js('https://code.jquery.com/jquery-1.12.4.min.js')")
  lines.push("      ->js('index.js')")
  lines.push("  ),")
  lines.push("  body(")
  lines.push("    div(")
  lines.push("      aside(" + menuHTML(dir) + ")->id('menu'),")
  lines.push("      div()->id('cover'),")
  lines.push("      header(")
  lines.push("        label()->id('hamburger'),")
  lines.push("        b(\"OA Wu's Blog\")")
  lines.push("      )->id('header'),")
  lines.push("      div(")
  lines.push("        article(")
  lines.push("          header(")
  lines.push("            h1('" + text.replace("'", "\\'") + "')")
  
  if (articles.length)
    lines.push("          ),", [...articles.map(article => articleHTML(article, dir)), footerHTML].filter(t => t !== null).join(",\n"))
  else
    lines.push("          )")

  lines.push("        )->id('articles')")
  lines.push("      )->id('main')")
  lines.push("    )->id('app')")
  lines.push("  )")
  lines.push(")->lang('zh-Hant');")

  FileSystem.writeFile(file, lines.filter(t => t !== null).join("\n"), { encoding: 'utf8' }, error => {
console.error(1);
process.exit()

  })
}

Queue()
  .enqueue(next => Process.exec('rm -rf ' + dirPage + '*', error => error ? errorHandler(error) : next()))
  .enqueue(next => FileSystem.writeFile(dirPage + '.gitignore', "*\n!/.gitkeep\n!/.gitignore", { encoding: 'utf8' }, error => error ? errorHandler(error) : FileSystem.writeFile(dirPage + '.gitkeep', "", { encoding: 'utf8' }, error => error ? errorHandler(error) : next())))
  .enqueue(next => Process.exec('rm -rf ' + dirApi + '*', error => error ? errorHandler(error) : next()))
  .enqueue(next => exists(dirApi) || mkdir(dirApi) ? next() : errorHandler(new Error('建立 API 目錄失敗！')))
  .enqueue(next => next(FileSystem.readdirSync(dirArticles).map(name => {

    const path = dirArticles + name
    if (!access(path)) return null
  
    const limit = 10
    const isDir = isDirectory(path)

    let index = null
    let key = null
    let text = null
    let count = 0
    let pages = []

    if (isDir) {
      const match = isMenu(name)
      if (!match) return null

      index = match.index
      key   = match.menu.key
      text  = match.menu.text
      const order = ['ASC', 'DESC'].includes(match.menu.order) ? match.menu.order : 'ASC'
      
      const articles = FileSystem.readdirSync(path + Path.sep).map(name => {
        if (!access(path + Path.sep + name)) return null
        const tmp = isArticle(name)
        if (!tmp) return null
        return { tmp, name }
      })
        .filter(t => t !== null)
        .sort(({ tmp: { index: a } }, { tmp: { index: b } }) => order === 'ASC' ? a - b : b - a)
        .map(({ name }) => path + Path.sep + name)

      count = articles.length

      for (let i = 0; i < articles.length; i += limit)
        pages.push({ index: pages.length, name: pages.length ? '' + (pages.length + 1) : 'index', articles: articles.slice(i, i + limit) })
      
    } else {
      const match = isArticle(name)
      if (!match) return null

      index = match.index
      const tmp = require(path)
      key   = tmp.key
      text  = tmp.title
      count = 0
      menu  = null
      pages = []
    }

    return {
      index,
      key,
      text,
      name,
      count,
      isDir,
      pages,
      path: path + (isDir ? Path.sep : '')
    }
  }).filter(t => t !== null).sort(({ index: a }, { index: b }) => a - b)))
  .enqueue((next, menu) => {
    const items = menu.map(({ key, text, count, isDir}) => ({ key, text, count, isDir}))
    FileSystem.writeFile(dirApi + 'menu.json', ENV === 'Production' ? JSON.stringify(items) : JSON.stringify(items, null, 2), { encoding: 'utf8' }, error => error
      ? errorHandler(error)
      : next(menu))
  })
  .enqueue((next, menu) => {
    menu.filter(({ isDir }) => isDir)
      .forEach(({ key, pages, text }) => {
        const dir = dirPage + key + Path.sep

        mkdir(dir) && mkdir(dir + 'pages' + Path.sep) && pages.forEach(({ name, articles }, i) => {
          writeArticles(dir + 'pages' + Path.sep + name + '.php', text, articles, key, pages.map(page => ({ ...page, href: baseURL + key + '/pages/' + page.name + EXT, active: page.name === name, type: null })))
        })
      })
  })
