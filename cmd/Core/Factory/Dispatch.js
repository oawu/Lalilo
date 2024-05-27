/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path         = require('path')

const queue        = require('@oawu/queue').create()

const Helper       = require('@oawu/_Helper')
const FactoryIcon  = require('@oawu/_FactoryIcon')
const FactoryScss  = require('@oawu/_FactoryScss')
const FactoryFile  = require('@oawu/_FactoryFile')

const iconTimerMap = new Map()
const scssTimerMap = new Map()
const fileTimerMap = new Map()

const Config       = require('@oawu/_Config')

module.exports = (file, action) => {
  const last = file.split(Path.sep).pop()

  if (last == '.DS_Store') {
    return
  }
  
  const ext = Path.extname(last).toLowerCase()

  if (Helper.Fs.inDir(Config.Source.dir.icon, file) && ext == '.css' && last == 'style.css') {
    clearTimeout(iconTimerMap.get(file))

    return iconTimerMap.set(file, setTimeout(_ => queue.enqueue(next => {
      if (typeof action != 'function') {
        iconTimerMap.delete(file)
        return next()
      }

      const icon = FactoryIcon(file)
      action = action(icon)

      iconTimerMap.delete(file)
      typeof action == 'function'
        ? action.call(icon, next)
        : next()
    }), 357))
  }

  if (Helper.Fs.inDir(Config.Source.dir.scss, file) && ext == '.scss') {
    clearTimeout(scssTimerMap.get(file))

    return scssTimerMap.set(file, setTimeout(_ => queue.enqueue(next => {
      if (typeof action != 'function') {
        scssTimerMap.delete(file)
        return next()
      }

      const scss = FactoryScss(file)
      action = action(scss)

      scssTimerMap.delete(file)

      typeof action == 'function'
        ? action.call(scss, next)
        : next()
    }), 357))
  }

  if (Helper.Fs.inDir(Config.Source.path, file)
    && !Config.Serve.watch.ignoreDirs.filter(dir => Helper.Fs.inDir(dir, file)).length
    && Config.Serve.watch.exts.includes(ext)) {

    clearTimeout(fileTimerMap.get(file))

    return fileTimerMap.set(file, setTimeout(_ => queue.enqueue(next => {
      if (typeof action != 'function') {
        fileTimerMap.delete(file)
        return next()
      }

      const _file = FactoryFile(file)
      action = action(_file)

      fileTimerMap.delete(file)

      typeof action == 'function'
        ? action.call(_file, next)
        : next()
    }), 357))
  }
}
