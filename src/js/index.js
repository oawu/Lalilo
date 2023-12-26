/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

// const Request = function(obj) {
//   if (!(this instanceof Request))
//     return new Request(obj)

//   const isObj = Helper.Type.isObject(obj)

//   this._display = isObj && typeof obj.display == 'boolean' ? obj.display : false
//   this._displayVar = isObj && typeof obj.displayVar == 'boolean' ? obj.displayVar : false

//   this._subtitle = isObj && typeof obj.subtitle == 'string' && obj.subtitle !== '' ? obj.subtitle : ''

//   this._url = Request.Url(
//     isObj && Helper.Type.isObject(obj.url) && Array.isArray(obj.url.paths)
//       ? obj.url.paths
//       : [])

//   this._method = Request.Method(
//     isObj && typeof obj.method == 'string' && ['get', 'post', 'put', 'delete'].includes(obj.method.toLowerCase())
//       ? obj.method
//       : 'get')

//   this._header = Request.Header(
//     isObj && Helper.Type.isObject(obj.header) && typeof obj.header.display == 'boolean'
//       ? obj.header.display
//       : false,
//     isObj && Helper.Type.isObject(obj.header) && Array.isArray(obj.header.data)
//       ? obj.header.data
//       : []
//   )

//   this._payload = Request.Payload.dispatch(isObj
//     ? obj.payload
//     : null)

//   this._rule = Request.Rule(
//     isObj && Helper.Type.isObject(obj.rule) && typeof obj.rule.display == 'boolean'
//       ? obj.rule.display
//       : false,

//     isObj && Helper.Type.isObject(obj.rule) && typeof obj.rule.index == 'number' && obj.rule.index >= 0 && obj.rule.index <= 1
//       ? obj.rule.index
//       : 0,

//     isObj && Helper.Type.isObject(obj.rule)
//       ? Request.Rule.Test.dispatch(obj.rule.test)
//       : null,

//     isObj && Helper.Type.isObject(obj.rule) && Array.isArray(obj.rule.saves)
//       ? obj.rule.saves.map(save => Helper.Type.isObject(save) && typeof save.key == 'string' && save.key !== '' && typeof save.var == 'string' && save.var !== ''
//         ? Request.Rule.Save(save.key, save.var)
//         : null).filter(save => save !== null)
//       : []
//   )

//   this._response = Request.Response(
//     isObj && Helper.Type.isObject(obj.response) && typeof obj.response.display == 'boolean'
//       ? obj.response.display
//       : false,

//     isObj && Helper.Type.isObject(obj.response) && typeof obj.response.index == 'number' && obj.response.index >= 0 && obj.response.index <= 1
//       ? obj.rule.index
//       : 0,

//     Request.Response.Body(isObj && Helper.Type.isObject(obj.response) ? obj.response.body : null),
//   )

//   this._title = isObj && typeof obj.title == 'string' && obj.title !== '' ? obj.title : `[${this.method.toUpperCase()}] ${this.url.toString()}`
// }

// Object.defineProperty(Request.prototype, 'url', { get () { return this._url } })
// Object.defineProperty(Request.prototype, 'method', { get () { return this._method } })
// Object.defineProperty(Request.prototype, 'header', { get () { return this._header } })
// Object.defineProperty(Request.prototype, 'payload', { get () { return this._payload } })
// Object.defineProperty(Request.prototype, 'rule', { get () { return this._rule } })
// Object.defineProperty(Request.prototype, 'response', { get () { return this._response } })
// Object.defineProperty(Request.prototype, 'display', { get () { return this._display } })
// Object.defineProperty(Request.prototype, 'displayVar', { get () { return this._displayVar } })
// Object.defineProperty(Request.prototype, 'title', { get () { return this._title } })
// Object.defineProperty(Request.prototype, 'subtitle', { get () { return this._subtitle } })

// Object.defineProperty(Request.prototype, 'vars', { get () {
//   return [...this._url.vars, ...this._header.vars, ...this._payload.vars]
// } })
// Object.defineProperty(Request.prototype, 'forceVars', { get () {
//   const vars = []
//   for (let t of this.vars.filter(({ val }) => val === null))
//     vars.push(t)
//   return vars
// } })

// Request.prototype.toggleDisplay = function() { this._display = !this._display; return this }
// Request.prototype.toggleDisplayVar = function() { this._displayVar = !this._displayVar; return this }
// Request.Token = function(type) {
//   if (!(this instanceof Request.Token))
//     return new Request.Token(type)

