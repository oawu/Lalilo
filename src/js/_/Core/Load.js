/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Load = {
  _: {
    mount (opt) {
      return document.body.appendChild(new Vue(this.option(opt)).$mount().$el)
    },
    option (opt) {
      if (typeof opt == 'function') {
        opt = opt()
      }

      if (typeof opt != 'object' || opt === null || Array.isArray(opt)) {
        return opt
      }

      if (typeof opt.template == 'undefined') {
        opt.template = ''
      }

      if (typeof opt.template == 'string') {
        opt.template = El3(opt.template)
      }

      if (opt.template instanceof El3) {
        opt.template = opt.template.toString()
      }

      if (typeof opt.template == 'object') {
        opt.template = opt.template.toString()
      }
      
      return opt
    }
  },
  Vue: opt => document.addEventListener('DOMContentLoaded', _ => Load._.mount(opt)),
  VueComponent: (identifier, opt) => Vue.component(identifier, Load._.option(opt))
}