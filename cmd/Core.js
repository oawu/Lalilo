
const FileSystem = require('fs')
const Path = require('path')

const { println, access, exists, isDirectory } = require('@oawu/helper')


const KEY_PAGES = 'pages'
const LIMIT_PAGE = 10

const errorHandler = error => {
  println(error instanceof Error
    ? error.message
    : error)
  process.exit(1)
}

const isMenu = name => {
  const match = /^(?<index>\d{3})(\s*_\|_\s*)(?<key>[^\/(_\|_)]+)(\s*_\|_\s*)(?<text>[^\/(_\|_)]+)(\s*_\|_\s*)(?<order>[^\/(_\|_)]+)\s*$/.exec(name)
  return match && match.groups && match.groups.index && match.groups.key && match.groups.text && match.groups.order
    ? { index: parseInt(match.groups.index, 10), menu: { key: match.groups.key, text: match.groups.text, order: ['ASC', 'DESC'].includes(match.groups.order.toUpperCase()) ? match.groups.order.toUpperCase() : 'ASC' } }
    : null
}

const isArticle = name => {
  const match = /^(?<index>\d{3})(\s*_\|_\s*)(?<tip>[^\/]*)\s*\.json\s*?$/.exec(name)
  return match && match.groups && match.groups.index && match.groups.tip
    ? { index: parseInt(match.groups.index, 10), tip: match.groups.tip }
    : null
}

const pagination = (pages, limit = 3) => {
  const nowIndex = pages.map(({ type }) => type).indexOf('active')
  const p1 = pages.splice(0, nowIndex + limit)

  if (nowIndex + 1 < p1.length) {
    let tmp = p1[nowIndex + 1]
    p1.push({ ...tmp, get href () { return tmp.href }, type: 'next' })
  }
  
  if (pages.length) {
    let tmp = pages.pop()
    p1.push({ ...tmp, get href () { return tmp.href }, type: 'last' })
  }

  const p0 = p1.splice(0, nowIndex)
  const p3 = p0.splice(-(limit - 1))

  if (p3.length) {
    let tmp = p3[p3.length - 1]
    p1.unshift({...tmp, get href () { return tmp.href }, type: 'prev' }, ...p3)
  }
  if (p0.length) {
    let tmp = p0.shift()
    p1.unshift({...tmp, get href () { return tmp.href }, type: 'first' })
  }

  return p1
}

