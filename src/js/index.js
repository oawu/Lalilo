/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Helper = {
  Type: {
    isObject: obj => typeof obj === 'object' && obj !== null && !Array.isArray(obj)
  }
}

const Request = function(obj) {
  if (!(this instanceof Request))
    return new Request(obj)

  const isObj = Helper.Type.isObject(obj)

  this._display = isObj && typeof obj.display == 'boolean' ? obj.display : false
  this._displayVar = isObj && typeof obj.displayVar == 'boolean' ? obj.displayVar : false


  this._url = Request.Url(
    isObj && Helper.Type.isObject(obj.url) && Array.isArray(obj.url.paths)
      ? obj.url.paths
      : [])

  this._method = Request.Method(
    isObj && typeof obj.method == 'string' && ['get', 'post', 'put', 'delete'].includes(obj.method.toLowerCase())
      ? obj.method
      : 'get')

  this._header = Request.Header(
    isObj && Helper.Type.isObject(obj.header) && typeof obj.header.display == 'boolean'
      ? obj.header.display
      : false,
    isObj && Helper.Type.isObject(obj.header) && Array.isArray(obj.header.data)
      ? obj.header.data
      : []
  )

  this._payload = Request.Payload.dispatch(isObj
    ? obj.payload
    : null)

  this._testRule = Request.TestRule(
    isObj && Helper.Type.isObject(obj.testRule) && typeof obj.testRule.display == 'boolean'
      ? obj.testRule.display
      : false,
    isObj && Helper.Type.isObject(obj.testRule)
      ? Request.TestRule.dispatch(obj.testRule.rule)
      : null
  )

}

Object.defineProperty(Request.prototype, 'url', { get () { return this._url } })
Object.defineProperty(Request.prototype, 'method', { get () { return this._method } })
Object.defineProperty(Request.prototype, 'header', { get () { return this._header } })
Object.defineProperty(Request.prototype, 'payload', { get () { return this._payload } })
Object.defineProperty(Request.prototype, 'testRule', { get () { return this._testRule } })
Object.defineProperty(Request.prototype, 'display', { get () { return this._display } })
Object.defineProperty(Request.prototype, 'displayVar', { get () { return this._displayVar } })
Object.defineProperty(Request.prototype, 'vars', { get () {
  return [...this._url.vars, ...this._header.vars, ...this._payload.vars]
} })
Object.defineProperty(Request.prototype, 'forceVars', { get () {
  const vars = []
  for (let t of this.vars.filter(({ val }) => val === null))
    vars.push(t)
  return vars
} })

Request.prototype.toggleDisplay = function() { this._display = !this._display; return this }
Request.prototype.toggleDisplayVar = function() { this._displayVar = !this._displayVar; return this }
Request.Token = function(type) {
  if (!(this instanceof Request.Token))
    return new Request.Token(type)

  this._type = type
}
Object.defineProperty(Request.Token.prototype, 'type', { get () { return this._type } })
Object.defineProperty(Request.Token.prototype, 'isVar', { get () { return this.type == 'var' } })
Object.defineProperty(Request.Token.prototype, 'isRand', { get () { return this.type == 'rand' } })
Object.defineProperty(Request.Token.prototype, 'isStr', { get () { return this.type == 'str' } })
Object.defineProperty(Request.Token.prototype, 'isNum', { get () { return this.type == 'num' } })
Object.defineProperty(Request.Token.prototype, 'isDynamic', { get () { return this.isVar || this.isRand } })

Request.Token.Str = function(val) {
  if (!(this instanceof Request.Token.Str))
    return new Request.Token.Str(val)
  else
    Request.Token.call(this, 'str')

  this._val = val
}
Request.Token.Str.prototype = Object.create(Request.Token.prototype)
Request.Token.Str.prototype.toString = function() { return this._val }
Object.defineProperty(Request.Token.Str.prototype, 'val', { get () { return this._val } })

Request.Token.Num = function(val) {
  if (!(this instanceof Request.Token.Num))
    return new Request.Token.Num(val)
  else
    Request.Token.call(this, 'num')

  this._val = val
}
Request.Token.Num.prototype = Object.create(Request.Token.prototype)
Request.Token.Num.prototype.toString = function() { return this._val }
Object.defineProperty(Request.Token.Num.prototype, 'val', { get () { return this._val } })

