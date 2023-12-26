/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Rule.Test.Obj = function(optional, struct) {
  if (!(this instanceof Api.Rule.Test.Obj))
    return new Api.Rule.Test.Obj(optional, struct)
  else
    Api.Rule.Test.call(this, 'obj')

  this._optional = optional
  this._struct = struct
}

Api.Rule.Test.Obj.prototype = Object.create(Api.Rule.Test.prototype)
Object.defineProperty(Api.Rule.Test.Obj.prototype, 'struct', { get () { return this._struct } })
Object.defineProperty(Api.Rule.Test.Obj.prototype, 'optional', { get () { return this._optional } })
Api.Rule.Test.Obj.prototype.condition = function(title) {
  let descriptions = []
  const keys = this.struct ? Object.keys(this.struct) : []

  if (keys.length)
    descriptions.push(`結構中的 ${keys.map(k => `「${k}」`).join('、')} 需要檢查`)
  else
    descriptions.push(`結構內容完全不用檢查`)

  const children = []
  for (let key of keys)
    children.push(this.struct[key].condition(key))

  return Api.Rule.Test.Condition(this, title, descriptions, children)
}