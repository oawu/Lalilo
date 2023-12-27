/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

PrettyJson.Obj = function(keyVals) {
  if (!(this instanceof PrettyJson.Obj))
    return new PrettyJson.Obj(keyVals)

  PrettyJson.call(this, 'obj')
  this._keyVals = keyVals
}
PrettyJson.Obj.prototype = Object.create(PrettyJson.prototype)
Object.defineProperty(PrettyJson.Obj.prototype, 'keyVals', { get () { return this._keyVals } })
// PrettyJson.Obj.prototype.toString = function () { return `{${this.keyVals.map(keyVal => `"${keyVal.key}":${keyVal.val.toString()}`).join(',')}}` }
PrettyJson.Obj.prototype.toStructString = function (level = 0) { return `{\n${this.keyVals.length ? `${this.keyVals.map(keyVal => `${' '.repeat((level + 1) * 2)}"${keyVal.key}": ${keyVal.val.toStructString(level + 1)}`).join(',\n')}\n` : ''}${' '.repeat(level * 2)}}` }