//   this._type = type
// }
// Object.defineProperty(Request.Token.prototype, 'type', { get () { return this._type } })
// Object.defineProperty(Request.Token.prototype, 'isVar', { get () { return this.type == 'var' } })
// Object.defineProperty(Request.Token.prototype, 'isRand', { get () { return this.type == 'rand' } })
// Object.defineProperty(Request.Token.prototype, 'isStr', { get () { return this.type == 'str' } })
// Object.defineProperty(Request.Token.prototype, 'isNum', { get () { return this.type == 'num' } })
// Object.defineProperty(Request.Token.prototype, 'isDynamic', { get () { return this.isVar || this.isRand } })

// Request.Token.Str = function(val) {
//   if (!(this instanceof Request.Token.Str))
//     return new Request.Token.Str(val)
//   else
//     Request.Token.call(this, 'str')

//   this._val = val
// }
// Request.Token.Str.prototype = Object.create(Request.Token.prototype)
// Request.Token.Str.prototype.toString = function() { return `${this.val}` }
// Object.defineProperty(Request.Token.Str.prototype, 'val', { get () { return this._val } })
// Object.defineProperty(Request.Token.Str.prototype, 'description', { get () { return `${this.val}` } })

// Request.Token.Num = function(val) {
//   if (!(this instanceof Request.Token.Num))
//     return new Request.Token.Num(val)
//   else
//     Request.Token.call(this, 'num')

//   this._val = val
// }
// Request.Token.Num.prototype = Object.create(Request.Token.prototype)
// Request.Token.Num.prototype.toString = function() { return `${this.val}` }
// Object.defineProperty(Request.Token.Num.prototype, 'val', { get () { return this._val } })
// Object.defineProperty(Request.Token.Num.prototype, 'description', { get () { return `${this.val}` } })

// Request.Token.Var = function(type, key, val) {
//   if (!(this instanceof Request.Token.Var))
//     return new Request.Token.Var(type, key, val)
//   else
//     Request.Token.call(this, 'var')

//   this._key = key
//   this._val = val
//   this._subtype = type
// }
// Request.Token.Var.prototype = Object.create(Request.Token.prototype)
// Request.Token.Var.prototype.toString = function() { return `變數：${this.key}` }

// Object.defineProperty(Request.Token.Var.prototype, 'key', { get () { return this._key } })
// Object.defineProperty(Request.Token.Var.prototype, 'val', { get () { return this._val } })
// Object.defineProperty(Request.Token.Var.prototype, 'valString', { get () {
//   if (this.val === null)
//     return `預設值：?`
//   if (typeof this.val == 'string')
//     return `預設值："${this.val}"`
//   if (typeof this.val == 'number')
//     return `預設值：${this.val}`
//   if (Helper.Type.isObject(this.val))
//     return `預設值：${this.val}`
  
//   return `預設值：?`
// } })
// Object.defineProperty(Request.Token.Var.prototype, 'subtype', { get () { return this._subtype } })
// Object.defineProperty(Request.Token.Var.prototype, 'description', { get () { return `{{V(${this.key})}}` } })

// Request.Token.Rand = function(type, title) {
//   if (!(this instanceof Request.Token.Rand))
//     return new Request.Token.Rand(type, title)
//   else
//     Request.Token.call(this, 'rand')

//   this._subtype = type
//   this._title = title
// }
// Request.Token.Rand.prototype = Object.create(Request.Token.prototype)
// Request.Token.Rand.prototype.toString = function() { return `隨機：${this.title}` }

// Object.defineProperty(Request.Token.Rand.prototype, 'subtype', { get () { return this._subtype } })
// Object.defineProperty(Request.Token.Rand.prototype, 'title', { get () { return this._title } })
// Object.defineProperty(Request.Token.Rand.prototype, 'description', { get () { return `{{R(${this.subtype})}}` } })

// Request.Token.dispatch = function(obj) {
//   if (!Helper.Type.isObject(obj) || typeof obj.type != 'string')
//     return null

//   if (obj.type == 'str' && typeof obj.val == 'string')
//     return Request.Token.Str(obj.val)

//   if (obj.type == 'num' && typeof obj.val == 'number')
//     return Request.Token.Num(obj.val)

//   if (obj.type == 'var'
//       && Helper.Type.isObject(obj.val)
//       && typeof obj.val.type == 'string' && obj.val.type !== '' && ['str', 'num', 'obj'].includes(obj.val.type)
//       && typeof obj.val.key == 'string' && obj.val.key !== ''
//   ) return Request.Token.Var(obj.val.type, obj.val.key,
//     (obj.val.type == 'str' && typeof obj.val.val == 'string') ||
//     (obj.val.type == 'num' && typeof obj.val.val == 'number') ||
//     (obj.val.type == 'obj' && Helper.Type.isObject(obj.val.val))
//      ? obj.val.val
//      : null)

