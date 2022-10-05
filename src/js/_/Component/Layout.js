/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */
const Layout = function() {
  if (!(this instanceof Layout))
    return new Layout()

  this._menu = Layout.Menu()
  this._header = Layout.Header()
}
Layout.Menu = function(title = '', page = null) { if (!(this instanceof Layout.Menu)) return new Layout.Menu(title, page); else this._title = title, this._page = page }
Layout.Header = function() { if (!(this instanceof Layout.Header)) return new Layout.Header(); else this._title = '', this._lefts = [], this._rights = [] }

Object.defineProperty(Layout.prototype, 'menu', { get () { return this._menu } })
Object.defineProperty(Layout.prototype, 'menuTitle', { get () { return this.menu.title.bind(this.menu) }, set (val) { return this.menu.title(val), this } })
Object.defineProperty(Layout.prototype, 'menuPage', { get () { return this.menu.page.bind(this.menu) }, set (val) { return this.menu.page(val), this } })

Object.defineProperty(Layout.prototype, 'header', { get () { return this._header } })
Object.defineProperty(Layout.prototype, 'headerLeft', { get () { return this.header.left.bind(this.menu) }, set (val) { return this.header.left(val), this } })
Object.defineProperty(Layout.prototype, 'headerRight', { get () { return this.header.right.bind(this.menu) }, set (val) { return this.header.right(val), this } })
Object.defineProperty(Layout.prototype, 'headerTitle', { get () { return this.header.title.bind(this.header) }, set (val) { return this.header.title(val), this } })

Layout.prototype.menuReset = function() { return this._menu = Layout.Menu(), this }
Layout.prototype.headerReset = function() { return this._header = Layout.Header(), this }

Object.defineProperty(Layout.Menu.prototype, 'title', { get () { const func = function(val) { if (typeof val == 'string') this._title = val; return this }; func.toString = _ => this._title; return func }, set (val) { if (typeof val == 'string') this._title = val; return this } })
Object.defineProperty(Layout.Menu.prototype, 'page', { get () { return val => { return this._page = val, this } }, set (val) { return this._page = val, this } })

Layout.Header._ = function(key, button) {
  if (!['_lefts', '_rights'].includes(key) || this[key] === undefined) return this
  if (!(button instanceof Layout.Header.Button && button.isEnable)) return this
  return this[key].push(button), this
}
Object.defineProperty(Layout.Header.prototype, 'isEnable', { get () { return this._lefts.length || this._rights.length || this._title !== '' } })
Object.defineProperty(Layout.Header.prototype, 'left', {
  get () { return (text, icon = null, click = null) => {
    if (typeof text == 'object') return Layout.Header._.call(this, '_lefts', text)
    if (typeof text != 'string') return this
    if (typeof icon == 'function') click = icon, icon = ''
  
    return Layout.Header._.call(this, '_lefts', Layout.Header.Button(text, icon, click))
  } },
  set (val) { return Layout.Header._.call(this, '_lefts', val) }
})
Object.defineProperty(Layout.Header.prototype, 'right', {
  get () { return (text, icon = null, click = null) => {
    if (typeof text == 'object') return Layout.Header._.call(this, '_rights', text)
    if (typeof text != 'string') return this
    if (typeof icon == 'function') click = icon, icon = ''
  
    return Layout.Header._.call(this, '_rights', Layout.Header.Button(text, icon, click))
  } },
  set (val) { return Layout.Header._.call(this, '_rights', val) }
})
Object.defineProperty(Layout.Header.prototype, 'title', { get () { const func = function(val) { if (typeof val == 'string') this._title = val; return this }; func.toString = _ => this._title; return func }, set (val) { if (typeof val == 'string') this._title = val; return this } })
Object.defineProperty(Layout.Header.prototype, 'lefts', { get () { return this._lefts } })
Object.defineProperty(Layout.Header.prototype, 'rights', { get () { return this._rights } })

Layout.Header.Button = function(text, icon = null, click = null) {
  if (!(this instanceof Layout.Header.Button))
    return new Layout.Header.Button(text, icon, click)

  this._text = ''
  this._icon = null
  this._click = null

  if (typeof icon == 'function') this.text(text).click(icon)
  else this.text(text).icon(icon).click(click)
}
Object.defineProperty(Layout.Header.Button.prototype, 'isEnable', { get () { return this._text || this._icon  } })
Layout.Header.Button.prototype.text = function(val) { return typeof val == 'string' && (this._text = val), this }
Layout.Header.Button.prototype.icon = function(val) { return typeof val == 'string' && (this._icon = val), this }
Layout.Header.Button.prototype.click = function(val) { return typeof val == 'function' && (this._click = val), this }

Load.VueComponent('layout', {
  props: {
    // menu: { type: String, required: true }
  },
  data: _ => ({
    layout: Layout.shared = Layout(),
    menuItems: [
      { page: 'index', text: '首頁',    icon: 'index' },
      { page: 'members', text: '人員管理', icon: 'members' },
      { page: 'albums', text: '相簿管理', icon: 'albums' },
      { page: 'tags', text: '標籤管理', icon: 'tags' },
      { page: 'logout', text: '登出',   icon: 'logout', click: _ => Alert.shared.reset('確定要登出？').button('取消', alert => alert.dismiss()).button('確定', alert => alert.loading(_ => Change('login', Flash.Toastr.success('登出成功！')))).present() },
    ]
  }),
  mounted () {
  },
  watch: {
  },
  methods: {
  },
  computed: {
    header () { return this.layout.header },
    lefts () { return this.header.lefts },
    rights () { return this.header.rights },
  },
  template: `
  main#app
    aside#menu
      div#menu-items
        label => *for=(menu, i) in menuItems   :key=i   :class=[menu.icon ? '_icon_y' : '_icon_n', menu.description ? '_desc_y' : '_desc_n', layout.menu._page == menu.page ? 'active' : '']   @click=typeof menu.click == 'function' ? menu.click(layout) : Redirect(menu.page)
          i => *if=menu.icon   :class=menu.icon
          b => *text=menu.text
          span => *text=menu.description

    div#main
      div#main-container
        slot => name=main

    header#menu-header
      span => *text=layout.menu.title

    header#main-header
      nav#main-nav => *if=header.isEnable
        div._lefts => *if=lefts.length
          label._scalc => *for=(btn, i) in lefts   :key=i   *text=btn._text   :class=[btn._icon, btn._icon ? '_iy' : '_in', btn._text ? '_ty' : '_tn']   @click=e=>btn._click && btn._click.call(layout, layout, header, btn, e)

        h1._title => *text=header.title   :class=[!lefts.length && !rights.length ? '_only' : '']

        div._rights => *if=rights.length
          label._scalc => *for=(btn, i) in rights   :key=i   *text=btn._text   :class=[btn._icon, btn._icon ? '_iy' : '_in', btn._text ? '_ty' : '_tn']   @click=e=>btn._click && btn._click.call(layout, layout, header, btn, e)

      slot => *else   name=header
  `
})
