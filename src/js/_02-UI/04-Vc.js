/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 315 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { El3, Helper } = window
  const { Type: T, promisify } = Helper

  const _loading = {
    props: {},
    computed: {
      text() {
        return T.neStr(this.view._loading) ? this.view._loading : ''
      }
    },
    template: El3(`
      .loading
        div
          div
            i => *for=i in [0,1,2,3,4,5,6,7,8,9]   :key='loading_' + i   :class='_i' + i
          span => *if=text !== ''   *text=text
    `).toString()
  }
  const _header = {
    props: {},
    computed: {
      header() {
        return this.view._header instanceof window.Vc.View.Header ? this.view._header : null
      },
      isHide() {
        if (!(this.vc instanceof window.Vc.Nav)) {
          return true
        }
        return !this.header || this.header._hide
      },
      left() {
        if (!this.header) {
          return null
        }
        if (!T.obj(this.header._left)) {
          return null
        }

        if (!T.neStr(this.header._left.text)) {
          return null
        }

        const isP = T.promise(this.header._left.click)
        const isA = T.asyncFunc(this.header._left.click)
        const isF = T.func(this.header._left.click)

        const cls = [{ _click: isP || isA || isF }]
        if (T.neStr(this.header._left.cls)) {
          cls.push(this.header._left.cls)
        }
        if (T.arr(this.header._left.cls)) {
          cls.push(...this.header._left.cls)
        }
        if (T.obj(this.header._left.cls)) {
          cls.push(this.header._left.cls)
        }

        return {
          text: this.header._left.text,
          cls: [{ _click: isP || isA || isF }, this.header._left.cls],
          click: async _ => {
            if (isP) {
              await this.header._left.click
            }
            if (isA) {
              await this.header._left.click.call(this.view, this.view, this.vc, this.header)
            }
            if (isF) {
              this.header._left.click.call(this.view, this.view, this.vc, this.header)
            }
          }
        }
      },
      right() {
        if (!this.header) {
          return null
        }
        if (!T.obj(this.header._right)) {
          return null
        }

        if (!T.neStr(this.header._right.text)) {
          return null
        }

        const isP = T.promise(this.header._right.click)
        const isA = T.asyncFunc(this.header._right.click)
        const isF = T.func(this.header._right.click)

        const cls = [{ _click: isP || isA || isF }]
        if (T.neStr(this.header._right.cls)) {
          cls.push(this.header._right.cls)
        }
        if (T.arr(this.header._right.cls)) {
          cls.push(...this.header._right.cls)
        }
        if (T.obj(this.header._right.cls)) {
          cls.push(this.header._right.cls)
        }

        return {
          text: this.header._right.text,
          cls: [{ _click: isP || isA || isF }, this.header._right.cls],
          click: async _ => {
            if (isP) {
              await this.header._right.click
            }
            if (isA) {
              await this.header._right.click.call(this.view, this.view, this.vc, this.header)
            }
            if (isF) {
              this.header._right.click.call(this.view, this.view, this.vc, this.header)
            }
          }
        }
      },
    },
    template: El3(`
      header.header => *if=!isHide
        label => *if=left   @click=left.click   :class=left.cls
          span => *text=left.text

        b => *text=header._title

        label => *if=right   @click=right.click   :class=right.cls
          span => *text=right.text
    `).toString()

  }
  const _view = {
    props: {},
    computed: {
      cls() {
        return this.view._cls
      }
    },
    components: { _loading, _header },
    template: El3(`
      .view => :class=cls
        _loading => *if=view._loading   :view=view
        template => *if=1 || view._isLoaded
          _header => :vc=vc   :view=view
          .body
            component => :is=view._identifier   :vc=vc   :view=view   *bind=view._props
    `).toString()
  }

  const _footer = {
    props: {},
    methods: {
      click() {
        this.$emit('click', this.vc, this.footer)
        if (T.func(this.footer.click) || T.asyncFunc(this.footer.click)) {
          this.footer.click(this.vc, this.footer)
        }
      }
    },
    render(h) {
      const items = []

      const cls = []
      const icon = this.footer.icon
      if (T.neStr(icon) || icon || T.obj(icon)) {
        items.push(h('i', {}))
        cls.push(icon)
      }
      items.push(h('span', {}, this.footer.text))

      return h('label', { class: cls, on: { click: this.click }}, items)
    }
  }

  // window.Vc$
  void (_ => {
    window.Vc$ = function () {
      if (!(this instanceof window.Vc$)) {
        return new window.Vc$()
      }

      this._vc = null
      this._icon = null

      this._display = false

      this._ani = false
      this._opa1 = false
      this._move = false
      this._ing = false

      this._vue = null

      this._secPresent = 300
    }

    Object.defineProperty(window.Vc$.prototype, 'title', {
      get() {
        return ''
      }
    })

    window.Vc$.prototype.icon = function(name) {
      this._icon = name
      return this
    }

    window.Vc$.prototype.present = function (completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        if (T.obj(this._vue) && this._vue instanceof Vue && !T.obj(this._vue.$el) && this._vue.$mount()) {
          document.body.append(this._vue.$el)
        }

        if (this._display) { return this }
        if (this._ing) { return this }

        this._ing = true

        if (animated) {
          this._display = true
          this._ani = true

          await new Promise(resolve => setTimeout(resolve, 10))
          this._opa1 = true
          this._move = true

          await new Promise(resolve => setTimeout(resolve, this._secPresent - 1))
          this._ani = false

        } else {
          this._display = true
          this._opa1 = true
          this._move = true
        }

        this._ing = false
        document.body.style.overflow = 'hidden'

        return this
      })
    }

    window.Vc$.prototype.dismiss = function (completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        document.body.style.overflow = ''
        if (!this._display) { return this }
        // if (this._ing) { return this }

        this._ing = true
        if (animated) {
          this._ani = true

          await new Promise(resolve => setTimeout(resolve, 1))
          this._opa1 = false
          this._move = false

          await new Promise(resolve => setTimeout(resolve, this._secPresent - 1))
        } else {
          this._move = false
        }

        this._vc = null
        this._opa1 = false
        this._display = false
        this._ing = false
        return this
      })
    }
  })();


  // window.Vc
  void (_ => {
    window.Vc = function (view = null) {
      if (!(this instanceof window.Vc)) {
        return new window.Vc(view)
      }

      window.Vc$.call(this)

      this._view = null

      const _that = this

      this._vue = new Vue({
        data: {
          vc: _that,
        },
        mounted() {
        },
        computed: {
          display() { return this.vc._display },
          cls() {
            return {
              _ani: this.vc._ani,
              _opa1: this.vc._opa1,
              _move: this.vc._move,
            }
          },
          style() { return { } },
          view () { return this.vc._view },
        },

        methods: {
        },

        components: { _view },

        template: El3(`
          .Vc => *if=display   :class=cls   :style=style
            .container
              _view => *if=view   :vc=vc   :view=view
        `).toString()
      })

      this.view(view)
    }

    window.Vc.prototype = Object.create(window.Vc$.prototype)
    window.Vc.prototype.constructor = window.Vc

    Object.defineProperty(window.Vc.prototype, 'title', {
      get() {
        const title = this._view ? this._view._header._title : ''
        return T.neStr(title) ? title : Object.getOwnPropertyDescriptor(window.Vc$.prototype, 'title').get.call(this)
      }
    })

    window.Vc.prototype.view = function (view) {
      view = view instanceof window.Vc.View ? view : null
      if (!view) {
        return this
      }

      this._view = view
      this._view._vc = this

      if (!this._display) {
        return this
      }

      if (this._view && !this._view._isLoaded) {
        this._view._isLoaded = true
        this._view.emitLoaded()
      }
      return this
    }

    window.Vc.prototype.present = function (completion = null, animated = true) {
      if (this._vc) {
        return this
      }

      if (T.bool(completion)) {
        animated = completion
        completion = null
      }

      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        await window.Vc$.prototype.present.call(this, animated)

        if (this._view && !this._view._isLoaded) {
          this._view._isLoaded = true
          this._view.emitLoaded()
        }

        return this
      })
    }

    window.Vc.prototype.dismiss = function (completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        if (this._vc) {
          await this._vc.dismiss(animated)
          return this
        }

        await window.Vc$.prototype.dismiss.call(this, null, animated)

        if (this._view instanceof window.Vc.View) {
          this._view._vc = null
          this._view = null
        }
        this._vue = null

        return this
      })
    }
  })();

  // window.Vc.View
  void (_ => {
    window.Vc.View = function (identifier, props = {}, title = null) {
      if (!(this instanceof window.Vc.View)) {
        return T.neStr(identifier) && _view.components[identifier]
          ? new window.Vc.View(identifier, title, props)
          : null
      }
      this._vc = null

      this._identifier = identifier
      this._header = window.Vc.View.Header()

      this._loading = null
      this._funcs = new Map()
      this._ing = false

      this._props = {}

      this._isLoaded = false
      this._loadeds = []

      this._cls = {
        _ani: false,
        _opa1: false,
        _sdw: false,
        _move_1: false,
        _move_2: false,
      }

      if (T.obj(title)) {
        props = title
        title = ''
      }

      this
        .headerTitle(title)
        .props(props)
        .loading()
    }

    Object.defineProperty(window.Vc.View.prototype, 'data', {
      get() { return this._props }
    })

    Object.defineProperty(window.Vc.View.prototype, 'isLoaded', {
      get() { return this._isLoaded }
    })

    window.Vc.View.prototype.loading = function (loading = '讀取中，請稍候…') {
      this._loading = loading
      return this
    }
    window.Vc.View.prototype.props = function (val) {
      if (T.obj(val)) {
        this._props = { ...this._props, ...val }
      }
      return this
    }
    window.Vc.View.prototype.setProps = function (val) {
      if (T.obj(val)) {
        this._props = val
      }
      return this
    }
    window.Vc.View.prototype.push = function (view, completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        if (!(this._vc instanceof window.Vc.Nav)) {
          return view
        }
        await this._vc.push(view, animated)
        return this
      })
    }
    window.Vc.View.prototype.pop = function (completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        if (!(this._vc instanceof window.Vc.Nav)) {
          return this
        }
        await this._vc.pop(animated)
        return this
      })
    }
    window.Vc.View.prototype.present = function (completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        await window.Vc(this).present(animated)
        return this
      })
    }
    window.Vc.View.prototype.dismiss = function (completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        if (!(this._vc instanceof window.Vc$)) {
          return this
        }
        await this._vc.dismiss(animated)
        return this
      })
    }

    window.Vc.View.prototype.funcs = function (key) {
      let funcs = this._funcs.has(key)
        ? this._funcs.get(key)
        : []
      return Array.isArray(funcs)
        ? funcs
        : []
    }
    window.Vc.View.prototype.on = function (key, func) {
      this._funcs.set(key, this.funcs(key).concat([func]))
      return this
    }
    window.Vc.View.prototype.emit = function (key, ...data) {
      const funcs = this.funcs(key)

      for (const func of funcs) {
        if (T.asyncFunc(func)) {
          func.call(this, this, ...data)
        }

        if (T.func(func)) {
          setTimeout(_ => func.call(this, this, ...data))
        }
      }

      return this
    }

    window.Vc.View.prototype.onLoaded = function (func) {
      if (this._isLoaded) {
        if (T.asyncFunc(func)) {
          func.call(this, this, this._vc)
        }

        if (T.func(func)) {
          setTimeout(_ => func.call(this, this, this._vc))
        }
      } else {
        this._loadeds.push(func)
      }
      return this
    }
    window.Vc.View.prototype.emitLoaded = function () {
      for (const func of this._loadeds) {
        if (T.asyncFunc(func)) {
          func.call(this, this, this._vc)
        }

        if (T.func(func)) {
          // setTimeout(_ => )
            func.call(this, this, this._vc)
        }
      }
      return this
    }

    window.Vc.View.prototype.headerHide = function (hide) {
      this._header.hide(hide)
      return this
    }
    window.Vc.View.prototype.headerTitle = function (title) {
      this._header.title(title)
      return this
    }
    window.Vc.View.prototype.headerLeft = function (text, click = null, cls = null) {
      this._header.left(text, click, cls)
      return this
    }
    window.Vc.View.prototype.headerRight = function (text, click = null, cls = null) {
      this._header.right(text, click, cls)
      return this
    }
    window.Vc.View.prototype.title = function (title) {
      return this.headerTitle(title)
    }
    window.Vc.View.prototype.left = function (text, click = null, cls = null) {
      return this.headerLeft(text, click, cls)
    }
    window.Vc.View.prototype.right = function (text, click = null, cls = null) {
      return this.headerRight(text, click, cls)
    }
  })();

  // window.Vc.View.Header
  void (_ => {
    window.Vc.View.Header = function (title = '', left = null, right = null) {
      if (!(this instanceof window.Vc.View.Header)) {
        return new window.Vc.View.Header(title, left, right)
      }

      this._hide = false

      this._title = ''
      this._left = null
      this._right = null

      this.title(title)
      this.left(left)
      this.right(right)
    }
    window.Vc.View.Header.prototype.hide = function (hide) {
      if (T.bool(hide)) {
        this._hide = hide
      }
      return this
    }
    window.Vc.View.Header.prototype.title = function (title) {
      if (T.str(title)) {
        this._title = title
      }
      return this
    }
    window.Vc.View.Header.prototype.left = function (text, click = null, cls = null) {
      if (text === null) {
        this._left = text
        return this
      }

      if (T.neStr(text)) {
        this._left = { text, click, cls }
        return this
      }
      return this
    }
    window.Vc.View.Header.prototype.right = function (text, click = null, cls = null) {
      if (text === null) {
        this._right = text
        return this
      }

      if (T.neStr(text)) {
        this._right = { text, click, cls }
        return this
      }
      return this
    }
  })();

  // window.Vc.Nav
  void (_ => {
    window.Vc.Nav = function (view = null) {
      if (!(this instanceof window.Vc.Nav)) {
        return new window.Vc.Nav(view)
      }

      window.Vc$.call(this)

      this._view = null
      this._views = []

      this._secPush = 360

      const _that = this

      this._vue = new Vue({
        data: {
          vc: _that
        },
        computed: {
          display() { return this.vc._display },
          cls() {
            return {
              _ani: this.vc._ani,
              _opa1: this.vc._opa1,
              _move: this.vc._move,
            }
          },
          style() { return { } },
          views() { return this.vc._views }
        },

        components: { _view },

        template: El3(`
          .Vc-Nav => *if=display   :class=cls   :style=style
            .nav
              .views
                _view => *for=(view, i) in views   :key='view_' + i   :vc=vc   :view=view
        `).toString()
      })

      this.root(view)
    }

    window.Vc.Nav.prototype = Object.create(window.Vc$.prototype)
    window.Vc.Nav.prototype.constructor = window.Vc.Nav

    Object.defineProperty(window.Vc.Nav.prototype, 'views', {
      get() {
        return this._views
      }
    })
    Object.defineProperty(window.Vc.Nav.prototype, 'title', {
      get() {
        const title = this._views.length ? this._views[0]._header._title : ''
        return T.neStr(title) ? title : Object.getOwnPropertyDescriptor(window.Vc$.prototype, 'title').get.call(this)
      }
    })

    window.Vc.Nav.prototype.root = function (view) {
      if (T.neStr(view)) {
        view = window.Vc.View(view)
      }

      if (!(view instanceof window.Vc.View)) {
        return this
      }

      this._ing = true
      view._ing = true

      view._vc = this
      this._views = [view]
      this._view = view

      view._cls._opa1 = true
      view._cls._move_1 = true

      this._ing = false
      view._ing = false

      // if (view._header._left === null) {
      //   view.headerLeft('關閉', _ => this.dismiss())
      // }

      if (!this._display) {
        return this
      }

      if (this._view) {
        this._view._isLoaded = true
        this._view.emitLoaded()
      }
      return this
    }

    window.Vc.Nav.prototype.present = function (completion = null, animated = true) {
      if (this._vc) {
        return this
      }

      if (T.bool(completion)) {
        animated = completion
        completion = null
      }

      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        await window.Vc$.prototype.present.call(this, animated)

        if (this._view && !this._view._isLoaded) {
          this._view._isLoaded = true
          this._view.emitLoaded()
        }

        return this
      })
    }
    window.Vc.Nav.prototype.dismiss = function (completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        if (this._vc) {
          await this._vc.dismiss(animated)
          return this
        }

        await window.Vc$.prototype.dismiss.call(this, null, animated)

        if (this._view instanceof window.Vc.View) {
          this._view._vc = null
          this._view = null
        }

        for (const view of this._views) {
          if (view instanceof window.Vc.View) {
            view._vc = null
          }
        }

        this._views = []
        this._vue = null

        return this
      })
    }

    window.Vc.Nav.prototype.push = function (view, completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        if (T.neStr(view)) {
          view = window.Vc.View(view)
        }

        if (!(view instanceof window.Vc.View)) {
          return this
        }

        if (this._views.includes(view)) {
          return this
        }

        const prev = this._view

        if (this._ing || view._ing || (prev && prev._ing)) {
          return this
        }

        this._ing = true
        view._ing = true

        if (prev) {
          prev._ing = true

          if (view._header._left === null) {
            view.headerLeft('返回', _ => {
              this.pop()
            }, '_back')
          }
        }

        view._vc = this

        this._views.push(view)
        this._view = view


        if (animated) {
          await Promise.all([
            (async _ => {
              await new Promise(resolve => setTimeout(resolve, 10))

              view._cls._ani = true
              view._cls._opa1 = true
              view._cls._sdw = true

              await new Promise(resolve => setTimeout(resolve, 1))
              view._cls._move_1 = true

              await new Promise(resolve => setTimeout(resolve, this._secPush - 1))
              view._cls._ani = false
              view._cls._sdw = false
            })(),
            (async _ => {
              if (!prev) {
                return
              }

              prev._cls._ani = true
              prev._cls._sdw = true

              await new Promise(resolve => setTimeout(resolve, 1))
              prev._cls._move_1 = false
              prev._cls._move_2 = true

              await new Promise(resolve => setTimeout(resolve, this._secPush - 1))
              prev._cls._ani = false
              prev._cls._opa1 = false
              prev._cls._sdw = false
              prev._ing = false
            })(),
          ])
        } else {
          await Promise.all([
            (async _ => {
              view._cls._opa1 = true
              view._cls._move_1 = true
            })(),

            (async _ => {
              if (!prev) {
                return
              }
              prev._cls._move_2 = true
              prev._cls._move_1 = false
              prev._cls._opa1 = false
              prev._ing = false
            })(),
          ])
        }

        view._ing = false
        this._ing = false

        if (!view._isLoaded) {
          view._isLoaded = true
          view.emitLoaded()
        }

        return this
      })
    }

    window.Vc.Nav.prototype.pop = function (completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        const prev = this._views.length > 1
          ? this._views[this._views.length - 2]
          : null

        if (prev === null) {
          await this.dismiss(completion, animated)
          return this
        }

        const now = this._view

        if (this._ing || now._ing || prev._ing) {
          return this
        }

        this._ing = true
        now._ing = true
        prev._ing = true

        if (animated) {
          await Promise.all([
            (async _ => {

              now._cls._ani = true
              now._cls._sdw = true

              await new Promise(resolve => setTimeout(resolve, 1))
              now._cls._move_1 = false

              await new Promise(resolve => setTimeout(resolve, this._secPush - 1))
              now._cls._opa1 = false

            })(),
            (async _ => {
              prev._cls._ani = true
              prev._cls._sdw = true
              prev._cls._opa1 = true

              await new Promise(resolve => setTimeout(resolve, 1))
              prev._cls._move_2 = false
              prev._cls._move_1 = true

              await new Promise(resolve => setTimeout(resolve, this._secPush - 1))
              prev._cls._ani = false
              prev._cls._sdw = false
            })(),
          ])
        } else {
          await Promise.all([
            (async _ => {
              now._cls._move_1 = false
              now._cls._opa1 = false
            })(),
            (async _ => {
              prev._cls._opa1 = true
              prev._cls._move_2 = false
              prev._cls._move_1 = true
            })(),
          ])

        }

        const view = this._views.pop()
        view._vc = null

        this._view = prev

        now._nav = null
        now._ing = false

        prev._ing = false
        this._ing = false
      })
    }
  })();

  // window.Vc.Tab
  void (_ => {
    window.Vc.Tab = function (vcs = []) {
      if (!(this instanceof window.Vc.Tab)) {
        return new window.Vc.Tab(vcs)
      }

      window.Vc$.call(this)

      this._items = []

      const _that = this

      this._vue = new Vue({
        data: {
          vc: _that,
          index: null
        },
        mounted() {
        },
        computed: {
          display() { return this.vc._display },
          cls() {
            return {
              _ani: this.vc._ani,
              _opa1: this.vc._opa1,
              _move: this.vc._move,
            }
          },
          style() { return { } },

          footers() {
            const footers = []
            for (const { footer, vc } of this.vc.items) {
              footers.push({ is: '_footer', footer: {
                get text() {
                  return T.neStr(footer.text) ? footer.text : vc.title
                },
                get icon() {
                  if (T.neStr(footer.icon) || T.arr(footer.icon) || T.obj(footer.icon)) {
                    return footer.icon
                  }

                  return T.neStr(vc._icon) || T.arr(vc._icon) || T.obj(vc._icon) ? vc._icon : null
                },
                get click () {
                  return footer.click
                }
              } })
              footers.push({ is: 'i', footer: null, active: false })
            }
            if (footers.length) {
              footers.pop()
            }
            return footers
          }
        },
        methods: {
          click(i) {
            this.index = i

            const item = this.vc.item

            if (item && !item.loaded && item.vc._view) {
              item.loaded = true
              item.vc._view._isLoaded = true
              item.vc._view.emitLoaded()
            }
          }
        },

        components: { _view, _footer },

        template: El3(`
          .Vc-Tab => *if=display   :class=cls   :style=style
            .container => :index=index
              .tabs
                .tab => *for=(item, i) in vc.items   :key='tab-' + i
                  template => *if=item.type == 'vc'
                    _view => :vc=item.vc   :view=item.vc._view

                  template => *if=item.type == 'vc.nav'
                    .nav
                      .views
                        _view => *for=(view, i) in item.vc.views   :key='view_' + i   :vc=item.vc   :view=view

              .footer => :n=vc.items.length
                component => *for=({ is, footer }, i) in footers   :key='tab-footer-' + i   :is=is   :vc=vc   :footer=footer   @click=click(i ? i / 2 : 0)
        `).toString()
      })

      if (!T.arr(vcs)) {
        vcs = [vcs]
      }

      for (const vc of vcs) {
        this.add(vc)
      }
    }

    window.Vc.Tab.prototype = Object.create(window.Vc$.prototype)
    window.Vc.Tab.prototype.constructor = window.Vc.Tab


    Object.defineProperty(window.Vc.Tab.prototype, 'items', {
      get() {
        return this._items
      }
    })
    Object.defineProperty(window.Vc.Tab.prototype, 'item', {
      get() {
        const items = this.items
        return this._vue.index < items.length ? items[this._vue.index] : null
      }
    })
    Object.defineProperty(window.Vc.Tab.prototype, 'vc', {
      get() {
        const item = this.item
        if (!T.obj(item)) {
          return null
        }
        return item.vc
      }
    })
    Object.defineProperty(window.Vc.Tab.prototype, 'view', {
      get() {
        const vc = this.vc
        if (!(vc instanceof window.Vc$)) {
          return null
        }
        if (vc instanceof window.Vc.Nav) {
          return vc._view
        }
        if (vc instanceof window.Vc) {
          return vc._view
        }
        return null
      }
    })

    window.Vc.Tab.prototype.index = function(index = null) {
      if (!(index === null || (T.num(index) && index >= 0))) {
        return this
      }
      this._vue.click(index)
      return this
    }

    window.Vc.Tab.prototype.add = function(footer, vc = null) {
      if (footer instanceof window.Vc$) {
        vc = footer
        footer = ''
      }
      if (T.str(footer)) [
        footer = { text: footer, icon: null }
      ]
      if (!(T.obj(footer) && T.str(footer.text))) {
        return this
      }
      if (!(vc instanceof window.Vc$)) {
        return this
      }

      if (this._vue.index === null) {
        this._vue.index = 0
      }

      const type = vc instanceof window.Vc.Nav ? 'vc.nav' : 'vc'

      vc._vc = this
      this._items.push({ type, footer, vc, loaded: false })

      if (!this._display) {
        return this
      }

      const item = this.item

      if (item && !item.loaded && item.vc._view) {
        item.loaded = true
        item.vc._view._isLoaded = true
        item.vc._view.emitLoaded()
      }
      return this
    }

    window.Vc.Tab.prototype.present = function (completion = null, animated = true) {
      if (this._vc) {
        return this
      }

      if (T.bool(completion)) {
        animated = completion
        completion = null
      }

      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        await window.Vc$.prototype.present.call(this, animated)

        const item = this.item

        if (item && !item.loaded && item.vc._view) {
          item.loaded = true
          item.vc._view._isLoaded = true
          item.vc._view.emitLoaded()
        }
        return this
      })
    }

    window.Vc.Tab.prototype.dismiss = function (completion = null, animated = true) {
      if (T.bool(completion)) {
        animated = completion
        completion = null
      }
      if (!T.bool(animated)) {
        animated = true
      }

      return promisify(completion, async _ => {
        if (this._vc) {
          await this._vc.dismiss(animated)
          return this
        }

        await window.Vc$.prototype.dismiss.call(this, null, animated)

        for (const item of this._items) {
          if (item.vc instanceof window.Vc$) {
            item.vc._vc = null
            if (item.vc._view instanceof window.Vc.View) {
              item.vc._view._vc = null
            }
          }
        }

        this._items = []
        return this
      })
    }
  })();

  void (_ => {
    window.Vc.View.Component = function (identifier, opt) {
      if (!T.neStr(identifier)) {
        return null
      }

      if (opt === undefined) {
        return null
      }

      if (T.func(opt)) {
        opt = opt()
      }

      if (!T.obj(opt)) {
        return null
      }

      if (opt.template === undefined) {
        opt.template = ''
      }

      if (T.func(opt.template)) {
        opt.template = opt.template()
      }

      if (T.num(opt.template)) {
        opt.template = `${opt.template}`
      }
      if (T.bool(opt.template)) {
        opt.template = ''
      }
      if (T.arr(opt.template)) {
        opt.template = ''
      }

      if (T.str(opt.template)) {
        opt.template = El3(opt.template)
      }

      if (T.func(El3) && opt.template instanceof El3) {
        opt.template = opt.template.toString()
      }

      if (T.obj(opt.template)) {
        opt.template = opt.template.toString()
      }

      _view.components[identifier] = opt

      return opt
    }

    _loading.props.view = { type: window.Vc.View, required: true }

    _header.props.vc = { type: window.Vc$, required: true }
    _header.props.view = { type: window.Vc.View, required: true }

    _view.props.vc = { type: window.Vc$, required: true }
    _view.props.view = { type: window.Vc.View, required: true }

    _footer.props.footer = { type: Object, required: true }
    _footer.props.vc = { type: window.Vc$, required: true }
  })();

})()