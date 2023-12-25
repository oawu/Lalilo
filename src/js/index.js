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

  this._rule = Request.Rule(
    isObj && Helper.Type.isObject(obj.rule) && typeof obj.rule.display == 'boolean'
      ? obj.rule.display
      : false,

    isObj && Helper.Type.isObject(obj.rule) && typeof obj.rule.index == 'number' && obj.rule.index >= 0 && obj.rule.index <= 1
      ? obj.rule.index
      : 0,

    isObj && Helper.Type.isObject(obj.rule)
      ? Request.Rule.Test.dispatch(obj.rule.test)
      : null,

    isObj && Helper.Type.isObject(obj.rule) && Array.isArray(obj.rule.saves)
      ? obj.rule.saves.map(save => Helper.Type.isObject(save) && typeof save.key == 'string' && save.key !== '' && typeof save.var == 'string' && save.var !== ''
        ? Request.Rule.Save(save.key, save.var)
        : null).filter(save => save !== null)
      : []
  )

  this._response = Request.Response(
    isObj && Helper.Type.isObject(obj.response) && typeof obj.response.display == 'boolean'
      ? obj.response.display
      : false,

    isObj && Helper.Type.isObject(obj.rule) && typeof obj.rule.index == 'number' && obj.rule.index >= 0 && obj.rule.index <= 1
      ? obj.rule.index
      : 0,

    Request.Response.Raw(isObj && Helper.Type.isObject(obj.response) ? obj.response.raw : null),
  )
}

Object.defineProperty(Request.prototype, 'url', { get () { return this._url } })
Object.defineProperty(Request.prototype, 'method', { get () { return this._method } })
Object.defineProperty(Request.prototype, 'header', { get () { return this._header } })
Object.defineProperty(Request.prototype, 'payload', { get () { return this._payload } })
Object.defineProperty(Request.prototype, 'rule', { get () { return this._rule } })
Object.defineProperty(Request.prototype, 'response', { get () { return this._response } })
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


Request.Rule = function(display, index, test, saves) {
  if (!(this instanceof Request.Rule))
    return new Request.Rule(display, index, test, saves)

  this._display = display
  this._index = index
  this._test = test
  this._saves = saves
}
Object.defineProperty(Request.Rule.prototype, 'display', { get () { return this._display } })
Object.defineProperty(Request.Rule.prototype, 'index', { get () { return this._index }, set (val) { return this._index = val >= 0 && val <= 1 ? val : 0 } })
Object.defineProperty(Request.Rule.prototype, 'test', { get () { return this._test } })
Object.defineProperty(Request.Rule.prototype, 'saves', { get () { return this._saves } })
Object.defineProperty(Request.Rule.prototype, 'showTest', { get () { return this.index == 0 } })
Object.defineProperty(Request.Rule.prototype, 'showSave', { get () { return this.index == 1 } })

Request.Rule.prototype.toggleDisplay = function() { this._display = !this._display; return this }

Request.Rule.Test = function() {}

Request.Rule.Test.Description = function(type, title, optional, descriptions, children = []) {
  if (!(this instanceof Request.Rule.Test.Description))
    return new Request.Rule.Test.Description(type, title, optional, descriptions, children)
  this._type = type
  this._title = title
  this._optional = optional
  this._descriptions = descriptions
  this._children = children
}
Object.defineProperty(Request.Rule.Test.Description.prototype, 'type', { get () { return this._type } })
Object.defineProperty(Request.Rule.Test.Description.prototype, 'title', { get () { return this._title } })
Object.defineProperty(Request.Rule.Test.Description.prototype, 'optional', { get () { return this._optional } })
Object.defineProperty(Request.Rule.Test.Description.prototype, 'descriptions', { get () { return this._descriptions } })
Object.defineProperty(Request.Rule.Test.Description.prototype, 'children', { get () { return this._children } })

