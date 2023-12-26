/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Request.Method = function(method) {
  if (this instanceof Api.Request.Method)
    this._val = method
  else
    return new Api.Request.Method(method)
}

// Api.Request.Method.prototype.toString = function() { return this._val.toLowerCase() }
Object.defineProperty(Api.Request.Method.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Api.Request.Method.prototype, 'toLowerCase', { get () { return this.val.toLowerCase() } })
Object.defineProperty(Api.Request.Method.prototype, 'toUpperCase', { get () { return this.val.toUpperCase() } })
// Api.Request.Method.prototype.toLowerCase = function() { return this.val.toLowerCase() }
// Api.Request.Method.prototype.toUpperCase = function() { return this.val.toUpperCase() }
