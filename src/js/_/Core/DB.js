/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const DB = {}
DB._debug = {
  funcs: [],
  emit (...data) {
    for (const func of this.funcs) {
      func(...data)
    }
    return this
  },
  on (func) {
    this.funcs.push(func)
    return this
  }
}

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
    store3.createIndex('activityId_accH', ['activityId', 'position.acc']);
  },
}

DB._keyword = [
  '_key',
  '_val',
  '_watchs',
  '_table',

  'id',
  
  '__val', 'save', 'delete',

  'where', 'filter', 'map',

  'create', 'all', 'one', 'count', 'clear', 'first'
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
    this._timer = 10
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

  if (DB._$_open !== undefined) {
    return resolve(DB._$_open)
  }

  const open = DB._$.open(DB._config.name, DB._config.version)

  open.onupgradeneeded = e => {
    if (!(DB._T.obj(DB._config) && DB._T.func(DB._config.schema))) {
      return null
    }

    if (!(DB._T.obj(e) && DB._T.obj(e.target) && DB._T.obj(e.target.result) && e.target.result instanceof IDBDatabase)) {
      return null
    }

    DB._config.schema(e.target.result, e)
  }

  open.onsuccess = e => {
    if (DB._T.obj(e) && DB._T.obj(e.target) && DB._T.obj(e.target.result) && e.target.result instanceof IDBDatabase) {
      DB._$_open = e.target.result
      resolve(e.target.result)
    } else {
      reject(new Error('無法開啟 DB'))
    }
  }
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


DB._Model = function(row) {
  if (!(this instanceof DB._Model)) {
    return row instanceof DB._Raw
      ? new DB._Model(row)
      : null
  }

  this._key = row.key
  this._val = {}
  this._watchs = []

  this.__val(row.val)

  Object.defineProperty(this, 'id', { get () { return this._key }, configurable: false })
}
DB._Model.prototype.__val = function(val) {
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
  return DB._func_or_promise(this, closure, (resolve, reject) => DB._T.str(this._table) ? DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    try {
      const _tran = db.transaction(this._table, 'readwrite')
      const _req = _tran.objectStore(this._table).put(this._val, this._key)

      _req.onerror = e => _reject(new Error(`發生錯誤，錯誤原因：${e.message}`))
      _req.onsuccess = e => DB._T.obj(e) && DB._T.obj(e.target)
        ? resolve(this.__val(this._val))
        : reject(new Error('回應結果格式錯誤'))

      _tran.commit()

    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  }) : reject(new Error('Table 錯誤')))
}
DB._Model.prototype.delete = function(closure) {
  return DB._func_or_promise(this, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    try {
      
      const _tran = db.transaction(this._table, 'readwrite')
      const _req = _tran.objectStore(this._table).delete(this._key)
        _req.onerror = e => _reject(new Error(`發生錯誤，錯誤原因：${e.message}`))
        _req.onsuccess = e => {
          this._key = null
          resolve(this)
        }
      _tran.commit()

    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  }))
}

DB._Raw = function(key, val) {
  if (!(this instanceof DB._Raw)) {
    return val === undefined
      ? null
      : new DB._Raw(key, val)
  }

  this.key = key
  this.val = val
}

DB._Builder = function(Model, table) {
  if (!(this instanceof DB._Builder)) {
    return new DB._Builder(Model, table)
  }

  this._Model = Model
  this._table = table
  this._where = null
  this._funcs = []
}
DB._Builder.prototype.where = function(key, val) {
  this._where = { key, val }
  return this
}
DB._Builder.prototype.filter = function(func) {
  if (DB._T.func(func)) {
    this._funcs.push({ type: 'filter' , func })
  }

  return this
}
DB._Builder.prototype.map = function(func) {
  if (DB._T.func(func)) {
    this._funcs.push({ type: 'map' , func })
  }

  return this
}

