/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Type: T } = window.Helper

  window.Toastr = function (message, type = 'success') {
    if (!T.obj(window.Toastr._vue)) {
      window.Toastr._vue = new Vue({
        data: {
          id: 0,
          toastrs: [],
        },
        methods: {
          async close(toastr) {
            toastr.predisappear = true

            await new Promise(resolve => setTimeout(resolve, 10))

            toastr.disappear = true

            await new Promise(resolve => setTimeout(resolve, 100))

            let i = this.toastrs.indexOf(toastr)
            if (i != -1) {
              this.toastrs.splice(i, 1)
            }

            return this
          },
          async push(message, type) {
            if (!this.$el && this.$mount()) {
              document.body.append(this.$el)
            }

            const object = {
              id: ++this.id,
              message,
              type,
              appear: false,
              appeared: false,
              disappear: false,
              predisappear: false
            }

            this.toastrs.push(object)

            await new Promise(resolve => setTimeout(resolve, 100))
            object.appear = true

            await new Promise(resolve => setTimeout(resolve, 300))
            object.appeared = true

            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.close(object)

            return this
          }
        },
        template: `
          <div id="Toastr" v-if="toastrs.length">
            <div v-for="toastr in toastrs" :key="toastr.id" :class="['toastr', { appear: toastr.appear, appeared: toastr.appeared, predisappear: toastr.predisappear, disappear: toastr.disappear }]" :type="toastr.type" @click="close(toastr)">
              <span v-if="toastr.message">{{ toastr.message }}</span>
            </div>
          </div>`
      })
    }

    window.Toastr._vue.push(message, type)
    return window.Toastr
  }

  window.Toastr.failure = message => window.Toastr(message, 'failure')
  window.Toastr.success = message => window.Toastr(message, 'success')
  window.Toastr.warning = message => window.Toastr(message, 'warning')
  window.Toastr.info = message => window.Toastr(message, 'info')
})();