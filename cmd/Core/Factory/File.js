/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Factory = require('@oawu/_Factory')
const { promisify, Type: T } = require('@oawu/helper')

const File = function (file) {
  if (!(this instanceof File)) {
    return new File(file)
  }

  Factory.call(this, file)
}

File.prototype = Object.create(Factory.prototype)

File.$ = new Map()
File.$on = (key, func) => {
  if (!(T.func(func) || T.asyncFunc(func) || T.promise(func))) {
    return File
  }

  let funcs = File.$.get(key)
  if (!T.arr(funcs)) {
    funcs = []
  }
  funcs.push(func)
  File.$.set(key, funcs)
  return File
}
File.$emit = (key, ...data) => {
  let funcs = File.$.get(key) || []
  if (!T.arr(funcs)) {
    funcs = []
  }

  for (let func of funcs) {
    setTimeout(_ => {
      if (T.func(func)) {
        try { func(...data) } catch (_) { }
      } else if (T.asyncFunc(func)) {
        func(...data).catch(_ => { })
      } else if (T.promise(func)) {
        func.catch(_ => { })
      }
    })
  }

  return File
}


let _actions = []
let _reloadTimer = null
const _reload = _ => {
  clearTimeout(_reloadTimer)

  _reloadTimer = setTimeout(_ => {
    File.$emit('reload', _actions)
    _actions = []
    clearTimeout(_reloadTimer)
    _reloadTimer = null
  }, 300)
}

File.prototype.create = function (done) {
  return promisify(done, done => {
    _actions.push({ type: '新增', name: this._name })
    _reload()
    done()
  })
}

File.prototype.update = function (done) {
  return promisify(done, done => {
    _actions.push({ type: '修改', name: this._name })
    _reload()
    done()
  })
}

File.prototype.remove = function (done) {
  return promisify(done, done => {
    _actions.push({ type: '刪除', name: this._name })
    _reload()
    done()
  })
}

module.exports = File
