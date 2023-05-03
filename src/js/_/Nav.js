/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Nav = function(root, type = 'center') {
  if (!(this instanceof Nav))
    return new Nav(root, type)

  const nav = this

  const _header = {
    props: {
      header: { type: Object, required: true }
    },
    computed: {
      enable () { return !(this.title === '' && this.left === null && this.right === null) },
      title () { return this.header._title },
      left () { return this.header._left },
      right () { return this.header._right },
      className () { return { _header: true, __full: this.left === null && this.right === null } }
    },
    template: `<header v-if="enable" :class="className"><label v-if="left" class="_left" v-on:click="e => typeof left._click == 'function' && $emit('click', e, left)"><i v-if="left._icon" :class='left._icon'></i><span v-if="left._text !== ''">{{ left._text }}</span></label><b @dblclick="$emit('dblclick')">{{ title }}</b><label v-if="right" class="_right" v-on:click="e => typeof right._click == 'function' && $emit('click', e, right)"><i v-if="right._icon" :class='right._icon'></i><span v-if="right._text !== ''">{{ right._text }}</span></label></header>`
  }

  const _loading = {
    props: {
      view: { type: Nav.View, required: true }
    },
    template: `<div class="_loading"><div><div><i v-for="i in [0,1,2,3,4,5,6,7,8,9,10,11]" :key="i" :class="'__i' + i"></i></div><span v-if="typeof view._loading == 'string' && view._loading !== ''" v-text="view._loading"></span></div></div>`
  }

  const _view = {
    props: {
      nav: { type: Nav, required: true },
      view: { type: Nav.View, required: true }
    },
    data: _ => ({
      headerShow: false,
    }),
    components: { _header, _loading, ...Nav.Component.s },
    mounted () {
      this.scroll(0)
    },
    computed: {
      className () {
        let items = ['_view']

        this.view._status.a && items.push('__a')
        this.view._status.n0 && items.push('__n0')
        this.view._status.n1 && items.push('__n1')
        this.view._status.n2 && items.push('__n2')
        this.view._status.n3 && items.push('__n3')
        this.view._status.f0 && items.push('__f0')
        this.view._status.f1 && items.push('__f1')
        this.view._status.f2 && items.push('__f2')
        this.view._status.f3 && items.push('__f3')
        this.view._status.h && items.push('__h')
        return items
      }
    },
    methods: {
      scroll (i) {
        if (!this.view._header._autoShow)
          return this.headerShow = true
        if (i >= 20 && !this.headerShow)
          this.headerShow = true
        if (i < 20 && this.headerShow)
          this.headerShow = false
      },
      dblclick () {
        if (!this.$refs.body)
          return this
        this.$refs.body.scrollTo({top: 0, behavior: 'smooth'})
      }
    },
    template: `<div :class="className"><_loading v-if="view._loading" :view="view"></_loading><template v-if="view._isLoaded"><_header @dblclick="dblclick" :class="{__show: headerShow}" :header="view.header" @click="(e, b) => b._click.call(nav, view, nav, e, view.header, b)"></_header><div class="_body" @scroll="e=>scroll(e.target.scrollTop)" :ref="'body'"><component :is="view.identifier" :nav="nav" :view="view" :header="view.header" v-bind="view._props"></component></div></template></div>`
  }

  this._vue = new Vue({
    data: {
      nav,
      ing: false,

      views: [],
      view: null,

      sec: {
        display: 10,
        present: 360,
        push: 360
      },

      status: {
        type: null,
        isCover: null,
        display: false,
        p0: false,
        p1: false,
      }
    },

    components: { _view },

    computed: {
      display () {
        return this.view !== null && this.status.display == true
      },
      style () {
        return {
          '--sec-present': `${this.sec.present / 1000}s`,
          '--sec-push': `${this.sec.push / 1000}s`,
          '--max-height': this.status.type.height ? `${this.status.type.height}px` : '',
        }
      },
      className () {
        let items = []
        items.push(`__type_to_${this.status.type.to}`)
        items.push(`__type_from_${this.status.type.from}`)
        items.push(`__type_height_${this.status.type.height !== null ? 'y' : 'n'}`)
        items.push(`__cover_${(((this.status.type.to == 'center') || (this.status.type.to == 'bottom')) && this.status.isCover === null) || this.status.isCover ? 'y' : 'n'}`)
        this.status.p0 && items.push('__p0')
        this.status.p1 && items.push('__p1')
        return items
      }
    },
    methods: {
      present(view = null, completion = null, animated = true) {
        if (typeof view == 'string')
          view = Nav.View(view)
        if (typeof view == 'function')
          animated = completion, completion = view, view = null
        if (typeof view == 'boolean')
          animated = view, completion = null, view = null
        if (typeof completion == 'boolean')
          animated = completion, completion = null
        if (typeof animated != 'boolean')
          animated = true
        if (view instanceof Nav.View)
          this.nav.view = view

        if (!this.view)
          return this

        if (this.ing)
          return this

        this.ing = true

        this.$el || this.$mount() && document.body.append(this.$el)
        this.status.display = true

        animated
          ? setTimeout(_ => setTimeout(_ => {
              this.status.p1 = true
              this.ing = false
              typeof completion == 'function' && completion.call(this.nav, this.view, this.nav)
            }, this.sec.present - 1, this.status.p0 = true), this.sec.display)
          : setTimeout(_ => {
              this.status.p1 = true
              this.ing = false
              typeof completion == 'function' && completion.call(this.nav, this.view, this.nav)
            }, this.sec.display, this.status.p0 = true)

        return this
      },
      dismiss(completion = null, animated = true) {
        if (typeof completion == 'boolean')
          animated = completion, completion = null
        if (typeof animated != 'boolean')
          animated = true

        if (this.ing)
          return this

        this.ing = true

        animated
          ? setTimeout(_ => setTimeout(_ => {
              this.views = []
              this.view = null
              this.status.display = false
              this.ing = false
              typeof completion == 'function' && completion.call(this.nav, this.nav)
            }, this.sec.present - 1, this.status.p0 = false), this.sec.display, this.status.p1 = false)
          : (_ => {
              this.status.p1 = false
              this.status.p0 = false
              this.views = []
              this.view = null
              this.status.display = false
              this.ing = false
              typeof completion == 'function' && completion.call(this.nav, this.nav)
            })()

        return this
      },
      push(view, completion = null, animated = true) {
        if (typeof view == 'string')
          view = Nav.View(view)
        if (!(view instanceof Nav.View))
          return this
        if (typeof completion == 'boolean')
            animated = completion, completion = null
        if (typeof animated != 'boolean')
          animated = true

        const prev = this.view

        if (this.ing || view._ing || (prev && prev._ing))
          return this

        this.ing = true
        view._('ing', true)
        
        if (prev) {
          prev._('ing', true)
          view._header._left === null && view.headerLeft('返回', '_back', _ => this.pop())
        }

        view._nav = this.nav
        this.views.push(view)
        this.view = view

        animated
          ? setTimeout(_ => setTimeout(_ => setTimeout(_ => setTimeout(_ => {
              view._('n3', true)
              prev && prev._('f3', true)
              typeof completion == 'function' && completion.call(this.nav, this.view, this.nav)
            }, this.sec.display, view._('n2', true)._('a', false)._('ing', false)._('load', true), prev && prev._('f2', true)._('a', false)._('ing', false), this.ing = false), this.sec.push - 1, view._('n1', true), prev && prev._('f1', true)), this.sec.display, view._('n0', true), prev && prev._('f0', true)), this.sec.display, view._('a', true), prev && prev._('a', true))
          : (_ => {
              view._('a', false)._('n0', true)._('n1', true)._('n2', true)._('n3', true)._('ing', false)._('load', true)
              prev && prev._('a', false)._('f0', true)._('f1', true)._('f2', true)._('f3', true)._('ing', false)
              this.ing = false
              typeof completion == 'function' && completion.call(this.nav, this.view, this.nav)
            })()

        return this
      },
      pop(completion = null, animated = true) {
        if (typeof completion == 'boolean')
          animated = completion, completion = null
        if (typeof animated != 'boolean')
          animated = true

        const prev = this.views.length > 1
          ? this.views[this.views.length - 2]
          : null

        if (prev === null)
          return this.dismiss(completion, animated)

        const now  = this.view

        if (this.ing || now._ing || prev._ing)
          return this

        this.ing = true
        now._('ing', true)
        prev._('ing', true)

        animated
          ? setTimeout(_ => setTimeout(_ => {
              const view = this.views.pop()
              this.view = prev

              now._nav = null
              now._('n0', false)._('ing', false)
              prev._('f0', false)._('ing', false)
              this.ing = false

              typeof completion == 'function' && completion.call(this.nav, this.view, view, this.nav)
            }, this.sec.push - 1, now._('n1', false), prev._('f1', false)), this.sec.display, now._('a', true)._('n3', false)._('n2', false), prev._('a', true)._('f3', false)._('f2', false))
        : (_ => {
            now._('a', false)._('n3', false)._('n2', false)._('n1', false)._('n0', false)._('ing', false)
            prev._('a', false)._('f3', false)._('f2', false)._('f1', false)._('f0', false)._('ing', false)

            const view = this.views.pop()
            this.view = prev
            now._nav = null
            this.ing = false

            typeof completion == 'function' && completion.call(this.nav, this.view, view, this.nav)
          })()
        
        return this
      },
      root(completion = null, animated = true) {
        if (typeof completion == 'boolean')
          animated = completion, completion = null
        if (typeof animated != 'boolean')
          animated = true

        if (this.views.length == 0) 
          return this
        if (this.views.length == 1)
          return typeof completion == 'function' && completion.call(this.nav, this.view, this.nav), this
        if (this.views.length == 2)
          return this.pop(completion, animated)

        const prev = this.views[0]
        const now  = this.view
        const mids = this.views.slice(1, -1)

        if (this.ing || now._ing || prev._ing)
          return this

        this.ing = true
        now._('ing', true)
        prev._('ing', true)

        mids.forEach(mid => {
          mid._('ing', true)
          mid._('a', false)._('h', true)._('n0', false)._('n1', false)._('n2', false)._('n3', false)._('f0', false)._('f1', false)._('f2', false)._('f3', false)
        })

        animated
          ? setTimeout(_ => setTimeout(_ => {
              const views = this.views.splice(1)
              this.view = prev

              now._nav = null
              mids.forEach(mid => mid._nav = null)

              now._('n0', false)._('ing', false)
              prev._('f0', false)._('ing', false)

              this.ing = false
              typeof completion == 'function' && completion.call(this.nav, this.view, this.nav, views)
            }, this.sec.push - 1, now._('a', true)._('n1', false), prev._('a', true)._('f1', false)), this.sec.display, now._('a', true)._('n3', false)._('n2', false), prev._('a', true)._('f3', false)._('f2', false))
          : (_ => {
              now._('a', false)._('n3', false)._('n2', false)._('n1', false)._('n0', false)._('ing', false)
              prev._('a', false)._('f3', false)._('f2', false)._('f1', false)._('f0', false)._('ing', false)

              const views = this.views.splice(1)
              this.view = prev
              now._nav = null
              mids.forEach(mid => mid._nav = null)
              this.ing = false

              typeof completion == 'function' && completion.call(this.nav, this.view, this.nav, views)
            })()

        return this
      },
      update(view = null, completion = null, animated = true) {
        if (typeof view == 'string')
          view = Nav.View(view)
        if (!(view instanceof Nav.View))
          return this
        if (!this.display)
          return this.present(view, completion, animated)
        if (typeof completion == 'boolean')
          animated = completion, completion = null
        if (typeof animated != 'boolean')
          animated = true

        if (this.ing)
          return this

        this.ing = true
        view._nav = this.nav

        return this.view.update(view, _ => {
          this.ing = false
          typeof completion == 'function' && completion.call(this.nav, this.view, this.nav)
        }), this
      },
      flash(view = null, completion = null, animated = true) {
        if (typeof view == 'string')
          view = Nav.View(view)
        if (!(view instanceof Nav.View))
          return this
        if (typeof completion == 'boolean')
          animated = completion, completion = null
        if (typeof animated != 'boolean')
          animated = true

        this.display
          ? this.dismiss(_ => this.present(view, completion, animated), animated)
          : this.present(view, completion, animated)
        return this
      }
    },
    template: `<div v-if="display" :style="style" :class="className" id="__oaui-na"><div class="_na"><div class="_views"><_view v-for="(view, i) in views" :key="i" :nav="nav" :view="view"></_view></div></div></div>`,
  })

  this.type(type).view = root
}
  Object.defineProperty(Nav, 'shared', {
    get () { return this._shared === undefined ? this._shared = this() : this._shared }
  })
  Object.defineProperty(Nav.prototype, 'views', {
    get () { return this._vue.views }
  })
  Object.defineProperty(Nav.prototype, 'view', {
    get () { return this._vue.view },
    set (view) { return this._vue.push(view, this._vue.view ? true : false) }
  })
  Object.defineProperty(Nav.prototype, 'rootView', {
    get () { return this.views.length ? this.views[0] : null }
  })
  Object.defineProperty(Nav.prototype, 'data', {
    get () { return this.view.data }
  })
  Object.defineProperty(Nav.prototype, 'isRoot', {
    get () { return this.views.length == 1 }
  })
  Object.defineProperty(Nav.prototype, 'isDisplay', {
    get () { return this._vue.display }
  })
  Nav.prototype.cover = function(val) {
    if (typeof val == 'boolean')
      this._vue.status.isCover = val
    return this
  }
  Nav.prototype.type = function(type) {
    if (typeof type == 'string' && ['center', 'left', 'right', 'bottom'].includes(type))
      type = { at: type }

    if (!(typeof type == 'object' && type !== null && !Array.isArray(type)))
      return this

    let tmp = {}

    if (type.to === undefined)
      type.to = 'center'

    if (!['center', 'right', 'left', 'bottom'].includes(type.to))
      type.to = 'center'

    tmp.to = type.to

    if (tmp.to == 'center') {
      if (type.from === undefined) type.from = 'bottom'
      tmp.from = ['top', 'bottom', 'center'].includes(type.from) ? type.from : 'bottom'
    }

    if (tmp.to == 'left') {
      if (type.from === undefined) type.from = 'left'
      tmp.from = ['left', 'top', 'bottom'].includes(type.from) ? type.from : 'left'
    }

    if (tmp.to == 'right') {
      if (type.from === undefined) type.from = 'right'
      tmp.from = ['right', 'top', 'bottom'].includes(type.from) ? type.from : 'right'
    }

    if (tmp.to == 'bottom') {
      if (type.from === undefined) type.from = 'bottom'
      tmp.from = ['bottom'].includes(type.from) ? type.from : 'bottom'
    }

    tmp.from = tmp.from

    if (tmp.to == 'bottom' && tmp.from == 'bottom') {
      if (type.height === undefined) type.height = null
      type.height = parseFloat(type.height)
      tmp.height = type.height = isNaN(type.height) ? null : type.height
    }

    this._vue.status.type = tmp
    return this
  }
  Nav.prototype.present = function(view = null, completion = null, animated = true) {
    this._vue.present(view, completion, animated)
    return this
  }
  Nav.prototype.dismiss = function(completion = null, animated = true) {
    this._vue.dismiss(completion, animated)
    return this
  }
  Nav.prototype.push = function(view, completion = null, animated = true) {
    this._vue.push(view, completion, animated)
    return this
  }
  Nav.prototype.pop = function(completion = null, animated = true) {
    this._vue.pop(completion, animated)
    return this
  }
  Nav.prototype.root = function(completion = null, animated = true) {
    this._vue.root(completion, animated)
    return this
  }
  Nav.prototype.update = function(view = null, completion = null, animated = true) {
    this._vue.update(view, completion, animated)
    return this
  }
  Nav.prototype.flash = function(view = null, completion = null, animated = true) {
    this._vue.flash(view, completion, animated)
    return this
  }
  Nav.prototype.viewHeaderTitle = function(title = '') {
    if (this.view)
      this.view.headerTitle(title)
    return this
  }
  Nav.prototype.viewHeaderRight = function(text = null, icon = null, click = null) {
    if (this.view)
      this.view.headerRight(text, icon, click)
    return this
  }
  Nav.prototype.viewHeaderLeft = function(text = null, icon = null, click = null) {
    if (this.view)
      this.view.headerLeft(text, icon, click)
    return this
  }
  Nav.prototype.viewHeaderAutoShow = function(val) {
    if (this.view)
      this.view.headerAutoShow(val)
    return this
  }
  Nav.prototype.viewLoading = function(loading = '讀取中，請稍候…') {
    if (this.view)
      this.view.loading(loading)
    return this
  }
  Nav.prototype.viewProps = function(props) {
    if (this.view)
      this.view.props(props)
    return this
  }
  Nav.prototype.viewEmit = function(key, ...data) {
    if (this.view)
      this.view.viewEmit(key, ...data)
    return this
  }
  Nav.prototype.viewOn = function(key, func) {
    if (this.view)
      this.view.viewOn(key, func)
    return this
  }
  Nav.prototype.headerTitle = function(title = '') {
    return this.viewHeaderTitle(title)
  }
  Nav.prototype.headerRight = function(text = null, icon = null, click = null) {
    return this.viewHeaderRight(text, icon, click)
  }
  Nav.prototype.headerLeft = function(text = null, icon = null, click = null) {
    return this.viewHeaderLeft(text, icon, click)
  }
  Nav.prototype.headerAutoShow = function(val) {
    return this.viewHeaderAutoShow(val)
  }
  Nav.prototype.loading = function(loading = '讀取中，請稍候…') {
    return this.viewLoading(loading)
  }
  Nav.prototype.props = function(props) {
    return this.viewProps(props)
  }
  Nav.prototype.emit = function(key, ...data) {
    return this.viewEmit(key, ...data)
  }
  Nav.prototype.on = function(key, func) {
    return this.viewOn(key, func)
  }
  Nav.prototype.title = function(title = '') {
    return this.viewHeaderTitle(title)
  }
  Nav.prototype.right = function(text = null, icon = null, click = null) {
    return this.viewHeaderRight(text, icon, click)
  }
  Nav.prototype.left = function(text = null, icon = null, click = null) {
    return this.viewHeaderLeft(text, icon, click)
  }

