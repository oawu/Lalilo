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

  this._ctrl    = Api.Ctrl(isObj    ? obj.ctrl    : null)
  this._request = Api.Request(isObj ? obj.request : null)
  this._rule    = Api.Rule(isObj    ? obj.rule    : null)

  // this._response = Api.Response()
}

Object.defineProperty(Api.prototype, 'ctrl',     { get () { return this._ctrl } })
Object.defineProperty(Api.prototype, 'request',  { get () { return this._request } })
Object.defineProperty(Api.prototype, 'rule',     { get () { return this._rule } })
// Object.defineProperty(Api.prototype, 'response', { get () { return this._url } })