Request.Token.Var = function(type, key, val) {
  if (!(this instanceof Request.Token.Var))
    return new Request.Token.Var(type, key, val)
  else
    Request.Token.call(this, 'var')

  this._key = key
  this._val = val
  this._subtype = type
}
Request.Token.Var.prototype = Object.create(Request.Token.prototype)
Request.Token.Var.prototype.toString = function() { return `變數：${this.key}` }
Object.defineProperty(Request.Token.Var.prototype, 'key', { get () { return this._key } })
Object.defineProperty(Request.Token.Var.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Request.Token.Var.prototype, 'valString', { get () {
  if (this.val === null)
    return `預設值：?`
  if (typeof this.val == 'string')
    return `預設值："${this.val}"`
  if (typeof this.val == 'number')
    return `預設值：${this.val}`
  if (Helper.Type.isObject(this.val))
    return `預設值：${this.val}`
  
  return `預設值：?`
} })
Object.defineProperty(Request.Token.Var.prototype, 'subtype', { get () { return this._subtype } })

Request.Token.Rand = function(type, title) {
  if (!(this instanceof Request.Token.Rand))
    return new Request.Token.Rand(type, title)
  else
    Request.Token.call(this, 'rand')

  this._subtype = type
  this._title = title
}
Request.Token.Rand.prototype = Object.create(Request.Token.prototype)
Request.Token.Rand.prototype.toString = function() { return `隨機：${this._title}` }
Object.defineProperty(Request.Token.Rand.prototype, 'subtype', { get () { return this._subtype } })
Object.defineProperty(Request.Token.Rand.prototype, 'title', { get () { return this._title } })

Request.Token.dispatch = function(obj) {
  if (!Helper.Type.isObject(obj) || typeof obj.type != 'string')
    return null

  if (obj.type == 'str' && typeof obj.val == 'string')
    return Request.Token.Str(obj.val)

  if (obj.type == 'num' && typeof obj.val == 'number')
    return Request.Token.Num(obj.val)

  if (obj.type == 'var'
      && Helper.Type.isObject(obj.val)
      && typeof obj.val.type == 'string' && obj.val.type !== '' && ['str', 'num', 'obj'].includes(obj.val.type)
      && typeof obj.val.key == 'string' && obj.val.key !== ''
  ) return Request.Token.Var(obj.val.type, obj.val.key,
    (obj.val.type == 'str' && typeof obj.val.val == 'string') ||
    (obj.val.type == 'num' && typeof obj.val.val == 'number') ||
    (obj.val.type == 'obj' && Helper.Type.isObject(obj.val.val))
     ? obj.val.val
     : null)

  if (obj.type == 'rand'
      && Helper.Type.isObject(obj.val)
      && typeof obj.val.type == 'string' && obj.val.type !== '' && ['uuid', 'name', 'email', 'phone', 'address'].includes(obj.val.type)
      && typeof obj.val.title == 'string' && obj.val.title !== ''
  ) return Request.Token.Rand(obj.val.type, obj.val.title)

 return null
}

Request.Url = function(paths) {
  if (!(this instanceof Request.Url))
    return new Request.Url(paths)

  this._paths = []
  for (let path of paths) {
    let tmp = Request.Token.dispatch(path)
    if (tmp !== null)
      this._paths.push(tmp)
  }
}
Object.defineProperty(Request.Url.prototype, 'paths', { get () { return this._paths } })
Object.defineProperty(Request.Url.prototype, 'vars', { get () { return this.paths.filter(path => path.isVar) } })

Request.Method = function(method) {
  if (!(this instanceof Request.Method))
    return new Request.Method(method)
  this._val = method
}
Request.Method.prototype.toString = function() { return this._val.toLowerCase() }
Request.Method.prototype.toUpperCase = function() { return this._val.toUpperCase() }

Request.Header = function(display, data) {
  if (!(this instanceof Request.Header))
    return new Request.Header(display, data)

  this._display = display

  this._data = []

  for (const row of data) {
    if (Helper.Type.isObject(row)) {

      const key = Request.Token.dispatch(row.key)
      const val = Request.Token.dispatch(row.val)
      
      if (key !== null && val !== null)
        this._data.push({ key, val })
    }
  }
}
Object.defineProperty(Request.Header.prototype, 'display', { get () { return this._display } })
Object.defineProperty(Request.Header.prototype, 'data', { get () { return this._data } })
Object.defineProperty(Request.Header.prototype, 'vars', { get () { return this.data.map(({ key, val }) => [key, val]).reduce((a, b) => a.concat(b), []).filter(path => path.isVar) } })
Request.Header.prototype.toggleDisplay = function() { this._display = !this._display; return this }