Nav.View = function(identifier, title = '', props = null) {
  if (!(this instanceof Nav.View))
    return typeof identifier == 'string' && identifier !== '' && Nav.Component.s[identifier]
      ? new Nav.View(identifier, title, props)
      : null

  this._loading = null
  this._funcs = new Map()

  this._identifier = identifier
  this._props = {}
  this._header = Nav.Header()
  this._nav = null
  this._ing = false
  this._isLoaded = false
  this._status = { a: false, h: false, n0: false, n1: false, n2: false, n3: false, f0: false, f1: false, f2: false, f3: false }
  
  if (typeof title == 'object')
    props = title, title = ''

  this
    .headerTitle(title)
    .props(props)
    .loading()
}
  Object.defineProperty(Nav.View.prototype, 'nav', {
    get () { return this._nav }
  })
  Object.defineProperty(Nav.View.prototype, 'data', {
    get () { return this._props }
  })
  Object.defineProperty(Nav.View.prototype, 'identifier', {
    get () { return this._identifier }
  })
  Object.defineProperty(Nav.View.prototype, 'header', {
    get () { return this._header }
  })
  Nav.View.prototype._ = function(key, val) {
    if (typeof val != 'boolean')
      return this

    if (key === 'ing')
      return this._ing = val, this

    if (key === 'load')
      return this._isLoaded = val, this

    if (this._status[key] === undefined)
      return this

    this._status[key] = val
    return this
  }
  Nav.View.prototype.update = function(view, completion = null) {
    if (!(view instanceof Nav.View))
      return this

    if (this == view)
      return typeof completion == 'function' && completion.call(this._nav, this, this._nav), this

    if (this._ing)
      return this

    this._ing = true

    this._loading = view._loading
    this._funcs = view._funcs
    this._identifier = view._identifier
    this._props = view._props
    this._header = view._header

    this._ing = false

    return typeof completion == 'function' && completion.call(this._nav, this, this._nav), this
  }
  Nav.View.prototype.props = function(val) {
    if (typeof val == 'object' && val !== null && !Array.isArray(val))
      this._props = val
    return this
  }
  Nav.View.prototype.loading = function(loading = '讀取中，請稍候…') {
    this._loading = loading
    return this
  }
  Nav.View.prototype.headerTitle = function(title = '') {
    this._header.title(title)
    return this
  }
  Nav.View.prototype.headerRight = function(text = null, icon = null, click = null) {
    this._header.right(text, icon, click)
    return this
  }
  Nav.View.prototype.headerLeft = function(text = null, icon = null, click = null) {
    this._header.left(text, icon, click)
    return this
  }
  Nav.View.prototype.headerAutoShow = function(val) {
    this._header.autoShow(val)
    return this
  }
  Nav.View.prototype.funcs = function(key) {
    let funcs = this._funcs.has(key) ? this._funcs.get(key) : []
    return Array.isArray(funcs) ? funcs : []
  }
  Nav.View.prototype.on = function(key, func) {
    if (typeof func == 'function')
      this._funcs.set(key, this.funcs(key).concat([func]))
    return this
  }
  Nav.View.prototype.emit = function(key, ...data) {
    this.funcs(key).forEach(func => func(...data))
    return this
  }
  Nav.View.prototype.title = function(title = '') {
    return this.headerTitle(title)
  }
  Nav.View.prototype.right = function(text = null, icon = null, click = null) {
    return this.headerRight(text, icon, click)
  }
  Nav.View.prototype.left = function(text = null, icon = null, click = null) {
    return this.headerLeft(text, icon, click)
  }
  Nav.View.prototype.presentTo = function(nav, completion = null, animated = true) {
    if (nav instanceof Nav)
      nav.present(this, completion, animated)
    return this
  }
  Nav.View.prototype.dismiss = function(completion = null, animated = true) {
    if (this.nav)
      this.nav.dismiss(completion, animated)
    return this
  }
  Nav.View.prototype.push = function(view, completion = null, animated = true) {
    if (this.nav)
      this.nav.push(view, completion, animated)
    return this
  }
  Nav.View.prototype.pop = function(completion = null, animated = true) {
    if (this.nav)
      this.nav.pop(completion, animated)
    return this
  }
  Nav.View.prototype.root = function(completion = null, animated = true) {
    if (this.nav)
      this.nav.root(completion, animated)
    return this
  }
  Nav.View.prototype.updateTo = function(nav, completion = null, animated = true) {
    if (nav instanceof Nav)
      nav.update(this, completion, animated)
    return this
  }
  Nav.View.prototype.flashTo = function(nav, completion = null, animated = true) {
    if (nav instanceof Nav)
      nav.flash(this, completion, animated)
    return this
  }
  Nav.View.prototype.pushTo = function(nav, completion = null, animated = true) {
    if (nav instanceof Nav)
      nav.push(this, completion, animated)
    return this
  }

