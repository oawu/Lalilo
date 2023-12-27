/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

PrettyJson.Arr = function(elements) {
  if (!(this instanceof PrettyJson.Arr))
    return new PrettyJson.Arr(elements)

  PrettyJson.call(this, 'arr')
  this._elements = elements
}
PrettyJson.Arr.prototype = Object.create(PrettyJson.prototype)
Object.defineProperty(PrettyJson.Arr.prototype, 'elements', { get () { return this._elements } })
// PrettyJson.Arr.prototype.toString = function () { return `[${this.elements.map(e => e.toString()).join(',')}]` }
PrettyJson.Arr.prototype.toStructString = function (level = 0) { return `[\n${this.elements.length ? `${this.elements.map(e => `${' '.repeat((level + 1) * 2)}${e.toStructString(level + 1)}`).join(',\n')}\n` : ''}${' '.repeat(level * 2)}]` }
