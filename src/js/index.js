/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

window.Load.Vue(_ => {
  const { Str } = window.Helper

  return {
    data: {
      style: {
        color: 'rgba(120, 120, 120, 1.00);'
      },
      version: '3.0.1'
    },
    async mounted() {
    },
    computed: {
      date() {
        return Str.date()
      }
    },
    methods: {
    },
    template: `
      main#app
        h1 => *text='你好，世界！'
        div => :style=style
          span => *text='這是 '
          b    => *text='Lalilo'
          span => *text='，你目前版本是 '
          b    => *text=version
        br
        span => *text=date
      `
  }
})