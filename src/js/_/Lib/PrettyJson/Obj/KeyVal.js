/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

PrettyJson.Obj.KeyVal = function(key, val) {
  if (!(this instanceof PrettyJson.Obj.KeyVal))
    return new PrettyJson.Obj.KeyVal(key, val)
  this._key = key
  this._val = val
}

Object.defineProperty(PrettyJson.Obj.KeyVal.prototype, 'key', { get () { return this._key } })
Object.defineProperty(PrettyJson.Obj.KeyVal.prototype, 'val', { get () { return this._val } })
