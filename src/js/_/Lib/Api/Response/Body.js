/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Response.Body = function(text, json) {
  if (!(this instanceof Api.Response.Body))
    return new Api.Response.Body(text, json)

  this._text = text
  this._json = json
}

Object.defineProperty(Api.Response.Body.prototype, 'text',  { get () { return this._text } })
Object.defineProperty(Api.Response.Body.prototype, 'json',  { get () { return this._json } })
