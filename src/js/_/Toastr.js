/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Toastr = function(message, type = 'success') {
  if (Toastr._vue === undefined)
    Toastr._vue = new Vue({
      data: {
        id: 0,
        toastrs: [],
      },
      methods: {
        close (toastr) {
          return setTimeout(_ => setTimeout(_ => {
            let i = this.toastrs.indexOf(toastr)
            i == -1 || this.toastrs.splice(i, 1)
          }, 100, toastr.disappear = true), 10, toastr.predisappear = true), this
        },
        push (message, type) {
          this.$el || this.$mount() && document.body.append(this.$el)
          const object = { id: ++this.id, message, type, appear: false, appeared: false, disappear: false, predisappear: false }
          return setTimeout(_ => setTimeout(_ => setTimeout(_ => this.close(object), 5000, object.appeared = true), 300, object.appear = true), 100, this.toastrs.push(object)), this
        }
      },
      template: `<div id="toastr" v-if="toastrs.length"><div v-for="toastr in toastrs" :key="toastr.id" :class="['toastr', { appear: toastr.appear, appeared: toastr.appeared, predisappear: toastr.predisappear, disappear: toastr.disappear }]" :type="toastr.type" @click="close(toastr)"><span v-if="toastr.message">{{ toastr.message }}</span></div></div>`
    })

  return Toastr._vue.push(message, type), Toastr
}

Toastr.failure = function(message) { return Toastr(message, 'failure'), this }
Toastr.success = function(message) { return Toastr(message, 'success'), this }
Toastr.warning = function(message) { return Toastr(message, 'warning'), this }
Toastr.info = function(message) { return Toastr(message, 'info'), this }