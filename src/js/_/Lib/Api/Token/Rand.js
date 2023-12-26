/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Token.Rand = function(key, title) {
  if (!(this instanceof Api.Token.Rand))
    return new Api.Token.Rand(key, title)
  else
    Api.Token.call(this, 'rand')

  this._key = key
  this._title = title
}
Api.Token.Rand.prototype = Object.create(Api.Token.prototype)
// Api.Token.Rand.prototype.toString = function() { return `隨機：${this.title}` }
Object.defineProperty(Api.Token.Rand.prototype, 'key', { get () { return this._key } })
Object.defineProperty(Api.Token.Rand.prototype, 'title', { get () { return this._title } })
Object.defineProperty(Api.Token.Rand.prototype, 'description', { get () { return `{{R(${this.key})}}` } })
Object.defineProperty(Api.Token.Rand.prototype, 'text', { get () { return `隨機：${this.title}` } })
