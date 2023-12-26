/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Rule.Save = function(obj) {
  if (!(this instanceof Api.Rule.Save))
    return new Api.Rule.Save(obj)

  const isObj = Helper.Type.isObject(obj)
}

Object.defineProperty(Api.Rule.Save.prototype, 'test',     { get () { return this._test } })
Object.defineProperty(Api.Rule.Save.prototype, 'saves', { get () { return this._saves } })
