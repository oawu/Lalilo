/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Rule.Test.Arr = function(optional, min, max, len, struct) {
  if (!(this instanceof Api.Rule.Test.Arr))
    return new Api.Rule.Test.Arr(optional, min, max, len, struct)
  else
    Api.Rule.Test.call(this, 'arr')


  this._optional = optional
  this._min      = min
  this._max      = max
  this._len      = len
  this._struct   = struct
}

Api.Rule.Test.Arr.prototype = Object.create(Api.Rule.Test.prototype)
Object.defineProperty(Api.Rule.Test.Arr.prototype, 'struct',   { get () { return this._struct } })
Object.defineProperty(Api.Rule.Test.Arr.prototype, 'len',      { get () { return this._len } })
Object.defineProperty(Api.Rule.Test.Arr.prototype, 'min',      { get () { return this._min } })
Object.defineProperty(Api.Rule.Test.Arr.prototype, 'max',      { get () { return this._max } })
Object.defineProperty(Api.Rule.Test.Arr.prototype, 'optional', { get () { return this._optional } })

Api.Rule.Test.Arr.prototype.condition = function(title) {
  let descriptions = []
  if (this.len !== null) {
    descriptions.push(`長度需等於「${this.len}」`)
  } else { 
    this.min === null || descriptions.push(`長度需大於等於「${this.min}」`)
    this.max === null || descriptions.push(`長度需小於等於「${this.max}」`)
  }

  const children = []
  if (this.struct === null) {
    descriptions.push(`，元素類型不需要檢查`)
  } else {
    children.push(this.struct.description('元素'))
  }

  return Api.Rule.Test.Condition(this.type, title, this.optional, descriptions, children)
}