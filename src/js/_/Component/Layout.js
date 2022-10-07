/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */
const Layout = function() {
  if (!(this instanceof Layout))
    return new Layout()

  // this._menu = Layout.Menu()
  this._header = Layout.Header()
  this._left = Layout.View.Nav(this)
  this._right = Layout.View.Nav(this)
}
Object.defineProperty(Layout.prototype, 'header', { get () { return this._header } })
Object.defineProperty(Layout.prototype, 'left', { get () { return this._left } })
Object.defineProperty(Layout.prototype, 'right', { get () { return this._right } })
Layout.prototype.headerReset = function() { return this._header = Layout.Header(), this }

// 
Layout.Header = function(title = null, left = null, right = null) {
  if (!(this instanceof Layout.Header))
    return new Layout.Header(title, left, right);
  this._title = ''
  this._lefts = []
  this._rights = []
  this.title(title).left(left).right(right)
}
Object.defineProperty(Layout.Header.prototype, 'lefts', { get () { return this._lefts } })
Object.defineProperty(Layout.Header.prototype, 'rights', { get () { return this._rights } })
Object.defineProperty(Layout.Header.prototype, 'enable', { get () { return this._lefts.length || this._rights.length || this._title !== '' } })
Layout.Header.prototype.title = function(title = null) {
  if (title === null)
    return this
  if (typeof title == 'string')
    this._title = title
  return this
}
Layout.Header.prototype.left = function(text = null, icon = null, click = null) {
  if (text === null)
    return this

  if (text instanceof Layout.Header.Button)
    return text.enable && (this._lefts.push(text), this._enable = true), this

  if (typeof text != 'string')
    return this

  if (typeof icon == 'function')
    click = icon, icon = null

  let button = Layout.Header.Button(text, icon, click)
  return button.enable && (this._lefts.push(button), this._enable = true), this
}
Layout.Header.prototype.right = function(text = null, icon = null, click = null) {
  if (text === null)
    return this

  if (text instanceof Layout.Header.Button)
    return text.enable && (this._rights.push(text), this._enable = true), this

  if (typeof text != 'string')
    return this

  if (typeof icon == 'function')
    click = icon, icon = null

  let button = Layout.Header.Button(text, icon, click)
  return button.enable && (this._rights.push(button), this._enable = true), this
}

// 
Layout.Header.Button = function(text, icon = null, click = null) {
  if (!(this instanceof Layout.Header.Button))
    return new Layout.Header.Button(text, icon, click)

  this._text = ''
  this._icon = null
  this._click = null

  if (typeof icon == 'function')
    click = icon, icon = null

  this.text(text).icon(icon).click(click)
}
Object.defineProperty(Layout.Header.Button.prototype, 'enable', { get () { return this._text !== '' || this._icon !== null } })
Layout.Header.Button.prototype.text = function(val) { return typeof val == 'string' && (this._text = val), this }
Layout.Header.Button.prototype.icon = function(val) { return typeof val == 'string' && (this._icon = val), this }
Layout.Header.Button.prototype.click = function(val) { return typeof val == 'function' && (this._click = val), this }

// 
Layout.View = function(identifier, title = null, props = null) {
  if (!(this instanceof Layout.View))
    return typeof identifier == 'string' && identifier !== '' && Vue.options.components[identifier]
      ? new Layout.View(identifier, title, props)
      : null

  this._loading = null
  this._identifier = identifier
  this._props = {}
  this._header = Layout.View.Header()
  this._nav = null
  this._ing = false
  this._status = { animated: false, appear: false, push: false, pushed: false, forward: false, hide: false, didLoad: false }
  
  if (typeof title == 'object')
    props = title, title = null

  this.headerTitle(title).props(props).loading()
}
Object.defineProperty(Layout.View.prototype, 'ing', { get () { return this._ing }, set (val) { return typeof val == 'boolean' && (this._ing = val), this } })
Object.defineProperty(Layout.View.prototype, 'nav', { get () { return this._nav }, get (val) { return val instanceof Layout.View.Nav && (this._nav = val), this } })
Object.defineProperty(Layout.View.prototype, 'data', { get () { return this._props } })
Object.defineProperty(Layout.View.prototype, 'identifier', { get () { return this._identifier } })
Object.defineProperty(Layout.View.prototype, 'header', { get () { return this._header } })
Object.defineProperty(Layout.View.prototype, 'status', { get () { return this._status } })
Layout.View.prototype._ = function(key, val) {
  if (this._status[key] === undefined) return this
  if (typeof val != 'boolean') return this
  this._status[key] = val
  return this
}
Layout.View.prototype.props = function(val) { return typeof val == 'object' && val !== null && !Array.isArray(val) && (this._props = val), this }
Layout.View.prototype.loading = function(loading = '讀取中，請稍候…') { return this._loading = loading, this }
Layout.View.prototype.title = function(title = null) { return this.headerTitle(title) }
Layout.View.prototype.right = function(text = null, icon = null, click = null) { return this.headerRight(text, icon, click) }
Layout.View.prototype.left = function(text = null, icon = null, click = null) { return this.headerLeft(text, icon, click) }
Layout.View.prototype.headerTitle = function(title = null) { return this.header.title(title), this }
Layout.View.prototype.headerRight = function(text = null, icon = null, click = null) { return this.header.right(text, icon, click), this }
Layout.View.prototype.headerLeft = function(text = null, icon = null, click = null) { return this.header.left(text, icon, click), this }

