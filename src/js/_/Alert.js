/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Alert = function (title = '', message = null) {

  if (!(this instanceof Alert)) {
    if (Alert._shared instanceof Alert) {
      Alert._shared.reset()
      Alert._shared.title(title)
      Alert._shared.message(message)
      return Alert._shared
    }

    return Alert._shared = new Alert(title, message)
  }

  const _that = this

  const _button = {
    props: {
      buttons: { type: Array, required: true },
      inputs: { type: Array, required: true }
    },
    methods: {
      async click(button) {
        const T = window.Helper.Type
        const func = button._click

        if (T.func(func)) {
          func(_that, ...this.inputs.map(input => input._value))
        }
        if (T.asyncFunc(func)) {
          await func(_that, ...this.inputs.map(input => input._value))
        }
        if (T.promise(func)) {
          await func
        }
      }
    },
    template: `
    <div class="_buttons" v-if="buttons.length" :n="buttons.length">
      <button class='_button' v-for="(button, i) in buttons" :key="'_alert_button_' + i" @click="click(button)" :class="{ '__preferred': button._isPreferred, '__warning': button._isDestructive }" ref="button">{{ button._text }}</button>
    </div>`
  }

  const _input = {
    props: {
      inputs: { type: Array, required: true }
    },
    template: `
      <div class="_inputs" v-if="inputs.length">
        <input type="text" class='_input' v-for="(input, i) in inputs" :key="'_alert_input_' + i" :placeholder="input._placeholder" v-model.trim="input._value" ref="input" />
      </div>`
  }

  this._vue = new Vue({
    data: {
      display: false,
      show: false,

      title: null,
      message: null,
      buttons: [],
      inputs: [],
      isLoading: false,
    },
    methods: {
      present(completion = null, animated = true) {
        return window.Helper.promisify(completion, async _ => {
          const T = window.Helper.Type

          if (!T.obj(this.$el) && this.$mount()) {
            document.body.append(this.$el)
          }

          if (animated) {
            this.display = true
            await new Promise(resolve => setTimeout(resolve, 50))
            this.show = true
            await new Promise(resolve => setTimeout(resolve, 300))
          } else {
            this.display = true
            this.show = true
            await new Promise(resolve => setTimeout(resolve, 50))
          }

          setTimeout(_ => {
            if (T.obj(this.$refs) && T.obj(this.$refs.inputs) && T.obj(this.$refs.inputs.$refs) && T.arr(this.$refs.inputs.$refs.input) && this.$refs.inputs.$refs.input.length > 0) {
              const inputs = this.$refs.inputs.$refs.input
              inputs[inputs.length - 1].focus()
            } else if (T.obj(this.$refs) && T.obj(this.$refs.buttons) && T.obj(this.$refs.buttons.$refs) && T.arr(this.$refs.buttons.$refs.button) && this.$refs.buttons.$refs.button.length > 0) {
              const buttons = this.$refs.buttons.$refs.button
              buttons[buttons.length - 1].focus()
            }
          }, 50)

          return _that
        }, _that)
      },
      reset() {
        this.title = null
        this.message = null
        this.buttons = []
        this.inputs = []
        this.isLoading = false
      },
      dismiss(completion = null, animated = true) {
        return window.Helper.promisify(completion, async _ => {
          if (animated) {
            await new Promise(resolve => setTimeout(resolve, 10))
            this.show = false
            await new Promise(resolve => setTimeout(resolve, 300))
          } else {
            this.status.p1 = false
            this.show = false
          }

          this.display = false
          this.reset()

          return _that
        }, _that)
      },
    },
    components: {
      _button,
      _input,
    },
    template: `<div id="alert" v-if="display" :class="{ __show: show }">
      <div :class="{ _body: true, __loading: isLoading }">

        <template v-if="isLoading">
          <div class="_loading">
            <div>
              <i v-for="i in [0,1,2,3,4,5,6,7,8,9]" :key="'_alert_loading_' + i" :class="'__i' + i"></i>
            </div>

            <span>{{ message.text }}</span>
          </div>
        </template>

        <template v-else>
          <b class="_title" v-if="title !== null">{{ title }}</b>

          <template v-if="message !== null">
            <span class="_subtitle" v-if="message.isHTML" v-html="message.text"></span>
            <span class="_subtitle" v-if="!message.isHTML">{{ message.text }}</span>
          </template>

          <_input ref="inputs" :inputs=inputs></_input>

          <_button ref="buttons" :buttons=buttons :inputs=inputs></_button>

        </template>
      </div>
    </div>`,
  })

  this.title(title)
  this.message(message)
}

