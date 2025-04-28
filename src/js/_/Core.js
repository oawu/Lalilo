/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

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
