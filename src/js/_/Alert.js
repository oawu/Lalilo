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
      isLoading: false,

      title: '',
      message: null,

      buttons: [],
      inputs: [],
      status: {
        p0: false,
        p1: false, 
      }
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
            this.status.p1 = true
            typeof completion == 'function' && completion()
          }, 300, this.status.p0 = true), 50, this.display = true)
          : setTimeout(_ => {
            this.status.p1 = true
            typeof completion == 'function' && completion()
          }, 50, this.display = true, this.status.p0 = true), this
      },
      dismiss(completion = null, animated = true) {
        return animated
          ? setTimeout(_ => setTimeout(_ => {
            this.display = false
            typeof completion == 'function' && completion()
          }, 300, this.status.p0 = false), 10, this.status.p1 = false)
          : setTimeout(_ => {
            this.display = false
            typeof completion == 'function' && completion()
          }, 1, this.status.p1 = false, this.status.p0 = false), this
      },
    },
    template: `<div id="__oaui-alert" v-if="display" :class="{ __p0: status.p0, __p1: status.p1 }"><div :class="{ _body: true, __loading: isLoading }"><template v-if="isLoading"><div class="_loading"><div><i v-for="i in [0,1,2,3,4,5,6,7,8,9,10,11]" :key="i" :class="'__i' + i"></i></div><span>{{ message.text }}</span></div></template><template v-else><b class="_title" v-if="title">{{ title }}</b><span class="_subtitle" v-if="message && message.text !== '' && message.isHTML" v-html="message.text"></span><span class="_subtitle" v-if="message && message.text !== '' && !message.isHTML">{{ message.text }}</span><input class='_input' v-for="(input, i) in inputs" :key="i" type="text" :placeholder="input.placeholder" v-model.trim="input.value" ref="alertInput" /><div class="_buttons" v-if="buttons.length" :n="buttons.length"><button class='_button' v-for="(button, i) in buttons" :key="i" @click="button.click ? button.click(...inputs.map(input => input.value)) : {}" :class="{ '__preferred': button.preferred, '__warning': button.isRed }" ref="alertButton">{{ button.text }}</button></div></template></div></div>`,
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

  return this._vue.dismiss(_ => {
    typeof completion == 'function' && completion.call(this, this)
    this.reset('', '', [], [])
  }, animated), this
}
Alert.prototype.title = function(title) {
  if (typeof title == 'string')
    this._vue.title = title
  return this
}
Alert.prototype.message = function(message, isHTML = false) {
  if (typeof message == 'string')
    this._vue.message = { text: message, isHTML }
  return this
}
Alert.prototype.button = function(text, click = null, isRed = false, preferred = false) {
  text && this._vue.buttons.push(new Alert._Button(text, typeof click == 'function' ? click.bind(this, this) : null, isRed, preferred))
  return this
}
Alert.prototype.input = function(placeholder = '', value = '') {
  this._vue.inputs.push(new Alert._Input(placeholder, value))
  return this
}
Alert.prototype.reset = function(title = '', message = '', buttons = [], inputs = []) {
  this.title(title)
  this.message(message)
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

Alert._Button = function(text = '', click = null, isRed = false, preferred = false) {
  if (!(this instanceof Alert._Button))
    return new Alert._Button(text, click, isRed, preferred)
  this.text = text
  this.click = click
  this.isRed = isRed
  this.preferred = preferred
}

Alert._Input = function(placeholder = '', value = '') {
  if (!(this instanceof Alert._Input)) return new Alert._Input(placeholder, value)
  this.value = value
  this.placeholder = placeholder
}
