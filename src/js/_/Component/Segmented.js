/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('segmented-auto', {
  props: {
    items: { type: Array, default: [], required: true },
    index: { type: Number, default: 0, required: true }
  },
  data: _ => ({
    position: null,
    ani: false,
    privateItems: []
  }),
  mounted () {

    this.privateItems = this.items
      .map(item => ({
        title: Array.isArray(item) ? item[0] : item,
        subtitle: Array.isArray(item) ? item[1] : ''
      }))
      .map(({ title, subtitle }) => ({
        title: (typeof title == 'string') || (typeof title == 'number' && !isNaN(title) && title !== Infinity) || (typeof title == 'boolean') ? `${title}` : '',
        subtitle: (typeof subtitle == 'string') || (typeof subtitle == 'number' && !isNaN(subtitle) && subtitle !== Infinity) || (typeof subtitle == 'boolean') ? `${subtitle}` : ''
      }))
      .filter(({ title, subtitle }) => title !== '')

    setTimeout(_ => this.click(null, _ => setTimeout(_ => this.ani = true, 300)), 10)
  },
  watch: {
    index (index) {
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
    click (index = null, closure = null) {
      if (index !== null) {
        this.$emit('click', index)
        this.index = index
      }

      if (this.index < 0 || this.index >= this.$refs.items.length) {
        if (typeof closure == 'function') {
          closure()
        }
        return
      }

      let el = this.$refs.items[this.index]

      if (this.index == this.$refs.items.length - 1) {
        this.position = {
          top: `${el.offsetTop + 2}px`,
          left: `${el.offsetLeft + 2}px`,
          width: `${this.$refs.segmented.offsetWidth - el.offsetLeft - 2 * 2}px`,
          height: `${el.offsetHeight - 2 * 2}px`
        }
      } else if (this.index == 0) {
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

      if (typeof closure == 'function') {
        closure()
      }
    }
  },
  template: `
    div._segmented.__auto => :i=index   :n=privateItems.length   :ref='segmented'
      label => *for=({ title, subtitle }, i) in privateItems   :ref='items'   @click=index=i
        span => *text=title
        i => *if=subtitle!==''   *text=subtitle
      span => :class={show: position, ani }   :style=position`
})

Load.VueComponent('segmented-fixed', {
  props: {
    items: { type: Array, default: [], required: true },
    index: { type: Number, default: 0, required: true }
  },
  data: _ => ({
    privateItems: []
  }),
  mounted () {
    this.privateItems = this.items
      .map(item => ({
        title: Array.isArray(item) ? item[0] : item,
        subtitle: Array.isArray(item) ? item[1] : ''
      }))
      .map(({ title, subtitle }) => ({
        title: (typeof title == 'string') || (typeof title == 'number' && !isNaN(title) && title !== Infinity) || (typeof title == 'boolean') ? `${title}` : '',
        subtitle: (typeof subtitle == 'string') || (typeof subtitle == 'number' && !isNaN(subtitle) && subtitle !== Infinity) || (typeof subtitle == 'boolean') ? `${subtitle}` : ''
      }))
      .filter(({ title, subtitle }) => title !== '')
  },
  methods: {
    click (index) {
      this.$emit('click', index)
      this.index = index
    },
  },
  template: `
    div._segmented.__fixed => :i=index   :n=privateItems.length
      label => *for=({ title, subtitle }, i) in privateItems   @click=click(i)
        span => *text=title
        i => *if=subtitle!==''   *text=subtitle`
})
