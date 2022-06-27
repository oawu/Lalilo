
const Path = require('path')
const FileSystem = require('fs')

const { argv, println, scanDir, access, isDirectory, exists, mkdir } = require('@oawu/helper')
const Queue = require('@oawu/queue')
const Config = require('./config/Serve.js')

const env     = argv(['-E', '--env'])
const baseURL = argv(['-E', '--base-url'])

const dirRoot = argv(['-E', '--dir'])
const dirEntry = argv(['-E', '--entry'])
const dirSrc = dirEntry + (Config.dir.html !== '' ? Config.dir.html + Path.sep : '')
const dirApi = dirEntry + 'api' + Path.sep
const dirArticles = dirRoot + 'articles' + Path.sep

const errorHandler = error => {
  println(error instanceof Error ? error.message : error)
  process.exit(1)
}

Queue()
  .enqueue(next => Promise.all(scanDir(dirSrc).filter(file => ['.html', '.php'].includes(Path.extname(file))).map(file => new Promise((resolve, reject) => FileSystem.unlink(file, error => error ? reject(error) : resolve))))
    .then(next)
    .catch(errorHandler))
  .enqueue(next => {
    const Process = require('child_process')
    Process.exec('rm -rf ' + dirApi + '*', error => error ? errorHandler(error) : next())
  })
  .enqueue(next => exists(dirApi) || mkdir(dirApi) ? next() : errorHandler(new Error('建立 API 目錄失敗！')))
  .enqueue(next => next(FileSystem.readdirSync(dirArticles).map(name => {
    const path = dirArticles + name
    if (!access(path)) return null
    const match = /^(?<index>\d{3})\s*_\|_\s*(?<key>.*)\s*_\|_\s*(?<text>.*)\s*(\.json)?$/.exec(name)
    if (!(match && match.groups && match.groups.index && match.groups.key && match.groups.text)) return null
    const isDir = isDirectory(path)
    const count = isDir ? FileSystem.readdirSync(path + Path.sep).filter(name => {
      const file = path + Path.sep + name
      if (!access(file)) return false
      const match = /^(?<index>\d{3})\s*_\|_\s*(?<tip>.*)\s*(\.json)?$/.exec(name)
      return match && match.groups && match.groups.index && match.groups.tip
    }).length : 0
    return { index: parseInt(match.groups.index, 10), key: match.groups.key, text: match.groups.text, name, isDir, path: path + (isDir ? Path.sep : ''), count }
  }).filter(t => t !== null)))
  .enqueue((next, menu) => {
    FileSystem.writeFile(dirApi + 'menu.json', env === 'Production' ? JSON.stringify(menu) : JSON.stringify(menu, null, 2), { encoding: 'utf8' }, error => error
      ? errorHandler(error)
      : next())
  })


