/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Factory = require('@oawu/_Factory')

const File = function(file) {
  if (!(this instanceof File)) {
    return new File(file)
  }

  Factory.call(this, file)
}
File.$ = new Map()
File.$on = (key, func) => {
  if (typeof func != 'function') {
    return File
  }

  let funcs = File.$.get(key)
  if (!Array.isArray(funcs)) {
    funcs = []
  }
  funcs.push(func)
  File.$.set(key, funcs)
  return File
}
File.$emit = (key, ...data) => {
  let funcs = File.$.get(key)
  if (!Array.isArray(funcs)) {
    funcs = []
  }

  for (let func of funcs) {
    func(...data)
  }
  return File
}

let actions = []
let reloadTimer = null
const reload = _ => {
  clearTimeout(reloadTimer)

  reloadTimer = setTimeout(_ => {
    File.$emit('reload', actions)
    actions = []
    clearTimeout(reloadTimer)
    reloadTimer = null
  }, 300)
}

File.prototype = Object.create(Factory.prototype)

File.prototype.build = function(done) {
  return done([])
}

File.prototype.create = function(done) {
  actions.push({ type: '新增', name: this.name })
  reload()
  return done()
}
File.prototype.update = function(done) {
  actions.push({ type: '修改', name: this.name })
  reload()
  return done()
}
File.prototype.remove = function(done) {
  actions.push({ type: '刪除', name: this.name })
  reload()
  return done()
}

module.exports = File
