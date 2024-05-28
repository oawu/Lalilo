/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path       = require('path')
const FileSystem = require('fs')

const Factory    = require('@oawu/_Factory')
const Notifier   = require('@oawu/_Notifier')
const Helper     = require('@oawu/_Helper')
const Config     = require('@oawu/_Config')

const parse = function(className, dir, face, data) {
  const contents = [
    `/**`,
    ` * @author      OA Wu <oawu.tw@gmail.com>`,
    ` * @copyright   Copyright (c) 2015 - ${new Date().getFullYear()}, Lalilo`,
    ` * @license     http://opensource.org/licenses/MIT  MIT License`,
    ` * @link        https://www.ioa.tw/`,
    ` */`,
    ``,
    `@import "Lalilo";`
  ]

  const basePath = `${Config.baseUrl}${Helper.Fs.dirOrEmpty(Path.relative(Config.Source.path, Config.Source.dir.icon)).split(Path.sep).join('/')}`

  data = data.match(/\.icon-[a-zA-Z_\-0-9]*:before\s?\{\s*content:\s*"[\\A-Za-z0-9]*";(\s*color:\s*#[A-Za-z0-9]*;)?\s*}/g)

  data = Array.isArray(data)
    ? data.map(v => v.replace(/^\.icon-/g, className)
        .replace(/\n/g, ' ')
        .replace(/\{\s*/g, '{ ')
        .replace(/\s+/g, ' '))
        .sort((a, b) => a >= b ? a == b ? 0 : 1 : -1)
    : []

  const path = `${basePath}${dir}`
  const time = new Date().getTime()

  return (data.length
    ? [
      ...contents,
      ``,
      `@font-face { ${[
        `font-family: "${face}"`,
        `src: ${[
          `url("${path}/fonts/icomoon.eot?t=${time}") format("embedded-opentype")`,
          `url("${path}/fonts/icomoon.woff?t=${time}") format("woff")`,
          `url("${path}/fonts/icomoon.ttf?t=${time}") format("truetype")`,
          `url("${path}/fonts/icomoon.svg?t=${time}") format("svg")`
        ].join(', ')}`
      ].join('; ')} }`,
      ``,
      `*[class^="${face}-"]:before, *[class*=" ${face}-"]:before {`,
        ...[
          `font-family: "${face}"`,
          `speak: none`,
          `font-style: normal`,
          `font-weight: normal`,
          `font-variant: normal`,
        ].map(t => `  ${t};`),
      `}`,
      ``,
      ...data,
      ``]
    : contents).join("\n")
}

const Icon = function(file) {
  if (!(this instanceof Icon)) {
    return new Icon(file)
  }

  Factory.call(this, file)

  this.dir   = Path.dirname(this.file).split(Path.sep).pop()
  this.face  = `icon${this.dir != 'icomoon' ? `-${this.dir}` : ''}`
  this.scss  = `${Config.Source.iconDirInScss}${this.face}.scss`
}

Icon.prototype = Object.create(Factory.prototype)

Icon.prototype.build = function(done) {
  return FileSystem.readFile(this.file, 'utf8', (error, data) => {
    if (error) {
      return typeof done == 'function'
        ? done([`無法讀取：${this.name}`, error])
        : null
    }

    FileSystem.writeFile(this.scss, parse(`.${this.face}-`, this.dir, this.face, data), error => {
      if (typeof done != 'function') {
        return null
      }

      return error
        ? done([`無法寫入：${Path.$.rRoot(this.scss)}`, error])
        : done([])
    })
  })
}

Icon.prototype.create = function(done) {
  return FileSystem.readFile(this.file, 'utf8', (error, data) => {    
    if (error) {
      Helper.Display.LineRed('新增 icon 失敗')
        .row('錯誤', `無法讀取「${this.name}」`)
        .row('原因', error.message)
        .go()

      Notifier('新增 icon 失敗')
        .row('錯誤', `無法讀取「${this.name}」`)
        .row('原因', error.message)
        .go()

      return typeof done == 'function'
        ? done()
        : null
    }

    FileSystem.writeFile(this.scss, parse(`.${this.face}-`, this.dir, this.face, data), error => {
      if (error) {
        Helper.Display.LineRed('新增 icon 失敗')
          .row('錯誤', `無法寫入「${Path.$.rRoot(this.scss)}」`)
          .row('原因', error.message)
          .go()

        Notifier('新增 icon 失敗')
          .row('錯誤', `無法寫入「${Path.$.rRoot(this.scss)}」`)
          .row('原因', error.message)
          .go()

        return typeof done == 'function'
          ? done()
          : null
      }

      Helper.Display.LineBlue('新增 icon 成功')
        .row('檔案路徑', this.name.dim)
        .row('新增檔案', Path.$.rRoot(this.scss).dim)
        .go()

      typeof done == 'function'
        ? done()
        : null
    })
  })
}
Icon.prototype.update = function(done) {
  return FileSystem.readFile(this.file, 'utf8', (error, data) => {
    if (error) {
      Helper.Display.LineRed('修改 icon 失敗')
        .row('錯誤', `無法讀取「${this.name}」`)
        .row('原因', error.message)
        .go()

      Notifier('修改 icon 失敗')
        .row('錯誤', `無法讀取「${this.name}」`)
        .row('原因', error.message)
        .go()

      return typeof done == 'function'
        ? done()
        : null
    }

    FileSystem.writeFile(this.scss, parse(`.${this.face}-`, this.dir, this.face, data), error => {
      if (error) {
        Helper.Display.LineRed('修改 icon 失敗')
          .row('錯誤', `無法寫入「${Path.$.rRoot(this.scss)}」`)
          .row('原因', error.message)
          .go()

        Notifier('修改 icon 失敗')
          .row('錯誤', `無法寫入「${Path.$.rRoot(this.scss)}」`)
          .row('原因', error.message)
          .go()

        return typeof done == 'function'
          ? done()
          : null
      }

      Helper.Display.LineBlue('修改 icon 成功')
        .row('檔案路徑', this.name.dim)
        .row('修改檔案', Path.$.rRoot(this.scss).dim)
        .go()

      typeof done == 'function'
        ? done()
        : null
    })
  })
}
Icon.prototype.remove = function(done) {
  return Helper.Fs.remove(this.scss, error => {
    if (error) {
      Helper.Display.LineRed('移除 scss 失敗')
        .row('錯誤', `無法移除：${Path.$.rRoot(this.scss)}`)
        .row('原因', error.message)
        .go()

      Notifier('移除 scss 失敗')
        .row('檔案', Path.$.rRoot(this.scss))
        .row('原因', error.message)
        .go()

      return typeof done == 'function'
        ? done()
        : null
    }

    Helper.Display.LineGreen('移除 scss 成功')
      .row('檔案路徑', Path.$.rRoot(this.scss).dim)
      .go()

    return typeof done == 'function'
      ? done()
      : null
  })
}

module.exports = Icon