Request.Payload = function(display, type) {
  if (!(this instanceof Request.Payload))
    return new Request.Payload(display, type)

  this._type = type
  this._display = display
}
Request.Payload.prototype.toString = function() {
  if (this._type == 'form') return '表單'
  if (this._type == 'rawJson') return 'Json'
  return ''
}

Object.defineProperty(Request.Payload.prototype, 'type', { get () { return this._type } })
Object.defineProperty(Request.Payload.prototype, 'display', { get () { return this._display } })
Request.Payload.prototype.toggleDisplay = function() { this._display = !this._display; return this }
Object.defineProperty(Request.Payload.prototype, 'vars', { get () { return [] } })

Request.Payload.Form = function(display, data) {
  if (!(this instanceof Request.Payload.Form))
    return new Request.Payload.Form(display, data)
  else
    Request.Payload.call(this, display, 'form')

  this._data = []
  for (const row of data) {
    if (Helper.Type.isObject(row)) {
      
      const key = Request.Token.dispatch(row.key)
      const val = Request.Token.dispatch(row.val)
      
      if (key !== null && val !== null)
        this._data.push({ key, val })
    }
  }
  
}
Request.Payload.Form.prototype = Object.create(Request.Payload.prototype)
Object.defineProperty(Request.Payload.Form.prototype, 'data', { get () { return this._data } })

Object.defineProperty(Request.Payload.Form.prototype, 'vars', { get () {
  return this.data.map(({ key, val }) => [key, val]).reduce((a, b) => a.concat(b), []).filter(path => path.isVar)
} })

Request.Payload.dispatch = function(obj) {
  if (!Helper.Type.isObject(obj) || typeof obj.type != 'string')
    return null

  if (obj.type == 'form' && Array.isArray(obj.data) && obj.data.length)
    return Request.Payload.Form(typeof obj.display == 'boolean' ? obj.display : false, obj.data)

  return null
}


Request.TestRule = function(display, rule) {
  if (!(this instanceof Request.TestRule))
    return new Request.TestRule(display, rule)

  this._display = display
  this._rule = rule
}
Object.defineProperty(Request.TestRule.prototype, 'display', { get () { return this._display } })
Object.defineProperty(Request.TestRule.prototype, 'rule', { get () { return this._rule } })
Object.defineProperty(Request.TestRule.prototype, 'description', { get () { return this.rule === null ? null : this.rule.description('回應結果') } })
Request.TestRule.prototype.toggleDisplay = function() { this._display = !this._display; return this }

Request.TestRule.Description = function(type, title, optional, descriptions, children = []) {
  if (!(this instanceof Request.TestRule.Description))
    return new Request.TestRule.Description(type, title, optional, descriptions, children)
  this._type = type
  this._title = title
  this._optional = optional
  this._descriptions = descriptions
  this._children = children
}
Object.defineProperty(Request.TestRule.Description.prototype, 'type', { get () { return this._type } })
Object.defineProperty(Request.TestRule.Description.prototype, 'title', { get () { return this._title } })
Object.defineProperty(Request.TestRule.Description.prototype, 'optional', { get () { return this._optional } })
Object.defineProperty(Request.TestRule.Description.prototype, 'descriptions', { get () { return this._descriptions } })
Object.defineProperty(Request.TestRule.Description.prototype, 'children', { get () { return this._children } })

