/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
  },
  mounted () {
    App.VC.Mounted().emit()
  },
  methods: {
  },
  template: `
    main#app
      #Launch
        #words
          span.word => *text='找'
          span.word => *text='你'
          span.word => *text='算'
          span.word => *text='帳'
          span.word => *text='!'
        #version => *text='v1.0.0'
      `
})
