/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

window.Load.VueComponent('SegmentedAuto', _ => {
  const { Type: T } = window.Helper

  return {
    props: {
      items: { type: Array, default: [], required: true },
      value: { type: Number, default: 0, required: true }
    },
    data: _ => ({
      position: null,
      ani: false,
      privateItems: []
    }),
    mounted() {
      this.privateItems = this.items
        .map(item => ({
          title: T.arr(item) ? item[0] : item,
          subtitle: T.arr(item) ? item[1] : ''
        }))
        .map(({ title, subtitle }) => ({
          title: (T.str(title)) || (T.num(title)) || (T.bool(title)) ? `${title}` : '',
          subtitle: (T.str(subtitle)) || (T.num(subtitle)) || (T.bool(subtitle)) ? `${subtitle}` : ''
        }))
        .filter(({ title, _ }) => title !== '')

      setTimeout(_ => this.click(null, _ => setTimeout(_ => this.ani = true, 300)), 10)
    },
    watch: {
      value(val) {
        this.click()
      }
    },
    methods: {
      text(item) {
        return T.arr(item) ? item[0] : item
      },
      num(item) {
        return T.arr(item) ? item[1] : null
      },
      click(val = null, closure = null) {
        if (val !== null) {
          this.value = val
          this.$emit('input', val)
        }

        if (this.value < 0 || this.value >= this.$refs.items.length) {
          if (T.func(closure)) {
            closure()
          }
          return
        }

        let el = this.$refs.items[this.value]

        if (this.value == this.$refs.items.length - 1) {
          this.position = {
            top: `${el.offsetTop + 2}px`,
            left: `${el.offsetLeft + 2}px`,
            width: `${this.$refs.segmented.offsetWidth - el.offsetLeft - 2 * 2}px`,
            height: `${el.offsetHeight - 2 * 2}px`
          }
        } else if (this.value == 0) {
          this.position = {
            top: `${el.offsetTop + 2}px`,
            left: `2px`,
            width: `${el.offsetWidth - 2 * 2}px`,
            height: `${el.offsetHeight - 2 * 2}px`
          }
        } else {
          this.position = {
            top: `${el.offsetTop + 2}px`,
            left: `${el.offsetLeft + 2}px`,
            width: `${el.offsetWidth - 2 * 2}px`,
            height: `${el.offsetHeight - 2 * 2}px`
          }
        }

        if (T.func(closure)) {
          closure()
        }
      }
    },
    template: `
      div.Segmented._auto => :i=value   :n=privateItems.length   :ref='segmented'
        label => *for=({ title, subtitle }, i) in privateItems   :ref='items'   @click=_=>click(i)
          span => *text=title
          i => *if=subtitle!==''   *text=subtitle
        span => :class={ _show: position, _ani: ani }   :style=position`
  }
})

window.Load.VueComponent('SegmentedFixed', _ => {
  const { Type: T } = window.Helper

  return {
    props: {
      items: { type: Array, default: [], required: true },
      index: { type: Number, default: 0, required: true }
    },
    data: _ => ({
      privateItems: []
    }),
    mounted() {
      this.privateItems = this.items
        .map(item => ({
          title: T.arr(item) ? item[0] : item,
          subtitle: T.arr(item) ? item[1] : ''
        }))
        .map(({ title, subtitle }) => ({
          title: (T.str(title)) || (T.num(title)) || (T.bool(title)) ? `${title}` : '',
          subtitle: (T.str(subtitle)) || (T.num(subtitle)) || (T.bool(subtitle)) ? `${subtitle}` : ''
        }))
        .filter(({ title, _ }) => title !== '')
    },
    methods: {
      click(index) {
        this.$emit('click', index)
        this.index = index
      },
    },
    template: `
      div.Segmented._fixed => :i=index   :n=privateItems.length
        label => *for=({ title, subtitle }, i) in privateItems   @click=click(i)
          span => *text=title
          i => *if=subtitle!==''   *text=subtitle`
  }
})
