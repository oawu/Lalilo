/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Helper } = window
  const { Type: T, Json } = Helper

  const bus = new Vue()

  window.Bus = function (vue) {
    if (!(this instanceof window.Bus)) {
      return new window.Bus(vue)
    }

    this._vue = vue instanceof Vue ? vue : null
  }

  window.Bus.prototype.emit = function (key, ...params) {
    bus.$emit(key, ...params)
    return this
  }

  window.Bus.prototype.on = function (key, func) {
    if (!(T.func(func) || T.asyncFunc(func))) {
      return this
    }

    const vm = this._vue
    const wrap = vm ? (...params) => func.apply(vm, params) : func

    bus.$on(key, wrap)
    const stop = () => bus.$off(key, wrap)
    if (vm) {
      vm.$once('hook:beforeDestroy', stop)
    }
    return stop
  }

  window.Bus.prototype.once = function (key, func) {
    if (!(T.func(func) || T.asyncFunc(func))) {
      return this
    }

    const vm = this._vue
    const wrap = vm ? (...params) => func.apply(vm, params) : func
    bus.$once(key, wrap)
    return this
  }

  window.Bus.prototype.off = function (key, func) {
    bus.$off(key, func)
    return this
  }

  window.Bus.$on = (key, func) => bus.$on(key, func)
  window.Bus.$once = (key, func) => bus.$once(key, func)
  window.Bus.$off = (key, func) => bus.$off(key, func)
  window.Bus.$emit = (key, ...params) => bus.$emit(key, ...params)
})();
