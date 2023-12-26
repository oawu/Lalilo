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
  // console.error(this._test.condition('a'));
  
  
  this._saves = []    

  // isObj && Helper.Type.isObject(obj.rule) && Array.isArray(obj.rule.saves)
  //   ? obj.rule.saves.map(save => Helper.Type.isObject(save) && typeof save.key == 'string' && save.key !== '' && typeof save.var == 'string' && save.var !== ''
  //     ? Request.Rule.Save(save.key, save.var)
  //     : null).filter(save => save !== null)
  //   : []
}

Object.defineProperty(Api.Rule.prototype, 'test',  { get () { return this._test } })
Object.defineProperty(Api.Rule.prototype, 'saves', { get () { return this._saves } })