//   if (obj.type == 'rand'
//       && Helper.Type.isObject(obj.val)
//       && typeof obj.val.type == 'string' && obj.val.type !== '' && ['uuid', 'name', 'email', 'phone', 'address'].includes(obj.val.type)
//       && typeof obj.val.title == 'string' && obj.val.title !== ''
//   ) return Request.Token.Rand(obj.val.type, obj.val.title)

//  return null
// }


// Request.Rule.Save = function(key, v) {
//   if (!(this instanceof Request.Rule.Save))
//     return new Request.Rule.Save(key, v)
  
//   this._key = key
//   this._var = v
// }
// Object.defineProperty(Request.Rule.Save.prototype, 'key', { get () { return this._key } })
// Object.defineProperty(Request.Rule.Save.prototype, 'var', { get () { return this._var } })


// Request.Response = function(display, index, body) {
//   if (!(this instanceof Request.Response))
//     return new Request.Response(display, index, body)

//   this._display = display
//   this._index = index
//   this._body = body
// }
// Object.defineProperty(Request.Response.prototype, 'display', { get () { return this._display } })
// Object.defineProperty(Request.Response.prototype, 'body', { get () { return this._body } })
// Object.defineProperty(Request.Response.prototype, 'index', { get () { return this._index }, set (val) { return this._index = val >= 0 && val <= 1 ? val : 0 } })
// Object.defineProperty(Request.Response.prototype, 'showPretty', { get () { return this.index == 0 } })
// Object.defineProperty(Request.Response.prototype, 'showOrigin', { get () { return this.index == 1 } })
// Request.Response.prototype.toggleDisplay = function() { this._display = !this._display; return this }

// Request.Response.Body = function(data) {
//   if (!(this instanceof Request.Response.Body))
//     return new Request.Response.Body(data)

//   if (Helper.Type.isObject(data)) {
//     this._text = JSON.stringify(data)
//     this._json = { val: data, pretty: PrettyJson.dispatch(data) }
//     return this._error = undefined
//   }

//   if (Array.isArray(data)) {
//     this._text = JSON.stringify(data)
//     this._json = { val: data, pretty: PrettyJson.dispatch(data) }
//     return this._error = undefined
//   }

//   const type = typeof data

//   if (data === null || ['number', 'string', 'boolean'].includes(type)) {
//     if (data === null) this._text = 'null'
//     if (type == 'string') this._text = `${data}`
//     if (type == 'number') this._text = `${data}`
//     if (type == 'boolean') this._text = data ? 'true' : 'false'

//     this._json = undefined
//     this._error = undefined
//     let val = undefined
//     try {
//       val = JSON.parse(data)
//     } catch (e) {
//       this._error = e
//       val = undefined
//     }

//     if (this._error === undefined)
//       this._json = { val, pretty: PrettyJson.dispatch(val) }

//     return this._error
//   }

//   this._text = undefined
//   this._json = undefined
//   return this._error = undefined
// }
// Object.defineProperty(Request.Response.Body.prototype, 'text', { get () { return this._text } })
// Object.defineProperty(Request.Response.Body.prototype, 'json', { get () { return this._json } })
// Object.defineProperty(Request.Response.Body.prototype, 'error', { get () { return this._error } })


// const PrettyJson = function (type) {
//   if (this instanceof PrettyJson) return this._type = type
//   else return new PrettyJson(type)
// }
// Object.defineProperty(PrettyJson.prototype, 'type', { get () { return this._type } })
// PrettyJson.dispatch = function(data) {
//   if (typeof data == 'string') return PrettyJson.Str(data)
//   if (typeof data == 'number') return PrettyJson.Num(data)
//   if (typeof data == 'boolean') return PrettyJson.Bool(data)
//   if (Array.isArray(data)) return PrettyJson.Arr(data.map(t => PrettyJson.dispatch(t)))
  
//   if (Helper.Type.isObject(data)) {
//     const keyVals = []
//     for (let key in data) keyVals.push(PrettyJson.Obj.KeyVal(key, PrettyJson.dispatch(data[key])))
//     return PrettyJson.Obj(keyVals)
//   }

//   return PrettyJson.Null()
// }

