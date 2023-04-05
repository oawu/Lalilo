/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Nav.Component('demo1', {
  props: {
    view: { type: Nav.View },
    arr: { type: Array, default: [] }
  },
  methods: {
    click () {
      this.view.emit('a', 1,2,3)
    }
  },
  template: `
    div.aa
      div => *text=arr.length
      label => *text='click'   @click=click
      `
})
Nav.Component('demo2', {
  props: {
    view: { type: Nav.View },
  },
  mounted () {
  },
  methods: {
  },
  template: `
    div.xx => *text='a'
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
    test1() {
      Nav.View('demo1').headerTitle('a').loading(false).presentTo(Nav.shared, v => {
        v.push(Nav.View('demo1').headerTitle('b').loading(false), v => {
          v.push(Nav.View('demo1').headerTitle('c').loading(false), v => {
            v.right('a', v => {
              v.root((v, n) => {
                Nav.View('demo1').headerTitle('a-1').loading(false).updateTo(n, (v, n) => {
                  Nav.View('demo1').headerTitle('b-1').loading(false).pushTo(n, (v, n) => {
                    Nav.View('demo1').headerTitle('a-2').loading(false).flashTo(n)
                  })
                })
              })
            })
          })  
        })
      })
    },
    demo2() {
      Nav.View('demo2').headerTitle('a').presentTo(Nav.shared, v => {
      })

    }
  },
  template: `
    div
      label.btn => *text='測試 1'   @click=test1
      label.btn => *text='測試 2'   @click=demo2
  `
})