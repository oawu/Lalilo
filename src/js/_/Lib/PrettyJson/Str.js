/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

PrettyJson.Str = function(val) {
  if (!(this instanceof PrettyJson.Str))
    return new PrettyJson.Str(val)

  PrettyJson.call(this, 'str')
  this._val = val
}
PrettyJson.Str.prototype = Object.create(PrettyJson.prototype)
Object.defineProperty(PrettyJson.Str.prototype, 'val', { get () { return this._val } })
// PrettyJson.Str.prototype.toString = function() { return `"${this.val}"` }
PrettyJson.Str.prototype.toStructString = function() { return `"${this.val}"` }
