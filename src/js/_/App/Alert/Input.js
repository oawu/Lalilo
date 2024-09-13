/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  if (typeof App == 'undefined') { return }
  if (typeof App.Alert == 'undefined') { return }
  if (typeof App.Alert.Input != 'undefined') { return }
  
  App.Alert.Input = function(value = '', placeholder = '') {
    if (!(this instanceof App.Alert.Input)) {
      return new App.Alert.Input(value, placeholder)
    }

    this._value = ''
    this._placeholder = ''
    this.value(value).placeholder(placeholder)
  }
  App.Alert.Input.prototype.value = function(val) {
    if (App._T.str(val)) { this._value = val }
    return this
  }
  App.Alert.Input.prototype.placeholder = function(val) {
    if (App._T.str(val)) { this._placeholder = val }
    return this
  }

})()
