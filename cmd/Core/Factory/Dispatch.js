/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path = require('path')

const { Type: T } = require('@oawu/helper')
const { inDir, fileExt } = require('@oawu/_Helper')

const Config = require('@oawu/_Config')
const FactoryIcon = require('@oawu/_FactoryIcon')
const FactoryScss = require('@oawu/_FactoryScss')
const FactoryFile = require('@oawu/_FactoryFile')

const _icon = new Map()
const _scss = new Map()
const _file = new Map()

const _defer = (map, timer) => {
  map.ing = false
  _loop(map, timer)
}

const _action = (action, defer) => {
  if (T.func(action)) {
    try { action() }
    catch (_) { }
    finally { defer() }
  } else if (T.asyncFunc(action)) {
    action().catch(_ => { }).finally(defer)
  } else if (T.promise(action)) {
    action.catch(_ => { }).finally(defer)
  } else {
    defer()
  }
}

const _loop = (_map, timer) => {
  if (_map.ing) {
    return
  } else {
    _map.ing = true
  }

  if (_map.tasks.length == 0) {
    _map.ing = false
    return
  }

  setTimeout(_ => {
    const task = _map.tasks.shift()
    if (task.id != _map.id) {
      return _defer(_map, timer)
    }

    if (T.func(task.action)) {
      try { _action(task.action(), _ => _defer(_map, timer)) }
      catch (_) { _defer(_map, timer) }
    } else if (T.asyncFunc(task.action)) {
      task.action()
        .then(action => _action(action, _ => _defer(_map, timer)))
        .catch(_ => _defer(_map, timer))
    } else if (T.promise(task.action)) {
      task.action
        .then(action => _action(action, _ => _defer(_map, timer)))
        .catch(_ => _defer(_map, timer))
    } else {
      _defer(_map, timer)
    }
  }, timer)
}

module.exports = (file, action) => {
  if (inDir(Config.Source.dir.icon, file) && file.endsWith('style.css')) {
    const _map = _icon.get(file) || { id: 0, ing: false, tasks: [] }
    const factory = FactoryIcon(file)
    const task = { id: ++_map.id, action: action(factory).bind(factory) }
    _map.tasks.push(task)
    _icon.set(file, _map)
    _loop(_map, 357)
  }
  if (inDir(Config.Source.dir.scss, file) && file.endsWith('.scss')) {
    const _map = _scss.get(file) || { id: 0, ing: false, tasks: [] }
    const factory = FactoryScss(file)
    const task = { id: ++_map.id, action: action(factory).bind(factory) }
    _map.tasks.push(task)
    _scss.set(file, _map)
    _loop(_map, 357)
  }
  if (inDir(Config.Source.path, file)
    && !Config.Server.watch.ignoreDirs.filter(dir => inDir(dir, file)).length
    && Config.Server.watch.exts.filter(ext => fileExt(file) === ext).length) {
    const _map = _file.get(file) || { id: 0, ing: false, tasks: [] }
    const factory = FactoryFile(file)
    const task = { id: ++_map.id, action: action(factory).bind(factory) }
    _map.tasks.push(task)
    _file.set(file, _map)
    _loop(_map, 357)
  }
}