// PrettyJson.Null = function() {
//   if (!(this instanceof PrettyJson.Null))
//     return new PrettyJson.Null()
//   PrettyJson.call(this, 'null')
// }
// PrettyJson.Null.prototype = Object.create(PrettyJson.prototype)
// PrettyJson.Null.prototype.toString = function() { return 'null' }
// PrettyJson.Null.prototype.toStructString = function() { return this.toString() }

// PrettyJson.Num = function(val) {
//   if (!(this instanceof PrettyJson.Num))
//     return new PrettyJson.Num(val)

//   PrettyJson.call(this, 'num')
//   this._val = val
// }
// PrettyJson.Num.prototype = Object.create(PrettyJson.prototype)
// Object.defineProperty(PrettyJson.Num.prototype, 'val', { get () { return this._val } })
// PrettyJson.Num.prototype.toString = function() { return this.val }
// PrettyJson.Num.prototype.toStructString = function() { return this.toString() }

// PrettyJson.Str = function(val) {
//   if (!(this instanceof PrettyJson.Str))
//     return new PrettyJson.Str(val)

//   PrettyJson.call(this, 'str')
//   this._val = val
// }
// PrettyJson.Str.prototype = Object.create(PrettyJson.prototype)
// Object.defineProperty(PrettyJson.Str.prototype, 'val', { get () { return this._val } })
// PrettyJson.Str.prototype.toString = function() { return `"${this.val}"` }
// PrettyJson.Str.prototype.toStructString = function() { return this.toString() }

// PrettyJson.Bool = function(val) {
//   if (!(this instanceof PrettyJson.Bool))
//     return new PrettyJson.Bool(val)

//   PrettyJson.call(this, 'bool')
//   this._val = val
// }
// PrettyJson.Bool.prototype = Object.create(PrettyJson.prototype)
// Object.defineProperty(PrettyJson.Bool.prototype, 'val', { get () { return this._val } })
// PrettyJson.Bool.prototype.toString = function() { return this.val ? 'true' : 'false' }
// PrettyJson.Bool.prototype.toStructString = function() { return this.toString() }

// PrettyJson.Arr = function(elements) {
//   if (!(this instanceof PrettyJson.Arr))
//     return new PrettyJson.Arr(elements)

//   PrettyJson.call(this, 'arr')
//   this._elements = elements
// }
// PrettyJson.Arr.prototype = Object.create(PrettyJson.prototype)
// Object.defineProperty(PrettyJson.Arr.prototype, 'elements', { get () { return this._elements } })
// PrettyJson.Arr.prototype.toString = function () { return `[${this.elements.map(e => e.toString()).join(',')}]` }
// PrettyJson.Arr.prototype.toStructString = function (level = 0) { return `[\n${this.elements.length ? `${this.elements.map(e => `${' '.repeat((level + 1) * 2)}${e.toStructString(level + 1)}`).join(',\n')}\n` : ''}${' '.repeat(level * 2)}]` }

// PrettyJson.Obj = function(keyVals) {
//   if (!(this instanceof PrettyJson.Obj))
//     return new PrettyJson.Obj(keyVals)

//   PrettyJson.call(this, 'obj')
//   this._keyVals = keyVals
// }
// PrettyJson.Obj.prototype = Object.create(PrettyJson.prototype)
// Object.defineProperty(PrettyJson.Obj.prototype, 'keyVals', { get () { return this._keyVals } })
// PrettyJson.Obj.prototype.toString = function () { return `{${this.keyVals.map(keyVal => `"${keyVal.key}":${keyVal.val.toString()}`).join(',')}}` }
// PrettyJson.Obj.prototype.toStructString = function (level = 0) { return `{\n${this.keyVals.length ? `${this.keyVals.map(keyVal => `${' '.repeat((level + 1) * 2)}"${keyVal.key}": ${keyVal.val.toStructString(level + 1)}`).join(',\n')}\n` : ''}${' '.repeat(level * 2)}}` }

// PrettyJson.Obj.KeyVal = function(key, val) {
//   if (!(this instanceof PrettyJson.Obj.KeyVal))
//     return new PrettyJson.Obj.KeyVal(key, val)
//   this._key = key
//   this._val = val
// }
// Object.defineProperty(PrettyJson.Obj.KeyVal.prototype, 'key', { get () { return this._key } })
// Object.defineProperty(PrettyJson.Obj.KeyVal.prototype, 'val', { get () { return this._val } })

