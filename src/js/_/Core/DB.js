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
    const store = db.createObjectStore('Location', { autoIncrement: true })
    store.createIndex('Status', 'status');
    // db.deleteObjectStore('Location')
  },
  tables: [
    'Location'
  ]
}

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

DB._result = (obj, closure, promiseFunc) => {
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
DB._init = closure => DB._result(DB, closure, (resolve, reject) => {

  if (!DB._$) {
    return reject(new Error('無法使用 DB'))
  }

  const open = DB._$.open(DB._config.name, DB._config.version)

  open.onupgradeneeded = e => {
    DB._T.obj(DB._config) && DB._T.func(DB._config.schema)
    ? DB._config.schema(
      DB._T.obj(e) && DB._T.obj(e.target) && DB._T.obj(e.target.result) && e.target.result instanceof IDBDatabase
        ? e.target.result
        : null,
      e)
    : null
  }

  open.onsuccess = e => {
    DB._T.obj(e) && DB._T.obj(e.target) && DB._T.obj(e.target.result) && e.target.result instanceof IDBDatabase
      ? resolve(e.target.result)
      : reject(new Error('無法開啟 DB'))
  }
})

DB._bases = closure => DB._result(DB, closure, (resolve, reject) => DB._$.databases()
  .then(bases => resolve(bases))
  .catch(e => reject(e)))

DB._clear = closure => DB._result(this, closure, (resolve, reject) => {
  DB._init((error, db) => {
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
  })
})


DB._model = table => {
  let obj = {
    $query: null,

    one (key, closure) {
      return DB._result(this, closure, (resolve, reject) => DB._init((error, db) => {
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
      }))
    },
    create (param, closure) {
      return DB._result(this, closure, (resolve, reject) => DB._init((error, db) => {
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
      }))
    },
    update (key, param, closure) {
      return DB._result(this, closure, (resolve, reject) => DB._init((error, db) => {
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
      }))
    },
    delete (key, closure) {
      return DB._result(this, closure, (resolve, reject) => DB._init((error, db) => {
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
      }))
    },
    clear (closure) {
      return DB._result(this, closure, (resolve, reject) => DB._init((error, db) => {
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
      }))
    },





    all (closure) {
      return DB._result(this, closure, (resolve, reject) => DB._init((error, db) => {
        if (error) {
          return reject(error)
        }
        
        const data = []

        try {
          const _req = this.$query
            ? db.transaction(table).objectStore(table).index(this.$query.key).openCursor(this.$query.val)
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
      }))
    },
    count (closure) {
      return DB._result(this, closure, (resolve, reject) => DB._init((error, db) => {
        if (error) {
          return reject(error)
        }
        try {
          const _req = this.$query
            ? db.transaction(table).objectStore(table).index(this.$query.key).count(this.$query.val)
            : db.transaction(table).objectStore(table).count()

          _req
            .onsuccess = e => DB._T.obj(e) && DB._T.obj(e.target)
              ? resolve(e.target.result)
              : reject(new Error('回應結果格式錯誤'))
        } catch (e) {
          reject(new Error(`執行發生錯誤！錯誤原因：${e.message}`))
        }
      }))
    },
    first (closure) {
      return DB._result(this, closure, (resolve, reject) => DB._init((error, db) => {
        if (error) {
          return reject(error)
        }
        
        try {
          const _req = this.$query
            ? db.transaction(table).objectStore(table).index(this.$query.key).openCursor(this.$query.val)
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
      }))
    },
  }

  return {
    all: closure => obj.all(closure),
    count: closure => obj.count(closure),
    first: closure => obj.first(closure),
    
    one: (key, closure) => obj.one(key, closure),
    create: (param, closure) => obj.create(param, closure),
    update: (key, param, closure) => obj.update(key, param, closure),
    delete: (key, closure) => obj.delete(key, closure),
    clear: closure => obj.clear(closure),

    index (key, val) {
      const $query = { key, val }

      return {
        all: closure => obj.all.call({ $query }, closure),
        count: closure => obj.count.call({ $query }, closure),
        first: closure => obj.first.call({ $query }, closure),
      }
    } 
  }
}

for (const table of DB._config.tables) {
  DB[table] = DB._model(table)
}
