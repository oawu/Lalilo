/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const DB = {}

DB._config = {
  name: 'Base1',
  version: 1,
  schema: db => {
    const store1 = db.createObjectStore('Date', { autoIncrement: true })
    const store2 = db.createObjectStore('Date.Activity', { autoIncrement: true })
    const store3 = db.createObjectStore('Date.Activity.Point', { autoIncrement: true })

    store1.createIndex('ymd', ['year', 'month', 'day']);

    store2.createIndex('dateId', 'dateId');

    store3.createIndex('activityId', 'activityId');
    store3.createIndex('activityId_status', ['activityId', 'status']);
    store3.createIndex('accH', 'position.acc');
  },
}

DB._keyword = [
  '$',

  '_key',
  '_val',
  '_watchs',

  'id',
  
  'val',
  'save',
  'delete',

  'create', 'all', 'one', 'count', 'clear', 'first', 'where'
]

Object.defineProperty(DB, '_$', { get () {
  if (DB._$$ !== undefined) {
    return DB._$$
  }
  if (window.indexedDB !== undefined) {
    return DB._$$ = window.indexedDB
  }
  if (window.mozIndexedDB !== undefined) {
    return DB._$$ = window.mozIndexedDB
  }
  if (window.webkitIndexedDB !== undefined) {
    return DB._$$ = window.webkitIndexedDB
  }
  if (window.msIndexedDB !== undefined) {
    return DB._$$ = window.msIndexedDB
  }
  if (window.shimIndexedDB !== undefined) {
    return DB._$$ = window.shimIndexedDB
  }

  return DB._$$ = null
} })

// ===== DB._T
  DB._T = {
    bool:  v => typeof v == 'boolean',
    num:   v => typeof v == 'number' && !isNaN(v) && v !== Infinity,
    str:   v => typeof v == 'string',
    neStr: v => typeof v == 'string' && v !== '',
    obj:   v => typeof v == 'object' && v !== null && !Array.isArray(v),
    func:  v => typeof v == 'function',
  }

// ===== DB._D
  DB._D = function(timer = null, food = undefined, watch = _ => _ === undefined) {
    if (!(this instanceof DB._D)) {
      return new DB._D(timer, food, watch)
    }

    this._food = food
    this._watch = t => t !== undefined
    this._timer = 100
    this._biteFunc = null

    this.watch(watch)
    this.timer(timer)
  }

  Object.defineProperty(DB._D.prototype, 'eat', {
    get () {
      const that = this
      return (function (...foods) {
        that._food = foods
        return that
      }).bind(this)
    }
  })

  DB._D.prototype.watch = function(watch) {
    if (typeof watch == 'function') {
      this._watch = watch
    }

    return this
  }
  DB._D.prototype.timer = function(timer) {
    if (typeof timer == 'number' && !isNaN(timer) && timer !== Infinity) {
      this._timer = timer
    }

    return this
  }
  DB._D.prototype.bite = function(biteFunc) {
    this._biteFunc = biteFunc

    const _wait = _ => {
      if (typeof this._watch == 'function' ? this._watch(this._food) : false) {
        return setTimeout(_wait, this._timer)
      }

      if (typeof this._biteFunc == 'function') {
        this._biteFunc(...this._food)
      }
    }

    _wait()
    return this
  }

DB._func_or_promise = (obj, closure, promiseFunc) => {
  const promise = new Promise(promiseFunc)

  if (!DB._T.func(closure)) {
    return promise
  }

  const dog = DB._D().bite(food => food instanceof Error
    ? closure(food, null)
    : closure(null, food))

  promise
    .then(dog.eat)
    .catch(dog.eat)

  return obj
}
DB._init = closure => DB._func_or_promise(DB, closure, (resolve, reject) => {
  if (!DB._$) {
    return reject(new Error('無法使用 DB'))
  }

  const open = DB._$.open(DB._config.name, DB._config.version)

  open.onupgradeneeded = e => DB._T.obj(DB._config) && DB._T.func(DB._config.schema)
    ? DB._config.schema(
      DB._T.obj(e) && DB._T.obj(e.target) && DB._T.obj(e.target.result) && e.target.result instanceof IDBDatabase
        ? e.target.result
        : null,
      e)
    : null

  open.onsuccess = e => DB._T.obj(e) && DB._T.obj(e.target) && DB._T.obj(e.target.result) && e.target.result instanceof IDBDatabase
      ? resolve(e.target.result)
      : reject(new Error('無法開啟 DB'))
})