Request.TestRule.Num = function(optional, val, min, max) {
  if (!(this instanceof Request.TestRule.Num))
    return new Request.TestRule.Num(optional, val, min, max)

  this._optional = optional
  this._val      = val
  this._min      = min
  this._max      = max
}
Object.defineProperty(Request.TestRule.Num.prototype, 'type', { get () { return '數字' } })
Object.defineProperty(Request.TestRule.Num.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Request.TestRule.Num.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Request.TestRule.Num.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Request.TestRule.Num.prototype, 'optional', { get () { return this._optional } })
Request.TestRule.Num.prototype.description = function(title) {
  let descriptions = []
  if (this.val !== undefined) {
    descriptions.push(`值需等於「${this.val}」`)
  } else {
    this.min === undefined || descriptions.push(`需大於等於「${this.min}」`)
    this.max === undefined || descriptions.push(`需小於等於「${this.max}」`)
  }

  return Request.TestRule.Description(this.type, title, this.optional, descriptions)
}
Request.TestRule.Str = function(optional, val, min, max, len) {
  if (!(this instanceof Request.TestRule.Str))
    return new Request.TestRule.Str(optional, val, min, max, len)

  this._optional = optional
  this._val      = val
  this._len      = len
  this._min      = min
  this._max      = max
}
Object.defineProperty(Request.TestRule.Str.prototype, 'type', { get () { return '字串' } })
Object.defineProperty(Request.TestRule.Str.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Request.TestRule.Str.prototype, 'len', { get () { return this._len } })
Object.defineProperty(Request.TestRule.Str.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Request.TestRule.Str.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Request.TestRule.Str.prototype, 'optional', { get () { return this._optional } })
Request.TestRule.Str.prototype.description = function(title) {
  let descriptions = []
  if (this.val !== undefined) {
    descriptions.push(`值需等於「${this.val}」`)
  } else if (this.len !== undefined) {
    descriptions.push(`長度需等於「${this.val}」`)
  } else { 
    this.min === undefined || descriptions.push(`長度需大於等於「${this.min}」`)
    this.max === undefined || descriptions.push(`長度需小於等於「${this.max}」`)
  }

  return Request.TestRule.Description(this.type, title, this.optional, descriptions)
}

Request.TestRule.Bool = function(optional, val) {
  if (!(this instanceof Request.TestRule.Bool))
    return new Request.TestRule.Bool(optional, val)

  this._optional = optional
  this._val      = val
}
Object.defineProperty(Request.TestRule.Bool.prototype, 'type', { get () { return '布林值' } })
Object.defineProperty(Request.TestRule.Bool.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Request.TestRule.Bool.prototype, 'optional', { get () { return this._optional } })
Request.TestRule.Bool.prototype.description = function(title) {
  let descriptions = []
  this.val === undefined || descriptions.push(`值需等於「${this.val ? 'true' : 'false'}」`)
  return Request.TestRule.Description(this.type, title, this.optional, descriptions)
}

Request.TestRule.Arr = function(optional, min, max, len, element) {
  if (!(this instanceof Request.TestRule.Arr))
    return new Request.TestRule.Arr(optional, min, max, len, element)

  this._optional = optional
  this._min      = min
  this._max      = max
  this._len      = len
  this._element  = element
}
Object.defineProperty(Request.TestRule.Arr.prototype, 'type', { get () { return '陣列' } })
Object.defineProperty(Request.TestRule.Arr.prototype, 'element', { get () { return this._element } })
Object.defineProperty(Request.TestRule.Arr.prototype, 'len', { get () { return this._len } })
Object.defineProperty(Request.TestRule.Arr.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Request.TestRule.Arr.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Request.TestRule.Arr.prototype, 'optional', { get () { return this._optional } })
Request.TestRule.Arr.prototype.description = function(title) {
  let descriptions = []
  if (this.len !== undefined) {
    descriptions.push(`長度需等於「${this.len}」`)
  } else { 
    this.min === undefined || descriptions.push(`長度需大於等於「${this.min}」`)
    this.max === undefined || descriptions.push(`長度需小於等於「${this.max}」`)
  }

  const children = []
  if (this.element === null) {
    descriptions.push(`，元素類型不需要檢查`)
  } else {
    const { title: t, descriptions: descs, children: s } = this.element.description('元素')
    descriptions.push(...descs)
    children.push(...s)
  }

  return Request.TestRule.Description(this.type, title, this.optional, descriptions, children)
}

Request.TestRule.Obj = function(optional, struct) {
  if (!(this instanceof Request.TestRule.Obj))
    return new Request.TestRule.Obj(optional, struct)

  this._optional = optional
  this._struct = struct
}
Object.defineProperty(Request.TestRule.Obj.prototype, 'type', { get () { return 'JSON' } })
Object.defineProperty(Request.TestRule.Obj.prototype, 'struct', { get () { return this._struct } })
Object.defineProperty(Request.TestRule.Obj.prototype, 'optional', { get () { return this._optional } })
Request.TestRule.Obj.prototype.description = function(title) {
  let descriptions = []
  const keys = this.struct ? Object.keys(this.struct) : []

  if (keys.length)
    descriptions.push(`結構中的 ${keys.map(k => `「${k}」`).join('、')} 需要檢查`)
  else
    descriptions.push(`結構內容完全不用檢查`)

  const children = []
  for (let key of keys)
    children.push(this.struct[key].description(key))

  return Request.TestRule.Description(this.type, title, this.optional, descriptions, children)
}

