/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Response.Header = function(key, val) {
  if (!(this instanceof Api.Response.Header))
    return new Api.Response.Header(key, val)

  this._key = key
  this._val = val
}

Object.defineProperty(Api.Response.Header.prototype, 'key',  { get () { return this._key } })
Object.defineProperty(Api.Response.Header.prototype, 'val',  { get () { return this._val } })
