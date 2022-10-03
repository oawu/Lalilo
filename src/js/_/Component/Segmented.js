/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('segmented', {
  props: {
    items: { type: Array, default: [], required: true },
    index: { type: Number, default: 0, required: true }
  },
  data: _ => ({
    position: null,
    ani: false
  }),
  mounted () {
    setTimeout(_ => this.click(_ => setTimeout(_ => this.ani = true, 300)), 10)
  },
  watch: {
    index () {
      this.click()
    }
  },
  methods: {
    text (item) {
      return Array.isArray(item) ? item[0] : item
    },
    num (item) {
      return Array.isArray(item) ? item[1] : null
    },
    click (closure) {
      if (this.index < 0 || this.index >= this.$refs.items.length)
        return typeof closure == 'function' && closure()

      let el = this.$refs.items[this.index]
      this.position = this.index != this.$refs.items.length - 1
        ? this.index != 0
          ? { top: `${el.offsetTop + 2}px`, left: `${el.offsetLeft + 2}px`, width: `${el.offsetWidth - 2 * 2}px`, height: `${el.offsetHeight - 2 * 2}px` }
          : { left: `2px`, top: `${el.offsetTop + 2}px`, width: `${el.offsetWidth - 2 * 2}px`, height: `${el.offsetHeight - 2 * 2}px` }
        : { width: `${this.$refs.segmented.offsetWidth - el.offsetLeft - 2 * 2}px`, top: `${el.offsetTop + 2}px`, left: `${el.offsetLeft + 2}px`, height: `${el.offsetHeight - 2 * 2}px` }

      return typeof closure == 'function' && closure()
    }
  },
  template: `
    div._segmented => :i=index   :n=items.length   :ref='segmented'
      label => *for=(item, i) in items   :ref='items'   @click=click(_ => $emit('click', i), index = i)
        span => *text=text(item)
        i => *if=num(item)!==null   *text=num(item)
      span => :class={show: position, ani }   :style=position`
})
