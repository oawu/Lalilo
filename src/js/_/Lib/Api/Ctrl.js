/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Ctrl = function(obj) {
  if (!(this instanceof Api.Ctrl))
    return new Api.Ctrl(obj)

  const isObj = Helper.Type.isObject(obj)
  
  this._main          = isObj && typeof obj.main          == 'boolean' ? obj.main          : false
  this._forceVar      = isObj && typeof obj.forceVar      == 'boolean' ? obj.forceVar      : false
  this._header        = isObj && typeof obj.header        == 'boolean' ? obj.header        : false
  this._payload       = isObj && typeof obj.payload       == 'boolean' ? obj.payload       : false
  this._rule          = isObj && typeof obj.rule          == 'boolean' ? obj.rule          : false
  this._response      = isObj && typeof obj.response      == 'boolean' ? obj.response      : false
  
  this._ruleIndex     = isObj && typeof obj.ruleIndex     == 'number'  ? obj.ruleIndex     : 0
  this._responseIndex = isObj && typeof obj.responseIndex == 'number'  ? obj.responseIndex : 0
  this._responseBodyIndex = isObj && typeof obj.responseBodyIndex == 'number' ? obj.responseBodyIndex : 0
}

Object.defineProperty(Api.Ctrl.prototype, 'main',     { get () { return this._main } })
Object.defineProperty(Api.Ctrl.prototype, 'forceVar', { get () { return this._forceVar } })
Object.defineProperty(Api.Ctrl.prototype, 'header',   { get () { return this._header } })
Object.defineProperty(Api.Ctrl.prototype, 'payload',  { get () { return this._payload } })
Object.defineProperty(Api.Ctrl.prototype, 'rule',     { get () { return this._rule } })
Object.defineProperty(Api.Ctrl.prototype, 'response', { get () { return this._response } })

Object.defineProperty(Api.Ctrl.prototype, 'ruleIndex',     { get () { return this._ruleIndex }, set (val) { return this._ruleIndex = val } })
Object.defineProperty(Api.Ctrl.prototype, 'responseIndex', { get () { return this._responseIndex }, set (val) { return this._responseIndex = val } })
Object.defineProperty(Api.Ctrl.prototype, 'responseBodyIndex', { get () { return this._responseBodyIndex }, set (val) { return this._responseBodyIndex = val } })

Api.Ctrl.prototype.toggleMain = function() { this._main = !this.main; return this }
Api.Ctrl.prototype.toggleForceVar = function() { this._forceVar = !this.forceVar; return this }
Api.Ctrl.prototype.toggleHeader = function() { this._header = !this.header; return this }
Api.Ctrl.prototype.togglePayload = function() { this._payload = !this.payload; return this }
Api.Ctrl.prototype.toggleRule = function() { this._rule = !this.rule; return this }
Api.Ctrl.prototype.toggleResponse = function() { this._response = !this.response; return this }
