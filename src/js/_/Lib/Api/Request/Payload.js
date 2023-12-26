/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */


Api.Request.Payload = function(display, type) {
  if (!(this instanceof Api.Request.Payload))
    return new Api.Request.Payload(display, type)

  this._type = type
  // this._display = display
}

// Api.Request.Payload.prototype.toString = function() {
//   if (this._type == 'form') return '表單'
//   if (this._type == 'rawJson') return 'Json'
//   return ''
// }

Object.defineProperty(Api.Request.Payload.prototype, 'text', { get () {
  if (this.type == 'form') return '表單'
  if (this.type == 'rawJson') return 'Json'
  return ''
} })
Object.defineProperty(Api.Request.Payload.prototype, 'type', { get () { return this._type } })
// Object.defineProperty(Api.Request.Payload.prototype, 'display', { get () { return this._display } })
// Api.Request.Payload.prototype.toggleDisplay = function() { this._display = !this._display; return this }

Object.defineProperty(Api.Request.Payload.prototype, 'vars', { get () { return [] } })

Api.Request.Payload.dispatch = function(obj) {
  if (!Helper.Type.isObject(obj) || typeof obj.type != 'string')
    return null

  if (obj.type == 'form')
    return Api.Request.Payload.Form(
      typeof obj.display == 'boolean' ? obj.display : false,
      Array.isArray(obj.data)
        ? obj.data
        : [])

  return null
}
