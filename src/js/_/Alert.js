/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Alert = function(title = null, message = null, buttons = [], inputs = []) {
  if (!(this instanceof Alert)) {
    return new Alert(title, message, buttons)
  }

  this._vue = new Vue({
    data: {
      display: false,
      isLoading: false,

      title: null,
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
        if (!this.$el && this.$mount()) {
          document.body.append(this.$el)
        }

        if (animated) {
          this.display = true

          setTimeout(_ => {
            this.status.p0 = true

            setTimeout(_ => {
              setTimeout(_ => {
                if (this.$refs.alertInput && this.$refs.alertInput.length > 0) {
                  this.$refs.alertInput[this.$refs.alertInput.length - 1].focus()
                } else if (this.$refs.alertButton && this.$refs.alertButton.length > 0) {
                  this.$refs.alertButton[this.$refs.alertButton.length - 1].focus()
                }
              }, 50)

              this.status.p1 = true
              
              if (typeof completion == 'function') {
                completion()
              }
            }, 300)
          }, 50)

          return this
        }

        this.display = true
        this.status.p0 = true

        setTimeout(_ => {
          this.status.p1 = true
          if (typeof completion == 'function') {
            completion()
          }
        }, 50)

        return this
      },
      dismiss(completion = null, animated = true) {
        if (animated) {
          this.status.p1 = false

          setTimeout(_ => {
            this.status.p0 = false

            setTimeout(_ => {
              this.display = false

              if (typeof completion == 'function') {
                completion()
              }
            }, 300)
          }, 10)

          return this
        }

        this.status.p1 = false
        this.status.p0 = false

        setTimeout(_ => {
          this.display = false
          
          if (typeof completion == 'function') {
            completion()
          }
        }, 1)

        return this
      },
    },
    template: `<div id="__oaui-alert" v-if="display" :class="{ __p0: status.p0, __p1: status.p1 }">
      <div :class="{ _body: true, __loading: isLoading }">
        <template v-if="isLoading">
          <div class="_loading">
            <div>
              <i v-for="i in [0,1,2,3,4,5,6,7,8,9,10,11]" :key="'_alert_loading_' + i" :class="'__i' + i"></i>
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

          <input class='_input' v-for="(input, i) in inputs" :key="'_alert_input_' + i" type="text" :placeholder="input.placeholder" v-model.trim="input.value" ref="alertInput" />
          <div class="_buttons" v-if="buttons.length" :n="buttons.length">
            <button class='_button' v-for="(button, i) in buttons" :key="'_alert_button_' + i" @click="button.click ? button.click(...inputs.map(input => input.value)) : {}" :class="{ '__preferred': button.preferred, '__warning': button.destructive }" ref="alertButton">{{ button.text }}</button>
          </div>
        </template>
      </div>
    </div>`,
  })

  this.title(title)
  this.message(message)

  inputs.forEach(this.input)
  buttons.forEach(button => typeof button == 'object' && button !== null && !Array.isArray(button) && this.button(button.text, button.click, button.destructive, button.preferred))
}

Alert.prototype.present = function(completion = null, animated = true) {
  if (typeof completion == 'boolean') {
    animated = completion
  }
  if (typeof animated == 'function') {
    completion = animated
  }

  this._vue.present(typeof completion == 'function'
    ? completion.bind(this, this)
    : null, animated)

  return this
}
Alert.prototype.dismiss = function(completion = null, animated = true) {
  if (typeof completion == 'boolean') {
    animated = completion
  }
  if (typeof animated == 'function') {
    completion = animated
  }

  this._vue.dismiss(_ => {
    if (typeof completion == 'function') {
      completion.call(this, this)
    }

    this.reset('', '', [], [])
  }, animated)

  return this
}
Alert.prototype.title = function(title) {
  if (title === null) {
    this._vue.title = null
  } else if (typeof title == 'string') {
    this._vue.title = title
  }
  return this
}
Alert.prototype.message = function(text, isHTML = false) {
  if (text === null) {
    this._vue.message = null
  } else if (typeof text == 'string') {
    this._vue.message = { text, isHTML }
  }
  return this
}
Alert.prototype.button = function(text, click = null, destructive = false, preferred = false) {
  if (typeof text == 'string' && text !== '') {
    this._vue.buttons.push(Alert._Button(
      text,
      typeof click == 'function' ? click.bind(this, this) : null,
      typeof destructive == 'boolean' && destructive,
      typeof preferred == 'boolean' && preferred))
  }
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
  if (typeof text == 'function') {
    completion = text
    text = '讀取中…'
  }

  this.reset().message(text)._vue.isLoading = true

  if (typeof completion == 'function') {
    completion.call(this, this)
  }

  return this
}

Object.defineProperty(Alert, 'shared', { get () {
  if (this._shared === undefined) {
    this._shared = this()
  }
  
  return this._shared
} })

Alert._Button = function(text = '', click = null, destructive = false, preferred = false) {
  if (!(this instanceof Alert._Button)) {
    return new Alert._Button(text, click, destructive, preferred)
  }

  this.text = text
  this.click = click
  this.destructive = destructive
  this.preferred = preferred
}

Alert._Input = function(placeholder = '', value = '') {
  if (!(this instanceof Alert._Input)) {
    return new Alert._Input(placeholder, value)
  }
  this.value = value
  this.placeholder = placeholder
}
