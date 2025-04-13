/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Helper = {
  numFormat: (n, d = 3) => {
    const w = []
    for (let i = 0, a = ('' + n).split('').reverse(); i < a.length; i++) {
      if (!i || (i % d)) {
        w.push(a[i])
      } else {
        w.push(',', a[i])
      }
    }
    return w.reverse().join('')
  },
  pad0: (t, n = 2, c = '0') => {
    t = '' + t
    c = '' + c
    n = '' + Math.pow(10, n - 1)
    if (t.length > n.length) {
      return t
    }
    n = n.length - t.length
    return c.repeat(n) + t
  },
  date: (format = 'Y-m-d H:i:s', now = new Date()) => {
    if (format instanceof Date) {
      now = format
      format = typeof now == 'string' ? now : 'Y-m-d H:i:s'
    }

    now = now instanceof Date
      ? now
      : new Date(now * 1000)

    return format.replace('Y', now.getFullYear()).replace('m', Helper.pad0(now.getMonth() + 1)).replace('d', Helper.pad0(now.getDate())).replace('H', Helper.pad0(now.getHours())).replace('i', Helper.pad0(now.getMinutes())).replace('s', Helper.pad0(now.getSeconds()))
  },
  copyStr: (text, done, fail) => {
    let error = null
    let el = document.createElement('textarea')
    el.className = '__lalilo_copy_str'
    el.value = text
    document.body.appendChild(el)
    el.select()

    try {
      document.execCommand('copy')
    } catch (e) {
      error = e.message
    }

    document.body.removeChild(el)

    el = null
    let func = error
      ? fail
      : done

    typeof func == 'function' && func()
  },

  Type: {
    obj: v => typeof v == 'object' && v !== null && !Array.isArray(v),
    str: v => typeof v == 'string',
    neStr: v => typeof v == 'string' && v !== '',
    num: v => typeof v == 'number' && v !== Infinity && !isNaN(v),
    bool: v => typeof v == 'boolean',
    arr: v => Array.isArray(v),
    func: v => typeof v == 'function' && v.constructor.name !== 'AsyncFunction',
    asyncFunc: v => typeof v == 'function' && v.constructor.name === 'AsyncFunction',
    promise: v => typeof v == 'object' && v !== null && !Array.isArray(v) && v instanceof Promise,
    err: v => typeof v == 'object' && v !== null && !Array.isArray(v) && v instanceof Error,
  },
  promisify: (closure, func, obj = undefined) => {
    if (typeof closure == 'function' && closure.constructor.name !== 'AsyncFunction') {

      if (typeof func == 'function' && func.constructor.name === 'AsyncFunction') {
        func().then(closure).catch(closure)
        return obj
      }

      if (typeof func == 'object' && func !== null && !Array.isArray(func) && func instanceof Promise) {
        func.then(closure).catch(closure)
        return obj
      }

      if (!typeof func == 'function' && func.constructor.name !== 'AsyncFunction') {
        closure(func)
        return obj
      }

      let _tmp = false
      try {
        func(result => {
          if (_tmp) { return }
          _tmp = true
          closure(result)
        })
      } catch (error) {
        if (_tmp) { return }
        _tmp = true
        closure(error)
      }
      return obj
    }

    // =================

    if (typeof closure == 'function' && closure.constructor.name === 'AsyncFunction') {
      if (typeof func == 'function' && func.constructor.name === 'AsyncFunction') {
        func().then(closure).catch(closure)
        return obj
      }

      if (typeof func == 'object' && func !== null && !Array.isArray(func) && func instanceof Promise) {
        func.then(closure).catch(closure)
        return obj
      }

      if (!typeof func == 'function' && func.constructor.name !== 'AsyncFunction') {
        closure(func)
        return obj
      }

      let _tmp = false
      try {
        func(result => {
          if (_tmp) { return }
          _tmp = true
          closure(result)
        })
      } catch (error) {
        if (_tmp) { return }
        _tmp = true
        closure(error)
      }
      return obj
    }

    // =================

    if (typeof func == 'function' && func.constructor.name === 'AsyncFunction') {
      return func()
    }

    if (typeof func == 'object' && func !== null && !Array.isArray(func) && func instanceof Promise) {
      return func
    }

    return new Promise((resolve, reject) => {
      if (!typeof func == 'function' && func.constructor.name !== 'AsyncFunction') {
        return func instanceof Error
          ? reject(func)
          : resolve(func)
      }

      let _tmp = false
      try {
        func(result => {
          if (_tmp) { return }
          _tmp = true
          result instanceof Error ? reject(result) : resolve(result)
        })
      } catch (error) {
        if (_tmp) { return }
        _tmp = true
        reject(error)
      }
    })
  },
  tryFunc: async (func, ifCatchVal = undefined) => {
    if (typeof func == 'function' && func.constructor.name === 'AsyncFunction') {
      let result = null
      try {
        result = await func()
      } catch (error) {
        result = ifCatchVal
        if (ifCatchVal === undefined) {
          result = error
        }
        if (typeof ifCatchVal == 'function' && ifCatchVal.constructor.name !== 'AsyncFunction') {
          result = ifCatchVal(error)
        }
        if (typeof ifCatchVal == 'function' && ifCatchVal.constructor.name === 'AsyncFunction') {
          result = await ifCatchVal(error)
        }
      }
      return result
    }

    if (typeof func == 'object' && func !== null && !Array.isArray(func) && func instanceof Promise) {
      let result = null
      try {
        result = await func
      } catch (error) {
        result = ifCatchVal
        if (ifCatchVal === undefined) {
          result = error
        }
        if (typeof ifCatchVal == 'function' && ifCatchVal.constructor.name !== 'AsyncFunction') {
          result = ifCatchVal(error)
        }
        if (typeof ifCatchVal == 'function' && ifCatchVal.constructor.name === 'AsyncFunction') {
          result = await ifCatchVal(error)
        }
      }
      return result
    }

    if (typeof func == 'function' && func.constructor.name !== 'AsyncFunction') {
      let result = null
      try {
        result = func()
      } catch (error) {
        result = ifCatchVal
        if (ifCatchVal === undefined) {
          result = error
        }
        if (typeof ifCatchVal == 'function' && ifCatchVal.constructor.name !== 'AsyncFunction') {
          result = ifCatchVal(error)
        }
        if (typeof ifCatchVal == 'function' && ifCatchVal.constructor.name === 'AsyncFunction') {
          result = await ifCatchVal(error)
        }
      }
      return result
    }

    return func
  }

}