Load.VueComponent('test-rule', {
  props: {
    condition: { type: Api.Rule.Test.Condition, request: true }
  },
  template: `
    .test-rule
      template => *if=condition
        label
          b.title => *text=condition.title   :class={_optional: condition.test.optional}
          span.type => *text=condition.test.typeText
          template => *if=condition.descriptions.length
            i
            span.desc => *text=condition.description
        
        ul => *if=condition.children.length
          li => *for=(child, i) in condition.children   :key=i
            test-rule => :condition=child

      template => *else
        label
          b.title => *text='回應'
          i
          span.desc => *text='不需檢查。'
`
})

// Load.VueComponent('pretty-json-count', { props: { count: { type: Number, request: true }}, template: `span.pj-count._ns => *text=count` })
// Load.VueComponent('pretty-json-copy', { template: `span.pj-copy._ns => *text='複製'   @click.stop=$emit('copy')` })
// Load.VueComponent('pretty-json-empty', { template: `span.pj-empty._ns` })
// Load.VueComponent('pretty-json-colon', { template: `span.pj-colon._ns => *text=':'` })
// Load.VueComponent('pretty-json-more', { template: `span.pj-more._ns => *text='…'` })
// Load.VueComponent('pretty-json-comma', { template: `span.pj-comma._ns => *text=','` })
// Load.VueComponent('pretty-json-square-left', { template: `span.pj-square-left._ns => *text='['` })
// Load.VueComponent('pretty-json-square-right', { template: `span.pj-square-right._ns => *text=']'` })
// Load.VueComponent('pretty-json-curly-left', { template: `span.pj-curly-left._ns => *text='{'` })
// Load.VueComponent('pretty-json-curly-right', { template: `span.pj-curly-right._ns => *text='}'` })
// Load.VueComponent('pretty-json-key', { props: { val: { type: String, request: true } }, computed: { text () { return `"${this.val}"` }}, template: `span.pj-key._ns => *text=text` })
// Load.VueComponent('pretty-json-null', { template: `span.pj-null._ns => *text='null'` })
// Load.VueComponent('pretty-json-num', { props: { val: { type: PrettyJson.Num, request: true } }, template: `span.pj-num._ns => *text=val` })
// Load.VueComponent('pretty-json-str', { props: { val: { type: PrettyJson.Str, request: true } }, computed: { text () { return `"${this.val}"` }}, template: `span.pj-str._ns => *text=text` })
// Load.VueComponent('pretty-json-bool', { props: { val: { type: PrettyJson.Bool, request: true } }, template: `span.pj-bool._ns => *text=val` })

// Load.VueComponent('pretty-json-arr', {
//   props: {
//     obj: { type: PrettyJson.Arr, request: true },
//     colon: { type: Boolean, request: true }
//   },
//   data: _ => ({
//     display: true
//   }),
//   methods: {
//     addColon(i) {
//       return i < this.obj.elements.length - 1
//     },
//     copyArr () {
//       copy(this.obj.toStructString(), _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
//     },
//     copyKeyVal (item, colon) {
//       if (!['null', 'num', 'str', 'bool'].includes(item.type)) return Toastr.failure('複製失敗')
//       copy(`${item.toStructString()}${colon ? ',' : ''}`, _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
//     }
//   },
//   template: `
//     .pj-arr
//       div.pj-r0 => @click=display=!display
//         label
//           slot => name=key
//           pretty-json-square-left
//           pretty-json-count => *if=display   :count=obj.elements.length
//           pretty-json-more => *else
//         pretty-json-copy => @copy=copyArr

//       .pj-r1 => *if=display
//         div => *for=(item, i) in obj.elements   :key=i
//           .pj-els => *if=['null', 'num', 'str', 'bool'].includes(item.type)
//             pretty-json-null => *if=item.type == 'null'
//             pretty-json-num => *if=item.type == 'num'   :val=item.val
//             pretty-json-str => *if=item.type == 'str'   :val=item.val
//             pretty-json-bool => *if=item.type == 'bool'   :val=item.val
//             pretty-json-comma => *if=addColon(i)
//             pretty-json-copy => @copy=copyKeyVal(item, addColon(i))

//           pretty-json-arr => *if=item.type == 'arr'   :obj=item   :colon=addColon(i)
          
//           pretty-json-obj => *if=item.type == 'obj'   :obj=item   :colon=addColon(i)
          
//       .pj-r2
//         pretty-json-square-right
//         pretty-json-comma => *if=colon
//     `