// 
Layout.View.Nav = function(layout) {
  if (!(this instanceof Layout.View.Nav))
    return new Layout.View.Nav(layout)
  
  this._layout = layout
  this._views = []
  this._view = null
  this._ing = false
  this._status = {
    display: false,
    present: false,
    presented: false,
  }
}

Object.defineProperty(Layout.View.Nav.prototype, 'data', { get () { return this.view.data } })
Object.defineProperty(Layout.View.Nav.prototype, 'layout', { get () { return this._layout } })
Object.defineProperty(Layout.View.Nav.prototype, 'views', { get () { return this._views } })
Object.defineProperty(Layout.View.Nav.prototype, 'ing', { get () { return this._ing }, set (ing) { return typeof ing == 'boolean' && (this._ing = ing), this } })
Object.defineProperty(Layout.View.Nav.prototype, 'view', { get () { return this._view }, set (view) { return this.push(view, this.view ? true : false) } })
Object.defineProperty(Layout.View.Nav.prototype, 'status', { get () { return this._status } })
Object.defineProperty(Layout.View.Nav.prototype, 'display', { get () { return this.view !== null && this.status.display == true } })

Layout.View.Nav.prototype.present = function(view = null, completion = null, animated = true) {
  if (typeof view == 'function') animated = completion, completion = view, view = null
  if (typeof view == 'boolean') animated = view, completion = null, view = null
  if (typeof completion == 'boolean') animated = completion, completion = null
  if (typeof animated != 'boolean') animated = true
  if (view instanceof Layout.View) this.view = view

  if (!this.view) return this
  if (this.ing) return this
  else this.ing = true

  this.status.display = true

  if (animated) {
    setTimeout(_ => {
      this.status.present = true
      setTimeout(_ => {
        this.status.presented = true
        this.ing = false
        typeof completion == 'function' && completion.call(this.layout, this.layout, this, this.view)
      }, 360)
    }, 10)
  } else {
    this.status.present = true
    setTimeout(_ => {
      this.status.presented = true
      this.ing = false
      typeof completion == 'function' && completion.call(this.layout, this.layout, this, this.view)
    }, 50)
  }
  return this
}
Layout.View.Nav.prototype.dismiss = function(completion = null, animated = true) {
  if (typeof completion == 'boolean') animated = completion, completion = null
  if (typeof animated != 'boolean') animated = true

  if (this.ing) return this
  else this.ing = true

  if (animated) {
    this.status.presented = false
    setTimeout(_ => {
      this.status.present = false

      setTimeout(_ => {
        this._views = []
        this._view = null
        this.status.display = false
        this.ing = false
        typeof completion == 'function' && completion.call(this.layout, this.layout, this)
      }, 360)
    }, 10)
  } else {
    this.status.presented = false
    this.status.present = false
    this._views = []
    this._view = null
    this.status.display = false
    this.ing = false
    typeof completion == 'function' && completion.call(this.layout, this.layout, this)
  }

  return this
}
Layout.View.Nav.prototype.push = function(view = null, completion = null, animated = true) {
  if (!(view instanceof Layout.View)) return this
  if (typeof completion == 'boolean') animated = completion, completion = null
  if (typeof animated != 'boolean') animated = true

  if (view.ing) return this
  else view.ing = true

  const prev = this.view
  view.header._left === null
    ? prev
      ? view.headerLeft('返回', '__back', (_, nav) => nav.pop())
      : null//view.headerLeft('關閉', (_, nav) => nav.dismiss())
    : null

  view.nav = this
  this.views.push(view)
  this._view = view

  view._('animated', animated)
  prev && prev._('animated', animated)

  if (animated) {
    setTimeout(_ => {
      view._('appear', true)
      setTimeout(_ => {
        view._('push', true)
        prev && prev._('forward', true)

        setTimeout(_ => {
          view._('pushed', true, view.ing = false)._('didLoad', true)
          typeof completion == 'function' && completion.call(this.layout, this.layout, this, this.view)
        }, 350)
      }, 25)
    }, 10)
  } else {
    view._('appear', true)
    view._('push', true)
    prev && prev._('forward', true)
    view._('pushed', true, view.ing = false)._('didLoad', true)
    typeof completion == 'function' && completion.call(this.layout, this.layout, this, this.view)
  }

  return this
}
Layout.View.Nav.prototype.pop = function(completion = null, animated = true) {
  if (typeof completion == 'boolean') animated = completion, completion = null
  if (typeof animated != 'boolean') animated = true

  const prev = this.views.length > 1 ? this.views[this.views.length - 2] : null
  if (prev == null)
    return this.dismiss(completion, animated)

  const now  = this.view
  if (now.ing) return
  else now.ing = true

  now._('animated', animated)
  prev && prev._('animated', animated)

  if (animated) {
    now._('pushed', false)
    setTimeout(_ => {
      now._('push', false)
      prev && prev._('forward', false)

      setTimeout(_ => {
        now._('appear', false)
        setTimeout(_ => {
          const view = this.views.pop()
          this._view = prev
          now.ing = false
          typeof completion == 'function' && completion.call(this.layout, this.layout, this, prev, view)
        }, 10)
      }, 350)
    }, 25)
  } else {
    now._('pushed', false)
    now._('push', false)
    prev && prev._('forward', false)
    now._('appear', false)
    const view = this.views.pop()
    this._view = prev
    now.ing = false
    typeof completion == 'function' && completion.call(this.layout, this.layout, this, prev, view)
  }
  return this
}
Layout.View.Nav.prototype.root = function(completion = null, animated = true) {
  if (typeof completion == 'boolean') animated = completion, completion = null
  if (typeof animated != 'boolean') animated = true
  
  if (this.views.length == 0) return this
  if (this.views.length == 1) return typeof completion == 'function' && completion.call(this.layout, this.layout, this, view), this
  if (this.views.length == 2) return this.pop(completion, animated)

  const prev = this.views[0]
  const now  = this._view

  if (now.ing) return
  else now.ing = true

  now._('animated', animated)
  prev && prev._('animated', animated)

  const mids = this.views.slice(1, -1)
  mids.forEach(now => (now.ing = true, now._('hide', true)._('animated', false)))

  if (animated) {
    now._('pushed', false)

    setTimeout(_ => {
      now._('push', false)
      mids.forEach(now => now._('push', false)._('forward', false))
      prev && prev._('forward', false)

      setTimeout(_ => {
        now._('appear', false)
        mids.forEach(now => now._('appear', false))
        setTimeout(_ => {
          const views = this.views.splice(1)
          this._view = prev
          now.ing = false
          typeof completion == 'function' && completion.call(this.layout, this.layout, this, prev, views)
        }, 10)
      }, 350)
    }, 25)
  } else {
    now._('pushed', false)
    now._('push', false)
    mids.forEach(now => now._('push', false)._('forward', false))
    prev && prev._('forward', false)
    now._('appear', false)
    mids.forEach(now => now._('appear', false))
    const views = this.views.splice(1)
    this._view = prev
    now.ing = false
    typeof completion == 'function' && completion.call(this.layout, this.layout, this, prev, views)
  }
  return this
}
Layout.View.Nav.prototype.update = function(view = null, completion = null, animated = true) {
  if (!(view instanceof Layout.View)) return this
  if (!this.display) return this.present(view, completion, animated)
  if (typeof completion == 'boolean') animated = completion, completion = null
  if (typeof animated != 'boolean') animated = true

  if (this.ing) return this
  else this.ing = true

  this._view._loading = view._loading
  this._view._identifier = view._identifier
  this._view._props = view._props
  this._view._header = view._header
  this.ing = false
  return typeof completion == 'function' && completion.call(this.layout, this.layout, this, this.view), this
}
Layout.View.Nav.prototype.flash = function(view = null, completion = null, animated = true) {
  if (!(view instanceof Layout.View)) return this
  if (typeof completion == 'boolean') animated = completion, completion = null
  if (typeof animated != 'boolean') animated = true

  !this.display
    ? this.present(view, completion, animated)
    : this.dismiss(_ => this.present(view, completion, animated), animated)
  return this
}
Layout.View.Nav.prototype.loading = function(loading = '讀取中，請稍候…') { return this.viewLoading(loading) }
Layout.View.Nav.prototype.viewLoading = function(loading = '讀取中，請稍候…') { return this.view && this.view.loading(loading), this }
Layout.View.Nav.prototype.title = function(title = null) { return this.viewHeaderTitle(title) }
Layout.View.Nav.prototype.left = function(text = null, icon = null, click = null) { return this.viewHeaderLeft(text, icon, click) }
Layout.View.Nav.prototype.right = function(text = null, icon = null, click = null) { return this.viewHeaderRight(text, icon, click) }
Layout.View.Nav.prototype.headerTitle = function(title = null) { return this.viewHeaderTitle(title) }
Layout.View.Nav.prototype.headerLeft = function(text = null, icon = null, click = null) { return this.viewHeaderLeft(text, icon, click) }
Layout.View.Nav.prototype.headerRight = function(text = null, icon = null, click = null) { return this.viewHeaderRight(text, icon, click) }
Layout.View.Nav.prototype.viewHeaderTitle = function(title = null) { return this.view && this.view.headerTitle(title), this }
Layout.View.Nav.prototype.viewHeaderLeft = function(text = null, icon = null, click = null) { return this.view && this.view.headerLeft(text, icon, click), this }
Layout.View.Nav.prototype.viewHeaderRight = function(text = null, icon = null, click = null) { return this.view && this.view.headerRight(text, icon, click), this }

