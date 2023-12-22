/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Request = function(obj) {
  if (!(this instanceof Request))
    return new Request(obj)

  this._method = Request.Method(obj.method)
  this._header = Request.Header(obj.header)
  this._payload = Request.Payload.Form(obj.payload)
  this._testing = Request.Testing(obj.testing)
  this._display = obj.display

}

Object.defineProperty(Request.prototype, 'method', { get () { return this._method } })
Object.defineProperty(Request.prototype, 'header', { get () { return this._header } })
Object.defineProperty(Request.prototype, 'payload', { get () { return this._payload } })
Object.defineProperty(Request.prototype, 'testing', { get () { return this._testing } })
Object.defineProperty(Request.prototype, 'display', { get () { return this._display } })
Request.prototype.toggle = function() { this._display = !this._display; return this }

Request.Method = function(method) {
  if (!(this instanceof Request.Method))
    return new Request.Method(method)
  this._val = ['get', 'post', 'put', 'delete'].includes(method) ? method : 'get'
}
Request.Method.prototype.toString = function() { return this._val.toLowerCase() }
Request.Method.prototype.toUpperCase = function() { return this._val.toUpperCase() }

Request.Header = function(obj) {
  if (!(this instanceof Request.Header))
    return new Request.Header(obj)

  this._display = obj.display
  this._kvs = []

  for (let key in obj.kv)
    this._kvs.push({ key, val: obj.kv[key] })
}
Object.defineProperty(Request.Header.prototype, 'display', { get () { return this._display } })
Object.defineProperty(Request.Header.prototype, 'kvs', { get () { return this._kvs } })
Request.Header.prototype.toggle = function() { this._display = !this._display; return this }


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

Request.Method.prototype.toString = function() { return this._val.toLowerCase() }
Request.Method.prototype.toUpperCase = function() { return this._val.toUpperCase() }
Object.defineProperty(Request.Payload.prototype, 'type', { get () { return this._type } })
Object.defineProperty(Request.Payload.prototype, 'display', { get () { return this._display } })
Request.Payload.prototype.toggle = function() { this._display = !this._display; return this }

Request.Payload.Form = function(obj) {
  if (!(this instanceof Request.Payload.Form))
    return new Request.Payload.Form(obj)
  else
    Request.Payload.call(this, obj.display, 'form')

  this._kvs = []

  for (let key in obj.kv)
    this._kvs.push({ key, val: obj.kv[key] })
}
Request.Payload.Form.prototype = Object.create(Request.Payload.prototype)
Object.defineProperty(Request.Payload.Form.prototype, 'kvs', { get () { return this._kvs } })

Request.Payload.RawJson = function(obj) {
  if (!(this instanceof Request.Payload.RawJson))
    return new Request.Payload.RawJson(obj)
  else
    Request.Payload.call(this, obj.display, 'rawJson')
}
Request.Payload.RawJson.prototype = Object.create(Request.Payload.prototype)


Request.Testing = function(obj) {
  if (!(this instanceof Request.Testing))
    return new Request.Testing(obj)

  this._display = obj.display
  this._rule = Request.Testing.ruleDispatch(obj.rule)
}
Object.defineProperty(Request.Testing.prototype, 'display', { get () { return this._display } })
Object.defineProperty(Request.Testing.prototype, 'rule', { get () { return this._rule } })
Request.Testing.prototype.toggle = function() { this._display = !this._display; return this }
Request.Testing.prototype.description = function() {
  return this.rule === null
    ? Request.Testing.Description('回應結果不需要測試')
    : this.rule.description('回應結果')
  // const strs = ['回應結果']
  
  // // strs.push(this.rule.optional ? '可以不存在或者為 null，如果存在或者不是 null 時，則要' : '必須要')

  // // this.rule instanceof Request.Testing.Num && strs.push('為「數字」格式')
  // // this.rule instanceof Request.Testing.Str && strs.push('為「字串」格式')
  // // this.rule instanceof Request.Testing.Bool && strs.push('為「布林值」格式')
  // // this.rule instanceof Request.Testing.Arr && strs.push('為「陣列」格式')
  // // this.rule instanceof Request.Testing.Obj && strs.push('為「Json」格式')
  //   // : `回應結果必須為 this.rule.description()`
  // return `${strs.join('')}，${this.rule.description()}`
}
Request.Testing.Description = function(title, children = []) {
  if (!(this instanceof Request.Testing.Description))
    return new Request.Testing.Description(title, children)
  this._title = title
  this._children = children
}
Object.defineProperty(Request.Testing.Description.prototype, 'title', { get () { return this._title } })
Object.defineProperty(Request.Testing.Description.prototype, 'children', { get () { return this._children } })