Request.Rule.Test.Num = function(optional, val, min, max) {
  if (!(this instanceof Request.Rule.Test.Num))
    return new Request.Rule.Test.Num(optional, val, min, max)

  this._optional = optional
  this._val      = val
  this._min      = min
  this._max      = max
}
Object.defineProperty(Request.Rule.Test.Num.prototype, 'type', { get () { return '數字' } })
Object.defineProperty(Request.Rule.Test.Num.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Request.Rule.Test.Num.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Request.Rule.Test.Num.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Request.Rule.Test.Num.prototype, 'optional', { get () { return this._optional } })
Request.Rule.Test.Num.prototype.description = function(title) {
  let descriptions = []
  if (this.val !== null) {
    descriptions.push(`值需等於「${this.val}」`)
  } else {
    this.min === null || descriptions.push(`需大於等於「${this.min}」`)
    this.max === null || descriptions.push(`需小於等於「${this.max}」`)
  }

  return Request.Rule.Test.Description(this.type, title, this.optional, descriptions)
}
Request.Rule.Test.Str = function(optional, val, min, max, len) {
  if (!(this instanceof Request.Rule.Test.Str))
    return new Request.Rule.Test.Str(optional, val, min, max, len)

  this._optional = optional
  this._val      = val
  this._len      = len
  this._min      = min
  this._max      = max
}
Object.defineProperty(Request.Rule.Test.Str.prototype, 'type', { get () { return '字串' } })
Object.defineProperty(Request.Rule.Test.Str.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Request.Rule.Test.Str.prototype, 'len', { get () { return this._len } })
Object.defineProperty(Request.Rule.Test.Str.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Request.Rule.Test.Str.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Request.Rule.Test.Str.prototype, 'optional', { get () { return this._optional } })
Request.Rule.Test.Str.prototype.description = function(title) {
  let descriptions = []
  if (this.val !== null) {
    descriptions.push(`值需等於「${this.val}」`)
  } else if (this.len !== null) {
    descriptions.push(`長度需等於「${this.val}」`)
  } else { 
    this.min === null || descriptions.push(`長度需大於等於「${this.min}」`)
    this.max === null || descriptions.push(`長度需小於等於「${this.max}」`)
  }

  return Request.Rule.Test.Description(this.type, title, this.optional, descriptions)
}

Request.Rule.Test.Bool = function(optional, val) {
  if (!(this instanceof Request.Rule.Test.Bool))
    return new Request.Rule.Test.Bool(optional, val)

  this._optional = optional
  this._val      = val
}
Object.defineProperty(Request.Rule.Test.Bool.prototype, 'type', { get () { return '布林值' } })
Object.defineProperty(Request.Rule.Test.Bool.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Request.Rule.Test.Bool.prototype, 'optional', { get () { return this._optional } })
Request.Rule.Test.Bool.prototype.description = function(title) {
  let descriptions = []
  this.val === null || descriptions.push(`值需等於「${this.val ? 'true' : 'false'}」`)
  return Request.Rule.Test.Description(this.type, title, this.optional, descriptions)
}

Request.Rule.Test.Arr = function(optional, min, max, len, element) {
  if (!(this instanceof Request.Rule.Test.Arr))
    return new Request.Rule.Test.Arr(optional, min, max, len, element)

  this._optional = optional
  this._min      = min
  this._max      = max
  this._len      = len
  this._element  = element
}
Object.defineProperty(Request.Rule.Test.Arr.prototype, 'type', { get () { return '陣列' } })
Object.defineProperty(Request.Rule.Test.Arr.prototype, 'element', { get () { return this._element } })
Object.defineProperty(Request.Rule.Test.Arr.prototype, 'len', { get () { return this._len } })
Object.defineProperty(Request.Rule.Test.Arr.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Request.Rule.Test.Arr.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Request.Rule.Test.Arr.prototype, 'optional', { get () { return this._optional } })
Request.Rule.Test.Arr.prototype.description = function(title) {
  let descriptions = []
  if (this.len !== null) {
    descriptions.push(`長度需等於「${this.len}」`)
  } else { 
    this.min === null || descriptions.push(`長度需大於等於「${this.min}」`)
    this.max === null || descriptions.push(`長度需小於等於「${this.max}」`)
  }

  const children = []
  if (this.element === null) {
    descriptions.push(`，元素類型不需要檢查`)
  } else {
    children.push(this.element.description('元素'))
  }

  return Request.Rule.Test.Description(this.type, title, this.optional, descriptions, children)
}