Nav.Header = function(title = '', left = null, right = null) {
  if (!(this instanceof Nav.Header))
    return new Nav.Header(title, left, right)

  this._title = ''
  this._left = null
  this._right = null
  this._autoShow = false

  this.title(title)
  this.left(left)
  this.right(right)
  }
  Nav.Header.prototype.title = function(title) {
    if (typeof title == 'string')
      this._title = title
    return this
  }
  Nav.Header.prototype.right = function(text, icon = null, click = null) {
    if (text === null)
      return this._right = null, this

    if (text instanceof Nav.Button)
      return this._right = text, this

    if (typeof text != 'string')
      return this

    if (typeof icon == 'function')
      click = icon, icon = null

    let btn = Nav.Button(text, icon, click)
    if (btn.text === '' && btn.icon === null)
      return this
    
    this._right = btn
    return this
  }
  Nav.Header.prototype.left = function(text, icon = null, click = null) {
    if (text === null)
      return this._left = null, this

    if (text instanceof Nav.Button)
      return this._left = text, this

    if (typeof text != 'string')
      return this

    if (typeof icon == 'function')
      click = icon, icon = null

    let btn = Nav.Button(text, icon, click)
    if (btn.text === '' && btn.icon === null)
      return this
    
    this._left = btn
    return this
  }
  Nav.Header.prototype.autoShow = function(val) {
    if (typeof val == 'boolean')
      return this._autoShow = val
    return this
  }

