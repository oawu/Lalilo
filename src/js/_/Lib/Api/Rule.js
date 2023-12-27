/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Rule = function(obj) {
  if (!(this instanceof Api.Rule))
    return new Api.Rule(obj)

  const isObj = Helper.Type.isObject(obj)

  this._test = Api.Rule.Test.dispatch(isObj ? obj.test : null)
  
  this._saves = isObj && Array.isArray(obj.saves) ? obj.saves.map(
    save => Helper.Type.isObject(save)
      && typeof save.key == 'string' && save.key !== ''
      && typeof save.varName == 'string' && save.varName !== ''
      ? Api.Rule.Save(save.key, save.varName)
      : null).filter(save => save !== null) : []
}

Object.defineProperty(Api.Rule.prototype, 'test',  { get () { return this._test } })
Object.defineProperty(Api.Rule.prototype, 'saves', { get () { return this._saves } })