Request.Rule.Test.Obj = function(optional, struct) {
  if (!(this instanceof Request.Rule.Test.Obj))
    return new Request.Rule.Test.Obj(optional, struct)

  this._optional = optional
  this._struct = struct
}
Object.defineProperty(Request.Rule.Test.Obj.prototype, 'type', { get () { return 'JSON' } })
Object.defineProperty(Request.Rule.Test.Obj.prototype, 'struct', { get () { return this._struct } })
Object.defineProperty(Request.Rule.Test.Obj.prototype, 'optional', { get () { return this._optional } })
Request.Rule.Test.Obj.prototype.description = function(title) {
  let descriptions = []
  const keys = this.struct ? Object.keys(this.struct) : []

  if (keys.length)
    descriptions.push(`結構中的 ${keys.map(k => `「${k}」`).join('、')} 需要檢查`)
  else
    descriptions.push(`結構內容完全不用檢查`)

  const children = []
  for (let key of keys)
    children.push(this.struct[key].description(key))

  return Request.Rule.Test.Description(this.type, title, this.optional, descriptions, children)
}

Request.Rule.Test.dispatch = function(obj) {
  if (!Helper.Type.isObject(obj) || typeof obj.type != 'string')
    return null
  
  if (obj.type == 'num')
    return Request.Rule.Test.Num(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.val      == 'number'  ? obj.val      : null,
      typeof obj.min      == 'number'  ? obj.min      : null,
      typeof obj.max      == 'number'  ? obj.max      : null
    )

  if (obj.type == 'str')
    return Request.Rule.Test.Str(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.val      == 'string'  ? obj.val      : null,
      typeof obj.min      == 'number'  ? obj.min      : null,
      typeof obj.max      == 'number'  ? obj.max      : null,
      typeof obj.len      == 'number'  ? obj.len      : null
    )

  if (obj.type == 'bool')
    return Request.Rule.Test.Bool(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.val      == 'boolean' ? obj.val      : null
    )

  if (obj.type == 'arr')
    return Request.Rule.Test.Arr(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      typeof obj.min       == 'number' ? obj.min      : null,
      typeof obj.max       == 'number' ? obj.max      : null,
      typeof obj.len       == 'number' ? obj.len      : null,
      Request.Rule.Test.dispatch(obj.element)
    )

  if (obj.type == 'obj') {
    const struct = {}

    if (Helper.Type.isObject(obj.struct))
      for (let key in obj.struct) {
        let tmp = Request.Rule.Test.dispatch(obj.struct[key])
        if (tmp !== null)
          struct[key] = tmp
      }

    return Request.Rule.Test.Obj(
      typeof obj.optional == 'boolean' ? obj.optional : false,
      Object.keys(struct).length ? struct : null)
  }

  return null
}

Request.Rule.Save = function(key, v) {
  if (!(this instanceof Request.Rule.Save))
    return new Request.Rule.Save(key, v)
  
  this._key = key
  this._var = v
}
Object.defineProperty(Request.Rule.Save.prototype, 'key', { get () { return this._key } })
Object.defineProperty(Request.Rule.Save.prototype, 'var', { get () { return this._var } })


Request.Response = function(display, index, raw) {
  if (!(this instanceof Request.Response))
    return new Request.Response(display, index, raw)

  this._display = display
  this._index = index
  this._raw = raw
}
Object.defineProperty(Request.Response.prototype, 'display', { get () { return this._display } })
Object.defineProperty(Request.Response.prototype, 'raw', { get () { return this._raw } })
Object.defineProperty(Request.Response.prototype, 'index', { get () { return this._index }, set (val) { return this._index = val >= 0 && val <= 1 ? val : 0 } })
Object.defineProperty(Request.Response.prototype, 'showPretty', { get () { return this.index == 0 } })
Object.defineProperty(Request.Response.prototype, 'showOrigin', { get () { return this.index == 1 } })
Request.Response.prototype.toggleDisplay = function() { this._display = !this._display; return this }

