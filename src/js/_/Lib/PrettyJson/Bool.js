/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

PrettyJson.Bool = function(val) {
  if (!(this instanceof PrettyJson.Bool))
    return new PrettyJson.Bool(val)

  PrettyJson.call(this, 'bool')
  this._val = val
}
PrettyJson.Bool.prototype = Object.create(PrettyJson.prototype)
Object.defineProperty(PrettyJson.Bool.prototype, 'val', { get () { return this._val } })
// PrettyJson.Bool.prototype.toString = function() { return this.val ? 'true' : 'false' }
PrettyJson.Bool.prototype.toStructString = function() { return this.val ? 'true' : 'false' }