// })
// Load.VueComponent('pretty-json-obj', {
//   props: {
//     obj: { type: PrettyJson.Obj, request: true },
//     colon: { type: Boolean, request: true }
//   },
//   data: _ => ({
//     display: true
//   }),
//   methods: {
//     addColon(i) {
//       return i < this.obj.keyVals.length - 1
//     },
//     copyObj () {
//       copy(this.obj.toStructString(), _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
//     },
//     copyKeyVal (key, item, colon) {
//       if (!['null', 'num', 'str', 'bool'].includes(item.type)) return Toastr.failure('複製失敗')
//       copy(`"${key}": ${item.toStructString()}${colon ? ',' : ''}`, _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
//     }
//   },
//   template: `
//     .pj-obj
//       div.pj-r0 => @click=display=!display
//         label
//           slot => name=key
//           pretty-json-curly-left
//           pretty-json-more => *if=!display
//         pretty-json-copy => @copy=copyObj

//       .pj-r1 => *if=display
//         div => *for=({ key, val: item }, i) in obj.keyVals   :key=i
//           .pj-kvs => *if=['null', 'num', 'str', 'bool'].includes(item.type)
//             pretty-json-key => :val=key
//             pretty-json-colon
//             pretty-json-null => *if=item.type == 'null'
//             pretty-json-num => *if=item.type == 'num'   :val=item.val
//             pretty-json-str => *if=item.type == 'str'   :val=item.val
//             pretty-json-bool => *if=item.type == 'bool'   :val=item.val
//             pretty-json-comma => *if=addColon(i)
//             pretty-json-copy => @copy=copyKeyVal(key, item, addColon(i))


//           pretty-json-arr => *if=item.type == 'arr'   :obj=item   :colon=addColon(i)
//             template => slot=key
//               pretty-json-key => :val=key
//               pretty-json-colon

//           pretty-json-obj => *if=item.type == 'obj'   :obj=item   :colon=addColon(i)
//             template => slot=key
//               pretty-json-key => :val=key
//               pretty-json-colon

//       .pj-r2
//         pretty-json-curly-right
//         pretty-json-comma => *if=colon
//   `
// })

