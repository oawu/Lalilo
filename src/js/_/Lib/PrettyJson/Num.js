/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

PrettyJson.Num = function(val) {
  if (!(this instanceof PrettyJson.Num))
    return new PrettyJson.Num(val)

  PrettyJson.call(this, 'num')
  this._val = val
}
PrettyJson.Num.prototype = Object.create(PrettyJson.prototype)
Object.defineProperty(PrettyJson.Num.prototype, 'val', { get () { return this._val } })

// PrettyJson.Num.prototype.toString = function() { return this.val }
PrettyJson.Num.prototype.toStructString = function() { return `${this.val}` }
