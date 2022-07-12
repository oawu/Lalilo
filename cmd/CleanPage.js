
const Path       = require('path')
const FileSystem = require('fs')
const Process    = require('child_process')
const ejs        = require('ejs')

const { argv, exists, mkdir, access, isDirectory } = require('@oawu/helper')
const Queue = require('@oawu/queue')

const Config = require('./config/Serve.js')
const { errorHandler, readArticles } = require('./Core.js')

const ENV      = argv(['--env'])
const dirEntry = argv(['--entry'])
const dirRoot  = argv(['--dir'])
const baseURL  = argv(['--base-url'])

const dirPage = dirEntry + (Config.dir.html !== '' ? Config.dir.html + Path.sep : '')
const dirArticles = dirRoot + 'articles' + Path.sep
const dirTemplates = dirRoot + 'templates' + Path.sep

const EXT = ENV === 'Production' ? '.html' : ''

const writePage = (page, resolve, reject) => {
  exists(page.dir) || mkdir(page.dir, true)

  exists(page.dir) && access(page.dir) && isDirectory(page.dir)
    ? Promise.all([
      new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'component' + Path.sep + 'menu.ejs', { items: page.menu }, (error, str) => error ? reject(error) : resolve(str.trim()))),
      new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'component' + Path.sep + 'cover.ejs', (error, str) => error ? resolve(error) : resolve(str.trim()))),
      new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'articles-article.ejs', { articles: page.articles }, (error, str) => error ? resolve(error) : resolve(str.trim()))),
      new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'articles-pages.ejs', { pages: page.pages }, (error, str) => error ? resolve(error) : resolve(str.trim()))),
    ])
    .catch(reject)
    .then(([menu = '', cover = '', articles = '', pages = '']) => {
      ejs.renderFile(dirTemplates + 'articles.ejs', { menu, cover, articles, pages, header: page.menu.filter(({ active }) => active).shift() }, (error, str) => error
      ? reject(error)
      : FileSystem.writeFile(page.path, str.trim(), { encoding: 'utf8' }, error => error
        ? reject(error)
        : resolve(page.path)))
    })
    : reject(new Error('無法建立目錄：' + page.dir))
}

Queue()
  .enqueue(
    next => Process.exec('rm -rf ' + dirPage + '*', error => error
      ? errorHandler(error)
      : next()))
  .enqueue(
    next => FileSystem.writeFile(dirPage + '.gitignore', "*\n!/.gitkeep\n!/.gitignore", { encoding: 'utf8' },
      error => error
        ? errorHandler(error)
        : FileSystem.writeFile(dirPage + '.gitkeep', "", { encoding: 'utf8' },
          error => error
            ? errorHandler(error)
            : next())))
  
  .enqueue(next => next(readArticles(baseURL, EXT, dirPage, dirArticles)))

  .enqueue((next, { menu, pages, articles }) => Promise.all(pages.map(page => new Promise(writePage.bind(null, page))))
    .catch(errorHandler)
    .then(files => next({ menu, pages, articles }, files)))
  
  .enqueue((next, { menu, pages, articles }, files) => {
    // console.error(articles.slice(93)[0].$.prev);
    // process.exit()
    
    // console.error(articles.slice(63, 64)[0].title);
    // process.exit()
    
    Promise.all(articles.map(article => new Promise(writeArticle.bind(null, article))))
    .catch(errorHandler)
    .then(files => next({ menu, pages, articles }, files))
  })
  .enqueue((next, { menu, pages, articles }, files) => {
    console.error(files);
    
  })
const attrs = el => [
  el.class && { key: 'class', val: el.class },
  el.href && { key: 'href', val: el.href },
  el.href && { key: 'target', val: '_blank' },
  el.src && { key: 'src', val: el.src },
  el.alt && { key: 'alt', val: el.alt },
].filter(t => t)

const writeBlock = (block, index, format, resolve, reject) => {
  block.e !== undefined
    ? ejs.renderFile(dirTemplates + 'component' + Path.sep + 'attr.ejs', { attrs: attrs(block) }, (error, attr) => !error
      ? typeof block.s == 'object' && Array.isArray(block.s)
        ? Promise.all(block.s.map(block => new Promise(writeBlock.bind(null, block, index + 1, format && block.e != 'pre'))))
            .catch(reject)
            .then(blocks => ejs.renderFile(dirTemplates + 'article-block.ejs', {
              el: block.e, attr, format, index, copy: block.copy || null,
              blocks: blocks.map(block => block.trim()),
              text: ''
            }, (error, str) => error
              ? resolve(error)
              : resolve(str.trim())))
          : ejs.renderFile(dirTemplates + 'article-block.ejs', {
              el: block.e, attr, format, index, copy: block.copy || null,
              blocks: [],
              text: block.t || ''
            }, (error, str) => error
              ? resolve(error)
              : resolve(str.trim()))
      : resolve(error))
    : reject(new Error('錯誤的文章結構！'))
}

