/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Toastr = function(message, type = 'success') {
  if (Toastr._vue === undefined) {
    Toastr._vue = new Vue({
      data: {
        id: 0,
        toastrs: [],
      },
      methods: {
        close (toastr) {

          toastr.predisappear = true

          setTimeout(_ => {
            toastr.disappear = true

            setTimeout(_ => {
              let i = this.toastrs.indexOf(toastr)
              if (i != -1) {
                this.toastrs.splice(i, 1)
              }
            }, 100)
          }, 10)

          return this
        },
        push (message, type) {
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

          setTimeout(_ => {
            object.appear = true
            setTimeout(_ => {
              object.appeared = true
              setTimeout(_ => this.close(object), 5000)
            }, 300)
          }, 100)

          return this
        }
      },
      template: `<div id="toastr" v-if="toastrs.length"><div v-for="toastr in toastrs" :key="toastr.id" :class="['toastr', { appear: toastr.appear, appeared: toastr.appeared, predisappear: toastr.predisappear, disappear: toastr.disappear }]" :type="toastr.type" @click="close(toastr)"><span v-if="toastr.message">{{ toastr.message }}</span></div></div>`
    })
  }

  Toastr._vue.push(message, type)
  return Toastr
}

Toastr.failure = function(message) {
  Toastr(message, 'failure')
  return this
}
Toastr.success = function(message) {
  Toastr(message, 'success')
  return this
}
Toastr.warning = function(message) {
  Toastr(message, 'warning')
  return this
}
Toastr.info = function(message) {
  Toastr(message, 'info')
  return this
}