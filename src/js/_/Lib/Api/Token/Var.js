/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Token.Var = function(key, val) {
  if (!(this instanceof Api.Token.Var))
    return new Api.Token.Var(key, val)
  else
    Api.Token.call(this, 'var')

  this._key = key
  this._val = val
}
Api.Token.Var.prototype = Object.create(Api.Token.prototype)
// Api.Token.Var.prototype.toString = function() { return `變數：${this.key}` }
Object.defineProperty(Api.Token.Var.prototype, 'key', { get () { return this._key } })
Object.defineProperty(Api.Token.Var.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Api.Token.Var.prototype, 'description', { get () { return `{{V(${this.key})}}` } })
Object.defineProperty(Api.Token.Var.prototype, 'hasVal', { get () { return this.val !== undefined } })
Object.defineProperty(Api.Token.Var.prototype, 'text', { get () { return `變數：${this.key}` } })

Object.defineProperty(Api.Token.Var.prototype, 'default', { get () {
  if (!this.hasVal)
    return `預設值：?`

  if (typeof this.val == 'string')
    return `預設值："${this.val}"`

  if (typeof this.val == 'number')
    return `預設值：${this.val}`

  if (typeof this.val == 'bool')
    return `預設值：${this.val ? 'true' : 'false'}`

  if (this.val === null)
    return `預設值：null`
  
  if (Array.isArray(this.val))
    return `預設值：[...]`

  if (Helper.Type.isObject(this.val))
    return `預設值：Object(...)`
  
  return `預設值：?`
} })

