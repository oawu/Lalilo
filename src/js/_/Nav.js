/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Nav = function(root, type = 'center') {
  if (!(this instanceof Nav))
    return new Nav(root, type)
  
  if (typeof root == 'string')
    type = root, root = null

  const nav = this

  this._vue = new Vue({
    data: {
      nav,
      ing: false,
      views: [],
      view: null,
      status: {
        type: null,
        display: false,
        present: false,
        presented: false,
      }
    },
    computed: {
      display () {
        return this.view !== null && this.status.display == true
      },
      className () {
        return [
          `__t${this.status.type}`,
          {
            __present: this.status.present,
            __presented: this.status.presented
          }
        ]
      }
    },
    methods: {
      present(view = null, completion = null, animated = true) {
        if (typeof view == 'function') animated = completion, completion = view, view = null
        if (typeof view == 'boolean') animated = view, completion = null, view = null
        if (typeof completion == 'boolean') animated = completion, completion = null
        if (typeof animated != 'boolean') animated = true
        if (view instanceof Nav.View) this.nav.view = view

        if (!this.view) return this
        if (this.ing) return this
        else this.ing = true

        this.$el || this.$mount() && document.body.append(this.$el)
        this.status.display = true

        if (animated) {
          setTimeout(_ => {
            this.status.present = true
            setTimeout(_ => {
              this.status.presented = true
              this.ing = false
              typeof completion == 'function' && completion.call(this.nav, this.nav, this.view)
            }, 360)
          }, 10)
        } else {
          this.status.present = true
          setTimeout(_ => {
            this.status.presented = true
            this.ing = false
            typeof completion == 'function' && completion.call(this.nav, this.nav, this.view)
          }, 50)
        }
        return this
      },
      dismiss(completion = null, animated = true) {
        if (typeof completion == 'boolean') animated = completion, completion = null
        if (typeof animated != 'boolean') animated = true

        if (this.ing) return this
        else this.ing = true

        if (animated) {
          this.status.presented = false
          setTimeout(_ => {
            this.status.present = false

            setTimeout(_ => {
              this.views = []
              this.view = null
              this.status.display = false
              this.ing = false
              typeof completion == 'function' && completion.call(this.nav, this.nav)
            }, 360)
          }, 10)
        } else {
          this.status.presented = false
          this.status.present = false
          this.views = []
          this.view = null
          this.status.display = false
          this.ing = false
          typeof completion == 'function' && completion.call(this.nav, this.nav)
        }

        return this
      },
      push(view, completion = null, animated = true) {
        if (!(view instanceof Nav.View)) return this
        if (typeof completion == 'boolean') animated = completion, completion = null
        if (typeof animated != 'boolean') animated = true

        if (view.ing) return this
        else view.ing = true

        const prev = this.view
        prev && view.header._left === null && view.headerLeft('返回', '__back', nav => nav.pop())

        view.nav = this.nav
        this.views.push(view)
        this.view = view

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

                typeof completion == 'function' && completion.call(this.nav, this.nav, this.view)
              }, 350)
            }, 25)
          }, 10)
        } else {
          view._('appear', true)
          view._('push', true)
          prev && prev._('forward', true)
          view._('pushed', true, view.ing = false)._('didLoad', true)
          typeof completion == 'function' && completion.call(this.nav, this.nav, this.view)
        }

        return this
      },
      pop(completion = null, animated = true) {
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
                this.view = prev
                now.ing = false
                typeof completion == 'function' && completion.call(this.nav, this.nav, prev, view)
              }, 10)
            }, 350)
          }, 25)
        } else {
          now._('pushed', false)
          now._('push', false)
          prev && prev._('forward', false)
          now._('appear', false)
          const view = this.views.pop()
          this.view = prev
          now.ing = false
          typeof completion == 'function' && completion.call(this.nav, this.nav, prev, view)
        }
        return this
      },
      root(completion = null, animated = true) {
        if (typeof completion == 'boolean') animated = completion, completion = null
        if (typeof animated != 'boolean') animated = true
        
        if (this.views.length == 0) return this
        if (this.views.length == 1) return typeof completion == 'function' && completion.call(this.nav, this.nav, view), this
        if (this.views.length == 2) return this.pop(completion, animated)

        const prev = this.views[0]
        const now  = this.view

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
                this.view = prev
                now.ing = false
                typeof completion == 'function' && completion.call(this.nav, this.nav, prev, views)
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
          this.view = prev
          now.ing = false
          typeof completion == 'function' && completion.call(this.nav, this.nav, prev, views)
        }
        return this
      },
      update(view = null, completion = null, animated = true) {
        if (!(view instanceof Nav.View)) return this
        if (!this.display) return this.present(view, completion, animated)
        if (typeof completion == 'boolean') animated = completion, completion = null
        if (typeof animated != 'boolean') animated = true

        if (this.ing) return this
        else this.ing = true

        this.view._loading = view._loading
        this.view._identifier = view._identifier
        this.view._props = view._props
        this.view._header = view._header
        this.ing = false
        return typeof completion == 'function' && completion.call(this.nav, this.nav, this.view), this
      },
      flash(view = null, completion = null, animated = true) {
        if (!(view instanceof Nav.View)) return this
        if (typeof completion == 'boolean') animated = completion, completion = null
        if (typeof animated != 'boolean') animated = true

        !this.display
          ? this.present(view, completion, animated)
          : this.dismiss(_ => this.present(view, completion, animated), animated)
        return this
      }
    },
    template: `<div v-if="display" :class="className" id="nav"><div class="_views"><_view v-for="(view, i) in views" :key="i" :nav="nav" :view="view"></_view></div></div>`,
  })

  this._vue.$options.components['_view'] = {
    props: {
      nav: { type: Nav, required: true },
      view: { type: Nav.View, required: true }
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
          __animated: this.view._status.animated,
          __appear: this.view._status.appear,
          __push: this.view._status.push,
          __pushed: this.view._status.pushed,
          __forward: this.view._status.forward,
          __hide: this.view._status.hide }
      }
    },
    methods: {
      click (e, button) {
        return typeof button._click == 'function' && button._click.call(this.nav, this.nav, this.view, this.header, button, e)
      }
    },
    template: `<div :class="className" class="_view"><header v-if="header.enable" class="_header"><label v-if="left" v-text="left._text" :class="['__left', ...left._icon ? [left._icon, '__iy'] : ['__in'], left._text === '' ? '__tn' : '__ty']" v-on:click="e => click(e, left)"></label><span v-text="header._title" :class="{__only: !left && !right}"></span><label v-if="right" v-text="right._text" :class="['__right', ...right._icon ? [right._icon, '__iy'] : ['__in'], right._text === '' ? '__tn' : '__ty']" v-on:click="e => click(e, right)"></label></header><div v-if="view._loading" class="_loading"><div class="_container"><div><i v-for="i in is" :key="i" :class="'__i' + i"></i></div><span v-if="typeof view._loading == 'string' && view._loading !== ''" v-text="view._loading"></span></div></div><div v-if="view._status.didLoad" class="_body"><component :is="view.identifier" :nav="nav" :view="view" :header="header" v-bind="view._props"></component></div></div>`
  }

  this.type(type).view = root
}

