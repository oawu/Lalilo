/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('role-unit', {
  props: {
    // request: { type: Request, request: true }
  },
  data: _ => ({
    api: Api({

      ctrl: {
        error: new Error('asdd'),
        loading: false,

        main: false,
        forceVar: false,
        header: false,
        payload: false,
        
        rule: false,
        ruleIndex: 0,

        response: false,
        responseIndex: 2,
        responseBodyIndex: 1,
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
          { key: 'order', varName: 'order' },
          { key: 'order.id', varName: 'order-id' },
          { key: 'items', varName: 'items' },
          { key: 'items[0]', varName: 'item0' },
          { key: 'items[0].id', varName: 'item0-id' },
          { key: 'items[0].name', varName: 'item0-name' },
        ]
      },
      response: {
        info: {
          status: 200,
          size: 100, // B
          during: 100, // ms
        },
        headers: [
          { key: 'Authorization', val: 'auth-token' },
          { key: 'Authorization', val: 'auth-token' },
          { key: 'Authorization', val: 'auth-token' },
        ],
        body: '{"string":"這是一個字串","number":42,"boolean":true,"array":["元素1",2,false,{"nested_key":"nested_value"},["nested","array"],null],"object":{"key1":"value1","key2":123,"key3":{"nested_key":"nested_value"},"key4":["a","b",{"nested_object_in_array":true}],"key_with_null_value":null},"null_value":null}',
        body: '',
        // body: 1,
        // body: false,
        // body: 'aa',
      },
      // response: null

    })
  }),
  methods: {
  },
  computed: {
    ctrl () {
      return this.api ? this.api.ctrl : null
    },
    request () {
      return this.api ? this.api.request : null
    },
    rule () {
      return this.api ? this.api.rule : null
    },
    response () {
      return this.api ? this.api.response : null
    },
  },
  template: `
    .role-unit
      header.unit-header => :class=ctrl.main ? '_open' : ''
        i._icon-api
        div.info
          b => *text=request.title
          span => *text=request.subtitle   *if=request.subtitle!==''
        
        div.error => *if=ctrl.error
        label.loading => *if=ctrl.loading
          div
            i => *for=i in [0,1,2,3,4,5,6,7,8,9,10,11]   :key=i   :class='__i' + i
        div.arrow => *else   @click=ctrl.toggleMain()

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
            .segmenteds
              segmented => :items=['測試', '存取']   :index=ctrl.ruleIndex   @click=i=>ctrl.ruleIndex=i

            .test => *if=ctrl.ruleIndex==0
              test-rule => :condition=rule.test ? rule.test.condition('回應') : null

            .kvs => *if=ctrl.ruleIndex==1
              .kv => *for=(save, i) in rule.saves   :key=i
                label
                  b => *text=save.varName
                label
                  span => *text=save.key

        .response
          label.row._arr => :class=ctrl.response ? '_open' : ''   @click=ctrl.toggleResponse()
            b => *text='回應'   :subtitle='（Response）'

          div.info => *if=ctrl.response
            template => *if=response
              .segmenteds
                segmented.pick => :items=['Info', ['Header', response.headers.length], 'Body']   :index=ctrl.responseIndex   @click=i=>ctrl.responseIndex=i
                segmented.pick => *if=ctrl.responseIndex==2   :items=['原始資料', '結構化']   :index=ctrl.responseBodyIndex   @click=i=>ctrl.responseBodyIndex=i

              .kvs => *if=ctrl.responseIndex==0
                .kv
                  label
                    b => *text='狀態'   :subtitle='（Status Code）'
                  label
                    span => *text=response.info.status

                .kv
                  label
                    b => *text='傳輸大小'
                  label
                    span => *text=response.info.size   :subtitle='Byte'
                    
                .kv
                  label
                    b => *text='執行時間'
                  label
                    span => *text=response.info.during   :subtitle='ms'
                    
              .kvs => *if=ctrl.responseIndex==1
                .kv => *for=(header, i) in response.headers   :key=i
                  label
                    b => *text=header.key
                  label
                    span => *text=header.val

              template => *if=ctrl.responseIndex==2
                .pretty => *if=ctrl.responseBodyIndex==1
                  pretty-json => :json=response.body.json
                .origin => *if=ctrl.responseBodyIndex==0
                  div => *text=response.body.text
            template => *else
              div.response-empty => *text='尚未執行，所以還沒有任何回應結果。'
    `
})

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
                role-unit

                .role-unit
                  header.unit-header
                    i._icon-ifelse
                    .info
                      b => *text='檢查是否可被申請退貨'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='清除購物車'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='加入購物車'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='取得付款憑證'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='付款'
                      span
                    label
                  
                  .body

              .role-units
            
            .unit-roles
              .role-units
              .role-units
                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='登入後台'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='排程過 12 小時'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='登入後台'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='檢視訂單-取的項目'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='建立出貨單'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='檢視訂單-取得出貨單'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='送達'
                      span
                    label
                  
                  .body

            
            .unit-roles
              .role-units
                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='登入前台'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='檢視訂單'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-ifelse
                    .info
                      b => *text='檢查是否可被申請退貨'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='申請退貨'
                      span
                    label
                  
                  .body

              .role-units
            
            .unit-roles
              .role-units
              .role-units
                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='登入後台'
                      span
                    label
                  
                  .body

                .role-unit
                  header.unit-header
                    i._icon-api
                    .info
                      b => *text='允許退貨'
                      span
                    label
                  
                  .body

                
            .unit-roles
              .role-units
              .role-units
                .unit
                  .role-unit
                    header.unit-header
                      i
                      .info
                        b => *text='登入後台'
                        span
                      label
                    
                    .body

                  .role-unit
                    header.unit-header
                      i
                      .info
                        b => *text='退款'
                        span
                      label
                    
                    .body


      `
})
