/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path       = require('path')
const FileSystem = require('fs')

const SCSS       = require('@oawu/scss')

const Factory    = require('@oawu/_Factory')
const Notifier   = require('@oawu/_Notifier')
const Helper     = require('@oawu/_Helper')
const Config     = require('@oawu/_Config')

const err1 = error => error.line !== undefined || error.column !== undefined ? [
  `錯誤位置：第 ${error.line !== undefined ? error.line : '?'} 行，第 ${error.column !== undefined ? error.column : '?'} 個字`,
  `錯誤原因：${error.message}`,
] : [
  `錯誤原因：${error.message}`,
]

const Scss = function(file) {
  if (!(this instanceof Scss)) {
    return new Scss(file)
  }

  Factory.call(this, file)

  this.dirs = Helper.Fs.deSlash(Path.relative(Config.Source.dir.scss, this.file))
  this.css = `${Config.Source.dir.css}${[...this.dirs.slice(0, -1), `${Path.basename(this.dirs.pop(), '.scss')}.css`].join(Path.sep)}`
}

Scss.prototype = Object.create(Factory.prototype)

Scss.prototype.build = function(done) {
  return SCSS.file(this.file, (error, result) => {
    if (error) {
      return typeof done == 'function'
        ? done([`無法編譯：${this.name}`, ...err1(error)])
        : null
    }

    if (Helper.Fs.checkDirsExist(Config.Source.dir.css, this.dirs) !== true) {
      return typeof done == 'function'
        ? done([`無法建立目錄：${Path.$.rRoot(Path.dirname(this.css), true)}`])
        : null
    }

    FileSystem.writeFile(this.css, result.utf8.replace(/^\uFEFF/gm, ""), error => {
      if (typeof done != 'function') {
        return null
      }

      return error
        ? done([`無法寫入：${Path.$.rRoot(this.css)}`, error])
        : done([])
    })
  })
}

Scss.prototype.create = function(done) {
  return SCSS.file(this.file, (error, result) => {
    if (error) {
      Helper.Display.LineRed('編譯 scss 失敗')
        .row('檔案', this.name)
        .row('位置', error.line !== undefined || error.column !== undefined ? `第 ${error.line !== undefined ? error.line : '?'} 行，第 ${error.column !== undefined ? error.column : '?'} 個字` : '')
        .row('原因', error.info !== undefined ? error.info : error.message)
        .go()

      Notifier('編譯 scss 失敗')
        .row('檔案', this.name)
        .row('位置', error.line !== undefined || error.column !== undefined ? `第 ${error.line !== undefined ? error.line : '?'} 行，第 ${error.column !== undefined ? error.column : '?'} 個字` : '')
        .go()

      return typeof done == 'function'
        ? done()
        : null
    }
    
    if (Helper.Fs.checkDirsExist(Config.Source.dir.css, this.dirs) !== true) {
      Helper.Display.LineRed('無法建立 css 目錄')
        .row('目錄', `${Path.$.rRoot(Path.dirname(this.css), true)}`)
        .go()

      Notifier('無法建立 css 目錄')
        .row('目錄', `${Path.$.rRoot(Path.dirname(this.css), true)}`)
        .go()

      return typeof done == 'function'
        ? done()
        : null
    }

    FileSystem.writeFile(this.css, result.utf8.replace(/^\uFEFF/gm, ""), error => {
      if (error) {
        Helper.Display.LineRed('新增 scss 失敗')
          .row('錯誤', `無法寫入 ${Path.$.rRoot(this.css)}`)
          .row('原因', error.message)
          .go()

        Notifier('寫入 css 失敗')
          .row('檔案', Path.$.rRoot(this.css))
          .row('原因', error.message)
          .go()

        return typeof done == 'function'
          ? done()
          : null
      }
      
      Helper.Display.LineGreen('新增 scss 成功')
        .row('檔案路徑', this.name.dim)
        .row('新增檔案', Path.$.rRoot(this.css).dim)
        .row('編譯耗時', `${result.stats.duration / 1000}${' 秒'.dim}`)
        .go()

      typeof done == 'function'
        ? done()
        : null
    })
  })
}
Scss.prototype.update = function(done) {
  return SCSS.file(this.file, (error, result) => {
    if (error) {
      Helper.Display.LineRed('編譯 scss 失敗')
        .row('檔案', this.name)
        .row('位置', error.line !== undefined || error.column !== undefined ? `第 ${error.line !== undefined ? error.line : '?'} 行，第 ${error.column !== undefined ? error.column : '?'} 個字` : '')
        .row('原因', error.info !== undefined ? error.info : error.message)
        .go()

      Notifier('編譯 scss 失敗')
        .row('檔案', this.name)
        .row('位置', error.line !== undefined || error.column !== undefined ? `第 ${error.line !== undefined ? error.line : '?'} 行，第 ${error.column !== undefined ? error.column : '?'} 個字` : '')
        .go()

      return typeof done == 'function'
        ? done()
        : null
    }
    
    if (Helper.Fs.checkDirsExist(Config.Source.dir.css, this.dirs) !== true) {
      Helper.Display.LineRed('無法建立 css 目錄')
        .row('目錄', `${Path.$.rRoot(Path.dirname(this.css), true)}`)
        .go()

      Notifier('無法建立 css 目錄')
        .row('目錄', `${Path.$.rRoot(Path.dirname(this.css), true)}`)
        .go()

      return typeof done == 'function'
        ? done()
        : null
    }

    FileSystem.writeFile(this.css, result.utf8.replace(/^\uFEFF/gm, ""), error => {
      if (error) {
        Helper.Display.LineRed('修改 scss 失敗')
          .row('錯誤', `無法寫入 ${Path.$.rRoot(this.css)}`)
          .row('原因', error.message)
          .go()

        Notifier('寫入 css 失敗')
          .row('檔案', Path.$.rRoot(this.css))
          .row('原因', error.message)
          .go()

        return typeof done == 'function'
          ? done()
          : null
      }
      
      Helper.Display.LineGreen('修改 scss 成功')
        .row('檔案路徑', this.name.dim)
        .row('修改檔案', Path.$.rRoot(this.css).dim)
        .row('編譯耗時', `${result.stats.duration / 1000}${' 秒'.dim}`)
        .go()

      typeof done == 'function'
        ? done()
        : null
    })
  })
}
Scss.prototype.remove = function(done) {
  return Helper.Fs.remove(this.css, error => {
    if (error) {
      Helper.Display.LineRed('移除 css 失敗')
        .row('錯誤', `無法移除：${Path.$.rRoot(this.css)}`)
        .row('原因', error.message)
        .go()

      Notifier('移除 css 失敗')
        .row('檔案', Path.$.rRoot(this.css))
        .row('原因', error.message)
        .go()

      return typeof done == 'function'
        ? done()
        : null
    }

    Helper.Display.LineGreen('移除 css 成功')
      .row('檔案路徑', Path.$.rRoot(this.css).dim)
      .go()

    return typeof done == 'function'
      ? done()
      : null
  })
}

module.exports = Scss
