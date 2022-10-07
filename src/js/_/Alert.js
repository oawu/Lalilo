/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Alert = function(title = '', message = '', buttons = [], inputs = []) {
  if (!(this instanceof Alert))
    return new Alert(title, message, buttons)

  this._vue = new Vue({
    data: {
      display: false,
      presented: false,
      popuped: false,
      isLoading: false,

      title: '',
      message: '',
      buttons: [],
      inputs: [],
    },
    methods: {
      present(completion = null, animated = true) {
        this.$el || this.$mount() && document.body.append(this.$el)
        return animated
          ? setTimeout(_ => setTimeout(_ => {
            setTimeout(_ => {
              if (this.$refs.alertInput && this.$refs.alertInput[0]) {
                this.$refs.alertInput[0].focus()
              } else if (this.$refs.alertButton && this.$refs.alertButton[0]) {
                this.$refs.alertButton[0].focus()
              }
            }, 50)
            this.popuped = true
            typeof completion == 'function' && completion()
          }, 250, this.presented = true), 50, this.display = true)
          : setTimeout(_ => {
            this.popuped = true
            typeof completion == 'function' && completion()
          }, 50, this.display = true, this.presented = true), this
      },
      dismiss(completion = null, animated = true) {
        return animated
          ? setTimeout(_ => setTimeout(_ => {
            this.display = false
            typeof completion == 'function' && completion()
          }, 250, this.presented = false), 10, this.popuped = false)
          : setTimeout(_ => {
            this.display = false
            typeof completion == 'function' && completion()
          }, 1, this.popuped = false, this.presented = false), this
      },
    },
    template: `<div id="alert" v-if="display" :class="{ __presented: presented, __popuped: popuped }"><div :class="{ _content: true, __loading: isLoading }"><template v-if="isLoading"><i>{{ message }}</i></template><template v-else><b v-if="title">{{ title }}</b><span v-if="message">{{ message }}</span><input v-for="(input, i) in inputs" :key="i" type="text" :placeholder="input.placeholder" v-model.trim="input.value" ref="alertInput" /><div v-if="buttons.length" :n="buttons.length"><button v-for="(button, i) in buttons" :key="i" @click="button.click ? button.click(...inputs.map(input => input.value)) : {}" :class="{ preferred: button.preferred, 'is-red': button.isRed }" ref="alertButton">{{ button.text }}</button></div></template></div></div>`,
  })

  this.title(title).message(message)
  inputs.forEach(this.input)
  buttons.forEach(this.button)
}

Alert.prototype.present = function(completion = null, animated = true) {
  if (typeof completion == 'boolean') animated = completion
  if (typeof animated == 'function') completion = animated

  return this._vue.present(typeof completion == 'function' && completion.bind(this, this), animated), this
}
Alert.prototype.dismiss = function(completion = null, animated = true) {
  if (typeof completion == 'boolean') animated = completion
  if (typeof animated == 'function') completion = animated
  return this.reset()._vue.dismiss(typeof completion == 'function' && completion.bind(this, this), animated), this
}
Alert.prototype.title = function(title) {
  this._vue.title = title
  return this
}
Alert.prototype.message = function(message) {
  this._vue.message = message
  return this
}
Alert.prototype.button = function(text, click = null, preferred = false, isRed = false) {
  text && this._vue.buttons.push(new Alert._Button(text, typeof click == 'function' ? click.bind(this, this) : null, preferred, isRed))
  return this
}
Alert.prototype.input = function(placeholder = '', value = '') {
  this._vue.inputs.push(new Alert._Input(placeholder, value))
  return this
}
Alert.prototype.reset = function(title = '', message = '', buttons = [], inputs = []) {
  this._vue.title = title
  this._vue.message = message
  this._vue.buttons = buttons
  this._vue.inputs = inputs
  this._vue.isLoading = false
  return this
}
Alert.prototype.loading = function(text = '讀取中…', completion = null) {
  if (typeof text == 'function') completion = text, text = '讀取中…'
  this.reset().message(text)._vue.isLoading = true
  typeof completion == 'function' && completion.call(this, this)
  return this
}

Object.defineProperty(Alert, 'shared', { get () { return this._shared === undefined ? this._shared = this() : this._shared } })

Alert._Button = function(text = '', click = null, preferred = false, isRed = false) {
  if (!(this instanceof Alert._Button))
    return new Alert._Button(text, click, preferred, isRed)
  this.text = text
  this.click = click
  this.isRed = preferred
  this.preferred = isRed
}

Alert._Input = function(placeholder = '', value = '') {
  if (!(this instanceof Alert._Input)) return new Alert._Input(placeholder, value)
  this.value = value
  this.placeholder = placeholder
}