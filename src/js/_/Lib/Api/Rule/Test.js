/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */


Api.Rule.Test = function(type) {
  if (!(this instanceof Api.Rule.Test))
    return new Api.Rule.Test(type)
  this._type = type
}
Object.defineProperty(Api.Rule.Test.prototype, 'type', { get () { return this._type } })
Object.defineProperty(Api.Rule.Test.prototype, 'typeText', { get () {
  if ('bool' == this._type)
    return '布林'
  if ('num' == this._type)
    return '數字'
  if ('str' == this._type)
    return '字串'
  if ('arr' == this._type)
    return '陣列'
  if ('obj' == this._type)
    return '物件'
  
  return '?'
} })
Api.Rule.Test.prototype.condition = function(title) {
  return Api.Rule.Test.Condition('', '', false, [], [])
}

Api.Rule.Test.dispatch = function(obj) {
  if (!Helper.Type.isObject(obj) || typeof obj.type != 'string')
    return null
  
  if (obj.type == 'num')
    return Api.Rule.Test.Num(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.val      == 'number'  ? obj.val      : null,
      typeof obj.min      == 'number'  ? obj.min      : null,
      typeof obj.max      == 'number'  ? obj.max      : null
    )

  if (obj.type == 'str')
    return Api.Rule.Test.Str(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.val      == 'string'  ? obj.val      : null,
      typeof obj.min      == 'number'  ? obj.min      : null,
      typeof obj.max      == 'number'  ? obj.max      : null,
      typeof obj.len      == 'number'  ? obj.len      : null
    )

  if (obj.type == 'bool')
    return Api.Rule.Test.Bool(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.val      == 'boolean' ? obj.val      : null
    )

  if (obj.type == 'arr')
    return Api.Rule.Test.Arr(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.min       == 'number' ? obj.min      : null,
      typeof obj.max       == 'number' ? obj.max      : null,
      typeof obj.len       == 'number' ? obj.len      : null,
      
      Api.Rule.Test.dispatch(obj.struct)
    )

  if (obj.type == 'obj') {
    const struct = {}

    if (Helper.Type.isObject(obj.struct))
      for (let key in obj.struct) {
        let tmp = Api.Rule.Test.dispatch(obj.struct[key])
        if (tmp !== null)
          struct[key] = tmp
      }

    return Api.Rule.Test.Obj(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      Object.keys(struct).length ? struct : null)
  }

  return null
}