// 
Layout.View.Header = function(title = null, left = null, right = null) {
  if (!(this instanceof Layout.View.Header))
    return new Layout.View.Header(title, left, right)
  this._title = ''
  this._left = null
  this._right = null
  this._enable = false

  this.title(title)
  this.left(left)
  this.right(right)
}
Object.defineProperty(Layout.View.Header.prototype, 'enable', { get () { return this._enable } })
Layout.View.Header.prototype.title = function(title = null) {
  if (title === null)
    return this

  if (typeof title == 'string')
    this._title = title, this._enable = true

  return this
}
Layout.View.Header.prototype.right = function(text = null, icon = null, click = null) {
  if (text === null)
    return this

  if (text instanceof Layout.Header.Button)
    return text.enable && (this._right = text, this._enable = true), this

  if (typeof text != 'string')
    return this

  if (typeof icon == 'function')
    click = icon, icon = null

  let button = Layout.Header.Button(text, icon, click)
  return button.enable && (this._right = button, this._enable = true), this
}
Layout.View.Header.prototype.left = function(text = null, icon = null, click = null) {
  if (text === null)
    return this

  if (text instanceof Layout.Header.Button)
    return text.enable && (this._left = text, this._enable = true), this

  if (typeof text != 'string')
    return this
  
  if (typeof icon == 'function')
    click = icon, icon = null

  let button = Layout.Header.Button(text, icon, click)
  return button.enable && (this._left = button, this._enable = true), this
}

