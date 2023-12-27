/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Api = function(obj) {
  if (!(this instanceof Api))
    return new Api(obj)

  const isObj         = Helper.Type.isObject(obj)
  
  const isObjResponse = isObj && Helper.Type.isObject(obj.response)

  this._ctrl     = Api.Ctrl(isObj     ? obj.ctrl     : null)
  this._request  = Api.Request(isObj  ? obj.request  : null)
  this._rule     = Api.Rule(isObj     ? obj.rule     : null)

  if (isObj
      && Helper.Type.isObject(obj.response)
      && Helper.Type.isObject(obj.response.info)
        && typeof obj.response.info.status == 'number'
        && typeof obj.response.info.size == 'number'
        && typeof obj.response.info.during == 'number'
      && Array.isArray(obj.response.headers)
      && (
        typeof obj.response.body == 'boolean'
        || typeof obj.response.body == 'number'
        || typeof obj.response.body == 'string'
        || Array.isArray(obj.response.body)
        || Helper.Type.isObject(obj.response.body))) {
    
    const info = Api.Response.Info(
          obj.response.info.status,
          obj.response.info.size,
          obj.response.info.during)
    
    const headers = obj.response.headers
          .filter(h => Helper.Type.isObject(h) && typeof h.key == 'string' && h.key !== '' && typeof h.val == 'string')
          .map(({ key, val }) => Api.Response.Header(key, val))

    if (Helper.Type.isObject(obj.response.body)) {
      this._response = Api.Response(info, headers, Api.Response.Body(JSON.stringify(obj.response.body), Api.Response.Body.Json(obj.response.body)))
    } else if (Array.isArray(obj.response.body)) {
      this._response = Api.Response(info, headers, Api.Response.Body(JSON.stringify(obj.response.body), Api.Response.Body.Json(obj.response.body)))
    } else {
      const bodyType = typeof obj.response.body

      if (bodyType == 'boolean') {
        this._response = Api.Response(info, headers, Api.Response.Body(`${obj.response.body ? true : false}`, Api.Response.Body.Json(obj.response.body ? true : false)))
      } else if (bodyType == 'number') {
        this._response = Api.Response(info, headers, Api.Response.Body(`${obj.response.body}`, Api.Response.Body.Json(obj.response.body)))
      } else if (bodyType == 'string') {
        let bodyObj = undefined
        let bodyErr = undefined
        try {
          bodyObj = JSON.parse(obj.response.body)
          bodyErr = undefined
        } catch (e) {
          bodyErr = e
          bodyObj = undefined
        }

        this._response = bodyObj !== undefined && bodyErr === undefined
          ? Api.Response(info, headers, Api.Response.Body(JSON.stringify(bodyObj), Api.Response.Body.Json(bodyObj)))
          : Api.Response(info, headers, Api.Response.Body(obj.response.body, null))
      } else {
        this._response = null
      }
    }
  } else {
    this._response = null
  }

}

Object.defineProperty(Api.prototype, 'ctrl',     { get () { return this._ctrl } })
Object.defineProperty(Api.prototype, 'request',  { get () { return this._request } })
Object.defineProperty(Api.prototype, 'rule',     { get () { return this._rule } })
Object.defineProperty(Api.prototype, 'response', { get () { return this._response } })