Alert.prototype.present = function (completion = null, animated = true) {
  const T = window.Helper.Type

  if (T.bool(completion)) {
    animated = completion
    completion = null
  }
  if (T.func(animated) || T.asyncFunc(animated) || T.promise(animated)) {
    completion = animated
    animated = true
  }

  return this._vue.present(completion, animated)
}
Alert.prototype.dismiss = function (completion = null, animated = true) {
  const T = window.Helper.Type

  if (T.bool(completion)) {
    animated = completion
    completion = null
  }
  if (T.func(animated) || T.asyncFunc(animated) || T.promise(animated)) {
    completion = animated
    animated = true
  }

  return this._vue.dismiss(completion, animated)
}
Alert.prototype.reset = function () {
  this._vue.reset()
  return this
}
Alert.prototype.title = function (title) {
  if (title === null) {
    this._vue.title = title
  }
  if (window.Helper.Type.str(title)) {
    this._vue.title = title
  }
  return this
}
Alert.prototype.message = function (text, isHTML = false) {
  if (text === null) {
    this._vue.message = null
  }
  if (window.Helper.Type.str(text)) {
    this._vue.message = { text, isHTML }
  }
  return this
}
Alert.prototype.loading = function (text = '讀取中…', completion = null) {
  const T = window.Helper.Type

  if (T.func(text) || T.asyncFunc(text) || T.promise(text)) {
    completion = text
    text = '讀取中…'
  }

  this.reset()
  this.message(text)
  this._vue.isLoading = true

  if (typeof completion == 'function') {
    completion.call(this, this)
  }

  return this
}

Alert.prototype.input = function (placeholder = '', value = '') {
  this._vue.inputs.push(new Alert._Input(placeholder, value))
  return this
}
Alert.prototype.button = function (text, click = null, isDestructive = false, isPreferred = false) {
  if (!window.Helper.Type.neStr(text)) {
    return this
  }

  this._vue.buttons.push(Alert._Button(text, click, isDestructive, isPreferred))

  return this
}

Alert._Input = function (placeholder = '', value = '') {
  if (!(this instanceof Alert._Input)) {
    return new Alert._Input(placeholder, value)
  }
  this._value = ''
  this._placeholder = ''

  this.value(value)
  this.placeholder(placeholder)
}
Alert._Input.prototype.value = function (value) {
  if (window.Helper.Type.str(value)) {
    this._value = value
  }
  return this
}
Alert._Input.prototype.placeholder = function (placeholder) {
  if (window.Helper.Type.str(placeholder)) {
    this._placeholder = placeholder
  }
  return this
}

Alert._Button = function (text = '', click = null, isDestructive = false, isPreferred = false) {
  if (!(this instanceof Alert._Button)) {
    return new Alert._Button(text, click, isDestructive, isPreferred)
  }

  this._text = ''
  this._click = null
  this._isDestructive = false
  this._isPreferred = false

  this.text(text)
  this.click(click)
  this.isDestructive(isDestructive)
  this.isPreferred(isPreferred)
}
Alert._Button.prototype.text = function (text) {
  if (window.Helper.Type.str(text)) {
    this._text = text
  }

  return this
}
Alert._Button.prototype.click = function (click) {
  if (window.Helper.Type.func(click) || window.Helper.Type.asyncFunc(click) || window.Helper.Type.promise(click)) {
    this._click = click
  }
  return this
}
Alert._Button.prototype.isDestructive = function (isDestructive) {
  if (window.Helper.Type.bool(isDestructive)) {
    this._isDestructive = isDestructive
  }
  return this
}
Alert._Button.prototype.isPreferred = function (isPreferred) {
  if (window.Helper.Type.bool(isPreferred)) {
    this._isPreferred = isPreferred
  }
  return this
}
