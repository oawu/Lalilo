/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Response.Body.Json = function(obj) {
  if (!(this instanceof Api.Response.Body.Json))
    return new Api.Response.Body.Json(obj)

  this._val = obj
  this._pretty = PrettyJson.dispatch(obj)
  // this._val = val
}

Object.defineProperty(Api.Response.Body.Json.prototype, 'val',  { get () { return this._val } })
Object.defineProperty(Api.Response.Body.Json.prototype, 'pretty',  { get () { return this._pretty } })

// Api.Response.Body.Json.fromText = text => {
//   let obj = undefined
//   let err = undefined
//   try {
//     obj = JSON.parse(text)
//     err = undefined
//   } catch (e) {
//     err = e
//     obj = undefined
//   }
//   return obj !== undefined && err === undefined
//     ? Api.Response.Body.Json(obj)
//     : null
// }

// Object.defineProperty(Api.Response.Body.Json.prototype, 'key',  { get () { return this._key } })