DB._bases = closure => DB._func_or_promise(DB, closure, (resolve, reject) => DB._$.databases()
  .then(bases => resolve(bases))
  .catch(e => reject(e)))

DB._clear = closure => DB._func_or_promise(this, closure, (resolve, reject) => DB._init((error, db) => {
  if (error) {
    return reject(error)
  }

  DB._bases((error, bases) => {
    if (error) {
      return reject(error)
    }

    try {
      db.close()
    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }

    Promise.all(bases.map(base => new Promise((_resolve, _reject) => {
      if (!(DB._T.obj(base) && DB._T.neStr(base.name))) {
        return _reject(new Error('格式錯誤'))
      }

      const request = DB._$.deleteDatabase(base.name)
      request.onsuccess = _ => _resolve(base.name)
      request.onerror = e => _reject(new Error(`刪除失敗，錯誤原因：${e.message}`))
    })))
      .then(resolve)
      .catch(reject)
  })
}))


DB._Model = function(val = {}, key = null) {
  if (!(this instanceof DB._Model)) {
    return new DB._Model(val, key)
  }

  this._key = key
  this._val = {}
  this._watchs = []

  this.val(val)

  Object.defineProperty(this, 'id', { get () { return this._key }, configurable: false })
}
DB._Model.prototype.val = function(val) {
  if (!DB._T.obj(val)) {
    return this
  }

  for (let k of this._watchs) {
    if (!DB._keyword.includes(k)) {
      delete this[k];
    }
  }

  this._val = val

  for (let k in this._val) {
    if (!DB._keyword.includes(k)) {
      this._watchs.push(k)

      Object.defineProperty(this, k, {
        get () { return this._val[k] },
        set (val) { return this._val[k] = val },
        configurable: true,
      })
    }
  }
  return this
}
DB._Model.prototype.save = function(closure) {
  return DB._func_or_promise(this, closure, (resolve, reject) => {
    if (this._key === null) {
      return reject(new Error('此物件沒有 Key'))
    }

    this.$.update(this._key, this._val, (error, keyVal) => error ? reject(error) : resolve(this.val(keyVal.val)))
  })
}
DB._Model.prototype.delete = function(closure) {
  return DB._func_or_promise(this, closure, (resolve, reject) => this._key !== null
    ? this.$.delete(this._key, (error, _key) => {
        if (error) {
          return reject(error)
        }

        this._key = null

        resolve(this)
      })
    : resolve())
}

DB._Table = table => ({
  one: (key, closure, callBase = null) => DB._func_or_promise(callBase, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    try {
      db.transaction(table)
        .objectStore(table)
        .get(key)
        .onsuccess = e => DB._T.obj(e) && DB._T.obj(e.target)
          ? resolve({ key, val: e.target.result })
          : reject(new Error('回應結果格式錯誤'))
    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  })),
  create: (param, closure, callBase = null) => DB._func_or_promise(callBase, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    try {
      db.transaction(table, 'readwrite')
        .objectStore(table)
        .add(param)
        .onsuccess = e => DB._T.obj(e) && DB._T.obj(e.target)
          ? resolve({ key: e.target.result, val: param })
          : reject(new Error('回應結果格式錯誤'))
    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  })),
  update: (key, param, closure, callBase = null) => DB._func_or_promise(callBase, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    try {
      db.transaction(table, 'readwrite')
        .objectStore(table)
        .put(param, key)
        .onsuccess = e => DB._T.obj(e) && DB._T.obj(e.target)
          ? resolve({ key: e.target.result, val: param })
          : reject(new Error('回應結果格式錯誤'))
    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  })),
  delete: (key, closure, callBase = null) => DB._func_or_promise(callBase, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    try {
      db.transaction(table, 'readwrite')
        .objectStore(table)
        .delete(key)
        .onsuccess = e => resolve(key)
    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  })),
  clear: (closure, callBase = null) => DB._func_or_promise(callBase, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    try {
      db.transaction(table, 'readwrite')
        .objectStore(table)
        .clear()
        .onsuccess = e => resolve()
    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  })),
  all: (closure, where = null, callBase = null) => DB._func_or_promise(callBase, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }
    
    const data = []

    try {
      const _req = where instanceof DB._Where
        ? db.transaction(table).objectStore(table).index(where.key).openCursor(where.val)
        : db.transaction(table).objectStore(table).openCursor()

      _req
        .onsuccess = e => {
          if (!(DB._T.obj(e) && DB._T.obj(e.target))) {
            return reject(new Error('回應結果格式錯誤'))
          }

          let cursor = e.target.result


          if (cursor instanceof IDBCursorWithValue) {
            data.push({ key: cursor.primaryKey, val: cursor.value })
            cursor.continue()
          } else {
            resolve(data)
          }
        }
    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  })),
  count: (closure, where = null, callBase = null) => DB._func_or_promise(callBase, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }
    try {
      const _req = where instanceof DB._Where
        ? db.transaction(table).objectStore(table).index(where.key).count(where.val)
        : db.transaction(table).objectStore(table).count()

      _req
        .onsuccess = e => DB._T.obj(e) && DB._T.obj(e.target)
          ? resolve(e.target.result)
          : reject(new Error('回應結果格式錯誤'))
    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  })),
  first: (closure, where = null, callBase = null) => DB._func_or_promise(callBase, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }
    
    try {
      const _req = where instanceof DB._Where
        ? db.transaction(table).objectStore(table).index(where.key).openCursor(where.val)
        : db.transaction(table).objectStore(table).openCursor()

      _req
        .onsuccess = e => {
          if (!(DB._T.obj(e) && DB._T.obj(e.target))) {
            return reject(new Error('回應結果格式錯誤'))
          }

          let cursor = e.target.result

          if (cursor instanceof IDBCursorWithValue) {
            resolve({ key: cursor.primaryKey, val: cursor.value })
          } else {
            resolve()
          }
        }
    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  })),
})