Request.TestRule.dispatch = function(obj) {
  if (!Helper.Type.isObject(obj) || typeof obj.type != 'string')
    return null
  
  if (obj.type == 'num')
    return Request.TestRule.Num(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.val      == 'number'  ? obj.val      : null,
      typeof obj.min      == 'number'  ? obj.min      : null,
      typeof obj.max      == 'number'  ? obj.max      : null
    )

  if (obj.type == 'str')
    return Request.TestRule.Str(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.val      == 'string'  ? obj.val      : null,
      typeof obj.min      == 'number'  ? obj.min      : null,
      typeof obj.max      == 'number'  ? obj.max      : null,
      typeof obj.len      == 'number'  ? obj.len      : null
    )

  if (obj.type == 'bool')
    return Request.TestRule.Bool(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.val      == 'boolean' ? obj.val      : null
    )

  if (obj.type == 'arr')
    return Request.TestRule.Arr(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.min       == 'number' ? obj.min      : undefined,
      typeof obj.max       == 'number' ? obj.max      : undefined,
      typeof obj.len       == 'number' ? obj.len      : undefined,
      Request.TestRule.dispatch(obj.element)
    )

  if (obj.type == 'obj') {
    const struct = {}

    if (Helper.Type.isObject(obj.struct))
      for (let key in obj.struct) {
        let tmp = Request.TestRule.dispatch(obj.struct[key])
        if (tmp !== null)
          struct[key] = tmp
      }

    return Request.TestRule.Obj(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      Object.keys(struct).length ? struct : null)
  }

  return null
}

Load.VueComponent('test-rule', {
  props: {
    description: { type: Request.TestRule.Description, request: true }
  },
  computed: {
  },
  template: `
    div.test-rule
      label
        b => *text=description.title
        span.type => *text=description.type
        span.optional => *text=description.optional ? '非必須' : '必須'
        template => *if=description.descriptions.length
          i
          span.rule => *text=description.descriptions.join('，') + '。'
      ul => *if=description.children.length
        li => *for=(child, i) in description.children   :key=i
          test-rule => :description=child`
})

Load.VueComponent('role-unit', {
  props: {
    request: { type: Request, request: true }
  },
  computed: {
  },
  template: `
    .role-unit
      header => :class=request.display ? '_open' : ''
        i._icon-api
        div
          b => *text='登入前台'
          span => *text='用戶使用 E-Mail 登入'
        label => @click=request.toggleDisplay()

      .body.api => *if=request.display
        .var => *if=request.forceVars.length
          label.row._arr._var => :class={_open: request.displayVar}   @click=request.toggleDisplayVar()
            b => *text='必要變數'   :subtitle='（' + request.forceVars.length + '）'

          .kvs => *if=request.displayVar
            .kv => *for=(v, i) in request.forceVars   :key=i
              label
                b => *text=v.key
              label
                span => *text=v.valString

        .url
          label.row._copy
            b => *text='URL'
            div
              span => *for=(path, i) in request.url.paths   :key=i   *text=path   :class={_token_dynamic: path.isDynamic}

        .method
          .row
            b => *text='方式'   :subtitle='（method）'
            div
              span => *text=request.method.toUpperCase()   :class=request.method.toString()


        .header => *if=request.header.data.length
          label.row._arr => :class={_open: request.header.display}   @click=request.header.toggleDisplay()
            b => *text='標題'   :subtitle='（header）'

          .kvs => *if=request.header.display
            .kv => *for=({ key, val },i) in request.header.data   :key=i
              label
                b => *text=key   :class={_token_dynamic: key.isDynamic}
              label
                span => *text=val   :class={_token_dynamic: val.isDynamic}

        .payload => *if=request.payload
          label.row._arr => :class={_open: request.payload.display}   @click=request.payload.toggleDisplay()
            b => *text='內文'   :subtitle='（payload）'
            span => *text=request.payload

          template => *if=request.payload.display
            .kvs => *if=request.payload.type == 'form'
              .kv => *for=({ key, val }, i) in request.payload.data   :key=i
                label
                  b => *text=key   :class={_token_dynamic: key.isDynamic}
                label
                  span => *text=val   :class={_token_dynamic: val.isDynamic}

        .test-rules
          label.row._arr => :class=request.testRule.display ? '_open' : ''   @click=request.testRule.toggleDisplay()
            b => *text='測試條件'   :subtitle='（test rule）'

          div => *if=request.testRule.display
            test-rule => *if=request.testRule.description   :description=request.testRule.description
            div.test-rule => *else
              div
                b => *text='回應結果'
                i
                span.rule => *text='不需檢查。'
    `
})

