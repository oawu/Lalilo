/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  if (typeof App == 'undefined') { return }
  if (typeof App.Alert == 'undefined') { return }
  if (typeof App.Alert.Button != 'undefined') { return }
  

  App.Alert.Button = function(text, click = null, isPreferred = false, isDestructive = false) {
    if (!(this instanceof App.Alert.Button)) {
      return new App.Alert.Button(text, click, isPreferred, isDestructive)
    }

    this._text = ''
    this._click = null
    this._isPreferred = false
    this._isDestructive = false

    this.text(text)
      .click(click)
      .isPreferred(isPreferred)
      .isDestructive(isDestructive)
  }
  App.Alert.Button.prototype.text = function(val) {
    if (App._T.neStr(val)) { this._text = val }
    return this
  }
  App.Alert.Button.prototype.click = function(val, ...params) {
    if (App.Action === undefined) {
      return
    }

    if (!(val instanceof App._CMD)) {
      val = App.Action(val, ...params)
    }

    if (val instanceof App._CMD) {
      this._click = val
    }

    return this
  }
  App.Alert.Button.prototype.isPreferred = function(val) {
    if (App._T.bool(val)) { this._isPreferred = val }
    return this
  }
  App.Alert.Button.prototype.isDestructive = function(val) {
    if (App._T.bool(val)) { this._isDestructive = val }
    return this
  }

})()
