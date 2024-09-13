/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    mode: null,
    cover: `url("${window.baseUrl}img/piggy-bank.png")`,
  },
  mounted () {
    App.VC.Mounted().emit()
  },
  methods: {
    login () {
      this.mode = 'login'
    },
    register () {
      this.mode = 'register'
    },
    reset () {
      this.mode = null
    },
  },
  template: `
    main#app

      #panels => :class={'_login': mode === 'login', '_register': mode === 'register'}
        .cover
          figure => :style={backgroundImage: cover}

        .form
          Intro => *if=mode===null   @login=login   @register=register
          Login => *if=mode==='login'   @back=reset
          Register => *if=mode==='register'   @back=reset

      #version => *text='v1.00.00'
      `
})

Load.VueComponent('Register', {
  data: _ => ({
    focus: null,
    model: {
      mail: {
        vaild: undefined,
        val: '',
        timer: null
      },
      user: {
        vaild: undefined,
        val: '',
        timer: null
      },
      pswd: {
        val: '',
        type: 'password'
      }
    },
    errors: []
  }),
  mounted () {
  },
  methods: {
    _checkMail () {
      if (this.model.mail.val === '') {
        this.model.mail.vaild = undefined
        clearTimeout(this.model.mail.timer)
        this.model.mail.timer = null
        return
      }

      this.model.mail.vaild = null
      setTimeout(_ => {
        this.model.mail.vaild = 'done'
        clearTimeout(this.model.mail.timer)
        this.model.mail.timer = null
      }, 1000)
    },
    _checkUser () {
      if (this.model.user.val === '') {
        this.model.user.vaild = undefined
        clearTimeout(this.model.user.timer)
        this.model.user.timer = null
        return
      }

      this.model.user.vaild = null
      setTimeout(_ => {
        this.model.user.vaild = 'done'
        clearTimeout(this.model.user.timer)
        this.model.user.timer = null
      }, 1000)
    },
    submit () {
      this.errors = []
      if (this.model.mail.vaild === undefined || this.model.mail.val === '') {
        this.errors.push('請輸入您的 E-Mail')
      }
      if (this.model.mail.vaild !== 'done') {
        this.errors.push('您輸入的 E-Mail 無法使用')
      }
      if (this.model.user.vaild === undefined || this.model.user.val === '') {
        this.errors.push('請輸入您的帳號')
      }
      if (this.model.user.vaild !== 'done') {
        this.errors.push('您輸入的帳號無法使用')
      }
      if (this.model.pswd.val === '') {
        this.errors.push('請輸入您的密碼')
      }

      if (this.errors.length) {
        return
      }

      if (!this.vaild) {
        return
      }

      App.HUD.Show.Loading('註冊中，請稍後…')
        .emit()

      setTimeout(_ => {
        App.HUD.Show.Done('註冊成功').completion(App.HUD.Hide(400)).emit()
      }, 1000)
    }
  },
  computed: {
    vaild () {
      return this.model.mail.vaild === 'done'
        && this.model.mail.val !== ''
        && this.model.user.vaild === 'done'
        && this.model.user.val !== ''
        && this.model.pswd.val !== ''
    }
  },
  watch: {
    'model.mail.val' () {
      this.errors = []
      clearTimeout(this.model.mail.timer)
      this.model.mail.timer = setTimeout(this._checkMail, 300)
    },
    'model.user.val' () {
      this.errors = []
      clearTimeout(this.model.user.timer)
      this.model.user.timer = setTimeout(this._checkUser, 300)
    },
    'model.pswd.val' () {
      this.errors = []
    },
  },
  template: `
    .panel-register

      b.title => *text='註冊'
      .descs
        .desc => *text='請輸入您的 E-Mail 與建立帳號。'

      .inputs
        label.input => :class={_focus: focus === model.mail}
          i.icon-mail
          
          .loading => *if=model.mail.vaild === null   c=9
            i => *for=i in Array.from(Array(9).keys())   :key=i   :class='__i' + i

          .result._done => *if=model.mail.vaild === 'done'
          
          .result._fail => *if=model.mail.vaild === 'fail'

          input => type=mail   placeholder=請輸入 E-Mail…   @focus=focus=model.mail   *model.trim=model.mail.val
          span


      .inputs
        label.input => :class={_focus: focus === model.user}
          i.icon-at

          .loading => *if=model.user.vaild === null   c=9
            i => *for=i in Array.from(Array(9).keys())   :key=i   :class='__i' + i

          .result._done => *if=model.user.vaild === 'done'
          .result._fail => *if=model.user.vaild === 'fail'

          input => type=text   placeholder=請輸入帳號…   @focus=focus=model.user   *model.trim=model.user.val
          span

        label.input => :class={_focus: focus === model.pswd}
          i.icon-key
          lable.eye => @click=model.pswd.type = model.pswd.type=='text' ? 'password' : 'text'   :class={'_on': model.pswd.type=='password'}
          input => :type=model.pswd.type   placeholder=請輸入密碼…   @focus=focus=model.pswd   *model.trim=model.pswd.val
          span

      .errors => *if=errors.length
        .error => *for=(error, i) in errors   :key=i   *text=(i + 1) + '. ' + error

      .ctrl
        label.back => *text='返回'   @click=$emit('back')
        label.submit._full => *text='註冊'   @click=submit   :class={_vaild: vaild}
      `
})

Load.VueComponent('Login', {
  data: _ => ({
    focus: null,
    model: {
      user: {
        val: ''
      },
      pswd: {
        val: '',
        type: 'password'
      }
    }
  }),
  mounted () {
  },
  methods: {
    submit () {

    }
  },
  computed: {
    vaild () {
      return this.model.user.val !== ''
        && this.model.pswd.val !== ''
    }
  },
  template: `
    .panel-login
      b.title => *text='登入'
      .descs
        .desc => *text='請輸入您當初註冊的 E-Mail 與密碼登入'

      .inputs
        label.input => :class={_focus: focus === model.user}
          i.icon-at
          input => type=text   placeholder=請輸入帳號…   @focus=focus=model.user   *model.trim=model.user.val
          span

        label.input => :class={_focus: focus === model.pswd}
          i.icon-key
          lable.eye => @click=model.pswd.type = model.pswd.type=='text' ? 'password' : 'text'   :class={'_on': model.pswd.type=='password'}
          input => :type=model.pswd.type   placeholder=請輸入密碼…   @focus=focus=model.pswd   *model.trim=model.pswd.val
          span

      .forget
        label => *text='那個，我忘記密碼惹…'

      .errors => *if=0
        .error => *text='沒有此帳號'

      .ctrl
        label.back => *text='返回'   @click=$emit('back')
        label.submit._full => *text='登入'   @click=submit   :class={_vaild: vaild}
      `
})


Load.VueComponent('Intro', {
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
    login () {
      this.$emit('login')
    },
    register () {
      this.$emit('register')
    },
    offline () {
      this.$emit('offline')
    },
  },
  template: `
    .panel-intro
      b.title => *text='哈囉'

      .descs
        .desc => *text='歡迎來到「找你算帳」'
        .desc => *text='這是一個可以記錄開銷，與分享開銷的平台。'
        .desc => *text='同時我們也會是你旅遊開銷拆帳的好夥伴！'

      .buttons
        label.login._full => *text='登入'   @click=login
        label.register => *text='註冊'   @click=register
      `
})
