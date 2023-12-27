/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Response.Info = function(status, size, during) {
  if (!(this instanceof Api.Response.Info))
    return new Api.Response.Info(status, size, during)

  this._status = status
  this._size = size
  this._during = during
}

Object.defineProperty(Api.Response.Info.prototype, 'status',  { get () { return this._status } })
Object.defineProperty(Api.Response.Info.prototype, 'size',  { get () { return this._size } })
Object.defineProperty(Api.Response.Info.prototype, 'during',  { get () { return this._during } })
