/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  window.Helper = {}

  window.Helper.Type = {
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
  }

  window.Helper.promisify = (closure, func, obj = undefined) => {
    const T = window.Helper.Type

    if (T.func(closure)) {

      if (T.asyncFunc(func)) {
        func().then(closure).catch(closure)
        return obj
      }

      if (T.promise(func)) {
        func.then(closure).catch(closure)
        return obj
      }

      if (!T.func(func)) {
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

    if (T.asyncFunc(closure)) {
      if (T.asyncFunc(func)) {
        func().then(closure).catch(closure)
        return obj
      }

      if (T.promise(func)) {
        func.then(closure).catch(closure)
        return obj
      }

      if (!T.func(func)) {
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

    if (T.asyncFunc(func)) {
      return func()
    }

    if (T.promise(func)) {
      return func
    }

    return new Promise((resolve, reject) => {
      if (!T.func(func)) {
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
  }

  window.Helper.tryFunc = async (func, ifCatchVal = undefined) => {
    const T = window.Helper.Type

    if (T.asyncFunc(func)) {
      let result = null
      try {
        result = await func()
      } catch (error) {
        result = ifCatchVal
        if (ifCatchVal === undefined) {
          result = error
        }
        if (T.func(ifCatchVal)) {
          result = ifCatchVal(error)
        }
        if (T.asyncFunc(ifCatchVal)) {
          result = await ifCatchVal(error)
        }
      }
      return result
    }

    if (T.promise(func)) {
      let result = null
      try {
        result = await func
      } catch (error) {
        result = ifCatchVal
        if (ifCatchVal === undefined) {
          result = error
        }
        if (T.func(ifCatchVal)) {
          result = ifCatchVal(error)
        }
        if (T.asyncFunc(ifCatchVal)) {
          result = await ifCatchVal(error)
        }
      }
      return result
    }

    if (T.func(func)) {
      let result = null
      try {
        result = func()
      } catch (error) {
        result = ifCatchVal
        if (ifCatchVal === undefined) {
          result = error
        }
        if (T.func(ifCatchVal)) {
          result = ifCatchVal(error)
        }
        if (T.asyncFunc(ifCatchVal)) {
          result = await ifCatchVal(error)
        }
      }
      return result
    }

    return func
  }

  window.Helper.Json = {
    decode: text => {
      let json = null

      try {
        json = JSON.parse(text)
      } catch (error) {
        json = error
      }

      return json
    },
    encode: (json, space = 0) => {
      let text = null

      try {
        text = JSON.stringify(json, null, space)
      } catch (error) {
        text = error
      }

      return text
    }
  }

  window.Helper.Str = {
    pad: (t, l = 2, s = '0', r = false) => r ? String(t).padEnd(l, s) : String(t).padStart(l, s),
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
    date: (format = 'Y-m-d H:i:s', now = new Date()) => {
      if (window.Helper.Type.num(format)) {
        now = format
        format = window.Helper.Type.neStr(now) ? now : 'Y-m-d H:i:s'
      }
      if (format instanceof Date) {
        format = window.Helper.Type.neStr(now) ? now : 'Y-m-d H:i:s'
        now = format
      }
      if (window.Helper.Type.num(now)) {
        now = new Date(now * 1000)
      }
      if (!(now instanceof Date)) {
        now = new Date()
      }

      return format
        .replace('w', ['日', '一', '二', '三', '四', '五', '六'][now.getDay()])
        .replace('Y', now.getFullYear())
        .replace('m', window.Helper.Str.pad(now.getMonth() + 1))
        .replace('n', now.getMonth() + 1)
        .replace('d', window.Helper.Str.pad(now.getDate()))
        .replace('j', now.getDate())
        .replace('H', window.Helper.Str.pad(now.getHours()))
        .replace('i', window.Helper.Str.pad(now.getMinutes()))
        .replace('s', window.Helper.Str.pad(now.getSeconds()))
    }
  }
})();