Request.Response.Raw = function(data) {
  if (!(this instanceof Request.Response.Raw))
    return new Request.Response.Raw(data)

  if (Helper.Type.isObject(data)) {
    this._text = JSON.stringify(data)
    this._json = { val: data, pretty: PrettyJson.dispatch(data) }
    return this._error = undefined
  }

  if (Array.isArray(data)) {
    this._text = JSON.stringify(data)
    this._json = { val: data, pretty: PrettyJson.dispatch(data) }
    return this._error = undefined
  }

  const type = typeof data

  if (data === null || ['number', 'string', 'boolean'].includes(type)) {
    if (data === null) this._text = 'null'
    if (type == 'string') this._text = `${data}`
    if (type == 'number') this._text = `${data}`
    if (type == 'boolean') this._text = data ? 'true' : 'false'

    this._json = undefined
    this._error = undefined
    let val = undefined
    try {
      val = JSON.parse(type == 'string' ? `"${data}"` : data)
    } catch (e) {
      this._error = e
      val = undefined
    }

    if (this._error === undefined)
      this._json = { val, pretty: PrettyJson.dispatch(val) }

    return this._error
  }

  this._text = undefined
  this._json = undefined
  return this._error = undefined
}
Object.defineProperty(Request.Response.Raw.prototype, 'text', { get () { return this._text } })
Object.defineProperty(Request.Response.Raw.prototype, 'json', { get () { return this._json } })
Object.defineProperty(Request.Response.Raw.prototype, 'error', { get () { return this._error } })


const PrettyJson = function (type) {
  if (this instanceof PrettyJson) return this._type = type
  else return new PrettyJson(type)
}
Object.defineProperty(PrettyJson.prototype, 'type', { get () { return this._type } })
PrettyJson.dispatch = function(data) {
  if (typeof data == 'string') return PrettyJson.Str(data)
  if (typeof data == 'number') return PrettyJson.Num(data)
  if (typeof data == 'boolean') return PrettyJson.Bool(data)
  if (Array.isArray(data)) return PrettyJson.Arr(data.map(t => PrettyJson.dispatch(t)))
  
  if (Helper.Type.isObject(data)) {
    const keyVals = []
    for (let key in data) keyVals.push(PrettyJson.Obj.KeyVal(key, PrettyJson.dispatch(data[key])))
    return PrettyJson.Obj(keyVals)
  }

  return PrettyJson.Null()
}

PrettyJson.Null = function() {
  if (!(this instanceof PrettyJson.Null))
    return new PrettyJson.Null()
  PrettyJson.call(this, 'null')
}
PrettyJson.Null.prototype = Object.create(PrettyJson.prototype)
PrettyJson.Null.prototype.toString = function() { return 'null' }
PrettyJson.Null.prototype.toStructString = function() { return this.toString() }

PrettyJson.Num = function(val) {
  if (!(this instanceof PrettyJson.Num))
    return new PrettyJson.Num(val)

  PrettyJson.call(this, 'num')
  this._val = val
}
PrettyJson.Num.prototype = Object.create(PrettyJson.prototype)
Object.defineProperty(PrettyJson.Num.prototype, 'val', { get () { return this._val } })
PrettyJson.Num.prototype.toString = function() { return this.val }
PrettyJson.Num.prototype.toStructString = function() { return this.toString() }

PrettyJson.Str = function(val) {
  if (!(this instanceof PrettyJson.Str))
    return new PrettyJson.Str(val)

  PrettyJson.call(this, 'str')
  this._val = val
}
PrettyJson.Str.prototype = Object.create(PrettyJson.prototype)
Object.defineProperty(PrettyJson.Str.prototype, 'val', { get () { return this._val } })
PrettyJson.Str.prototype.toString = function() { return `"${this.val}"` }
PrettyJson.Str.prototype.toStructString = function() { return this.toString() }

PrettyJson.Bool = function(val) {
  if (!(this instanceof PrettyJson.Bool))
    return new PrettyJson.Bool(val)

  PrettyJson.call(this, 'bool')
  this._val = val
}
PrettyJson.Bool.prototype = Object.create(PrettyJson.prototype)
Object.defineProperty(PrettyJson.Bool.prototype, 'val', { get () { return this._val } })
PrettyJson.Bool.prototype.toString = function() { return this.val ? 'true' : 'false' }
PrettyJson.Bool.prototype.toStructString = function() { return this.toString() }

