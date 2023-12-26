/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Rule.Save = function(key, varName) {
  if (!(this instanceof Api.Rule.Save))
    return new Api.Rule.Save(key, varName)

  this._key = key
  this._varName = varName
}

Object.defineProperty(Api.Rule.Save.prototype, 'key', { get () { return this._key } })
Object.defineProperty(Api.Rule.Save.prototype, 'varName', { get () { return this._varName } })
