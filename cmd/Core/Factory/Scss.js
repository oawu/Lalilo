/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path = require('path')
const fs = require('fs/promises')
const Factory = require('@oawu/_Factory')
const Config = require('@oawu/_Config')

const { promisify, Type: T, tryFunc } = require('@oawu/helper')
const { Exist, checkDirs } = require('@oawu/_Helper')
const Display = require('@oawu/_Display')
const _scss = require('@oawu/scss')

const _content = result => {
  const content = result.utf8.trim().replace(/^\uFEFF/gm, "")
  if (content.startsWith('@charset "UTF-8";') && content.substring('@charset "UTF-8";'.length).trim() === '') {
    return ''
  }
  return content
}

const Scss = function (file) {
  if (!(this instanceof Scss)) {
    return new Scss(file)
  }

  Factory.call(this, file)
  this._dirs = Path.relative(Config.Source.dir.scss, this._file).split(Path.sep).filter(t => t !== '')
  this._css = Config.Source.dir.css + [...this._dirs.slice(0, -1), `${Path.basename(this._dirs.pop(), '.scss')}.css`].join(Path.sep)
}

Scss.prototype = Object.create(Factory.prototype)

Scss.prototype.build = async function (done) {
  return promisify(done, async _ => {
    const result = await tryFunc(_scss.file(this._file))
    if (T.err(result)) {
      throw new Error(`無法編譯：${this._name}`, { cause: result })
    }

    const mkdir = await tryFunc(checkDirs(Config.Source.dir.css, this._dirs))
    if (T.err(mkdir)) {
      throw new Error(`無法建立目錄：${Path.$.rRoot(Path.dirname(this._css), true)}`, { cause: mkdir })
    }

    const write = await tryFunc(fs.writeFile(this._css, _content(result), { encoding: 'utf8' }))
    if (T.err(write)) {
      throw new Error(`無法寫入：${Path.$.rRoot(this._css)}`, { cause: write })
    }

    return this
  })
}
Scss.prototype.create = async function (done) {
  return promisify(done, async _ => {
    const result = await tryFunc(_scss.file(this._file))
    if (T.err(result)) {
      Display.Red('編譯 scss 失敗')
        .row('檔案', this._name)
        .row('位置', result.line !== undefined || result.column !== undefined ? `第 ${result.line !== undefined ? result.line : '?'} 行，第 ${result.column !== undefined ? result.column : '?'} 個字` : '')
        .row('原因', result.info !== undefined ? result.info : result.message)
        .go()
      return this
    }

    const mkdir = await tryFunc(checkDirs(Config.Source.dir.css, this._dirs))
    if (T.err(mkdir)) {
      Display.Red('無法建立 css 目錄')
        .row('目錄', `${Path.$.rRoot(Path.dirname(this._css), true)}`)
        .go()
      return this
    }

    const write = await tryFunc(fs.writeFile(this._css, _content(result), { encoding: 'utf8' }))
    if (T.err(write)) {
      Display.Red('新增 scss 失敗')
        .row('錯誤', `無法寫入 ${Path.$.rRoot(this.css)}`)
        .row('原因', error.message)
        .go()
      return this
    }

    Display.Green('新增 scss 成功')
      .row('檔案路徑', this._name.dim)
      .row('新增檔案', Path.$.rRoot(this._css).dim)
      .row('編譯耗時', `${result.stats.duration / 1000}${' 秒'.dim}`)
      .go()
    return this
  })
}
Scss.prototype.update = async function (done) {
  return promisify(done, async _ => {
    const result = await tryFunc(_scss.file(this._file))
    if (T.err(result)) {
      Display.Red('編譯 scss 失敗')
        .row('檔案', this._name)
        .row('位置', result.line !== undefined || result.column !== undefined ? `第 ${result.line !== undefined ? result.line : '?'} 行，第 ${result.column !== undefined ? result.column : '?'} 個字` : '')
        .row('原因', result.info !== undefined ? result.info : result.message)
        .go()
      return this
    }

    const mkdir = await tryFunc(checkDirs(Config.Source.dir.css, this._dirs))
    if (T.err(mkdir)) {
      Display.Red('無法建立 css 目錄')
        .row('目錄', `${Path.$.rRoot(Path.dirname(this._css), true)}`)
        .go()
      return this
    }

    const write = await tryFunc(fs.writeFile(this._css, _content(result), { encoding: 'utf8' }))
    if (T.err(write)) {
      Display.Red('修改 scss 失敗')
        .row('錯誤', `無法寫入 ${Path.$.rRoot(this.css)}`)
        .row('原因', error.message)
        .go()
      return this
    }

    Display.Green('修改 scss 成功')
      .row('檔案路徑', this._name.dim)
      .row('修改檔案', Path.$.rRoot(this._css).dim)
      .row('編譯耗時', `${result.stats.duration / 1000}${' 秒'.dim}`)
      .go()
    return this
  })
}
Scss.prototype.remove = async function (done) {
  return promisify(done, async _ => {
    if (T.err(await tryFunc(Exist.file(this._css, fs.constants.R_OK)))) {
      return this
    }

    await tryFunc(fs.unlink(this._css))

    if (T.err(await tryFunc(Exist.file(this._css, fs.constants.R_OK)))) {
      Display.Green('移除 css 成功')
        .row('檔案路徑', Path.$.rRoot(this._css).dim)
        .go()
    } else {
      Display.Red('移除 css 失敗')
        .row('錯誤', `無法移除：${Path.$.rRoot(this._css)}`)
        .go()
    }

    return this
  })
}

module.exports = Scss