DB._Where = function(key, val) {
  if (!(this instanceof DB._Where)) {
    return new DB._Where(key, val)
  }

  this.key = key
  this.val = val
}

DB._InitModel = (_table, closure) => {
  
  const table = DB._Table(_table)

  const Model = function(raw = undefined) {
    if (!(this instanceof Model)) {
      return DB._T.obj(raw) ? new Model(raw) : null
    }

    DB._Model.call(this, raw.val, raw.key)
    this.$ = table
  }

  Model.prototype = Object.create(DB._Model.prototype)

  Model.create = (param, closure) => DB._func_or_promise(
    Model,
    closure,
    (resolve, reject) => table.create(
      param,
      (error, keyVal) => error
        ? reject(error)
        : resolve(Model(keyVal))))

  Model.all = (closure) => DB._func_or_promise(
    Model,
    closure,
    (resolve, reject) => table.all((error, keyVals) =>
      error
        ? reject(error)
        : resolve(keyVals.map(
          keyVal => Model(keyVal)).filter(
          obj => obj !== null))))

  Model.one = (key, closure) => DB._func_or_promise(
    Model,
    closure,
    (resolve, reject) => table.one(key, (error, keyVal) => error
      ? reject(error)
      : resolve(keyVal.val === undefined
        ? null
        : Model(keyVal))))

  Model.count = (closure) => table.count(closure, null, Model)
  Model.clear = (closure) => table.clear(closure, Model)

  Model.first = (closure) => DB._func_or_promise(
    Model,
    closure,
    (resolve, reject) => table.first((error, keyVal) => error
      ? reject(error)
      : resolve(DB._T.obj(keyVal)
        ? Model(keyVal)
        : null)))

  const Where = function(key, val) { return this instanceof Where ? DB._Where.call(this, key, val) : new Where(key, val) }
  Where.prototype = Object.create(DB._Where.prototype)
  Where.prototype.all = function(closure) {
    return DB._func_or_promise(
      this,
      closure,
      (resolve, reject) => table.all((error, keyVals) =>
        error
          ? reject(error)
          : resolve(keyVals.map(
            keyVal => Model(keyVal)).filter(
            obj => obj !== null)), this))
  }
  
  Where.prototype.count = function(closure) {
    return table.count(closure, this, Model)
  }
  
  Where.prototype.first = function(closure) {
    return DB._func_or_promise(
      Model,
      closure,
      (resolve, reject) => table.first((error, keyVal) => error
        ? reject(error)
        : resolve(DB._T.obj(keyVal)
          ? Model(keyVal)
          : null), this))
  }
  
  Model.where = Where

  closure(Model)
}
