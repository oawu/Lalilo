/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const PrettyJson = function (type) {
  if (this instanceof PrettyJson) return this._type = type
  else return new PrettyJson(type)
}

Object.defineProperty(PrettyJson.prototype, 'type', { get () { return this._type } })

PrettyJson.dispatch = data => {
  if (typeof data == 'boolean')
    return PrettyJson.Bool(data)
  if (typeof data == 'number')
    return PrettyJson.Num(data)
  if (typeof data == 'string')
    return PrettyJson.Str(data)
  
  if (Array.isArray(data))
    return PrettyJson.Arr(data.map(t => PrettyJson.dispatch(t)))
  
  if (!Helper.Type.isObject(data))
    return PrettyJson.Null()
    
  const keyVals = []
  for (let key in data)
    keyVals.push(PrettyJson.Obj.KeyVal(key, PrettyJson.dispatch(data[key])))

  return PrettyJson.Obj(keyVals)
}
