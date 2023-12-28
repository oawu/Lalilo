/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Rule.Test.Num = function(optional, val, min, max) {
  if (!(this instanceof Api.Rule.Test.Num))
    return new Api.Rule.Test.Num(optional, val, min, max)
  else
    Api.Rule.Test.call(this, 'num')

  this._optional = optional
  this._val      = val
  this._min      = min
  this._max      = max
}
Api.Rule.Test.Num.prototype = Object.create(Api.Rule.Test.prototype)

Object.defineProperty(Api.Rule.Test.Num.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Api.Rule.Test.Num.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Api.Rule.Test.Num.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Api.Rule.Test.Num.prototype, 'optional', { get () { return this._optional } })

Api.Rule.Test.Num.prototype.condition = function(title) {
  let descriptions = []
  if (this.val !== null) {
    descriptions.push(`值需等於「${this.val}」`)
  } else {
    this.min === null || descriptions.push(`需大於等於「${this.min}」`)
    this.max === null || descriptions.push(`需小於等於「${this.max}」`)
  }

  return Api.Rule.Test.Condition(this, title, descriptions)
}