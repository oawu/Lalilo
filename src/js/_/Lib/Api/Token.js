/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Token = function(type) {
  if (!(this instanceof Api.Token))
    return new Api.Token(type)
  this._type = type
}
Object.defineProperty(Api.Token.prototype, 'type', { get () { return this._type } })
Object.defineProperty(Api.Token.prototype, 'isFix', { get () { return this.type == 'fix' } })
Object.defineProperty(Api.Token.prototype, 'isVar', { get () { return this.type == 'var' } })
Object.defineProperty(Api.Token.prototype, 'isRand', { get () { return this.type == 'rand' } })
Object.defineProperty(Api.Token.prototype, 'description', { get () { return '?' } })
// Object.defineProperty(Api.Token.prototype, 'isDynamic', { get () { return this.isVar || this.isRand } })
Object.defineProperty(Api.Token.prototype, 'text', { get () { return '' } })

Api.Token.dispatch = function(obj) {
  if (!Helper.Type.isObject(obj) || typeof obj.type != 'string')
    return null

  if (obj.type == 'fix' && (typeof obj.val == 'string' || typeof obj.val == 'number'))
    return Api.Token.Fix(`${obj.val}`)

  if (obj.type == 'var'
      && typeof obj.key == 'string' && obj.key !== ''
  ) return Api.Token.Var(obj.key, obj.val)

  if (obj.type == 'rand'
      && typeof obj.key == 'string' && obj.key !== '' && ['uuid', 'name', 'email', 'phone', 'address'].includes(obj.key)
      && typeof obj.title == 'string' && obj.title !== ''
  ) return Api.Token.Rand(obj.key, obj.title)

 return null
}
