/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Response = function(info, headers, body) {
  if (!(this instanceof Api.Response))
    return new Api.Response(info, headers, body)

  this._info = info
  this._headers = headers
  this._body = body
}

Object.defineProperty(Api.Response.prototype, 'info',  { get () { return this._info } })
Object.defineProperty(Api.Response.prototype, 'headers',  { get () { return this._headers } })
Object.defineProperty(Api.Response.prototype, 'body',  { get () { return this._body } })
