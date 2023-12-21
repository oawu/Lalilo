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
  this._display = obj.display

}

Object.defineProperty(Request.prototype, 'method', { get () { return this._method } })
Object.defineProperty(Request.prototype, 'header', { get () { return this._header } })
Object.defineProperty(Request.prototype, 'payload', { get () { return this._payload } })
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

  for (let { key, val, desc = null } of obj.kvs)
    if (key !== '')
      this._kvs.push({ key, val, description: desc })
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

  for (let { key, val, desc = null } of obj.kvs)
    if (key !== '')
      this._kvs.push({ key, val, description: desc })
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


Load.Vue({
  data: {
    request: Request({
      display: true,
      method: 'post',
      header: {
        display: true,
        kvs: [
          { key: 'Authorization', val: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9kZXYtYXBpLmlkcmlwLmNvZmZlZVwvYXV0aFwvbG9naW4iLCJpYXQiOjE3MDI4ODc1NzEsImV4cCI6MTcwODA3MTU3MSwibmJmIjoxNzAyODg3NTcxLCJqdGkiOiJWbWVJY1NXakZxaVpFZEZCIiwic3ViIjo1NjE0LCJwcnYiOiJhZmQwZmQ5YmRkOWFjNzJmZjM5ODM0MWYxZDYyODQwY2JmNGM3MTY3In0.xcmOcBh3n-JsoVNSICdS8LkOWYHpLFiYbUirmnN3mp0' }
        ]
      },
      payload: {
        display: true,
        type: 'form',
        kvs: [
          { key: 'type', val: 'mobile' },
          { key: 'username', val: 'oa.wu@idrip.coffee' },
          { key: 'password', val: '123' },
        ]
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
                  
                  .body.api
                    .method
                      .row
                        span => *text='方式'
                        b => *text=request.method.toUpperCase()

                    .header => *if=request.header.kvs.length
                      label.row => :class=request.header.display ? '_open' : ''   @click=request.header.toggle()
                        span => *text='標題'

                      .kvs
                        .kv => *for=({ key, val, description },i) in request.header.kvs   :key=i
                          label => *text=key
                          label => *text=val

                    .payload
                      label.row => :class=request.payload.display ? '_open' : ''   @click=request.payload.toggle()
                        span => *text='內文'
                        b => *text=request.payload
                      
                      .kvs => *if=request.payload.type == 'form'
                        .kv => *for=({ key, val, description },i) in request.payload.kvs   :key=i
                          label => *text=key
                          label => *text=val



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
