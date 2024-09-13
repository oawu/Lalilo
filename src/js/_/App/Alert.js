/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  if (typeof App == 'undefined') { return }
  if (typeof App.Alert != 'undefined') { return }
  
  App.Alert = function(title = null, message = null) {
    if (!(this instanceof App.Alert)) {
      return new App.Alert(title, message)
    }

    App._CMD.call(this, 'Alert')
    
    this._title = null
    this._message = null
    this._buttons = []
    this._inputs = []
    this._isAnimated = true
    this.title(title).message(message)
  }
  App.Alert.prototype = Object.create(App._CMD.prototype)

  App.Alert.prototype.title = function(val) {
    if (val === null) { this._title = null }
    if (App._T.str(val)) { this._title = val }
    return this
  }
  App.Alert.prototype.message = function(val) {
    if (val === null) { this._message = null }
    if (App._T.str(val)) { this._message = val }
    return this
  }
  App.Alert.prototype.isAnimated = function(val) {
    if (App._T.bool(val)) { this._isAnimated = val }
    return this
  }
  App.Alert.prototype.button = function(text, ...data) {
    if (App.Alert.Button === undefined) {
      return this
    }
    if (!(text instanceof App.Alert.Button)) {
      text = App.Alert.Button(text, ...data)
    }
    if (text instanceof App.Alert.Button) {
      this._buttons.push(text)
    }
    return this
  }
  App.Alert.prototype.input = function(value = '', ...data) {
    if (App.Alert.Input === undefined) {
      return this
    }
    if (!(value instanceof App.Alert.Input)) {
      value = App.Alert.Input(value, ...data)
    }
    if (value instanceof App.Alert.Input) {
      this._inputs.push(value)
    }
    return this
  }

  // Object.defineProperty(App.Alert.prototype, App.JsonKeyName, { get () {
  //   let _button = null

  //   const title   = App._T.str(this._title) ? this._title : null
  //   const message = App._T.str(this._message) ? this._message : null
  //   const inputs = Array.isArray(this._inputs) ? this._inputs.filter(input => input instanceof App.Alert.Input).map(input => ({
  //     value: App._T.str(input._value) ? input._value : '',
  //     placeholder: App._T.str(input._placeholder) ? input._placeholder : '',
  //   })) : []

  //   const buttons = Array.isArray(this._buttons) ? this._buttons.filter(button => button instanceof App.Alert.Button && App._T.neStr(button._text)).map(button => {
  //     if (button._isPreferred) {
  //       if (_button !== null) { _button.isPreferred(false) }
  //       _button = button
  //     }
  //     return button
  //   }).map(({
  //     _text: text,
  //     _isPreferred: isPreferred,
  //     _isDestructive: isDestructive,
  //     _click: click,
  //   }) => ({
  //     text,
  //     isPreferred,
  //     isDestructive,
  //     click: click instanceof App ? click[App.JsonKeyName] : null,
  //   })) : []

  //   if (title === null && message === null && buttons <= 0) {
  //     return null
  //   }

  //   const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

  //   const isAnimated = App._T.bool(this._isAnimated) && this._isAnimated

  //   parent.struct = {
  //     title,
  //     message,
  //     buttons,
  //     inputs,
  //     isAnimated,
  //   }
  //   return parent
  // } })


})()