Request.Testing.Num = function(obj) {
  if (!(this instanceof Request.Testing.Num))
    return new Request.Testing.Num(obj)

  this._val = undefined
  this._min = undefined
  this._max = undefined
  this._optional = false

  if (typeof obj != 'object' || obj === null || Array.isArray(obj))
    return

  this._val = obj.val === undefined || typeof obj.val != 'number' ? undefined : obj.val
  this._min = obj.min === undefined || typeof obj.min != 'number' ? undefined : obj.min
  this._max = obj.max === undefined || typeof obj.max != 'number' ? undefined : obj.max
  this._optional = obj.optional === undefined || typeof obj.optional != 'boolean' ? false : obj.optional
}
Object.defineProperty(Request.Testing.Num.prototype, 'title', { get () { return '數字' } })
Object.defineProperty(Request.Testing.Num.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Request.Testing.Num.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Request.Testing.Num.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Request.Testing.Num.prototype, 'optional', { get () { return this._optional } })
Request.Testing.Num.prototype.description = function(title) {
  title = `「${title}」${this.optional ? '可以不存在或者為 null，如果存在或者不是 null 時，則' : '必須'}要為「${this.title}」格式`

  if (this.val !== undefined) {
    title += `，值需等於「${this.val}」`
  } else {
    this.min === undefined || (title += `，需大於等於「${this.min}」`)
    this.max === undefined || (title += `，需小於等於「${this.max}」`)
  }

  return Request.Testing.Description(title)
}
Request.Testing.Str = function(obj) {
  if (!(this instanceof Request.Testing.Str))
    return new Request.Testing.Str(obj)

  this._val = undefined
  this._min = undefined
  this._max = undefined
  this._len = undefined
  this._optional = false

  if (typeof obj != 'object' || obj === null || Array.isArray(obj))
    return

  this._val = obj.val === undefined || typeof obj.val != 'string' ? undefined : obj.val
  this._len = obj.len === undefined || typeof obj.len != 'number' ? undefined : obj.len
  this._min = obj.min === undefined || typeof obj.min != 'number' ? undefined : obj.min
  this._max = obj.max === undefined || typeof obj.max != 'number' ? undefined : obj.max
  this._optional = obj.optional === undefined || typeof obj.optional != 'boolean' ? false : obj.optional
}
Object.defineProperty(Request.Testing.Str.prototype, 'title', { get () { return '字串' } })
Object.defineProperty(Request.Testing.Str.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Request.Testing.Str.prototype, 'len', { get () { return this._len } })
Object.defineProperty(Request.Testing.Str.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Request.Testing.Str.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Request.Testing.Str.prototype, 'optional', { get () { return this._optional } })