const writeArticle = (article, resolve, reject) => {
  exists(article.$.dir) || mkdir(article.$.dir, true)

  exists(article.$.dir) && access(article.$.dir) && isDirectory(article.$.dir)
    ? Promise.all([
      new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'component' + Path.sep + 'menu.ejs', { items: article.$.menu }, (error, str) => error ? reject(error) : resolve(str.trim()))),
      new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'component' + Path.sep + 'cover.ejs', (error, str) => error ? resolve(error) : resolve(str.trim()))),
      new Promise((resolve, reject) => Promise.all(article.blocks.map(block => new Promise(writeBlock.bind(null, block, 6, block.e != 'pre')))).catch(reject).then(resolve)),
      new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'article-tags.ejs', { tags: article.tags || [] }, (error, str) => error ? resolve(error) : resolve(str.trim()))),
      new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'article-refs.ejs', { refs: article.refs || [] }, (error, str) => error ? resolve(error) : resolve(str.trim()))),
      new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'article-prevNext.ejs', { key: article.key, prev: article.$.prev, next: article.$.next }, (error, str) => error ? resolve(error) : resolve(str.trim()))),
      new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'article-footer.ejs', { at: article.at || '' }, (error, str) => error ? resolve(error) : resolve(str.trim()))),
    ])
    .catch(reject)
    .then(([menu = '', cover = '', blocks = [], tags = '', refs = '', prevNext = '', footer = '']) => {

      ejs.renderFile(dirTemplates + 'article.ejs', { menu, cover, blocks, tags, refs, prevNext, footer, article }, (error, str) => {
      // console.error(str);
      // process.exit()
      
        error
        ? reject(error)
        : FileSystem.writeFile(article.$.path, str.trim(), { encoding: 'utf8' }, error => error
          ? reject(error)
          : resolve(article.$.path))

      })
    })
    : reject(new Error('無法建立目錄：' + article.$.dir))
}















// const Path = require('path')
// const FileSystem = require('fs')
// const Process = require('child_process')

// const { argv, println, scanDir, access, isDirectory, exists, mkdir } = require('@oawu/helper')
// const Queue = require('@oawu/queue')
// const Config = require('./config/Serve.js')

// const ENV = argv(['--env'])
// const baseURL = argv(['--base-url'])
// const dirRoot = argv(['--dir'])
// const dirEntry = argv(['--entry'])

// const EXT = ENV === 'Production' ? '.html' : ''

// const dirPage = dirEntry + (Config.dir.html !== '' ? Config.dir.html + Path.sep : '')
// const dirApi = dirEntry + 'api' + Path.sep
// const dirArticles = dirRoot + 'articles' + Path.sep
// const dirTemplates = dirRoot + 'templates' + Path.sep

// const errorHandler = error => {
//   println(error instanceof Error ? error.message : error)
//   process.exit(1)
// }

// const isMenu = name => {
//   const match = /^(?<index>\d{3})(\s*_\|_\s*)(?<key>[^\/(_\|_)]+)(\s*_\|_\s*)(?<text>[^\/(_\|_)]+)(\s*_\|_\s*)(?<order>[^\/(_\|_)]+)\s*$/.exec(name)
//   return match && match.groups && match.groups.index && match.groups.key && match.groups.text && match.groups.order
//     ? { index: parseInt(match.groups.index, 10), menu: { key: match.groups.key, text: match.groups.text, order: match.groups.order.toUpperCase() } }
//     : null
// }

// const isArticle = name => {
//   const match = /^(?<index>\d{3})(\s*_\|_\s*)(?<tip>[^\/]*)\s*\.json\s*?$/.exec(name)
//   return match && match.groups && match.groups.index && match.groups.tip
//     ? { index: parseInt(match.groups.index, 10), tip: match.groups.tip }
//     : null
// }

// const pagination = (pages, limit = 3) => {
//   const nowIndex = pages.map(({ active }) => active).indexOf(true)
//   const p1 = pages.splice(0, nowIndex + limit)

//   nowIndex + 1 < p1.length && p1.push({ ...p1[nowIndex + 1], type: 'next' })
//   pages.length && p1.push({ ...pages.pop(), type: 'last' })

//   const p0 = p1.splice(0, nowIndex)
//   const p3 = p0.splice(-(limit - 1))

//   p3.length && p1.unshift({...p3[p3.length - 1], type: 'prev' }, ...p3)
//   p0.length && p1.unshift({...p0.shift(), type: 'first' })

//   return p1
// }

// const writeArticles = (file, text, articles, dir, pages) => {

//   pages = pagination(pages).map(({ index, name, active, type, href }) => ({ index, name, active, type, href }))

//   articles = articles.map(require).map(({ key, cover = null, title = '', subtitle = '', at = null, tags = [] }) => ({ key, cover: /^\//.exec(cover) ? baseURL + cover.replace(/^\//, '') : cover, title, subtitle, at, tags, href: baseURL + dir + '/' + key + EXT }))

