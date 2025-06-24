/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Type: T, promisify } = window.Helper

  window.Load = {
    $(opt, closure = null) {
      return promisify(closure, async _ => {
        if (T.func(opt)) {
          opt = opt()
        }
        if (T.asyncFunc(opt)) {
          opt = await opt()
        }
        if (T.promise(opt)) {
          opt = await opt
        }

        if (!T.obj(opt)) {
          return opt
        }

        if (opt.template === undefined) {
          opt.template = ''
        }

        if (T.func(opt.template)) {
          opt.template = opt.template()
        }
        if (T.asyncFunc(opt.template)) {
          opt.template = await opt.template()
        }
        if (T.promise(opt.template)) {
          opt.template = await opt.template
        }

        if (T.num(opt.template)) {
          opt.template = `${opt.template}`
        }
        if (T.bool(opt.template)) {
          opt.template = ''
        }
        if (T.arr(opt.template)) {
          opt.template = ''
        }

        const El3 = window.El3

        if (T.str(opt.template)) {
          opt.template = El3(opt.template)
        }

        if (T.func(El3) && opt.template instanceof El3) {
          opt.template = opt.template.toString()
        }

        if (T.obj(opt.template)) {
          opt.template = opt.template.toString()
        }

        return opt
      })
    },
    Vue: (opt, closure = null) => promisify(closure, async _ => document.addEventListener('DOMContentLoaded', async _ => document.body.appendChild(new Vue(await window.Load.$(opt)).$mount().$el))),
    VueComponent: (identifier, opt, closure = null) => promisify(closure, async _ => Vue.component(identifier, await window.Load.$(opt)))
  }
})();