PrettyJson.Arr = function(elements) {
  if (!(this instanceof PrettyJson.Arr))
    return new PrettyJson.Arr(elements)

  PrettyJson.call(this, 'arr')
  this._elements = elements
}
PrettyJson.Arr.prototype = Object.create(PrettyJson.prototype)
Object.defineProperty(PrettyJson.Arr.prototype, 'elements', { get () { return this._elements } })
PrettyJson.Arr.prototype.toString = function () { return `[${this.elements.map(e => e.toString()).join(',')}]` }
PrettyJson.Arr.prototype.toStructString = function (level = 0) { return `[\n${this.elements.length ? `${this.elements.map(e => `${' '.repeat((level + 1) * 2)}${e.toStructString(level + 1)}`).join(',\n')}\n` : ''}${' '.repeat(level * 2)}]` }

PrettyJson.Obj = function(keyVals) {
  if (!(this instanceof PrettyJson.Obj))
    return new PrettyJson.Obj(keyVals)

  PrettyJson.call(this, 'obj')
  this._keyVals = keyVals
}
PrettyJson.Obj.prototype = Object.create(PrettyJson.prototype)
Object.defineProperty(PrettyJson.Obj.prototype, 'keyVals', { get () { return this._keyVals } })
PrettyJson.Obj.prototype.toString = function () { return `{${this.keyVals.map(keyVal => `"${keyVal.key}":${keyVal.val.toString()}`).join(',')}}` }
PrettyJson.Obj.prototype.toStructString = function (level = 0) { return `{\n${this.keyVals.length ? `${this.keyVals.map(keyVal => `${' '.repeat((level + 1) * 2)}"${keyVal.key}": ${keyVal.val.toStructString(level + 1)}`).join(',\n')}\n` : ''}${' '.repeat(level * 2)}}` }

PrettyJson.Obj.KeyVal = function(key, val) {
  if (!(this instanceof PrettyJson.Obj.KeyVal))
    return new PrettyJson.Obj.KeyVal(key, val)
  this._key = key
  this._val = val
}
Object.defineProperty(PrettyJson.Obj.KeyVal.prototype, 'key', { get () { return this._key } })
Object.defineProperty(PrettyJson.Obj.KeyVal.prototype, 'val', { get () { return this._val } })

Load.VueComponent('test-rule', {
  props: {
    description: { type: Request.Rule.Test.Description, request: true }
  },
  template: `
    .test-rule
      template => *if=description
        label
          b.title => *text=description.title   :class={_optional: description.optional}
          span.type => *text=description.type
          template => *if=description.descriptions.length
            i
            span.desc => *text=description.descriptions.join('，') + '。'
        
        ul => *if=description.children.length
          li => *for=(child, i) in description.children   :key=i
            test-rule => :description=child

      template => *else
        label
          b.title => *text='回應'
          i
          span.desc => *text='不需檢查。'
`
})

Load.VueComponent('pretty-json-count', { props: { count: { type: Number, request: true }}, template: `span.pj-count._ns => *text=count` })
Load.VueComponent('pretty-json-copy', { template: `span.pj-copy._ns => *text='複製'   @click.stop=$emit('copy')` })
Load.VueComponent('pretty-json-empty', { template: `span.pj-empty._ns` })
Load.VueComponent('pretty-json-colon', { template: `span.pj-colon._ns => *text=':'` })
Load.VueComponent('pretty-json-more', { template: `span.pj-more._ns => *text='…'` })
Load.VueComponent('pretty-json-comma', { template: `span.pj-comma._ns => *text=','` })
Load.VueComponent('pretty-json-square-left', { template: `span.pj-square-left._ns => *text='['` })
Load.VueComponent('pretty-json-square-right', { template: `span.pj-square-right._ns => *text=']'` })
Load.VueComponent('pretty-json-curly-left', { template: `span.pj-curly-left._ns => *text='{'` })
Load.VueComponent('pretty-json-curly-right', { template: `span.pj-curly-right._ns => *text='}'` })
Load.VueComponent('pretty-json-key', { props: { val: { type: String, request: true } }, computed: { text () { return `"${this.val}"` }}, template: `span.pj-key._ns => *text=text` })
Load.VueComponent('pretty-json-null', { template: `span.pj-null._ns => *text='null'` })
Load.VueComponent('pretty-json-num', { props: { val: { type: PrettyJson.Num, request: true } }, template: `span.pj-num._ns => *text=val` })
Load.VueComponent('pretty-json-str', { props: { val: { type: PrettyJson.Str, request: true } }, computed: { text () { return `"${this.val}"` }}, template: `span.pj-str._ns => *text=text` })
Load.VueComponent('pretty-json-bool', { props: { val: { type: PrettyJson.Bool, request: true } }, template: `span.pj-bool._ns => *text=val` })

