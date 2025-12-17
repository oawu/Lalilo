/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Helper } = window
  const { Type: T, promisify } = Helper

  window.Jsoner = function (type, desc = '') {
    if (!(this instanceof window.Jsoner)) {
      return new window.Jsoner(type, desc)
    }

    this._type = type
    this._desc = T.str(desc) ? desc : ''
  }

  Object.defineProperty(window.Jsoner.prototype, 'type', {
    get() { return this._type },
  })
  Object.defineProperty(window.Jsoner.prototype, 'is', {
    get() { return `Jsoner-${this.type.charAt(0).toUpperCase() + this.type.slice(1)}` },
  })
  Object.defineProperty(window.Jsoner.prototype, 'desc', {
    get() { return this._desc },
  })

  window.Jsoner.prototype.eq = function (other) {
    return other instanceof window.Jsoner && other.type == this.type
  }
  window.Jsoner.prototype.toString = function () {
    return ''
  }

  window.Jsoner.fromJson = (json, closure = null) => promisify(closure, async _ => {
    if (json === null) {
      return await window.Jsoner.Null.formObj({ type: 'null' })
    }
    if (T.bool(json)) {
      return await window.Jsoner.Bool.formObj({ type: 'bool', val: json })
    }
    if (T.num(json)) {
      return await window.Jsoner.Num.formObj({ type: 'num', val: json })
    }
    if (T.str(json)) {
      return await window.Jsoner.Str.formObj({ type: 'str', val: json })
    }
    if (T.arr(json)) {
      const val = await Promise.all(json.map(async t => await window.Jsoner.fromJson(t)))
      return await window.Jsoner.Arr.formObj({ type: 'arr', val })
    }
    if (T.obj(json)) {
      let val = []
      for (let key in json) {
        const result = await Promise.all([
          window.Jsoner.fromJson(key),
          window.Jsoner.fromJson(json[key])
        ])
        val.push({ key: result[0], val: result[1] })
      }

      val = await Promise.all(val.map(async ({ key, val }) => await window.Jsoner.Obj.Row.formObj({ key, val })))
      return await window.Jsoner.Obj.formObj({ type: 'obj', val })
    }
    throw new Error('資料錯誤', { cause: json })
  }, window.Jsoner)
  window.Jsoner.formObj = (obj, closure = null) => promisify(closure, async _ => {
    if (obj instanceof window.Jsoner) {
      return obj
    }
    if (!T.obj(obj)) {
      throw new Error('格式不是物件', { cause: obj })
    }
    if (!T.neStr(obj.type)) {
      throw new Error('type 不是非空字串', { cause: obj.type })
    }
    if (obj.type == 'null') {
      return await window.Jsoner.Null.formObj(obj)
    }
    if (obj.type == 'bool') {
      return await window.Jsoner.Bool.formObj(obj)
    }
    if (obj.type == 'num') {
      return await window.Jsoner.Num.formObj(obj)
    }
    if (obj.type == 'str') {
      return await window.Jsoner.Str.formObj(obj)
    }
    if (obj.type == 'arr') {
      return await window.Jsoner.Arr.formObj(obj)
    }
    if (obj.type == 'obj') {
      return await window.Jsoner.Obj.formObj(obj)
    }
    throw new Error('錯誤的 type', { cause: obj.type })
  }, window.Jsoner)

  // Null
  void (_ => {
    window.Jsoner.Null = function (desc = '') {
      if (!(this instanceof window.Jsoner.Null)) {
        return new window.Jsoner.Null(desc)
      }
      window.Jsoner.call(this, 'null', desc)
    }

    window.Jsoner.Null.prototype = Object.create(window.Jsoner.prototype)
    window.Jsoner.Null.prototype.constructor = window.Jsoner.Null

    window.Jsoner.Null.prototype.eq = function (other) {
      return other instanceof window.Jsoner.Null && window.Jsoner.prototype.eq.call(this, other)
    }
    window.Jsoner.Null.prototype.toString = function () {
      return 'null'
    }

    window.Jsoner.Null.formObj = (json, closure = null) => promisify(closure, async _ => {
      if (!T.obj(json)) {
        throw new Error('格式不是物件')
      }

      if (!T.neStr(json.type)) {
        throw new Error('type 不是非空字串')
      }

      if (json.type != 'null') {
        throw new Error('type 不是 null')
      }

      return window.Jsoner.Null(json.desc)
    }, window.Jsoner.Null)
  })();
  // Bool
  void (_ => {
    window.Jsoner.Bool = function (val, desc = '') {
      if (!(this instanceof window.Jsoner.Bool)) {
        return new window.Jsoner.Bool(val, desc)
      }

      window.Jsoner.call(this, 'bool', desc)
      this._val = val
    }

    window.Jsoner.Bool.prototype = Object.create(window.Jsoner.prototype)
    window.Jsoner.Bool.prototype.constructor = window.Jsoner.Bool

    Object.defineProperty(window.Jsoner.Bool.prototype, 'val', {
      get() { return this._val },
    })

    window.Jsoner.Bool.prototype.eq = function (other) {
      return other instanceof window.Jsoner.Bool && window.Jsoner.prototype.eq.call(this, other) && this._val === other._val
    }
    window.Jsoner.Bool.prototype.toString = function () {
      return `${this.val ? 'true' : 'false'}`
    }

    window.Jsoner.Bool.formObj = (json, closure = null) => promisify(closure, async _ => {
      if (!T.obj(json)) {
        throw new Error('格式不是物件')
      }

      if (!T.neStr(json.type)) {
        throw new Error('type 不是非空字串')
      }

      if (json.type != 'bool') {
        throw new Error('type 不是 bool')
      }

      if (!T.bool(json.val)) {
        throw new Error('val 不是布林值')
      }

      return window.Jsoner.Bool(json.val, json.desc)
    }, window.Jsoner.Bool)
  })();
  // Num
  void (_ => {
    window.Jsoner.Num = function (val, desc = '') {
      if (!(this instanceof window.Jsoner.Num)) {
        return new window.Jsoner.Num(val, desc)
      }

      window.Jsoner.call(this, 'num', desc)
      this._val = val
    }

    window.Jsoner.Num.prototype = Object.create(window.Jsoner.prototype)
    window.Jsoner.Num.prototype.constructor = window.Jsoner.Num

    Object.defineProperty(window.Jsoner.Num.prototype, 'val', {
      get() { return this._val },
    })

    window.Jsoner.Num.prototype.eq = function (other) {
      return other instanceof window.Jsoner.Num
        && window.Jsoner.prototype.eq.call(this, other)
        && this._val === other._val
    }
    window.Jsoner.Num.prototype.toString = function () {
      return `${this.val}`
    }

    window.Jsoner.Num.formObj = (json, closure = null) => promisify(closure, async _ => {
      if (!T.obj(json)) {
        throw new Error('格式不是物件')
      }

      if (!T.neStr(json.type)) {
        throw new Error('type 不是非空字串')
      }

      if (json.type != 'num') {
        throw new Error('type 不是 num')
      }

      if (!T.num(json.val)) {
        throw new Error('val 不是數字')
      }

      return window.Jsoner.Num(json.val, json.desc)
    }, window.Jsoner.Num)
  })();
  // Str
  void (_ => {
    window.Jsoner.Str = function (val, desc = '') {
      if (!(this instanceof window.Jsoner.Str)) {
        return new window.Jsoner.Str(val, desc)
      }

      window.Jsoner.call(this, 'str', desc)
      this._val = val
    }

    window.Jsoner.Str.prototype = Object.create(window.Jsoner.prototype)
    window.Jsoner.Str.prototype.constructor = window.Jsoner.Str

    Object.defineProperty(window.Jsoner.Str.prototype, 'val', {
      get() { return this._val.replace(/"/g, '\\"') },
    })

    window.Jsoner.Str.prototype.eq = function (other) {
      return other instanceof window.Jsoner.Str
        && window.Jsoner.prototype.eq.call(this, other)
        && this._val === other._val
    }
    window.Jsoner.Str.prototype.toString = function () {
      return `"${this.val}"`
    }
    window.Jsoner.Str.formObj = (json, closure = null) => promisify(closure, async _ => {
      if (!T.obj(json)) {
        throw new Error('格式不是物件')
      }

      if (!T.neStr(json.type)) {
        throw new Error('type 不是非空字串')
      }

      if (json.type != 'str') {
        throw new Error('type 不是 str')
      }

      if (!T.str(json.val)) {
        throw new Error('val 不是字串')
      }

      return window.Jsoner.Str(json.val, json.desc)
    }, window.Jsoner.Str)
  })();
  // Arr
  void (_ => {
    window.Jsoner.Arr = function (elements, desc = '') {
      if (!(this instanceof window.Jsoner.Arr)) {
        return new window.Jsoner.Arr(elements, desc)
      }

      window.Jsoner.call(this, 'arr', desc)
      this._elements = elements
    }
    window.Jsoner.Arr.prototype = Object.create(window.Jsoner.prototype)
    window.Jsoner.Arr.prototype.constructor = window.Jsoner.Arr

    Object.defineProperty(window.Jsoner.Arr.prototype, 'elements', {
      get() { return this._elements },
    })

    window.Jsoner.Arr.prototype.eq = function (other) {
      if (!(other instanceof window.Jsoner.Arr
        && window.Jsoner.prototype.eq.call(this, other)
        && this._elements.length === other._elements.length)) {
        return false
      }

      for (const i in this._elements) {
        if (!this._elements[i].eq(other._elements[i])) {
          return false
        }
      }

      return true
    }
    window.Jsoner.Arr.prototype.toString = function () {
      return `[${this.elements.join(', ')}]`
    }

    window.Jsoner.Arr.formObj = (json, closure = null) => promisify(closure, async _ => {
      if (!T.obj(json)) {
        throw new Error('格式不是物件')
      }

      if (!T.neStr(json.type)) {
        throw new Error('type 不是非空字串')
      }

      if (json.type != 'arr') {
        throw new Error('type 不是 arr')
      }

      if (!T.arr(json.val)) {
        throw new Error('elements 不是陣列')
      }

      const elements = await Promise.all(json.val.map(async t => await window.Jsoner.formObj(t)))
      return window.Jsoner.Arr(elements, json.desc)
    }, window.Jsoner.Arr)
  })();
  // Obj
  void (_ => {
    window.Jsoner.Obj = function (rows, desc = '') {
      if (!(this instanceof window.Jsoner.Obj)) {
        return new window.Jsoner.Obj(rows, desc)
      }

      window.Jsoner.call(this, 'obj', desc)
      this._rows = window.Jsoner.Obj.Row.uniqueByKey(rows)
    }
    window.Jsoner.Obj.prototype = Object.create(window.Jsoner.prototype)
    window.Jsoner.Obj.prototype.constructor = window.Jsoner.Obj

    Object.defineProperty(window.Jsoner.Obj.prototype, 'rows', {
      get() { return this._rows },
    })

    window.Jsoner.Obj.prototype.eq = function (other) {
      if (!(other instanceof window.Jsoner.Obj
        && window.Jsoner.prototype.eq.call(this, other)
        && this._rows.length === other._rows.length)) {
        return false
      }

      for (const i in this._rows) {
        if (!(this._rows[i].key.eq(other._rows[i].key) && this._rows[i].val.eq(other._rows[i].val))) {
          return false
        }
      }

      return true
    }
    window.Jsoner.Obj.prototype.toString = function () {
      return `{${this.rows.join(', ')}}`
    }

    window.Jsoner.Obj.formObj = (json, closure = null) => promisify(closure, async _ => {
      if (!T.obj(json)) {
        throw new Error('格式不是物件')
      }

      if (!T.neStr(json.type)) {
        throw new Error('type 不是非空字串')
      }

      if (json.type != 'obj') {
        throw new Error('type 不是 obj')
      }

      if (!T.arr(json.val)) {
        throw new Error('rows 不是陣列')
      }

      const rows = await Promise.all(json.val.map(async t => await window.Jsoner.Obj.Row.formObj(t)))
      return window.Jsoner.Obj(rows, json.desc)
    }, window.Jsoner.Obj)
  })();
  // Obj/Row
  void (_ => {
    window.Jsoner.Obj.Row = function (key, val) {
      if (!(this instanceof window.Jsoner.Obj.Row)) {
        return new window.Jsoner.Obj.Row(key, val)
      }
      window.Jsoner.call(this, 'obj.row', '')

      this._key = key
      this._val = val
    }
    window.Jsoner.Obj.Row.prototype = Object.create(window.Jsoner.prototype)
    window.Jsoner.Obj.Row.prototype.constructor = window.Jsoner.Obj.Row


    Object.defineProperty(window.Jsoner.Obj.Row.prototype, 'key', {
      get() { return this._key },
    })
    Object.defineProperty(window.Jsoner.Obj.Row.prototype, 'val', {
      get() { return this._val },
    })

    window.Jsoner.Obj.Row.prototype.toString = function () {
      return `${this.key}: ${this.val}`
    }

    window.Jsoner.Obj.Row.uniqueByKey = rows => {
      const _in = (row, _rows) => {
        for (const i in _rows) {
          if (row.key.eq(_rows[i].key)) {
            return i
          }
        }
        return -1
      }

      const _rows = []
      for (const row of rows) {
        const i = _in(row, _rows)
        if (i != -1) {
          _rows.splice(i, 1)
        }
        _rows.push(row)
      }

      return _rows
    }
    window.Jsoner.Obj.Row.formObj = (json, closure = null) => promisify(closure, async _ => {
      if (json instanceof window.Jsoner.Obj.Row) {
        return json
      }

      if (!T.obj(json)) {
        throw new Error('格式不是物件')
      }

      const [key, val] = await Promise.all([
        window.Jsoner.formObj(json.key),
        window.Jsoner.formObj(json.val),
      ])

      if ((key instanceof window.Jsoner.Null)
        || (key instanceof window.Jsoner.Bool)
        || (key instanceof window.Jsoner.Num)
        || (key instanceof window.Jsoner.Str)) {
        return window.Jsoner.Obj.Row(key, val)
      }

      throw new Error('Key 格式錯誤')
    }, window.Jsoner.Obj.Row)
  })();

  Load.VueComponent('Jsoner-Desc', {
    props: { desc: { type: String, required: false, default: '' } },
    template: `span.Jsoner-Desc.Jsoner-NS => *if=desc !== ''   *text=desc`
  })
  Load.VueComponent('Jsoner-Empty', {
    props: { empty: { type: String, required: false, default: '－－' } },
    template: `label.Jsoner-Empty.Jsoner-NS => *text=empty`
  })
  Load.VueComponent('Jsoner-Copy', {
    template: `label.Jsoner-Copy.Jsoner-NS => @click.stop=$emit('click')`
  })
  Load.VueComponent('Jsoner-Add', {
    template: `label.Jsoner-Add.Jsoner-NS => @click.stop=$emit('click')`
  })
  Load.VueComponent('Jsoner-Remove', {
    template: `label.Jsoner-Remove.Jsoner-NS => @click.stop=$emit('click')`
  })
  Load.VueComponent('Jsoner-Quote', {
    data: _ => ({ quote: '"' }),
    template: `span.Jsoner-Quote.Jsoner-NS => *text=quote`
  })
  Load.VueComponent('Jsoner-Square-Left', {
    template: `span.Jsoner-Square-Left.Jsoner-NS => *text='['`
  })
  Load.VueComponent('Jsoner-Square-Right', {
    template: `span.Jsoner-Square-Right.Jsoner-NS => *text=']'`
  })
  Load.VueComponent('Jsoner-More', {
    template: `span.Jsoner-More.Jsoner-NS => *text='…'`
  })
  Load.VueComponent('Jsoner-Comma', {
    template: `span.Jsoner-Comma.Jsoner-NS => *text=','`
  })
  Load.VueComponent('Jsoner-Curly-Left', {
    template: `span.Jsoner-Curly-Left.Jsoner-NS => *text='{'`
  })
  Load.VueComponent('Jsoner-Curly-Right', {
    template: `span.Jsoner-Curly-Right.Jsoner-NS => *text='}'`
  })
  Load.VueComponent('Jsoner-Colon', {
    template: `span.Jsoner-Colon.Jsoner-NS => *text=':'`
  })

  Load.VueComponent('Jsoner-Null', {
    props: {
      parent: { type: window.Jsoner, required: false, default: null },
      jsoner: { type: window.Jsoner, required: false, default: null },
      comma: { type: Boolean, required: false, default: false },
      isKey: { type: Boolean, required: false, default: false },
      func: { type: Object, required: false, default: null },
    },
    computed: {
      text() {
        return 'null'
      },
      is() {
        return this.func.edit
          ? 'label'
          : 'div'
      },
      meta() {
        return this.isObj ? this.jsoner.val : this.jsoner
      },
      isObj() {
        return this.jsoner instanceof window.Jsoner.Obj.Row
      }
    },
    methods: {
      del() { if (T.func(this.func.del) || T.asyncFunc(this.func.del)) { this.func.del(this.jsoner, this.parent) } },
      edit() { if (T.func(this.func.edit) || T.asyncFunc(this.func.edit)) { this.func.edit(this.meta, this.parent) } },
      copy() { if (T.func(this.func.copy) || T.asyncFunc(this.func.copy)) { this.func.copy(this.jsoner, this.parent) } },
    },
    template: `
      .Jsoner-Null => :class=isKey ? '_is-key' : '_is-val'
        Jsoner-Remove => *if=!isKey && func.del   @click=del

        template => *if=isObj
          component => :is=jsoner.key.is   :isKey=true   :func=func   :jsoner=jsoner.key
          Jsoner-Colon

        component.Jsoner-Data.Jsoner-NS => :is=is   *text=text   @click.stop=edit

        Jsoner-Comma => *if=comma
        Jsoner-Desc => :desc=meta.desc
        Jsoner-Copy => *if=!isKey && func.copy   @click=copy
    `
  })
  Load.VueComponent('Jsoner-Num', {
    props: {
      parent: { type: window.Jsoner, required: false, default: null },
      jsoner: { type: window.Jsoner, required: false, default: null },
      comma: { type: Boolean, required: false, default: false },
      isKey: { type: Boolean, required: false, default: false },
      func: { type: Object, required: false, default: null },
    },
    methods: {
    },
    computed: {
      text() {
        return `${this.meta.val}`
      },
      is() {
        return this.func.edit
          ? 'label'
          : 'div'
      },
      meta() {
        return this.isObj ? this.jsoner.val : this.jsoner
      },
      isObj() {
        return this.jsoner instanceof window.Jsoner.Obj.Row
      }
    },
    methods: {
      del() { if (T.func(this.func.del) || T.asyncFunc(this.func.del)) { this.func.del(this.jsoner, this.parent) } },
      edit() { if (T.func(this.func.edit) || T.asyncFunc(this.func.edit)) { this.func.edit(this.meta, this.parent) } },
      copy() { if (T.func(this.func.copy) || T.asyncFunc(this.func.copy)) { this.func.copy(this.jsoner, this.parent) } },
    },
    template: `
      .Jsoner-Num => :class=isKey ? '_is-key' : '_is-val'
        Jsoner-Remove => *if=!isKey && func.del   @click=del

        template => *if=isObj
          component => :is=jsoner.key.is   :isKey=true   :func=func   :jsoner=jsoner.key
          Jsoner-Colon

        component.Jsoner-Data.Jsoner-NS => :is=is   *text=text   @click.stop=edit

        Jsoner-Comma => *if=comma
        Jsoner-Desc => :desc=meta.desc
        Jsoner-Copy => *if=!isKey && func.copy   @click=copy
    `
  })
  Load.VueComponent('Jsoner-Str', {
    props: {
      parent: { type: window.Jsoner, required: false, default: null },
      jsoner: { type: window.Jsoner, required: false, default: null },
      comma: { type: Boolean, required: false, default: false },
      isKey: { type: Boolean, required: false, default: false },
      func: { type: Object, required: false, default: null },
    },
    computed: {
      text() {
        return `"${this.meta.val}"`
      },
      is() {
        return this.func.edit
          ? 'label'
          : 'div'
      },
      meta() {
        return this.isObj ? this.jsoner.val : this.jsoner
      },
      isObj() {
        return this.jsoner instanceof window.Jsoner.Obj.Row
      }
    },
    methods: {
      del() { if (T.func(this.func.del) || T.asyncFunc(this.func.del)) { this.func.del(this.jsoner, this.parent) } },
      edit() { if (T.func(this.func.edit) || T.asyncFunc(this.func.edit)) { this.func.edit(this.meta, this.parent) } },
      copy() { if (T.func(this.func.copy) || T.asyncFunc(this.func.copy)) { this.func.copy(this.jsoner, this.parent) } },
    },
    template: `
      .Jsoner-Str => :class=isKey ? '_is-key' : '_is-val'
        Jsoner-Remove => *if=!isKey && func.del   @click=del

        template => *if=isObj
          component => :is=jsoner.key.is   :isKey=true   :func=func   :jsoner=jsoner.key
          Jsoner-Colon

        component.Jsoner-Data._str.Jsoner-NS => :is=is   *text=text   @click.stop=edit

        Jsoner-Comma => *if=comma
        Jsoner-Desc => :desc=meta.desc
        Jsoner-Copy => *if=!isKey && func.copy   @click=copy
    `
  })
  Load.VueComponent('Jsoner-Bool', {
    props: {
      parent: { type: window.Jsoner, required: false, default: null },
      jsoner: { type: window.Jsoner, required: false, default: null },
      comma: { type: Boolean, required: false, default: false },
      isKey: { type: Boolean, required: false, default: false },
      func: { type: Object, required: false, default: null },
    },
    computed: {
      text() {
        return this.meta.val
          ? 'true'
          : 'false'
      },
      is() {
        return this.func.edit
          ? 'label'
          : 'div'
      },
      meta() {
        return this.isObj ? this.jsoner.val : this.jsoner
      },
      isObj() {
        return this.jsoner instanceof window.Jsoner.Obj.Row
      }
    },
    methods: {
      del() { if (T.func(this.func.del) || T.asyncFunc(this.func.del)) { this.func.del(this.jsoner, this.parent) } },
      edit() { if (T.func(this.func.edit) || T.asyncFunc(this.func.edit)) { this.func.edit(this.meta, this.parent) } },
      copy() { if (T.func(this.func.copy) || T.asyncFunc(this.func.copy)) { this.func.copy(this.jsoner, this.parent) } },
    },
    template: `
      .Jsoner-Bool => :class=isKey ? '_is-key' : '_is-val'
        Jsoner-Remove => *if=!isKey && func.del   @click=del

        template => *if=isObj
          component => :is=jsoner.key.is   :isKey=true   :func=func   :jsoner=jsoner.key
          Jsoner-Colon

        component.Jsoner-Data.Jsoner-NS => :is=is   *text=text   @click.stop=edit

        Jsoner-Comma => *if=comma
        Jsoner-Desc => :desc=meta.desc
        Jsoner-Copy => *if=!isKey && func.copy   @click=copy
    `
  })
  Load.VueComponent('Jsoner-Arr', {
    props: {
      parent: { type: window.Jsoner, required: false, default: null },
      jsoner: { type: window.Jsoner, required: false, default: null },
      colon: { type: Boolean, required: true },
      func: { type: Object, required: false, default: null },
    },
    data: _ => ({
      display: true
    }),
    methods: {
      addColon(i) {
        return i < this.meta.elements.length - 1
      },
      add() { if (T.func(this.func.add) || T.asyncFunc(this.func.add)) { this.func.add(this.jsoner, this.parent) } },
      del() { if (T.func(this.func.del) || T.asyncFunc(this.func.del)) { this.func.del(this.jsoner, this.parent) } },
      edit() { if (T.func(this.func.edit) || T.asyncFunc(this.func.edit)) { this.func.edit(this.meta, this.parent) } },
      copy() { if (T.func(this.func.copy) || T.asyncFunc(this.func.copy)) { this.func.copy(this.jsoner, this.parent) } },
    },
    computed: {
      meta() {
        return this.isObj ? this.jsoner.val : this.jsoner
      },
      isObj() {
        return this.jsoner instanceof window.Jsoner.Obj.Row
      },
      desc() {
        return `${this.meta.desc !== '' ? `${this.meta.desc}，` : ''}共有 ${this.meta.elements.length} 個元素`
      }
    },
    template: `
      .Jsoner-Arr
        label.Jsoner-R0 => @click=display=!display
          Jsoner-Remove => *if=func.del   @click=del

          template => *if=isObj
            component => :is=jsoner.key.is   :isKey=true   :func=func   :jsoner=jsoner.key
            Jsoner-Colon

          Jsoner-Square-Left

          Jsoner-Desc => :desc=display ? desc : ''
          Jsoner-More => *if=!display
          Jsoner-Copy => *if=func.copy   @click=copy

        .Jsoner-R1 => *if=display
          .Jsoner-For => *for=(item, i) in meta.elements   :key=i
            .Jsoner-Els => *if=['null', 'num', 'str', 'bool'].includes(item.type)
              Jsoner-Null  => *if=item.type == 'null'   :func=func   :jsoner=item   :parent=meta   :comma=addColon(i)
              Jsoner-Num   => *if=item.type == 'num'    :func=func   :jsoner=item   :parent=meta   :comma=addColon(i)
              Jsoner-Str   => *if=item.type == 'str'    :func=func   :jsoner=item   :parent=meta   :comma=addColon(i)
              Jsoner-Bool  => *if=item.type == 'bool'   :func=func   :jsoner=item   :parent=meta   :comma=addColon(i)
            Jsoner-Arr => *if=item.type == 'arr'   :func=func   :jsoner=item   :parent=meta   :colon=addColon(i)
            Jsoner-Obj => *if=item.type == 'obj'   :func=func   :jsoner=item   :parent=meta   :colon=addColon(i)

          .Jsoner-For
            .Jsoner-Els
              Jsoner-Add => *if=func.add   @click=add

        .Jsoner-R2
          Jsoner-Square-Right
          Jsoner-Comma => *if=colon
      `
  })
  Load.VueComponent('Jsoner-Obj', {
    props: {
      parent: { type: window.Jsoner, required: false, default: null },
      jsoner: { type: window.Jsoner, required: false, default: null },
      colon: { type: Boolean, required: true },
      func: { type: Object, required: false, default: null },
    },
    data: _ => ({
      display: true
    }),
    methods: {
      addColon(i) {
        return i < this.meta.rows.length - 1
      },

      add() { if (T.func(this.func.add) || T.asyncFunc(this.func.add)) { this.func.add(this.jsoner, this.parent) } },
      del() { if (T.func(this.func.del) || T.asyncFunc(this.func.del)) { this.func.del(this.jsoner, this.parent) } },
      edit() { if (T.func(this.func.edit) || T.asyncFunc(this.func.edit)) { this.func.edit(this.meta, this.parent) } },
      copy() { if (T.func(this.func.copy) || T.asyncFunc(this.func.copy)) { this.func.copy(this.jsoner, this.parent) } },

    },
    computed: {
      meta() {
        return this.isObj ? this.jsoner.val : this.jsoner
      },
      isObj() {
        return this.jsoner instanceof window.Jsoner.Obj.Row
      },
    },
    template: `
      .Jsoner-Obj
        label.Jsoner-R0 => @click=display=!display
          Jsoner-Remove => *if=func.del   @click=del

          template => *if=isObj
            component => :is=jsoner.key.is   :isKey=true   :func=func   :jsoner=jsoner.key
            Jsoner-Colon

          Jsoner-Curly-Left

          Jsoner-Desc => :desc=display ? meta.desc : ''
          Jsoner-More => *if=!display
          Jsoner-Copy => *if=func.copy   @click=copy

        .Jsoner-R1 => *if=display
          .Jsoner-For => *for=(row, i) in meta.rows   :key=i
            .Jsoner-Kvs => *if=['null', 'num', 'str', 'bool'].includes(row.val.type)
              Jsoner-Null => *if=row.val.type == 'null'   :func=func   :jsoner=row   :parent=meta   :comma=addColon(i)
              Jsoner-Num => *if=row.val.type == 'num'   :func=func   :jsoner=row   :parent=meta   :comma=addColon(i)
              Jsoner-Str => *if=row.val.type == 'str'   :func=func   :jsoner=row   :parent=meta   :comma=addColon(i)
              Jsoner-Bool => *if=row.val.type == 'bool'   :func=func   :jsoner=row   :parent=meta   :comma=addColon(i)
            Jsoner-Arr => *if=row.val.type == 'arr'   :func=func   :jsoner=row   :parent=meta   :colon=addColon(i)
            Jsoner-Obj => *if=row.val.type == 'obj'   :func=func   :jsoner=row   :parent=meta   :colon=addColon(i)

          .Jsoner-For
            .Jsoner-Els
              Jsoner-Add => *if=func.add   @click=add

        .Jsoner-R2
          Jsoner-Curly-Right
          Jsoner-Comma => *if=colon
    `
  })

  Load.VueComponent('Jsoner', {
    props: {
      jsoner: { type: window.Jsoner, required: false, default: null },
      empty: { type: String, required: false, default: '－－' },

      copy: { type: Function, required: false, default: null },
      edit: { type: Function, required: false, default: null },
      add: { type: Function, required: false, default: null },
      del: { type: Function, required: false, default: null },
    },
    computed: {
      func() {
        return {
          copy: this.$listeners.copy || T.func(this.copy) || T.asyncFunc(this.copy) ? this._copy : null,
          edit: this.$listeners.edit || T.func(this.edit) || T.asyncFunc(this.edit) ? this._edit : null,
          del: this.$listeners.del || T.func(this.del) || T.asyncFunc(this.del) ? this._del : null,
          add: this.$listeners.add || T.func(this.add) || T.asyncFunc(this.add) ? this._add : null,
        }
      }
    },
    methods: {
      async _add(val, parent) {
        this.$emit('add', val, parent)

        if (T.func(this.add)) {
          this.add(val, parent)
        }
        if (T.asyncFunc(this.add)) {
          await this.add(val, parent)
        }
      },
      async _del(...vals) {
        this.$emit('del', ...vals)

        if (T.func(this.del)) {
          this.del(...vals)
        }
        if (T.asyncFunc(this.del)) {
          await this.del(...vals)
        }
      },
      async _edit(...vals) {
        this.$emit('edit', ...vals)

        if (T.func(this.edit)) {
          this.edit(...vals)
        }
        if (T.asyncFunc(this.edit)) {
          await this.edit(...vals)
        }
      },
      async _copy(...vals) {
        this.$emit('copy', ...vals)

        if (T.func(this.copy)) {
          this.copy(...vals)
        }
        if (T.asyncFunc(this.copy)) {
          await this.copy(...vals)
        }
      },
    },
    template: `
      .Jsoner => :class={_empty: jsoner === null }
        Jsoner-Empty => *if=jsoner === null   :empty=empty

        template => *else
          Jsoner-Null => *if=jsoner.type=='null'   :func=func   :jsoner=jsoner   :parent=null
          Jsoner-Num  => *if=jsoner.type=='num'   :func=func   :jsoner=jsoner   :parent=null
          Jsoner-Str  => *if=jsoner.type=='str'   :func=func   :jsoner=jsoner   :parent=null
          Jsoner-Bool => *if=jsoner.type=='bool'   :func=func   :jsoner=jsoner   :parent=null
          Jsoner-Arr => *if=jsoner.type == 'arr'   :func=func   :jsoner=jsoner   :parent=null
          Jsoner-Obj => *if=jsoner.type == 'obj'   :func=func   :jsoner=jsoner   :parent=null
    `
  })

})();