Load.Vue({
  data: {
    request: Request({
      display: true,
      method: 'post',
      url: {
        paths: [
          { type: 'var', val: {
            type: 'str',
            key: 'BaseURL',
          } },
          { type: 'str', val: 'market' },
          { type: 'num', val: 2 },
          { type: 'str', val: 'product' },
          { type: 'var', val: {
            type: 'num',
            key: 'product-id',
            val: 0
          } },
          { type: 'str', val: 'product' },
          { type: 'rand', val: {
            type: 'name', title: '姓名',
            type: 'email', title: 'E-Mail',
            type: 'phone', title: '電話',
            type: 'address', title: '地址',
          } },
        ]
      },
      header: {
        display: true,
        data: [
          {
            key: { type: 'str', val: 'Authorization' },
            val: { type: 'var', val: { type: 'str', key: 'auth-token'} }
          },
          {
            key: { type: 'str', val: 'Pid' },
            val: { type: 'var', val: { type: 'num', key: 'product-id'} }
          },
        ]
      },
      payload: {
        display: true,
        type: 'form',
        data: [
          {
            key: { type: 'str', val: 'type' },
            val: { type: 'str', val: 'mobile' },
          },
          {
            key: { type: 'str', val: 'username' },
            val: { type: 'var', val: { type: 'str', key: 'auth-account'} }
          },
          {
            key: { type: 'str', val: 'password' },
            val: { type: 'var', val: { type: 'str', key: 'auth-password'} }
          },
          {
            key: { type: 'str', val: 'uuid' },
            val: { type: 'rand', val: { type: 'uuid', title: 'UUID' } }
          },
        ]
      },
      testRule: {
        display: true,
        rule: {
          type: 'obj', optional: false,
          struct: {
            status: { type: 'num', optional: false, val: 200 },
            message: { type: 'str', optional: true },
            isPay: { type: 'bool', optional: true, val: false },
            ids: { type: 'arr', optional: false, min: 1, max: 10, element: {
              type: 'num', optional: false, min: 1, max: 10
            } },

            data: { type: 'obj', optional: false, struct: {
              id: { type: 'num', optional: false, min: 1 },
              ono: { type: 'str', optional: false, min: 1 },
              items: { type: 'arr', optional: false, min: 1, element: {
                type: 'obj', optional: false, min: 1, struct: {
                  id: { type: 'num', optional: false, min: 1 },
                }
              } }
            } }
          }
        },
        // rule: {
        //   type: 'num', optional: false, val: 200
        // }
      }
    })
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    layout
      template => slot=main
        #story
          #unit-roles
            .unit-roles
              .role-units
                b => *text='用戶前台'
              .role-units
                b => *text='管理後台'

            .unit-roles
              .role-units
                role-unit => :request=request

                .role-unit
                  header
                    i._icon-ifelse
                    div
                      b => *text='檢查是否可被申請退貨'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='清除購物車'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='加入購物車'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='取得付款憑證'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='付款'
                      span
                    label
                  
                  .body

              .role-units
            
            .unit-roles
              .role-units
              .role-units
                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='登入後台'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='排程過 12 小時'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='登入後台'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='檢視訂單-取的項目'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='建立出貨單'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='檢視訂單-取得出貨單'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='送達'
                      span
                    label
                  
                  .body

            
            .unit-roles
              .role-units
                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='登入前台'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='檢視訂單'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-ifelse
                    div
                      b => *text='檢查是否可被申請退貨'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='申請退貨'
                      span
                    label
                  
                  .body

              .role-units
            
            .unit-roles
              .role-units
              .role-units
                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='登入後台'
                      span
                    label
                  
                  .body

                .role-unit
                  header
                    i._icon-api
                    div
                      b => *text='允許退貨'
                      span
                    label
                  
                  .body

                
            .unit-roles
              .role-units
              .role-units
                .unit
                  .role-unit
                    header
                      i
                      div
                        b => *text='登入後台'
                        span
                      label
                    
                    .body

                  .role-unit
                    header
                      i
                      div
                        b => *text='退款'
                        span
                      label
                    
                    .body


      `
})
