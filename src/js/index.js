/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */


Load.VueComponent('layout', {
  props: {
  },
  data: _ => ({
    apis: Api.shared()
  }),
  mounted () {
  },
  methods: {
  },
  computed: {
  },
  template: `
  main#app
    aside#main-lebel1
      label._active
        figure._icon-apis
        span => *text='API'

      label
        figure._icon-stories
        span => *text='故事'

      label
        figure._icon-envs
        span => *text='環境'
    
    aside#main-lebel2
      tree-api-folder => *for=(folder,i) in apis   :key=i   :obj=folder

    div#main => :style={'--left-padding': null, '--right-padding': null}
      div#main-container
        slot => name=main

    header#main-header => :style={'--left-padding': null, '--right-padding': null}
      nav#main-nav
      slot => *else   name=header
  `
})


Load.Vue({
  data: {
    param: 0
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
        #api
          b.api-title => *text='02 | 登入'
          .send
            .url
              b.method => *text='post'
              div.path
                label => *text='BaseURL'
                i
                span => *text='order'
                i
                label => *text='3'
                i
                span => *text='pick'
                i
                label => *text='0'
                i
                span => *text='items'

                u => *text='?'

                div
                  b => *text='limit'
                  span => *text='10'
                u => *text='&'
                div
                  b => *text='nextId'
                  span => *text='0'
                u => *text='&'
                div
                  b => *text='name'
                  label => *text='隨機名字'

            .submit => *text='送出'
          .params
            segmented => :items=['Queries', 'Headers', 'Payload', 'Test']   :index=param   @click=i=>param=i

          .queries => *if=param == 0
            div => *text='a'
      `
})