const fill0 = (num, zero = '0', limit = 3) => (num = '' + num, limit = limit - num.length, limit > 0 ? `${zero.repeat(limit)}${num}` : num)
const readArticles = (baseURL, EXT, dirPage, dirArticles, dirEntry) => {
  const menuItems = []
  const allArticles = []
  const allPages = []
  const rootArticles = []

  const files = FileSystem
                  .readdirSync(dirArticles)
                  .map(name => ({ name, path: dirArticles + name }))
                  .map(({ path, name }) => {
                    if (!exists(path) && access(path)) return null
                    if (isDirectory(path)) {
                      const match = isMenu(name)
                      return match ? { path, name, match } : null
                    } else {
                      const match = isArticle(name)
                      return match ? { path, name, match } : null
                    }
                  })
                  .filter(tmp => tmp !== null)
                  .sort(({ match: { index: a } }, { match: { index: b } }) => a - b)
                  .map(({ path, name, match }) => match.tip ? {
                    path, name, menu: null
                  } : {
                    path, name, menu: match.menu
                  })

  for (const { path, name, menu } of files) {
    if (menu) {
      menu.href  = baseURL + menu.key + '/' + KEY_PAGES + '/index' + EXT

      let articles = []

      for (const name of FileSystem.readdirSync(path + Path.sep)) {
        const articlePath = path + Path.sep + name
        if (!(exists(articlePath) && access(articlePath)))
          continue
        
        const match = isArticle(name)
        
        if (!match)
          continue

        const baseDir = dirEntry + 'img' + Path.sep + menu.key + Path.sep + fill0(match.index) + Path.sep
        let icon = null, cover = null

        for (let e of ['jpg', 'jpeg', 'png', 'gif']) {
          if (exists(baseDir + 'cover.' + e) && access(baseDir + 'cover.' + e)) cover = e
          if (exists(baseDir + 'icon.' + e) && access(baseDir + 'icon.' + e)) icon = e
        }

        const article = require(articlePath)

        article.$ = {
          dir: dirPage + menu.key + Path.sep,
          iconURL: icon ? baseURL + 'img/' + menu.key + '/' + fill0(match.index) + '/icon.' + icon : null,
          cover: cover ? {
            ext: cover,
            url: baseURL + 'img/' + menu.key + '/' + fill0(match.index) + '/cover.' + cover
          } : null,

          get menu () { return menuItems.map(item => ({ ...item, active: item == menu })) },
          get href () { return baseURL + menu.key + '/' + article.key + EXT },
          get path () { return this.dir + article.key + '.html' },
          get next () {
            const index = articles.indexOf(article) + 1
            return index >= 1 && index < articles.length ? articles[index] : null
          },
          get prev () {
            const index = articles.indexOf(article) - 1
            return index >= 0 && index < articles.length ? articles[index] : null
          }
        }

        articles.push({ index: match.index, article })
      }

      articles = articles
        .sort(({ index: a }, { index: b }) => menu.order === 'ASC' ? a - b : b - a)
        .map(({ article }) => article)

      menu.count = articles.length
      delete menu.order

      const pages = []
      for (let i = 0; i < articles.length; i += LIMIT_PAGE)
        pages.push({
          index: pages.length,
          dir: dirPage + menu.key + Path.sep + KEY_PAGES + Path.sep,

          get articles () { return articles.slice(i, i + LIMIT_PAGE) },
          name: pages.length ? '' + (pages.length + 1) : 'index',

          get menu () { return menuItems.map(item => ({ ...item, active: item == menu })) },
          get href () { return baseURL + menu.key + '/' + KEY_PAGES + '/' + this.name + EXT },
          get path () { return this.dir + this.name + '.html' },
          get pages () { return pagination(pages.map((page, i) => ({
            text: i + 1 + '',
            type: this.index == i ? 'active' : null,
            get href () { return page.href }
          }))) }
        })

      menuItems.push(menu)
      allArticles.push(...articles)
      allPages.push(...pages)
    } else {
      const article = require(path)

      const baseDir = dirEntry + 'img' + Path.sep + article.key + Path.sep
        let icon = null, cover = null

        for (let e of ['jpg', 'jpeg', 'png', 'gif']) {
          if (exists(baseDir + '.cover' + e) && access(baseDir + '.cover' + e)) cover = e
          if (exists(baseDir + '.icon' + e) && access(baseDir + '.icon' + e)) icon = e
        }

      const tmp = {
        key: article.key,
        text: article.title,
        href: baseURL + article.key + EXT,
        count: null
      }
      article.$ = {
        dir: dirPage,
        iconURL: icon ? baseURL + 'img/' + article.key + '/icon.' + icon : null,
        cover: cover ? {
          ext: cover,
          url: baseURL + 'img/' + article.key + '/cover.' + cover
        } : null,
        get menu () { return menuItems.map(item => ({ ...item, active: item == tmp })) },
        get href () { return baseURL + article.key + EXT },
        get path () { return this.dir + article.key + '.html' },
        get next () {
          // const index = rootArticles.indexOf(article) + 1
          // return index >= 1 && index < rootArticles.length ? rootArticles[index] : null
        },
        get prev () {
          // const index = rootArticles.indexOf(article) - 1
          // return index >= 0 && index < rootArticles.length ? rootArticles[index] : null
        }
      }

      menuItems.push(tmp)
      rootArticles.push(article)
      allArticles.push(article)
    }
  }

  return {
    menu: menuItems.sort(({ index: a }, { index: b }) => a - b),
    pages: allPages,
    articles: allArticles,
  }
}

module.exports = {
  errorHandler, isMenu, isArticle, readArticles
}