Load.VueComponent('role-unit', {
  props: {
    // request: { type: Request, request: true }
  },
  data: _ => ({
    api: Api({
      ctrl: {
        main: true,
        forceVar: false,
        header: false,
        payload: false,
        rule: true,
        ruleIndex: 0,
        response: true,
        responseIndex: true,
      },
      request: {
        method: 'post',
        title: '登入前台',
        subtitle: '用戶使用 E-Mail 登入',
        
        url: [
          { type: 'var', key: 'BaseURL' },
          { type: 'fix', val: 'market' },
          { type: 'fix', val: 2 },
          { type: 'fix', val: 'product' },
          { type: 'var', key: 'product-id', val: 0 },
          { type: 'fix', val: 'product' },

          { type: 'rand', key: 'name', title: '姓名' },
          { type: 'rand', key: 'email', title: 'E-Mail' },
          { type: 'rand', key: 'phone', title: '電話' },
          { type: 'rand', key: 'address', title: '地址' },
        ],

        headers: [
          {
            key: { type: 'fix', val: 'Authorization' },
            val: { type: 'var', key: 'auth-token' }
          },
          {
            key: { type: 'fix', val: 'Pid' },
            val: { type: 'var', key: 'product-id' }
          },
        ],

        payload: {
          type: 'form',
          data: [
            {
              key: { type: 'fix', val: 'type' },
              val: { type: 'fix', val: 'mobile' },
            },
            {
              key: { type: 'fix', val: 'username' },
              val: { type: 'var', key: 'auth-account' }
            },
            {
              key: { type: 'fix', val: 'password' },
              val: { type: 'var', key: 'auth-password' }
            },
            {
              key: { type: 'fix', val: 'uuid' },
              val: { type: 'rand', key: 'uuid', title: 'UUID' }
            },
          ]
        },
      },
      rule: {
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

      }
    })

    // request: Request({
    //   rule: {
    //     display: false,
    //     index: 0,
    //     test: {
    //       type: 'obj', optional: false,
    //       struct: {
    //         status: { type: 'num', optional: false, val: 200 },
    //         message: { type: 'str', optional: true },
    //         isPay: { type: 'bool', optional: true, val: false },
    //         ids: { type: 'arr', optional: false, min: 1, max: 10, element: {
    //           type: 'num', optional: false, min: 1, max: 10
    //         } },

    //         data: { type: 'obj', optional: false, struct: {
    //           id: { type: 'num', optional: false, min: 1 },
    //           ono: { type: 'str', optional: false, min: 1 },
    //           items: { type: 'arr', optional: false, min: 1, element: {
    //             type: 'obj', optional: false, min: 1, struct: {
    //               id: { type: 'num', optional: false, min: 1 },
    //             }
    //           } }
    //         } }
    //       }
    //     },
    //     saves: [
    //       { key: 'order', var: 'order' },
    //       { key: 'order.id', var: 'order-id' },
    //       { key: 'items', var: 'items' },
    //       { key: 'items[0]', var: 'item0' },
    //       { key: 'items[0].id', var: 'item0-id' },
    //       { key: 'items[0].name', var: 'item0-name' },
    //     ]
    //   },
    //   response: {
    //     display: true,

    //     info: null,
    //     headers: null,
    //     body: '{"string":"這是一個字串","number":42,"boolean":true,"array":["元素1",2,false,{"nested_key":"nested_value"},["nested","array"],null],"object":{"key1":"value1","key2":123,"key3":{"nested_key":"nested_value"},"key4":["a","b",{"nested_object_in_array":true}],"key_with_null_value":null},"null_value":null}',
    //   }
    // })
  }),
  methods: {
  },
  computed: {
    ctrl () {
      return this.api.ctrl
    },
    request () {
      return this.api.request
    },
    rule () {
      return this.api.rule
    },
    responseBodyJsonPretty() {
      return this.request
        && this.request.response
        && this.request.response.body
        && this.request.response.body.json
        && this.request.response.body.json.pretty
          ? this.request.response.body.json.pretty
          : null
    }
  },
  template: `
    .role-unit
      header => :class=ctrl.main ? '_open' : ''
        i._icon-api
        div
          b => *text=request.title
          span => *text=request.subtitle   *if=request.subtitle!==''
        label => @click=ctrl.toggleMain()

      .body.api => *if=ctrl.main
        .var => *if=request.forceVars.length
          label.row._arr._var => :class={_open: ctrl.forceVar}   @click=ctrl.toggleForceVar()
            b => *text='必要變數'   :subtitle='（' + request.forceVars.length + '）'

          .kvs => *if=ctrl.forceVar
            .kv => *for=(v, i) in request.forceVars   :key=i
              label
                b => *text=v.key
              label
                span => *text=v.default

        .url
          div.method
            span => *text=request.method.toUpperCase   :class=request.method.toLowerCase
          div.paths
            span => *for=(path, i) in request.url.paths   :key=i   *text=path.text   :class={_token_dynamic: !path.isFix}

        .header => *if=request.headers.length
          label.row._arr => :class={_open: ctrl.header}   @click=ctrl.toggleHeader()
            b => *text='標題'   :subtitle='（Header）'

          .kvs => *if=ctrl.header
            .kv => *for=({ key, val },i) in request.headers   :key=i
              label
                b => *text=key.text   :class={_token_dynamic: !key.isFix}
              label
                span => *text=val.text   :class={_token_dynamic: !val.isFix}

        .payload => *if=request.payload
          label.row._arr => :class={_open: ctrl.payload}   @click=ctrl.togglePayload()
            b => *text='內文'   :subtitle='（Payload）'
            span => *text=request.payload.text

          template => *if=ctrl.payload
            .kvs => *if=request.payload.type == 'form'
              .kv => *for=({ key, val }, i) in request.payload.data   :key=i
                label
                  b => *text=key.text   :class={_token_dynamic: !key.isFix}
                label
                  span => *text=val.text   :class={_token_dynamic: !val.isFix}

        .rule
          label.row._arr => :class=ctrl.rule ? '_open' : ''   @click=ctrl.toggleRule()
            b => *text='規則'   :subtitle='（Rule）'

          div.info => *if=ctrl.rule
            segmented.pick => :items=['測試', '存取']   :index=ctrl.ruleIndex   @click=i=>ctrl.ruleIndex=i

            .test => *if=ctrl.ruleIndex==0
              test-rule => :condition=rule.test ? rule.test.condition('回應') : null

            .kvs => *if=ctrl.ruleIndex==1
      //         .kv => *for=(save, i) in request.rule.saves   :key=i
      //           label
      //             b => *text=save.var
      //           label
      //             span => *text=save.key

      //   .response
      //     label.row._arr => :class=request.response.display ? '_open' : ''   @click=request.response.toggleDisplay()
      //       b => *text='回應'   :subtitle='（Response）'

      //     div.info => *if=request.response.display
      //       segmented.pick => :items=['Info', 'Header', 'Body']   :index=request.response.index   @click=i=>request.response.index=i

      //       .pretty => *if=request.response.showPretty
      //         .pretty-json => *if=responseBodyJsonPretty
      //           pretty-json-obj  => *if=responseBodyJsonPretty.type == 'obj'   :obj=responseBodyJsonPretty
      //           pretty-json-arr  => *if=responseBodyJsonPretty.type == 'arr'   :obj=responseBodyJsonPretty
      //           pretty-json-null => *if=responseBodyJsonPretty.type == 'null'
      //           pretty-json-num  => *if=responseBodyJsonPretty.type == 'num'   :val=responseBodyJsonPretty.val
      //           pretty-json-str  => *if=responseBodyJsonPretty.type == 'str'   :val=responseBodyJsonPretty.val
      //           pretty-json-bool => *if=responseBodyJsonPretty.type == 'bool'   :val=responseBodyJsonPretty.val
      //         .pretty-json => *else
      //           pretty-json-empty

      //       .origin => *if=request.response.showOrigin
    `
})