//   const ejs = require('ejs')
  
//   Promise.all([
//     new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'component' + Path.sep + 'menu.ejs', { items: require(dirApi + 'menu.json').map(item => (item.href = baseURL + (item.isDir ? item.key + '/pages/index' : item.key) + EXT, item.isActive = item.key == dir, item)) }, (error, str) => error ? reject(error) : resolve(str.trim()))),
//     new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'component' + Path.sep + 'cover.ejs', (error, str) => error ? resolve(error) : resolve(str.trim()))),
//     new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'articles-article.ejs', { articles }, (error, str) => error ? resolve(error) : resolve(str.trim()))),
//     new Promise((resolve, reject) => ejs.renderFile(dirTemplates + 'articles-pages.ejs', { pages }, (error, str) => error ? resolve(error) : resolve(str.trim()))),
//   ]).then(([menu = '', cover = '', articles = '', pages = '']) => {

//     ejs.renderFile(dirTemplates + 'articles.ejs', { menu, cover, articles, pages }, (error, str) => {
//       // console.error(str);
//       // process.exit()
      
//       error ? errorHandler(error) : FileSystem.writeFile(file, str, { encoding: 'utf8' }, error => error && errorHandler(error))
//     })

//   }).catch(errorHandler)
// }

// Queue()
//   .enqueue(next => Process.exec('rm -rf ' + dirPage + '*', error => error ? errorHandler(error) : next()))
//   .enqueue(next => FileSystem.writeFile(dirPage + '.gitignore', "*\n!/.gitkeep\n!/.gitignore", { encoding: 'utf8' }, error => error ? errorHandler(error) : FileSystem.writeFile(dirPage + '.gitkeep', "", { encoding: 'utf8' }, error => error ? errorHandler(error) : next())))
//   .enqueue(next => Process.exec('rm -rf ' + dirApi + '*', error => error ? errorHandler(error) : next()))
//   .enqueue(next => exists(dirApi) || mkdir(dirApi) ? next() : errorHandler(new Error('建立 API 目錄失敗！')))
//   .enqueue(next => next(FileSystem.readdirSync(dirArticles).map(name => {

//     const path = dirArticles + name
//     if (!access(path)) return null
  
//     const limit = 10
//     const isDir = isDirectory(path)

//     let index = null
//     let key = null
//     let text = null
//     let count = 0
//     let pages = []

//     if (isDir) {
//       const match = isMenu(name)
//       if (!match) return null

//       index = match.index
//       key   = match.menu.key
//       text  = match.menu.text
//       const order = ['ASC', 'DESC'].includes(match.menu.order) ? match.menu.order : 'ASC'
      
//       const articles = FileSystem.readdirSync(path + Path.sep).map(name => {
//         if (!access(path + Path.sep + name)) return null
//         const tmp = isArticle(name)
//         if (!tmp) return null
//         return { tmp, name }
//       })
//         .filter(t => t !== null)
//         .sort(({ tmp: { index: a } }, { tmp: { index: b } }) => order === 'ASC' ? a - b : b - a)
//         .map(({ name }) => path + Path.sep + name)

//       count = articles.length

//       for (let i = 0; i < articles.length; i += limit)
//         pages.push({ index: pages.length, name: pages.length ? '' + (pages.length + 1) : 'index', articles: articles.slice(i, i + limit) })
      
//     } else {
//       const match = isArticle(name)
//       if (!match) return null

//       index = match.index
//       const tmp = require(path)
//       key   = tmp.key
//       text  = tmp.title
//       count = 0
//       menu  = null
//       pages = []
//     }

//     return {
//       index,
//       key,
//       text,
//       name,
//       count,
//       isDir,
//       pages,
//       path: path + (isDir ? Path.sep : '')
//     }
//   }).filter(t => t !== null).sort(({ index: a }, { index: b }) => a - b)))
//   .enqueue((next, menu) => {
//     const items = menu.map(({ key, text, count, isDir}) => ({ key, text, count, isDir}))
//     FileSystem.writeFile(dirApi + 'menu.json', ENV === 'Production' ? JSON.stringify(items) : JSON.stringify(items, null, 2), { encoding: 'utf8' }, error => error
//       ? errorHandler(error)
//       : next(menu))
//   })
//   .enqueue((next, menu) => {
//     menu.filter(({ isDir }) => isDir)
//       .forEach(({ key, pages, text }) => {
//         const dir = dirPage + key + Path.sep

//         mkdir(dir) && mkdir(dir + 'pages' + Path.sep) && pages.forEach(({ name, articles }, i) => {
//           writeArticles(dir + 'pages' + Path.sep + name + '.php', text, articles, key, pages.map(page => ({ ...page, href: baseURL + key + '/pages/' + page.name + EXT, active: page.name === name, type: null })))
//         })
//       })
//   })