Request.Testing.Str.prototype.description = function(title) {
  title = `「${title}」${this.optional ? '可以不存在或者為 null，如果存在或者不是 null 時，則' : '必須'}要為「${this.title}」格式`

  if (this.val !== undefined) {
    title += `，值需等於「${this.val}」`
  } else if (this.len !== undefined) {
    title += `，長度需等於「${this.val}」`
  } else { 
    this.min === undefined || (title += `，長度需大於等於「${this.min}」`)
    this.max === undefined || (title += `，長度需小於等於「${this.max}」`)
  }

  return Request.Testing.Description(title)
}
Request.Testing.Bool = function(obj) {
  if (!(this instanceof Request.Testing.Bool))
    return new Request.Testing.Bool(obj)

  this._val = undefined
  this._optional = false

  if (typeof obj != 'object' || obj === null || Array.isArray(obj))
    return

  this._val = obj.val === undefined || typeof obj.val != 'boolean' ? undefined : obj.val
  this._optional = obj.optional === undefined || typeof obj.optional != 'boolean' ? false : obj.optional
}
Object.defineProperty(Request.Testing.Bool.prototype, 'title', { get () { return '布林值' } })
Object.defineProperty(Request.Testing.Bool.prototype, 'val', { get () { return this._val } })
Object.defineProperty(Request.Testing.Bool.prototype, 'optional', { get () { return this._optional } })

Request.Testing.Bool.prototype.description = function(title) {
  title = `「${title}」${this.optional ? '可以不存在或者為 null，如果存在或者不是 null 時，則' : '必須'}要為「${this.title}」格式`
  this.val === undefined || (title += `，值需等於「${this.val ? 'true' : 'false'}」`)
  return Request.Testing.Description(title)
}
Request.Testing.Arr = function(obj) {
  if (!(this instanceof Request.Testing.Arr))
    return new Request.Testing.Arr(obj)

  this._element = Request.Testing.ruleDispatch(undefined)
  this._len = undefined
  this._min = undefined
  this._max = undefined
  this._optional = false

  if (typeof obj != 'object' || obj === null || Array.isArray(obj))
    return

  this._element = Request.Testing.ruleDispatch(obj.element)
  this._min = obj.min === undefined || typeof obj.min != 'number' ? undefined : obj.min
  this._max = obj.max === undefined || typeof obj.max != 'number' ? undefined : obj.max
  this._len = obj.len === undefined || typeof obj.len != 'number' ? undefined : obj.len
  this._optional = obj.optional === undefined || typeof obj.optional != 'boolean' ? false : obj.optional
}
Object.defineProperty(Request.Testing.Arr.prototype, 'title', { get () { return '陣列' } })
Object.defineProperty(Request.Testing.Arr.prototype, 'element', { get () { return this._element } })
Object.defineProperty(Request.Testing.Arr.prototype, 'len', { get () { return this._len } })
Object.defineProperty(Request.Testing.Arr.prototype, 'min', { get () { return this._min } })
Object.defineProperty(Request.Testing.Arr.prototype, 'max', { get () { return this._max } })
Object.defineProperty(Request.Testing.Arr.prototype, 'optional', { get () { return this._optional } })

Request.Testing.Arr.prototype.description = function(title) {
  title = `「${title}」${this.optional ? '可以不存在或者為 null，如果存在或者不是 null 時，則' : '必須'}要為「${this.title}」格式`
  
  if (this.len !== undefined) {
    title += `，長度需等於「${this.len}」`
  } else { 
    this.min === undefined || (title += `，長度需大於等於「${this.min}」`)
    this.max === undefined || (title += `，長度需小於等於「${this.max}」`)
  }

  const children = []
  if (this.element === null) {
    title += `，元素類型不需要檢查`
  } else {
    const { title: t, children: s } = this.element.description('元素')
    title += `，${t}`
    children.push(...s)
  }

  return Request.Testing.Description(title, children)
}
Request.Testing.Obj = function(obj) {
  if (!(this instanceof Request.Testing.Obj))
    return new Request.Testing.Obj(obj)

  this._struct = {}
  this._optional = false

  if (typeof obj != 'object' || obj === null || Array.isArray(obj))
    return

  this._optional = obj.optional === undefined || typeof obj.optional != 'boolean' ? false : obj.optional
  
  let struct = obj.struct === undefined || typeof obj.struct != 'object' || obj.struct === null || Array.isArray(obj.struct) ? {} : obj.struct
  for (let key in struct)
    this._struct[key] = Request.Testing.ruleDispatch(struct[key])
}
Object.defineProperty(Request.Testing.Obj.prototype, 'title', { get () { return 'JSON' } })
Object.defineProperty(Request.Testing.Obj.prototype, 'struct', { get () { return this._struct } })
Object.defineProperty(Request.Testing.Obj.prototype, 'optional', { get () { return this._optional } })

