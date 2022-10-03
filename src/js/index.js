/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    style: {
      color: 'rgba(120, 120, 120, 1.00);'
    },
    version: '1.0.0'
  },
  mounted () {
    Layout.shared.headerLeft('text', _ => {
        console.error(111);
      })
    // setTimeout(_ => {
    //   Layout.shared.menu = 'index'
    //   Layout.shared.headerLeft('text', _ => {
    //     console.error(111);
    //   })

    //   // setTimeout(_ => {
    //   //   Layout.shared.headerReset()
    //   // }, 1000)
    // }, 1000)
  },
  computed: {
  },
  methods: {
    date (format) {
      const pad0 = t => (t < 10 ? '0' : '') + t
      const date = new Date()
      return format.replace('Y', date.getFullYear())
        .replace('m', pad0(date.getMonth() + 1))
        .replace('d', pad0(date.getDate()))
        .replace('H', pad0(date.getHours()))
        .replace('i', pad0(date.getMinutes()))
        .replace('s', pad0(date.getSeconds()))
    }
  },
  template: `
  layout
    template => :slot:header
      span => *text='asd'

    template => :slot:main
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
      div => *text='as'
  `
})
