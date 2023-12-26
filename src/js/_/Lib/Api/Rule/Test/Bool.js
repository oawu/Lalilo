/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Rule.Test.Bool = function(optional, val) {
  if (!(this instanceof Api.Rule.Test.Bool))
    return new Api.Rule.Test.Bool(optional, val)
  else
    Api.Rule.Test.call(this, 'bool')

  this._optional = optional
  this._val      = val
}

Api.Rule.Test.Bool.prototype = Object.create(Api.Rule.Test.prototype)
Object.defineProperty(Api.Rule.Test.Bool.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Api.Rule.Test.Bool.prototype, 'optional', { get () { return this._optional } })

Api.Rule.Test.Bool.prototype.condition = function(title) {
  let descriptions = []
  this.val === null || descriptions.push(`值需等於「${this.val ? 'true' : 'false'}」`)
  return Api.Rule.Test.Condition(this, title, descriptions)
}