Load.VueComponent('pretty-json-arr', {
  props: {
    obj: { type: PrettyJson.Arr, request: true },
    colon: { type: Boolean, request: true }
  },
  data: _ => ({
    display: true
  }),
  methods: {
    addColon(i) {
      return i < this.obj.elements.length - 1
    },
    copyArr () {
      copy(this.obj.toStructString(), _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
    },
    copyKeyVal (item, colon) {
      if (!['null', 'num', 'str', 'bool'].includes(item.type)) return Toastr.failure('複製失敗')
      copy(`${item.toStructString()}${colon ? ',' : ''}`, _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
    }
  },
  template: `
    .pj-arr
      div.pj-r0 => @click=display=!display
        label
          slot => name=key
          pretty-json-square-left
          pretty-json-count => *if=display   :count=obj.elements.length
          pretty-json-more => *else
        pretty-json-copy => @copy=copyArr

      .pj-r1 => *if=display
        div => *for=(item, i) in obj.elements   :key=i
          .pj-els => *if=['null', 'num', 'str', 'bool'].includes(item.type)
            pretty-json-null => *if=item.type == 'null'
            pretty-json-num => *if=item.type == 'num'   :val=item.val
            pretty-json-str => *if=item.type == 'str'   :val=item.val
            pretty-json-bool => *if=item.type == 'bool'   :val=item.val
            pretty-json-comma => *if=addColon(i)
            pretty-json-copy => @copy=copyKeyVal(item, addColon(i))

          pretty-json-arr => *if=item.type == 'arr'   :obj=item   :colon=addColon(i)
          
          pretty-json-obj => *if=item.type == 'obj'   :obj=item   :colon=addColon(i)
          
      .pj-r2
        pretty-json-square-right
        pretty-json-comma => *if=colon
    `

})
Load.VueComponent('pretty-json-obj', {
  props: {
    obj: { type: PrettyJson.Obj, request: true },
    colon: { type: Boolean, request: true }
  },
  data: _ => ({
    display: true
  }),
  methods: {
    addColon(i) {
      return i < this.obj.keyVals.length - 1
    },
    copyObj () {
      copy(this.obj.toStructString(), _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
    },
    copyKeyVal (key, item, colon) {
      if (!['null', 'num', 'str', 'bool'].includes(item.type)) return Toastr.failure('複製失敗')
      copy(`"${key}": ${item.toStructString()}${colon ? ',' : ''}`, _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
    }
  },
  template: `
    .pj-obj
      div.pj-r0 => @click=display=!display
        label
          slot => name=key
          pretty-json-curly-left
          pretty-json-more => *if=!display
        pretty-json-copy => @copy=copyObj

      .pj-r1 => *if=display
        div => *for=({ key, val: item }, i) in obj.keyVals   :key=i
          .pj-kvs => *if=['null', 'num', 'str', 'bool'].includes(item.type)
            pretty-json-key => :val=key
            pretty-json-colon
            pretty-json-null => *if=item.type == 'null'
            pretty-json-num => *if=item.type == 'num'   :val=item.val
            pretty-json-str => *if=item.type == 'str'   :val=item.val
            pretty-json-bool => *if=item.type == 'bool'   :val=item.val
            pretty-json-comma => *if=addColon(i)
            pretty-json-copy => @copy=copyKeyVal(key, item, addColon(i))


          pretty-json-arr => *if=item.type == 'arr'   :obj=item   :colon=addColon(i)
            template => slot=key
              pretty-json-key => :val=key
              pretty-json-colon

          pretty-json-obj => *if=item.type == 'obj'   :obj=item   :colon=addColon(i)
            template => slot=key
              pretty-json-key => :val=key
              pretty-json-colon

      .pj-r2
        pretty-json-curly-right
        pretty-json-comma => *if=colon
  `
})

Load.VueComponent('role-unit', {
  props: {
    request: { type: Request, request: true }
  },
  methods: {
  },
  computed: {
    responseRawJsonPretty() {
      return this.request
        && this.request.response
        && this.request.response.raw
        && this.request.response.raw.json
        && this.request.response.raw.json.pretty
          ? this.request.response.raw.json.pretty
          : null
    }
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
          div.method
            span => *text=request.method.toUpperCase()   :class=request.method.toString()
          div.paths
            span => *for=(path, i) in request.url.paths   :key=i   *text=path   :class={_token_dynamic: path.isDynamic}

        .header => *if=request.header.data.length
          label.row._arr => :class={_open: request.header.display}   @click=request.header.toggleDisplay()
            b => *text='標題'   :subtitle='（Header）'

          .kvs => *if=request.header.display
            .kv => *for=({ key, val },i) in request.header.data   :key=i
              label
                b => *text=key   :class={_token_dynamic: key.isDynamic}
              label
                span => *text=val   :class={_token_dynamic: val.isDynamic}

        .payload => *if=request.payload
          label.row._arr => :class={_open: request.payload.display}   @click=request.payload.toggleDisplay()
            b => *text='內文'   :subtitle='（Payload）'
            span => *text=request.payload

          template => *if=request.payload.display
            .kvs => *if=request.payload.type == 'form'
              .kv => *for=({ key, val }, i) in request.payload.data   :key=i
                label
                  b => *text=key   :class={_token_dynamic: key.isDynamic}
                label
                  span => *text=val   :class={_token_dynamic: val.isDynamic}

        .rule
          label.row._arr => :class=request.rule.display ? '_open' : ''   @click=request.rule.toggleDisplay()
            b => *text='規則'   :subtitle='（Rule）'

          div.info => *if=request.rule.display
            segmented.pick => :items=['測試', '存取']   :index=request.rule.index   @click=i=>request.rule.index=i

            .test => *if=request.rule.showTest
              test-rule => :description=request.rule.test ? request.rule.test.description('回應') : null
            
            .kvs => *if=request.rule.showSave
              .kv => *for=(save, i) in request.rule.saves   :key=i
                label
                  b => *text=save.var
                label
                  span => *text=save.key

        .response
          label.row._arr => :class=request.response.display ? '_open' : ''   @click=request.response.toggleDisplay()
            b => *text='回應'   :subtitle='（Response）'

          div.info => *if=request.response.display
            segmented.pick => :items=['美化', '原始']   :index=request.response.index   @click=i=>request.response.index=i

            .pretty => *if=request.response.showPretty
              .pretty-json => *if=responseRawJsonPretty
                pretty-json-obj  => *if=responseRawJsonPretty.type == 'obj'   :obj=responseRawJsonPretty
                pretty-json-arr  => *if=responseRawJsonPretty.type == 'arr'   :obj=responseRawJsonPretty
                pretty-json-null => *if=responseRawJsonPretty.type == 'null'
                pretty-json-num  => *if=responseRawJsonPretty.type == 'num'   :val=responseRawJsonPretty.val
                pretty-json-str  => *if=responseRawJsonPretty.type == 'str'   :val=responseRawJsonPretty.val
                pretty-json-bool => *if=responseRawJsonPretty.type == 'bool'   :val=responseRawJsonPretty.val
              .pretty-json => *else
                pretty-json-empty

            .origin => *if=request.response.showOrigin
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
        display: false,
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
        display: false,
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
      rule: {
        display: false,
        index: 0,
        test: {
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
        saves: [
          { key: 'order', var: 'order' },
          { key: 'order.id', var: 'order-id' },
          { key: 'items', var: 'items' },
          { key: 'items[0]', var: 'item0' },
          { key: 'items[0].id', var: 'item0-id' },
          { key: 'items[0].name', var: 'item0-name' },
        ]
      },
      response: {
        display: true,
        // raw: 'a',
        // raw: 1,
        // raw: [],
        // raw: null,
        // raw: false,
        // raw: true,
        // raw: {},
        raw: undefined,
        // raw: '{"string":"這是一個字串","number":42,"boolean":true,"array":["元素1",2,false,{"nested_key":"nested_value"},["nested","array"],null],"object":{"key1":"value1","key2":123,"key3":{"nested_key":"nested_value"},"key4":["a","b",{"nested_object_in_array":true}],"key_with_null_value":null},"null_value":null}',
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
