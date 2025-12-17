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
const { Exist } = require('@oawu/_Helper')
const Display = require('@oawu/_Display')

const _parse = function (className, dir, face, data) {
  const comments = Config.Comments

  const contents = comments.length ? [
    '/**',
    ...comments.map(comment => ` * ${comment}`),
    ' */',
    '',
    `@import "Lalilo";`
  ] : [
    `@import "Lalilo";`
  ]

  const tmp = Path.relative(Config.Source.path, Config.Source.dir.icon).split(Path.sep).join('/')
  const basePath = Config.baseUrl + (tmp !== '' ? `${tmp}/` : '')

  data = data.match(/\.icon-[a-zA-Z_\-0-9]*:before\s?\{\s*content:\s*"[\\A-Za-z0-9]*";(\s*color:\s*#[A-Za-z0-9]*;)?\s*}/g)
  data = T.arr(data)
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

const Icon = function (file) {
  if (!(this instanceof Icon)) {
    return new Icon(file)
  }

  Factory.call(this, file)
  this._dir = Path.dirname(this._file).split(Path.sep).pop()
  this._face = `icon${this._dir != 'icomoon' ? `-${this._dir}` : ''}`
  this._scss = `${Config.Source.iconDirInScss}${this._face}.scss`
}

Icon.prototype = Object.create(Factory.prototype)


Icon.prototype.build = function (done) {
  return promisify(done, async _ => {
    let data = await tryFunc(fs.readFile(this._file, { encoding: 'utf8' }))
    if (T.err(data)) {
      throw new Error(`無法讀取：${this._name}`, { cause: data })
    }

    let result = await tryFunc(fs.writeFile(this._scss, _parse(`.${this._face}-`, this._dir, this._face, data), { encoding: 'utf8' }))
    if (T.err(result)) {
      throw new Error(`無法寫入：${Path.$.rRoot(this._scss)}`, { cause: result })
    }

    return this
  })
}

Icon.prototype.create = function (done) {
  return promisify(done, async _ => {
    let data = await tryFunc(fs.readFile(this._file, { encoding: 'utf8' }))
    if (T.err(data)) {
      Display.Red('新增 icon 失敗')
        .row('錯誤', `無法讀取「${this._name}」`)
        .row('原因', data.message)
        .go()
      return this
    }

    let result = await tryFunc(fs.writeFile(this._scss, _parse(`.${this._face}-`, this._dir, this._face, data), { encoding: 'utf8' }))
    if (T.err(result)) {
      Display.Red('新增 icon 失敗')
        .row('錯誤', `無法寫入「${Path.$.rRoot(this._scss)}」`)
        .row('原因', result.message)
        .go()
      return this
    }

    Display.Blue('新增 icon 成功')
      .row('檔案路徑', this._name.dim)
      .row('新增檔案', Path.$.rRoot(this._scss).dim)
      .go()
    return this
  })
}
Icon.prototype.update = function (done) {
  return promisify(done, async _ => {
    let data = await tryFunc(fs.readFile(this._file, { encoding: 'utf8' }))
    if (T.err(data)) {
      Display.Red('修改 icon 失敗')
        .row('錯誤', `無法讀取「${this._name}」`)
        .row('原因', data.message)
        .go()
      return this
    }

    let result = await tryFunc(fs.writeFile(this._scss, _parse(`.${this._face}-`, this._dir, this._face, data), { encoding: 'utf8' }))
    if (T.err(result)) {
      Display.Red('修改 icon 失敗')
        .row('錯誤', `無法寫入「${Path.$.rRoot(this._scss)}」`)
        .row('原因', result.message)
        .go()
      return this
    }

    Display.Blue('修改 icon 成功')
      .row('檔案路徑', this._name.dim)
      .row('修改檔案', Path.$.rRoot(this._scss).dim)
      .go()
    return this
  })
}
Icon.prototype.remove = function (done) {
  return promisify(done, async _ => {
    if (T.err(await tryFunc(Exist.file(this._scss, fs.constants.R_OK)))) {
      return this
    }

    await tryFunc(fs.unlink(this._scss))

    if (T.err(await tryFunc(Exist.file(this._scss, fs.constants.R_OK)))) {
      Display.Green('移除 scss 成功')
        .row('檔案路徑', Path.$.rRoot(this._scss).dim)
        .go()
    } else {
      Display.Red('移除 scss 失敗')
        .row('錯誤', `無法移除：${Path.$.rRoot(this._scss)}`)
        .go()
    }

    return this
  })
}


module.exports = Icon