Load.Vue({
  data: {
    // request: Request({
    //   display: true,
    //   method: 'post',
    //   title: '登入前台',
    //   subtitle: '用戶使用 E-Mail 登入',
    //   url: {
    //     paths: [
    //       { type: 'var', val: {
    //         type: 'str',
    //         key: 'BaseURL',
    //       } },
    //       { type: 'str', val: 'market' },
    //       { type: 'num', val: 2 },
    //       { type: 'str', val: 'product' },
    //       { type: 'var', val: {
    //         type: 'num',
    //         key: 'product-id',
    //         val: 0
    //       } },
    //       { type: 'str', val: 'product' },
    //       { type: 'rand', val: {
    //         type: 'name', title: '姓名',
    //         type: 'email', title: 'E-Mail',
    //         type: 'phone', title: '電話',
    //         type: 'address', title: '地址',
    //       } },
    //     ]
    //   },
    //   header: {
    //     display: false,
    //     data: [
    //       {
    //         key: { type: 'str', val: 'Authorization' },
    //         val: { type: 'var', val: { type: 'str', key: 'auth-token'} }
    //       },
    //       {
    //         key: { type: 'str', val: 'Pid' },
    //         val: { type: 'var', val: { type: 'num', key: 'product-id'} }
    //       },
    //     ]
    //   },
    //   payload: {
    //     display: false,
    //     type: 'form',
    //     data: [
    //       {
    //         key: { type: 'str', val: 'type' },
    //         val: { type: 'str', val: 'mobile' },
    //       },
    //       {
    //         key: { type: 'str', val: 'username' },
    //         val: { type: 'var', val: { type: 'str', key: 'auth-account'} }
    //       },
    //       {
    //         key: { type: 'str', val: 'password' },
    //         val: { type: 'var', val: { type: 'str', key: 'auth-password'} }
    //       },
    //       {
    //         key: { type: 'str', val: 'uuid' },
    //         val: { type: 'rand', val: { type: 'uuid', title: 'UUID' } }
    //       },
    //     ]
    //   },
    //   rule: {
    //     display: false,
    //     index: 0,
    //     test: {
    //       type: 'obj', optional: false,
    //       struct: {
    //         status: { type: 'num', optional: false, val: 200 },
    //         message: { type: 'str', optional: true },
    //         isPay: { type: 'bool', optional: true, val: false },
    //         ids: { type: 'arr', optional: false, min: 1, max: 10, element: {
    //           type: 'num', optional: false, min: 1, max: 10
    //         } },

    //         data: { type: 'obj', optional: false, struct: {
    //           id: { type: 'num', optional: false, min: 1 },
    //           ono: { type: 'str', optional: false, min: 1 },
    //           items: { type: 'arr', optional: false, min: 1, element: {
    //             type: 'obj', optional: false, min: 1, struct: {
    //               id: { type: 'num', optional: false, min: 1 },
    //             }
    //           } }
    //         } }
    //       }
    //     },
    //     saves: [
    //       { key: 'order', var: 'order' },
    //       { key: 'order.id', var: 'order-id' },
    //       { key: 'items', var: 'items' },
    //       { key: 'items[0]', var: 'item0' },
    //       { key: 'items[0].id', var: 'item0-id' },
    //       { key: 'items[0].name', var: 'item0-name' },
    //     ]
    //   },
    //   response: {
    //     display: true,

    //     info: null,
    //     headers: null,
    //     body: '{"string":"這是一個字串","number":42,"boolean":true,"array":["元素1",2,false,{"nested_key":"nested_value"},["nested","array"],null],"object":{"key1":"value1","key2":123,"key3":{"nested_key":"nested_value"},"key4":["a","b",{"nested_object_in_array":true}],"key_with_null_value":null},"null_value":null}',
    //   }
    // })
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
                role-unit

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
