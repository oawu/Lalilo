/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Request = function(obj) {
  if (!(this instanceof Api.Request))
    return new Api.Request(obj)

  const isObj = Helper.Type.isObject(obj)

  this._url = Api.Request.Url(
    isObj && Array.isArray(obj.url)
      ? obj.url
      : [])

  this._method = Api.Request.Method(
    isObj && typeof obj.method == 'string' && ['get', 'post', 'put', 'delete'].includes(obj.method.toLowerCase())
      ? obj.method.toLowerCase()
      : 'get')

  this._headers = []
  if (isObj && Array.isArray(obj.headers))
    for (const header of obj.headers)
      if (Helper.Type.isObject(header)) {
        const key = Api.Token.dispatch(header.key)
        const val = Api.Token.dispatch(header.val)
        key !== null && val !== null && this._headers.push({ key, val })
      }

  this._payload = Api.Request.Payload.dispatch(isObj
    ? obj.payload
    : null)

  this._title = isObj && typeof obj.title == 'string' && obj.title !== '' ? obj.title : `[${this.method.toUpperCase}] ${this.url.description}`
  this._subtitle = isObj && typeof obj.subtitle == 'string' && obj.subtitle !== '' ? obj.subtitle : ''
}

Object.defineProperty(Api.Request.prototype, 'url', { get () { return this._url } })
Object.defineProperty(Api.Request.prototype, 'method', { get () { return this._method } })
Object.defineProperty(Api.Request.prototype, 'headers', { get () { return this._headers } })
Object.defineProperty(Api.Request.prototype, 'payload', { get () { return this._payload } })

Object.defineProperty(Api.Request.prototype, 'title', { get () { return this._title } })
Object.defineProperty(Api.Request.prototype, 'subtitle', { get () { return this._subtitle } })

Object.defineProperty(Api.Request.prototype, 'vars', { get () {
  return [...this.url.vars, ...(this.headers.map(({ key, val }) => [key, val]).reduce((a, b) => a.concat(b), []).filter(path => path.isVar)), ...(this.payload !== null ? this.payload.vars : [])]
} })

Object.defineProperty(Api.Request.prototype, 'forceVars', { get () {
  const vars = []
  for (let t of this.vars.filter(v => !v.hasVal))
    vars.push(t)
  return vars
} })