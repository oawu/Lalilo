/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    title: '愛上大數據',
    type: 'model1',
    model1: {
      subtitle: '登入後台',
      account: '',
      password: '',
    },
    errors: []
  },
  mounted () {

  },
  computed: {
  },
  methods: {
    async submit () {
      await new Promise(r => setTimeout(r, 10))
      this.$refs.password.blur()
      await Alert().loading('登入中…').present()

      console.error(this.model1)
    }
  },
  template: `
  main#app
    h1 => *text=title

    form => *if=type == 'model1'   @submit.prevent=submit
      h2 => *text=model1.subtitle

      label.unit
        i.acc
        input.input => type=text   placeholder=請輸入帳號…   *model.trim=model1.account   :required=true    :autofocus=true   ref=account

      label.unit
        i.psw
        input.input => type=password   placeholder=請輸入密碼…   *model.trim=model1.password   :required=true   ref=password

      form-message.message => :messages=errors

      button.button._scalc => type=submit   *text='登入'

    footer => *text='© 2025 i3data.tw'

  `
})
