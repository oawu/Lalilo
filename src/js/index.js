/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */



Load.Vue({
  data: {
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
                  header
                    i._icon-api
                    div
                      b => *text='登入前台'
                      span => *text='用戶使用 E-Mail 登入'
                    label
                  
                  .body.api
                    .method
                      .row
                        span => *text='方式'
                        b => *text='POST'

                    .header
                      label.row._open
                        span => *text='標題'

                      .kvs
                        .kv
                          label => *text='Authorization'
                          label => *text='Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9kZXYtYXBpLmlkcmlwLmNvZmZlZVwvYXV0aFwvbG9naW4iLCJpYXQiOjE3MDI4ODc1NzEsImV4cCI6MTcwODA3MTU3MSwibmJmIjoxNzAyODg3NTcxLCJqdGkiOiJWbWVJY1NXakZxaVpFZEZCIiwic3ViIjo1NjE0LCJwcnYiOiJhZmQwZmQ5YmRkOWFjNzJmZjM5ODM0MWYxZDYyODQwY2JmNGM3MTY3In0.xcmOcBh3n-JsoVNSICdS8LkOWYHpLFiYbUirmnN3mp0'

                    .payload
                      label.row._open
                        span => *text='內文'
                        b => *text='表單'
                      .kvs
                        .kv
                          label => *text='type'
                          label => *text='mobile'

                        .kv
                          label => *text='username'
                          label => *text='oa.wu@idrip.coffee'

                        .kv
                          label => *text='password'
                          label => *text='123'


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
