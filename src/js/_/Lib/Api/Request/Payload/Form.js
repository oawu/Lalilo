/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Request.Payload.Form = function(display, data) {
  if (!(this instanceof Api.Request.Payload.Form))
    return new Api.Request.Payload.Form(display, data)
  else
    Api.Request.Payload.call(this, display, 'form')

  this._data = []
  for (const row of data) {
    if (Helper.Type.isObject(row)) {
      
      const key = Api.Token.dispatch(row.key)
      const val = Api.Token.dispatch(row.val)
      
      key !== null && val !== null && this._data.push({ key, val })
    }
  }
}

Api.Request.Payload.Form.prototype = Object.create(Api.Request.Payload.prototype)
Object.defineProperty(Api.Request.Payload.Form.prototype, 'data', { get () { return this._data } })

Object.defineProperty(Api.Request.Payload.Form.prototype, 'vars', { get () {
  return this.data.map(({ key, val }) => [key, val])
    .reduce((a, b) => a.concat(b), [])
    .filter(path => path.isVar)
} })
