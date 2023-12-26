/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Rule.Test.Condition = function(type, title, optional, descriptions, children = []) {
  if (!(this instanceof Api.Rule.Test.Condition))
    return new Api.Rule.Test.Condition(type, title, optional, descriptions, children)
  this._type = type
  this._title = title
  this._optional = optional
  this._descriptions = descriptions
  this._children = children
}
Object.defineProperty(Api.Rule.Test.Condition.prototype, 'type', { get () { return this._type } })
Object.defineProperty(Api.Rule.Test.Condition.prototype, 'title', { get () { return this._title } })
Object.defineProperty(Api.Rule.Test.Condition.prototype, 'optional', { get () { return this._optional } })
Object.defineProperty(Api.Rule.Test.Condition.prototype, 'descriptions', { get () { return this._descriptions } })
Object.defineProperty(Api.Rule.Test.Condition.prototype, 'children', { get () { return this._children } })
