/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Type: T, promisify } = window.Helper

  window.PopupBox = function (identifier, value = null) {
    if (!(this instanceof window.PopupBox)) {
      if (window.PopupBox._shared instanceof window.PopupBox) {
        window.PopupBox._sharedwindow.PopupBox._shared.identifier(identifier).value(value)
        return window.PopupBox._shared
      }

      return new PopupBox(identifier, value)
    }

    const _that = this

    this._update = null
    this._vue = new Vue({
      data: {
        value: null,
        display: false,
        presented: false,
        identifier: null,
      },
      methods: {
        present(completion = null, animated = true) {

          if (T.bool(completion)) {
            animated = completion
            completion = null
          }
          if (!T.bool(animated)) {
            animated = true
          }

          return promisify(completion, async _ => {
            if (!T.obj(this.$el) && this.$mount()) {
              document.body.append(this.$el)
            }

            if (animated) {
              this.display = true
              await new Promise(resolve => setTimeout(resolve, 1))
              this.presented = true
            } else {
              this.display = true
              this.presented = true
            }
            return _that
          }, _that)
        },
        dismiss(completion = null, animated = true) {

          if (T.bool(completion)) {
            animated = completion
            completion = null
          }
          if (!T.bool(animated)) {
            animated = true
          }

          return promisify(completion, async _ => {
            if (animated) {
              this.presented = false
              await new Promise(resolve => setTimeout(resolve, 300))
              this.display = false
            } else {
              this.presented = false
              this.display = false
            }
          }, _that)
        },
        async submit(value) {
          this.input(value)
          this.dismiss()
        },
        async input(value) {
          this.value = value
          if (T.promise(_that._update)) {
            await _that._update
          }
          if (T.asyncFunc(_that._update)) {
            await _that._update(value)
          }
          if (T.func(_that._update)) {
            _that._update(value)
          }
        }
      },
      template: `
        <div id="PopupBox" v-if="display" :class="{_present: presented}">
          <div class="cover" @click="dismiss"></div>
          <div class="box">
            <component :is="identifier" :value="value" @input=input @submit=submit></component>
          </div>
        </div>`
    })

    this
      .identifier(identifier)
      .value(value)
  }
  window.PopupBox.prototype.identifier = function (identifier) {
    if (T.neStr(identifier)) {
      this._vue.identifier = identifier
    }
    return this
  }
  window.PopupBox.prototype.value = function (value) {
    if (T.obj(value) || value === null) {
      this._vue.value = value
    }
    return this
  }
  window.PopupBox.prototype.update = function (update) {
    this._update = update
    return this
  }
  window.PopupBox.prototype.present = function (completion = null, animated = true) {
    if (T.bool(completion)) {
      animated = completion
      completion = null
    }
    if (!T.bool(animated)) {
      animated = true
    }

    return promisify(completion, async _ => {
      await this._vue.present(completion, animated)
      return this
    })
  }
  window.PopupBox.prototype.dismiss = function (completion = null, animated = true) {
    if (T.bool(completion)) {
      animated = completion
      completion = null
    }
    if (!T.bool(animated)) {
      animated = true
    }

    return promisify(completion, async _ => {
      await this._vue.dismiss(completion, animated)
      return this
    })
  }

})();