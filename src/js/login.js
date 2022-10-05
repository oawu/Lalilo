/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    title: '標題',
    subtitle: '登入後台',
    errors: [],
    account: '',
    password: '',
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    date (format) {
    },
    login (account, password) {
      Alert.shared.loading('登入中…').present(alert => setTimeout(_ => alert.dismiss(_ => Change('index', Flash.Toastr.success('登入成功！'))), 2000))
    },
    submit () {
      if (!this.errors.length)
        return this.errors = ['Error Demo.', '請再送出一次。']

      this.errors = []
      this.account.length || this.errors.push('請填寫「帳號」。')
      this.password.length || this.errors.push('請填寫「密碼」。')
      this.errors.length || this.login(this.account, this.password)
    }
  },
  template: `
  main#app
    h1 => *text=title
    form => @submit.prevent=submit
      h2 => *text=subtitle
      label.unit
        i.acc
        input => placeholder=請輸入帳號…   *model.trim=account   :required=true    :autofocus=true
      label.unit
        i.psw
        input => placeholder=請輸入密碼…   *model.trim=password   :required=true

      form_message => :messages=errors

      button._scalc => type=submit   *text='登入'
    footer => *text='© 2021 - 2022 ioa.tw'`
})