Request.Testing.Obj.prototype.description = function(title) {
  const keys = Object.keys(this.struct)
  title = `「${title}」${this.optional ? '可以不存在或者為 null，如果存在或者不是 null 時，則' : '必須'}要為「${this.title}」格式`

  if (keys.length)
    title += `，結構中的 ${keys.join('、')} 需要檢查`
  else
    title += `，結構內容完全不用檢查`

  const children = []
  for (let key of keys)
    children.push(this.struct[key].description(key))

  return Request.Testing.Description(title, children)
}

Request.Testing.ruleDispatch = function(obj) {
  if (typeof obj != 'object' || obj === null || Array.isArray(obj)) return null
  if (obj.type == 'num') return Request.Testing.Num(obj)
  if (obj.type == 'str') return Request.Testing.Str(obj)
  if (obj.type == 'bool') return Request.Testing.Bool(obj)
  if (obj.type == 'arr') return Request.Testing.Arr(obj)
  if (obj.type == 'obj') return Request.Testing.Obj(obj)
  return null
}

Load.VueComponent('testing-description', {
  props: {
    description: { type: Request.Testing.Description, request: true }
  },
  computed: {
  },
  template: `
    div.testing-description
      span => *text=description.title + '。'
      ul => *if=description.children.length
        li => *for=(child, i) in description.children   :key=i
          testing-description => :description=child`
})

Load.Vue({
  data: {
    request: Request({
      display: true,
      method: 'post',
      header: {
        display: true,
        kv: {
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9kZXYtYXBpLmlkcmlwLmNvZmZlZVwvYXV0aFwvbG9naW4iLCJpYXQiOjE3MDI4ODc1NzEsImV4cCI6MTcwODA3MTU3MSwibmJmIjoxNzAyODg3NTcxLCJqdGkiOiJWbWVJY1NXakZxaVpFZEZCIiwic3ViIjo1NjE0LCJwcnYiOiJhZmQwZmQ5YmRkOWFjNzJmZjM5ODM0MWYxZDYyODQwY2JmNGM3MTY3In0.xcmOcBh3n-JsoVNSICdS8LkOWYHpLFiYbUirmnN3mp0'
        }
      },
      payload: {
        display: true,
        type: 'form',
        kv: {
          type: 'mobile',
          username: 'oa.wu@idrip.coffee',
          password: '123',
        }
      },
      testing: {
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
        }
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
                .role-unit
                  header => :class=request.display ? '_open' : ''
                    i._icon-api
                    div
                      b => *text='登入前台'
                      span => *text='用戶使用 E-Mail 登入'
                    label => @click=request.toggle()

                  .body.api => *if=request.display
                    .method
                      .row
                        span => *text='方式'
                        b => *text=request.method.toUpperCase()

                    .header => *if=request.header.kvs.length
                      label.row => :class=request.header.display ? '_open' : ''   @click=request.header.toggle()
                        span => *text='標題'

                      .kvs => *if=request.header.display
                        .kv => *for=({ key, val },i) in request.header.kvs   :key=i
                          label => *text=key
                          label => *text=val

                    .payload
                      label.row => :class=request.payload.display ? '_open' : ''   @click=request.payload.toggle()
                        span => *text='內文'
                        b => *text=request.payload

                      template => *if=request.payload.display
                        .kvs => *if=request.payload.type == 'form'
                          .kv => *for=({ key, val },i) in request.payload.kvs   :key=i
                            label => *text=key
                            label => *text=val

                    .testing
                      label.row => :class=request.testing.display ? '_open' : ''   @click=request.testing.toggle()
                        span => *text='測試'

                      .testing.text => *if=request.testing.display
                        testing-description => :description=request.testing.description()


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