Nav.Button = function(text, icon = null, click = null) {
  if (!(this instanceof Nav.Button))
    return new Nav.Button(text, icon, click)

  this._text = ''
  this._icon = null
  this._click = null

  if (typeof icon == 'function')
    click = icon, icon = null

  this.text(text).icon(icon).click(click)
}
  Nav.Button.prototype.text = function(val) {
    if (typeof val == 'string')
      this._text = val
    return this
  }
  Nav.Button.prototype.icon = function(val) {
    if (typeof val == 'string')
      this._icon = val
    return this
  }
  Nav.Button.prototype.click = function(val) {
    if (typeof val == 'function')
      this._click = val
    return this
  }

Nav.Component = function(identifier, opt) {
  if (opt === undefined)
    return opt

  if (typeof opt == 'function')
    opt = opt()

  if (!(typeof opt == 'object' && opt !== null && !Array.isArray(opt)))
    return opt

  if (typeof opt.template == 'undefined')
    opt.template = ''

  if (typeof El3 != 'undefined') {
    if (typeof opt.template == 'string')
      opt.template = El3(opt.template)

    if (opt.template instanceof El3)
      opt.template = opt.template.toString()
  }

  if (typeof opt.template == 'object')
    opt.template = opt.template.toString()

  Nav.Component.s[identifier] = opt
}
  Nav.Component.s = {}