DB._Builder.prototype.create = function(param, closure) {
  return DB._func_or_promise(this._Model, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    try {
      const _tran = db.transaction(this._table, 'readwrite')
      const _req = _tran.objectStore(this._table).add(param)

      _req.onerror = e => _reject(new Error(`發生錯誤，錯誤原因：${e.message}`))

      _req.onsuccess = e => {
        if (!(DB._T.obj(e) && DB._T.obj(e.target))) {
          return reject(new Error('回應結果格式錯誤'))
        }

        const raw = DB._Raw(e.target.result, param)
        resolve(this._Model.prototype instanceof DB._Model ? this._Model(raw) : raw)
      }
      _tran.commit();

    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  }))
}
DB._Builder.prototype.one = function(key, closure) {
  return DB._func_or_promise(this._Model, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    try {
      const _tran = db.transaction(this._table)
      const _req = _tran.objectStore(this._table).get(key)
      _req.onerror = e => _reject(new Error(`發生錯誤，錯誤原因：${e.message}`))
      _req.onsuccess = e => {
        if (!(DB._T.obj(e) && DB._T.obj(e.target))) {
          return reject(new Error('回應結果格式錯誤'))
        }

        const raw = DB._Raw(key, e.target.result)
        resolve(this._Model.prototype instanceof DB._Model ? this._Model(raw) : raw)
      }
      _tran.commit()

    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  }))
}
DB._Builder.prototype.clear = function(key, closure) {
  return DB._func_or_promise(this._Model, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    try {
      const _tran = db.transaction(this._table, 'readwrite')
      const _req = _tran.objectStore(this._table).clear()
      _req.onerror = e => _reject(new Error(`發生錯誤，錯誤原因：${e.message}`))
      _req.onsuccess = e => resolve()
      _tran.commit()

    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  }))
}
DB._Builder.prototype.all = function(closure) {
  return DB._func_or_promise(this._Model, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }
    
    const dataList = []

    try {
      const _tran = db.transaction(this._table)

      const _req = this._where
        ? _tran.objectStore(this._table).index(this._where.key).openCursor(this._where.val)
        : _tran.objectStore(this._table).openCursor()

      _req.onerror = e => _reject(new Error(`發生錯誤，錯誤原因：${e.message}`))
      _req.onsuccess = e => {
        if (!(DB._T.obj(e) && DB._T.obj(e.target))) {
          return reject(new Error('回應結果格式錯誤'))
        }

        let cursor = e.target.result

        if (!(cursor instanceof IDBCursorWithValue)) {
          _tran.commit()
          return resolve(dataList)
        }

        const raw = DB._Raw(cursor.primaryKey, cursor.value)
        let data = this._Model.prototype instanceof DB._Model ? this._Model(raw) : raw


        for (let { type, func } of this._funcs) {
          if (type == 'map') {
            data = func(data)
          }

          if (type == 'filter') {
            if (!func(data)) {
              return cursor.continue()
            }
          }
        }

        if (data === null) {
          return cursor.continue()
        }

        dataList.push(data)
        cursor.continue()
      }
      
    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  }))
}
DB._Builder.prototype.count = function(closure) {
  return DB._func_or_promise(this._Model, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }

    if (this._funcs.length) {

      let count = 0

      try {
        const _tran = db.transaction(this._table)
        const _req = this._where
          ? _tran.objectStore(this._table).index(this._where.key).openCursor(this._where.val)
          : _tran.objectStore(this._table).openCursor()

        _req.onerror = e => _reject(new Error(`發生錯誤，錯誤原因：${e.message}`))
        _req.onsuccess = e => {
          if (!(DB._T.obj(e) && DB._T.obj(e.target))) {
            return reject(new Error('回應結果格式錯誤'))
          }

          let cursor = e.target.result

          if (!(cursor instanceof IDBCursorWithValue)) {
            _tran.commit()
            return resolve(count)
          }

          const raw = DB._Raw(cursor.primaryKey, cursor.value)
          let data = this._Model.prototype instanceof DB._Model ? this._Model(raw) : raw


          for (let { type, func } of this._funcs) {
            if (type == 'map') {
              data = func(data)
            }

            if (type == 'filter') {
              if (!func(data)) {
                return cursor.continue()
              }
            }
          }

          if (data === null) {
            return cursor.continue()
          }

          count += 1
          cursor.continue()
        }
        

      } catch (e) {
        reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
      }
    } else {
      try {
        const _tran = db.transaction(this._table)
        const _req = this._where
          ? _tran.objectStore(this._table).index(this._where.key).count(this._where.val)
          : _tran.objectStore(this._table).count()

        _req.onerror = e => _reject(new Error(`發生錯誤，錯誤原因：${e.message}`))
        _req.onsuccess = e => DB._T.obj(e) && DB._T.obj(e.target) ? resolve(e.target.result) : reject(new Error('回應結果格式錯誤'))
        _tran.commit()

      } catch (e) {
        reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
      }
    }
  }))
}
DB._Builder.prototype.first = function(closure) {
  return DB._func_or_promise(this._Model, closure, (resolve, reject) => DB._init((error, db) => {
    if (error) {
      return reject(error)
    }
    
    try {
      const _tran = db.transaction(this._table)

      const _req = this._where
        ? _tran.objectStore(this._table).index(this._where.key).openCursor(this._where.val)
        : _tran.objectStore(this._table).openCursor()

      _req.onerror = e => _reject(new Error(`發生錯誤，錯誤原因：${e.message}`))
      _req.onsuccess = e => {
        if (!(DB._T.obj(e) && DB._T.obj(e.target))) {
          return reject(new Error('回應結果格式錯誤'))
        }

        let cursor = e.target.result

        if (!(cursor instanceof IDBCursorWithValue)) {
          return resolve(null)
        }

        const raw = DB._Raw(cursor.primaryKey, cursor.value)
        let data = this._Model.prototype instanceof DB._Model ? this._Model(raw) : raw

        for (let { type, func } of this._funcs) {
          if (type == 'map') {
            data = func(data)
          }

          if (type == 'filter') {
            if (!func(data)) {
              return cursor.continue()
            }
          }
        }

        if (data === null) {
          return cursor.continue()
        }

        resolve(data)
      }
      _tran.commit()

    } catch (e) {
      reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
    }
  }))
}

DB._InitModel = (_table, closure) => {
  const Model = function(raw = undefined) {
    if (!(this instanceof Model)) {
      return raw instanceof DB._Raw ? new Model(raw) : null
    }

    DB._Model.call(this, raw)
    this._table = _table
  }

  Model.prototype = Object.create(DB._Model.prototype)

  Model.where  = (key, val)       => DB._Builder(Model, _table).where(key, val)
  Model.filter = (func)           => DB._Builder(Model, _table).filter(func)
  Model.map    = (func)           => DB._Builder(Model, _table).map(func)

  Model.create = (param, closure) => DB._Builder(Model, _table).create(param, closure)
  Model.all    = (closure)        => DB._Builder(Model, _table).all(closure)
  Model.one    = (key, closure)   => DB._Builder(Model, _table).one(key, closure)
  Model.count  = (closure)        => DB._Builder(Model, _table).count(closure)
  Model.first  = (closure)        => DB._Builder(Model, _table).first(closure)
  Model.clear  = (closure)        => DB._Builder(Model, _table).clear(closure)

  closure(Model)
}