// 
Load.VueComponent('_layout-aside-view', {
  props: {
    layout: { type: Layout, required: true },
    nav: { type: Layout.View.Nav, required: true },
    view: { type: Layout.View, required: true },
  },
  data: _ => ({
    is: [0,1,2,3,4,5,6,7,8,9,10,11]
  }),
  computed: {
    header () {
      return this.view.header
    },
    left () {
      return this.header && this.header._left
    },
    right () {
      return this.header && this.header._right
    },
    className () { 
      return {
        __animated: this.view.status.animated,
        __appear: this.view.status.appear,
        __push: this.view.status.push,
        __pushed: this.view.status.pushed,
        __forward: this.view.status.forward,
        __hide: this.view.status.hide
      }
    }
  },
  methods: {
    click (e, button) {
      return typeof button._click == 'function' && button._click.call(this.layout, this.layout, this.nav, this.view, this.header, button, e)
    }
  },
  template: `
    div._view => :class=className
      header._header => *if=header.enable
        label => *if=left   *text=left._text   :class=['__left', ...left._icon ? [left._icon, '__iy'] : ['__in'], left._text === '' ? '__tn' : '__ty']   @click=e => click(e, left)
        span => *text=header._title   :class={__only: !header._left && !header._right}
        label => *if=right   *text=right._text   :class=['__right', ...right._icon ? [right._icon, '__iy'] : ['__in'], right._text === '' ? '__tn' : '__ty']   @click=e => click(e, right)

      div._loading => *if=view._loading
        div._container
          div
            i => *for=i in is   :key=i   :class='__i' + i
          span => *if=typeof view._loading == 'string' && view._loading !== ''   *text=view._loading

      div._body => *if=view.status.didLoad
        component => :is=view.identifier   :layout=layout   :nav=nav   :view=view   :header=header   v-bind=view._props`
})