Nav.Type = { center: 'c', c: 'c', right: 'r', r: 'r', left: 'l', l: 'l', bottom: 'b', b: 'b', top: 't', t: 't' }
Object.defineProperty(Nav, 'shared', { get () { return this._shared === undefined ? this._shared = this() : this._shared } })
Object.defineProperty(Nav.prototype, 'views', { get () { return this._vue.views } })
Object.defineProperty(Nav.prototype, 'view', { get () { return this._vue.view }, set (view) { return this.push(view, this.view ? true : false) } })
Object.defineProperty(Nav.prototype, 'data', { get () { return this.view.data } })
Nav.prototype.type = function(type) { return typeof type == 'string' && Nav.Type[type.toLowerCase()] !== undefined && (this._vue.status.type = Nav.Type[type]), this }
Nav.prototype.present = function(view = null, completion = null, animated = true) { return this._vue.present(view, completion, animated), this }
Nav.prototype.dismiss = function(completion = null, animated = true) { return this._vue.dismiss(completion, animated), this }
Nav.prototype.push = function(view, completion = null, animated = true) { return this._vue.push(view, completion, animated), this }
Nav.prototype.pop = function(completion = null, animated = true) { return this._vue.pop(completion, animated), this }
Nav.prototype.root = function(completion = null, animated = true) { return this._vue.root(completion, animated), this }
Nav.prototype.update = function(view = null, completion = null, animated = true) { return this._vue.update(view, completion, animated), this }
Nav.prototype.flash = function(view = null, completion = null, animated = true) { return this._vue.flash(view, completion, animated), this }
Nav.prototype.loading = function(loading = '讀取中，請稍候…') { return this.viewLoading(loading) }
Nav.prototype.viewLoading = function(loading = '讀取中，請稍候…') { return this.view && this.view.loading(loading), this }
Nav.prototype.title = function(title = null) { return this.viewHeaderTitle(title) }
Nav.prototype.right = function(text = null, icon = null, click = null) { return this.viewHeaderRight(text, icon, click) }
Nav.prototype.left = function(text = null, icon = null, click = null) { return this.viewHeaderLeft(text, icon, click) }
Nav.prototype.headerTitle = function(title = null) { return this.viewHeaderTitle(title) }
Nav.prototype.headerRight = function(text = null, icon = null, click = null) { return this.viewHeaderRight(text, icon, click) }
Nav.prototype.headerLeft = function(text = null, icon = null, click = null) { return this.viewHeaderLeft(text, icon, click) }
Nav.prototype.viewHeaderTitle = function(title = null) { return this.view && this.view.headerTitle(title), this }
Nav.prototype.viewHeaderRight = function(text = null, icon = null, click = null) { return this.view && this.view.headerRight(text, icon, click), this }
Nav.prototype.viewHeaderLeft = function(text = null, icon = null, click = null) { return this.view && this.view.headerLeft(text, icon, click), this }

