/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('demo', {
  template: `
  div.test-demo => *text='demo'
  `
})

Load.Vue({
  data: {
  },
  mounted () {
    // setTimeout(
      // _ => Toastr.success('a', setTimeout(
      //   _ => Toastr.warning('b', setTimeout(
      //     _ => Toastr.failure('c', setTimeout(
      //       _ => Toastr.info('d'), 1000)), 1000)), 1000)), 1000)
      // setTimeout(_ => Alert('a', 'b').input().input().button('b', (a, b) => {
      //   console.error(b);
      // }).button('a', alert => {
      //   console.error(1);
        
      // }).present())
  },
  computed: {
  },
  methods: {
    nav () {
      Nav.shared.type('right').present(Nav.View('demo'), n => setTimeout(_ => n.loading(false), 1000))
    },
    alert () {
      Alert.shared.reset('a', 'b')
        .input()
        .button('取消', alert => {
          alert.dismiss()
        })
        .button('讀取', (alert, val) => alert.loading(_ => setTimeout(_ => alert
          .reset('值', val)
          .button('完成', alert => alert.dismiss()), 1000)))
        .present()

      // Alert('a', 'b')
      //   .input()
      //   .button('取消', alert => {
      //     alert.dismiss()
      //   })
      //   .button('讀取', (alert, val) => alert.loading(_ => setTimeout(_ => alert
      //     .reset('值', val)
      //     .button('完成', alert => alert.dismiss()), 1000)))
      //   .present()
    }
  },
  template: `
    main#app
      segmented => :items=[1,2,[3,2],'asd']   :index=3
      button.btn => @click=alert   *text='點擊'
      button.btn => @click=nav   *text='點擊'
      `
})
