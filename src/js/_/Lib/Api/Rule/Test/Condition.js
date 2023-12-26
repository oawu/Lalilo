/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Rule.Test.Condition = function(test, title, descriptions, children = []) {
  if (!(this instanceof Api.Rule.Test.Condition))
    return new Api.Rule.Test.Condition(test, title, descriptions, children)
  this._test         = test
  this._title        = title
  this._descriptions = descriptions
  this._children     = children
}

Object.defineProperty(Api.Rule.Test.Condition.prototype, 'test', { get () { return this._test } })
Object.defineProperty(Api.Rule.Test.Condition.prototype, 'title', { get () { return this._title } })
Object.defineProperty(Api.Rule.Test.Condition.prototype, 'descriptions', { get () { return this._descriptions } })
Object.defineProperty(Api.Rule.Test.Condition.prototype, 'description', { get () { return `${this.descriptions.join('，')}。` } })
Object.defineProperty(Api.Rule.Test.Condition.prototype, 'children', { get () { return this._children } })