// 
Nav.View = function(identifier, title = null, props = null) {
  if (!(this instanceof Nav.View))
    return typeof identifier == 'string' && identifier !== '' && Vue.options.components[identifier]
      ? new Nav.View(identifier, title, props)
      : null

  this._loading = null

  this._identifier = identifier
  this._props = {}
  this._header = Nav.View.Header()
  this._nav = null
  this._ing = false
  this._status = { animated: false, appear: false, push: false, pushed: false, forward: false, hide: false, didLoad: false }
  
  if (typeof title == 'object')
    props = title, title = null

  this.headerTitle(title).props(props).loading()
}
Object.defineProperty(Nav.View.prototype, 'ing', { get () { return this._ing }, set (val) { return typeof val == 'boolean' && (this._ing = val), this } })
Object.defineProperty(Nav.View.prototype, 'nav', { get () { return this._nav }, get (val) { return val instanceof Nav && (this._nav = val), this } })
Object.defineProperty(Nav.View.prototype, 'data', { get () { return this._props } })
Nav.View.prototype._ = function(key, val) {
  if (this._status[key] === undefined) return this
  if (typeof val != 'boolean') return this
  this._status[key] = val
  return this
}
Object.defineProperty(Nav.View.prototype, 'identifier', { get () { return this._identifier } })
Object.defineProperty(Nav.View.prototype, 'header', { get () { return this._header } })
Nav.View.prototype.props = function(val) { return typeof val == 'object' && val !== null && !Array.isArray(val) && (this._props = val), this }
Nav.View.prototype.loading = function(loading = '讀取中，請稍候…') { return this._loading = loading, this }
Nav.View.prototype.title = function(title = null) { return this.headerTitle(title) }
Nav.View.prototype.right = function(text = null, icon = null, click = null) { return this.headerRight(text, icon, click) }
Nav.View.prototype.left = function(text = null, icon = null, click = null) { return this.headerLeft(text, icon, click) }
Nav.View.prototype.headerTitle = function(title = null) { return this.header.title(title), this }
Nav.View.prototype.headerRight = function(text = null, icon = null, click = null) { return this.header.right(text, icon, click), this }
Nav.View.prototype.headerLeft = function(text = null, icon = null, click = null) { return this.header.left(text, icon, click), this }

// 
Nav.View.Header = function(title = null, left = null, right = null) {
  if (!(this instanceof Nav.View.Header))
    return new Nav.View.Header(title, left, right)
  this._title = ''
  this._left = null
  this._right = null
  this._enable = false

  this.title(title)
  this.left(left)
  this.right(right)
}
Object.defineProperty(Nav.View.Header.prototype, 'enable', { get () { return this._enable } })
Nav.View.Header.prototype.title = function(title = null) {
  if (title === null)
    return this

  if (typeof title == 'string')
    this._title = title, this._enable = true

  return this
}
Nav.View.Header.prototype.right = function(text = null, icon = null, click = null) {
  if (text === null)
    return this

  if (text instanceof Nav.View.Header.Button)
    return text.enable && (this._right = text, this._enable = true), this

  if (typeof text != 'string')
    return this

  if (typeof icon == 'function')
    click = icon, icon = null

  let button = Nav.View.Header.Button(text, icon, click)
  return button.enable && (this._right = button, this._enable = true), this
}
Nav.View.Header.prototype.left = function(text = null, icon = null, click = null) {
  if (text === null)
    return this

  if (text instanceof Nav.View.Header.Button)
    return text.enable && (this._left = text, this._enable = true), this

  if (typeof text != 'string')
    return this
  
  if (typeof icon == 'function')
    click = icon, icon = null

  let button = Nav.View.Header.Button(text, icon, click)
  return button.enable && (this._left = button, this._enable = true), this
}

// 
Nav.View.Header.Button = function(text, icon = null, click = null) {
  if (!(this instanceof Nav.View.Header.Button))
    return new Nav.View.Header.Button(text, icon, click)

  this._text = ''
  this._icon = null
  this._click = null

  if (typeof icon == 'function')
    click = icon, icon = null

  this.text(text).icon(icon).click(click)
}
Object.defineProperty(Nav.View.Header.Button.prototype, 'enable', { get () { return this._text !== '' || this._icon !== null } })
Nav.View.Header.Button.prototype.text = function(val) { return typeof val == 'string' && (this._text = val), this }
Nav.View.Header.Button.prototype.icon = function(val) { return typeof val == 'string' && (this._icon = val), this }
Nav.View.Header.Button.prototype.click = function(val) { return typeof val == 'function' && (this._click = val), this }
