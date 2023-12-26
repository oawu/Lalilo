/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Token.Fix = function(val) {
  if (!(this instanceof Api.Token.Fix))
    return new Api.Token.Fix(val)
  else
    Api.Token.call(this, 'fix')

  this._val = val
}
Api.Token.Fix.prototype = Object.create(Api.Token.prototype)
// Api.Token.Fix.prototype.toString = function() { return `${this.val}` }
Object.defineProperty(Api.Token.Fix.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Api.Token.Fix.prototype, 'description', { get () { return `${this.val}` } })
Object.defineProperty(Api.Token.Fix.prototype, 'text', { get () { return `${this.val}` } })
