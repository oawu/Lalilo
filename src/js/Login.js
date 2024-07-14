/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    mode: null
  },
  mounted () {
    App.VC.Mounted().emit()
  },
  methods: {
    login () {
      this.mode = 'login'
    },
    regest () {

    },
    offline () {

    },
  },
  template: `
    main#app
      Intro => *if=false   @login=login
      Login => *if=1

      #version => *text='v1.00.00'
      `
})

Load.VueComponent('Login', {
  data: _ => ({
    icon: `url("${window.baseUrl}img/piggy-bank.png")`
  }),
  mounted () {
  },
  methods: {
  },
  template: `
    #login
      #cover
        figure => :style={backgroundImage: icon}
      #hello
        b.title => *text='登入'
        .descs
          .desc => *text='請輸入您當初註冊的 E-Mail 與密碼登入'

        label.input
          i
          input
          span

      `
})


Load.VueComponent('Intro', {
  data: _ => ({
    icon: `url("${window.baseUrl}img/piggy-bank.png")`
  }),
  mounted () {
  },
  methods: {
    login () {
      this.$emit('login')
    },
    regest () {
      this.$emit('regest')
    },
    offline () {
      this.$emit('offline')
    },
  },
  template: `
    #intro
      #cover
        figure => :style={backgroundImage: icon}
      #hello
        b.title => *text='哈囉'
        .descs
          .desc => *text='歡迎來到「找你算帳」'
          .desc => *text='這是一個可以記錄開銷，與分享開銷的平台。'
          .desc => *text='同時我們也會是你旅遊開銷拆帳的好夥伴！'

        .buttons
          label.login => *text='登入'   @click=login
          label.regest => *text='註冊'   @click=regest
          label.offline => *text='暫不登入，使用離線功能'   @click=offline
      `
})
