/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Rule.Test.Str = function(optional, val, min, max, len) {
  if (!(this instanceof Api.Rule.Test.Str))
    return new Api.Rule.Test.Str(optional, val, min, max, len)
  else
    Api.Rule.Test.call(this, 'str')

  this._optional = optional
  this._val      = val
  this._len      = len
  this._min      = min
  this._max      = max
}
Api.Rule.Test.Str.prototype = Object.create(Api.Rule.Test.prototype)

Object.defineProperty(Api.Rule.Test.Str.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Api.Rule.Test.Str.prototype, 'len', { get () { return this._len } })
Object.defineProperty(Api.Rule.Test.Str.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Api.Rule.Test.Str.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Api.Rule.Test.Str.prototype, 'optional', { get () { return this._optional } })

Api.Rule.Test.Str.prototype.condition = function(title) {
  let descriptions = []
  if (this.val !== null) {
    descriptions.push(`值需等於「${this.val}」`)
  } else if (this.len !== null) {
    descriptions.push(`長度需等於「${this.val}」`)
  } else { 
    this.min === null || descriptions.push(`長度需大於等於「${this.min}」`)
    this.max === null || descriptions.push(`長度需小於等於「${this.max}」`)
  }

  return Api.Rule.Test.Condition(this.type, title, this.optional, descriptions)
}