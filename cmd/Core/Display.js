/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { Print } = require('@oawu/helper')

const Color = function (color, title) {
  if (!(this instanceof Color)) {
    return new Color(color, title)
  }
  this._color = color
  this._title = title
  this._rows = []
}

Color.prototype.row = function (key, val) {
  if (typeof key != 'string') {
    return this
  }
  if (typeof val != 'string') {
    return this
  }
  if (val === '') {
    return this
  }
  this._rows.push({ key, val })
  return this
}
Color.prototype.go = function () {
  const a = `${'   ● '[this._color]}`
  const b = `${this._title}`
  const c = `${this._rows.map(({ key, val }) => `${"\n     ↳ "[this._color].dim}${key !== '' ? `${key}：`.dim : ''}${val}`).join('')}`
  Print.ln(`${a}${b}${c}`)
  return this
}

const Red = function (title) {
  if (this instanceof Red) {
    Color.call(this, 'red', title)
  } else {
    return new Red(title)
  }
}
Red.prototype = Object.create(Color.prototype)

const Yellow = function (title) {
  if (this instanceof Yellow) {
    Color.call(this, 'yellow', title)
  } else {
    return new Yellow(title)
  }
}
Yellow.prototype = Object.create(Color.prototype)

const Green = function (title) {
  if (this instanceof Green) {
    Color.call(this, 'green', title)
  } else {
    return new Green(title)
  }
}
Green.prototype = Object.create(Color.prototype)

const Blue = function (title) {
  if (this instanceof Blue) {
    Color.call(this, 'lightBlue', title)
  } else {
    return new Blue(title)
  }
}
Blue.prototype = Object.create(Color.prototype)

const Cyan = function (title) {
  if (this instanceof Cyan) {
    Color.call(this, 'cyan', title)
  } else {
    return new Cyan(title)
  }
}
Cyan.prototype = Object.create(Color.prototype)

module.exports = {
  Red,
  Yellow,
  Green,
  Blue,
  Cyan,
}