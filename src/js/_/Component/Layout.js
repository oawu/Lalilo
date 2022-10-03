/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */
const Layout = function() {
  if (!(this instanceof Layout))
    return new Layout()

  this._menu = null
  this._header = null
}
Object.defineProperty(Layout.prototype, 'headerLeft', {
  get () {
    return (text, click = null) => {
      const btn = Layout.Header.Button(text, click)
      if (!btn.isDisplay) return this
      if (this._header === null) this._header = Layout.Header()
      this._header._lefts.push(btn)
    }
  },
  set (val) {
    if (!(val instanceof Layout.Header.Button)) return this
    if (this._header === null) this._header = Layout.Header()
    this._header._lefts.push(val)
    return this._d4
  }
})
Object.defineProperty(Layout.prototype, 'headerRight', {
  get () {
    return (text, click = null) => {
      const btn = Layout.Header.Button(text, click)
      if (!btn.isDisplay) return this
      if (this._header === null) this._header = Layout.Header()
      this._header._rights.push(btn)
    }
  },
  set (val) {
    if (!(val instanceof Layout.Header.Button)) return this
    if (this._header === null) this._header = Layout.Header()
    this._header._rights.push(val)
    return this._d4
  }
})
Object.defineProperty(Layout.prototype, 'headerTitle', {
  get () { return this._header._title },
  set (val) {
    if (typeof val != 'string' || val == '') return this
    if (this._header === null) this._header = Layout.Header()
    this._header._title = val
    return this._d4
  }
})
Object.defineProperty(Layout.prototype, 'menu', {
  get () { return this._menu },
  set (val) {
    if (typeof val == 'string') this._menu = val
    return this._menu
  },
})
Layout.prototype.headerReset = function() { return this._header = null, this }

Layout.Header = function() {
  if (!(this instanceof Layout.Header))
    return new Layout.Header()
  this._title = ''
  this._lefts = []
  this._rights = []
}
Layout.Header.Button = function(text, click = null) {
  if (!(this instanceof Layout.Header.Button))
    return new Layout.Header.Button(text, click)
  this._text = ''
  this._click = null

  this.text(text).click(click)
}
Object.defineProperty(Layout.Header.Button.prototype, 'isDisplay', { get () { return this._text !== ''  } })
Layout.Header.Button.prototype.text = function(val) {
  if (typeof val == 'string') this._text = val
  return this
}
Layout.Header.Button.prototype.click = function(val) {
  if (typeof val == 'function') this._click = val
  return this
}
Layout.shared = Layout()


Load.VueComponent('layout', {
  props: {
    // menu: { type: String, required: true }
  },
  data: _ => ({
    layout: Layout.shared,
    menuItems: [
      { page: 'index', text: '首頁',    icon: 'index' },
      { page: 'albums', text: '相簿管理', icon: 'albums' },
      { page: 'tags', text: '標籤管理', icon: 'tags' },
      { page: 'logout', text: '登出',   icon: 'logout' },
    ]
  }),
  mounted () {
  },
  watch: {
  },
  methods: {
  },
  template: `
  main#app
    aside#menu
      div#menu-items
        label => *for=(album, i) in menuItems   :key=i   :class=[album.icon ? '_icon_y' : '_icon_n', album.description ? '_desc_y' : '_desc_n', layout.menu == album.page ? 'active' : '']
          i => *if=album.icon   :class=album.icon
          b => *text=album.text
          span => *text=album.description

    div#main
      div#main-container
        slot => name=main

    header#menu-header
      span => *text='標題'

    header#main-header
      nav#main-nav => *if=layout._header
        div._lefts
          label => *text='asd'
          label => *text='asd'
          label => *text='asd'
        h1._title => *text='asd'
        div._rights
          label => *text='asd'
          label => *text='asd'
          label => *text='asd'

      slot => *else   name=header
  `
})