Load.VueComponent('_layout-aside', {
  props: {
    layout: { type: Layout, required: true },
    nav: { type: Layout.View.Nav, required: true },
  },
  computed: {
    className () {
      return {
        __present: this.nav.status.present,
        __presented: this.nav.status.presented
      }
    }
  },
  template: `
    aside => *if=nav.display   :class=className
      _layout-aside-view => *for=(view, i) in nav.views   :key=i   :view=view   :layout=layout   :nav=nav`
})

Load.VueComponent('_layout-menu', {
  props: {
    layout: { type: Layout, required: true },
    nav: { type: Layout.View.Nav, required: true },
    view: { type: Layout.View, required: true },
    header: { type: Layout.View.Header, required: true },
    page: { type: String, required: false, default: '' },
    items: { type: Array, required: true },
  },
  template: `
    div#menu-items
      label => *for=(item, i) in items   :key=i   :class=[item.icon ? '_icon_y' : '_icon_n', item.description === '' ? '_desc_n' : '_desc_y', page == item.page ? 'active' : '']   @click=typeof item.click == 'function' ? item.click.call() : Redirect(item.page)
        i => *if=item.icon   :class=item.icon
        b => *text=item.text
        span => *text=item.description`
})

Load.VueComponent('layout', {
  props: {
    // menu: { type: String, required: true }
  },
  data: _ => ({
    layout: Layout.shared = Layout(),
    menu: [
      { page: 'index', text: '首頁',    icon: 'index' },
      { page: 'members', text: '人員管理', icon: 'members' },
      { page: 'albums', text: '相簿管理', icon: 'albums' },
      { page: 'tags', text: '標籤管理', icon: 'tags' },
      { page: 'logout', text: '登出',   icon: 'logout', click: _ => Alert.shared.reset('確定要登出？').button('取消', alert => alert.dismiss()).button('確定', alert => alert.loading(_ => Change('login', Flash.Toastr.success('登出成功！')))).present() },
    ]
  }),
  mounted () {
    Layout.shared.left.present(Layout
      .View('_layout-menu', { items: this.menu, page: null })
      .loading(false)
      .title(''), false)
  },
  methods: {
    click(e, button) {
      typeof button._click == 'function' && button._click.call(this.layout, this.layout, this.header, button, e)
    }
  },
  computed: {
    header () { return this.layout.header },
    lefts () { return this.header.lefts },
    rights () { return this.header.rights },
  },
  template: `
  main#app
    _layout-aside#left => :layout=layout   :nav=layout.left
    _layout-aside#right => :layout=layout   :nav=layout.right

    div#main
      div#main-container
        slot => name=main

    header#main-header
      nav#main-nav => *if=header.enable
        div._lefts => *if=lefts.length
          label._scalc => *for=(btn, i) in lefts   :key=i   *text=btn._text   :class=[...btn._icon ? [btn._icon, '_iy'] : ['_in'], btn._text === '' ? '_tn' : '_ty']   @click=e=>click(e, btn)

        h1._title => *text=header._title   :class=[!lefts.length && !rights.length ? '_only' : '']

        div._rights => *if=rights.length
          label._scalc => *for=(btn, i) in rights   :key=i   *text=btn._text   :class=[...btn._icon ? [btn._icon, '_iy'] : ['_in'], btn._text === '' ? '_tn' : '_ty']   @click=e=>click(e, btn)

      slot => *else   name=header
  `
})
