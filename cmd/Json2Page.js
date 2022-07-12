const Path = require('path')
const FileSystem = require('fs')

// const { argv, println } = require('@oawu/helper')
// const Config = require('./config/Serve.js')

// const ENV = argv(['--env'])
// const dirRoot = argv(['--dir'])
// const baseURL = argv(['--base-url'])
// const dirEntry = argv(['--entry'])
// const jsonFile = argv(['--file'])

// const EXT = ENV === 'Production' ? '.html' : ''
// const dirPage = dirEntry + (Config.dir.html !== '' ? Config.dir.html + Path.sep : '')
// const dirArticles = dirRoot + 'articles' + Path.sep
// const dirApi = dirEntry + 'api' + Path.sep

// const errorHandler = error => {
//   println(error instanceof Error ? error.message : error)
//   process.exit(1)
// }

// const isMenuArticle = path => {
//   const name = Path.relative(dirArticles, path)
  
//   const match = /^(?<index1>\d{3})(\s*_\|_\s*)(?<key>[^\/(_\|_)]+)(\s*_\|_\s*)(?<text>[^\/(_\|_)]+)(\s*_\|_\s*)(?<order>[^\/(_\|_)]+)\s*(\/)(?<index2>\d{3})(\s*_\|_\s*)(?<tip>[^\/]*)\s*\.json\s*?$/.exec(name)
//   if (!(match && match.groups && match.groups.index1 && match.groups.key && match.groups.text && match.groups.order && match.groups.index2 && match.groups.tip))
//     return null
  
//   const article = require(path)
  
//   return {
//     menu: { index: match.groups.index1, key: match.groups.key, text: match.groups.text, order: match.groups.order.toUpperCase() },
//     article: {
//       index: match.groups.index2,
//       ...article
//     }
//   }
// }

// const isRootArticle = path => {
//   const name = Path.relative(dirArticles, path)
  
//   const match = /^(?<index>\d{3})(\s*_\|_\s*)(?<tip>[^\/]*)\s*\.json\s*?$/.exec(name)

//   if (!(match && match.groups && match.groups.index && match.groups.tip))
//     return null

//   const article = require(path)

//   return {
//     menu: null,
//     article
//   }
// }

// const json = isMenuArticle(jsonFile) || isRootArticle(jsonFile)

// const menuHTML = require(dirApi + 'menu.json')
//   .map(({ key, text, count, isDir }) => {
//     return `a(span('${text}')${isDir ? `->count(${count})` : ''})->href('${baseURL + (isDir ? key + '/pages/index' : key) + EXT}')${ json.menu && key == json.menu.key ? "->class('active')" : ''}`
//   }).map(t => "\n" + ' '.repeat(8) + t) + "\n" + ' '.repeat(6)

// const lines = []
// lines.push('<?php', '', '/**', ' * @author      OA Wu <oawu.tw@gmail.com>', ' * @copyright   Copyright (c) 2015 - 2022, LaliloCore', ' * @license     http://opensource.org/licenses/MIT  MIT License', ' * @link        https://www.ioa.tw/', ' */', '', 'namespace HTML;', '', '')
// lines.push("echo html(")
// lines.push("  head(")
// lines.push("    meta()->attr('http-equiv', 'Content-Language')->content('zh-tw'),")
// lines.push("    meta()->attr('http-equiv', 'Content-type')->content('text/html; charset=utf-8'),")
// lines.push("    meta()->name('viewport')->content('width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui'),")
// lines.push("")
// lines.push("    title(TITLE),")
// lines.push("")
// lines.push("    asset()")
// lines.push("      ->css('icon.css')")
// lines.push("      ->css('public.css')")
// lines.push("      ->css('layout.css')")
// lines.push("      ->js('https://code.jquery.com/jquery-1.12.4.min.js')")
// lines.push("      ->js('index.js')")
// lines.push("  ),")
// lines.push("  body(")
// lines.push("    div(")
// lines.push("      aside(" + menuHTML + ")->id('menu'),")
// lines.push("      div()->id('cover'),")
// lines.push("      header(")
// lines.push("        label()->id('hamburger'),")
// lines.push("        b(\"OA Wu's Blog\")")
// lines.push("      )->id('header')")
// lines.push("    )->id('app')")
// lines.push("  )")
// lines.push(")->lang('zh-Hant');")


// FileSystem.writeFile(dirPage + (json.menu ? json.menu.key + Path.sep : '') + (json.article.key) + '.php', lines.join("\n"), { encoding: 'utf8' }, error => {

// })
