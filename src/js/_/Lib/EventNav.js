/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Lib.EventNav = function(root = null) {
  if (!(this instanceof Lib.EventNav)) {
    return new Lib.EventNav(root)
  }

  const nav = this

  const _loading = {
    props: {
      view: { type: Lib.EventNav.View, required: true }
    },
    template: `
    <div class="loading">
      <div>
        <div>
          <i v-for="i in [0,1,2,3,4,5,6,7]" :key="i" :n="i"></i>
        </div>
        <span v-if="typeof view.loadingStr == 'string' && view.loadingStr !== ''" v-text="view.loadingStr"></span>
      </div>
    </div>
    `
  }

  const _header = {
    props: {
      header: { type: Object, required: true }
    },
    methods: {
      clickLeft (e) {
        if (this.header.left && typeof this.header.left.click == 'function') {
          this.$emit('click', e, this.header.left)
        }
      },
      clickRight (e) {
        if (this.header.right && typeof this.header.right.click == 'function') {
          this.$emit('click', e, this.header.right)
        }
      },
    },
    template: `
    <header v-if="header" :class="{ header: true, __full: header.left && header.right }">
      <label v-if="header.left" :class="['__left', header.left.className]" v-on:click="clickLeft">{{ header.left.text }}</label>
      <b>{{ header.title }}</b>
      <label v-if="header.right" :class="['__right', header.right.className]" v-on:click="clickRight">{{ header.right.text }}</label>
    </header>
    `
  }

  const _view = {
    props: {
      nav: { type: Lib.EventNav, required: true },
      view: { type: Lib.EventNav.View, required: true }
    },
    data: _ => ({
      headerShow: false,
    }),
    components: { _loading, _header, ...Lib.EventNav.Component.s },
    computed: {
      className () {
        let items = ['view']

        if (this.view.status.n0) { items.push('__n0') }
        if (this.view.status.n1) { items.push('__n1') }
        if (this.view.status.n2) { items.push('__n2') }
        if (this.view.status.n3) { items.push('__n3') }
        if (this.view.status.f0) { items.push('__f0') }
        if (this.view.status.f1) { items.push('__f1') }
        if (this.view.status.f2) { items.push('__f2') }
        if (this.view.status.f3) { items.push('__f3') }

        return items
      }
    },
    methods: {
      click (e, button) {
        button.click.call(this.nav, this.view, this.nav, this.view.header, button)
      },
    },
    template: `
      <div :class="className">
        <_loading v-if="view.loadingStr" :view="view"></_loading>

        <template v-if="view.isMounted">
          <_header :class="{__show: headerShow}" :header="view.header" @click="click"></_header>
          
          <div class="body" :ref="'body'">
            <component :is="view.identifier" :nav="nav" :view="view" :header="view.header" v-bind="view.props"></component>
          </div>
        </template>
      </div>
      `
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
        display: false,
        p0: false,
        p1: false,
      }
    },

    components: { _view },

    computed: {
      display () {
        return this.view !== null
          && this.status.display == true
      },
      style () {
        return {
          '--sec-present': `${this.sec.present / 1000}s`,
          '--sec-push': `${this.sec.push / 1000}s`,
        }
      },
      className () {
        const items = []

        if (this.status.p0) { items.push('__p0') }
        if (this.status.p1) { items.push('__p1') }

        return items
      }
    },
    methods: {
      present(view = null, completion = null, animated = true) {
        if (typeof view == 'string') {
          view = Lib.EventNav.View(view)
        }
        if (typeof view == 'function') {
          animated = completion
          completion = view
          view = null
        }
        if (typeof view == 'boolean') {
          animated = view
          completion = null
          view = null
        }
        if (typeof completion == 'boolean') {
          animated = completion
          completion = null
        }
        if (typeof animated != 'boolean') {
          animated = true
        }
        
        this.nav.view = view

        if (!this.view) {
          return this
        }

        if (this.ing) {
          return this
        }

        this.ing = true

        if (!this.$el && this.$mount()) {
          document.body.append(this.$el)
        }

        this.status.display = true

        if (animated) {
          setTimeout(_ => {
            this.status.p0 = true

            setTimeout(_ => {
              this.status.p1 = true
              this.ing = false

              if (typeof completion == 'function') {
                completion.call(this.nav, this.view, this.nav)
              }
            }, this.sec.present - 1)
          }, this.sec.display)
        } else {
          this.status.p0 = true

          setTimeout(_ => {
            this.status.p1 = true
            this.ing = false
            
            if (typeof completion == 'function') {
              completion.call(this.nav, this.view, this.nav)
            }
          }, this.sec.display)
        }

        return this
      },
      dismiss(completion = null, animated = true) {
        if (typeof completion == 'boolean') {
          animated = completion
          completion = null
        }
        if (typeof animated != 'boolean') {
          animated = true
        }

        if (this.ing) {
          return this
        }

        this.ing = true

        if (animated) {
          this.status.p1 = false

          setTimeout(_ => {
            this.status.p0 = false
            
            setTimeout(_ => {
              this.views = []
              this.view = null
            
              this.status.display = false
              this.ing = false
    
              if (typeof completion == 'function') {
                completion.call(this.nav, this.nav)
              }
            }, this.sec.present - 1)
          }, this.sec.display)
        } else {
          this.status.p1 = false
          this.status.p0 = false
          this.views = []
          this.view = null
          this.status.display = false
          this.ing = false
          
          if (typeof completion == 'function') {
            completion.call(this.nav, this.nav)
          }
        }

        return this
      },
      push(view, completion = null, animated = true) {
        if (typeof view == 'string') {
          view = Lib.EventNav.View(view)
        }
        if (!(view instanceof Lib.EventNav.View)) {
          return this
        }
        if (typeof completion == 'boolean') {
          animated = completion
          completion = null
        }
        if (typeof animated != 'boolean') {
          animated = true
        }

        const prev = this.view

        if (this.ing || view.ing || (prev && prev.ing)) {
          return this
        }

        this.ing = true
        view.ing = true
        
        if (prev) {

          prev.ing = true

          if (view.header === null && prev.header) {
            view.header = Lib.EventNav.View.Header()
          }

          if (view.header && view.header.left === null) {
            view.left('返回', _ => this.pop(), { className: '__back' })
          }
        }

        view.nav = this.nav

        this.views.push(view)
        this.view = view

        if (animated) {
          view.status.n0 = true
          if (prev) { prev.status.f0 = true }

          setTimeout(_ => {
            view.status.n1 = true
            if (prev) { prev.status.f1 = true }

            setTimeout(_ => {
              view.status.n2 = true
              if (prev) { prev.status.f2 = true }

              setTimeout(_ => {
                view.status.n3 = true
                if (prev) { prev.status.f3 = true }

                setTimeout(_ => {
                  view.ing = false
                  view.isMounted = true
                  if (prev) { prev.ing = false }
                  
                  this.ing = false
                  if (typeof completion == 'function') {
                    completion.call(this.nav, this.view, this.nav)
                  }
                }, this.sec.display)
              }, this.sec.push - 1)
            }, this.sec.display)
          }, this.sec.display)
        } else {
          view.status.n0 = true
          view.status.n1 = true
          view.status.n2 = true
          view.status.n3 = true

          view.ing = false
          view.isMounted = true

          if (prev) {
            prev.status.f0 = true
            prev.status.f1 = true
            prev.status.f2 = true
            prev.status.f3 = true
            prev.ing = false
          }
          
          this.ing = false
          if (typeof completion == 'function') {
            completion.call(this.nav, this.view, this.nav)
          }
        }

        return this
      },
      pop(completion = null, animated = true) {
        if (typeof completion == 'boolean') {
          animated = completion
          completion = null
        }
        if (typeof animated != 'boolean') {
          animated = true
        }

        const prev = this.views.length > 1
          ? this.views[this.views.length - 2]
          : null

        if (prev === null) {
          return this.dismiss(completion, animated)
        }

        const now = this.view

        if (this.ing || now.ing || prev.ing) {
          return this
        }

        this.ing = true
        now.ing = true
        prev.ing = true

        if (animated) {
          now.status.n3 = false
          prev.status.f3 = false

          setTimeout(_ => {
            now.status.n2 = false
            prev.status.f2 = false

            setTimeout(_ => {
              now.status.n1 = false
              prev.status.f1 = false

              setTimeout(_ => {
                now.status.n0 = false
                prev.status.f0 = false

                const view = this.views.pop()
                this.view = prev

                now.nav = null
                
                now.ing = false
                prev.ing = false
                this.ing = false

                if (typeof completion == 'function') {
                  completion.call(this.nav, this.view, view, this.nav)
                }
              }, this.sec.display)
            }, this.sec.push - 1)
          }, this.sec.display)
        } else {
          now.status.n3 = false
          prev.status.f3 = false

          now.status.n2 = false
          prev.status.f2 = false
          
          now.status.n1 = false
          prev.status.f1 = false
          
          now.status.n0 = false
          prev.status.f0 = false

          const view = this.views.pop()
          this.view = prev

          now.nav = null

          now.ing = false
          prev.ing = false
          this.ing = false

          if (typeof completion == 'function') {
            completion.call(this.nav, this.view, view, this.nav)
          }
        }

        return this
      },
      root(completion = null, animated = true) {
        if (typeof completion == 'boolean') {
          animated = completion
          completion = null
        }
        if (typeof animated != 'boolean') {
          animated = true
        }

        if (this.views.length == 0) {
          return this
        }
        if (this.views.length == 1) {
          if (typeof completion == 'function') {
            completion.call(this.nav, this.view, this.nav)
          }
          return this
        }
        if (this.views.length == 2) {
          return this.pop(completion, animated)
        }

        const prev = this.views[0]
        const now  = this.view
        const mids = this.views.slice(1, -1)

        if (this.ing || now.ing || prev.ing) {
          return this
        }

        this.ing = true
        now.ing = true
        prev.ing = true

        mids.forEach(mid => {
          mid.ing = true
          
          mid.status.n0 = false
          mid.status.n1 = false
          mid.status.n2 = false
          mid.status.n3 = false
          
          mid.status.f0 = false
          mid.status.f1 = false
          mid.status.f2 = false
          mid.status.f3 = false
        })

        if (animated) {
          now.status.n3 = false
          prev.status.f3 = false

          setTimeout(_ => {
            now.status.n2 = false
            prev.status.f2 = false

            setTimeout(_ => {
              now.status.n1 = false
              prev.status.f1 = false

              setTimeout(_ => {
                now.status.n0 = false
                prev.status.f0 = false

                const view = this.views.pop()
                this.view = prev

                now.nav = null
                mids.forEach(mid => mid.nav = null)
                
                now.ing = false
                prev.ing = false
                this.ing = false

                if (typeof completion == 'function') {
                  completion.call(this.nav, this.view, view, this.nav)
                }
              }, this.sec.display)
            }, this.sec.push - 1)
          }, this.sec.display)
        } else {
          now.status.n3 = false
          prev.status.f3 = false

          now.status.n2 = false
          prev.status.f2 = false
          
          now.status.n1 = false
          prev.status.f1 = false
          
          now.status.n0 = false
          prev.status.f0 = false

          const view = this.views.pop()
          this.view = prev

          now.nav = null
          mids.forEach(mid => mid.nav = null)

          now.ing = false
          prev.ing = false
          this.ing = false

          if (typeof completion == 'function') {
            completion.call(this.nav, this.view, view, this.nav)
          }
        }

        return this
      },
      
    },
    template: `
      <div id="event-nav" v-if="display" :style="style" :class="className">
        <div class="views">
          <_view v-for="(view, i) in views" :key="i" :nav="nav" :view="view"></_view>
        </div>
      </div>`,
  })

  this.view = root
}

Object.defineProperty(Lib.EventNav.prototype, 'views', {
  get () { return this._vue.views }
})
Object.defineProperty(Lib.EventNav.prototype, 'view', {
  get () { return this._vue.view }, set (view) { return this._vue.push(view, this._vue.view ? true : false) }
})

Lib.EventNav.prototype.title = function(val) {
  if (this.view) {
    this.view.title(val)
  }
  return this
}
Lib.EventNav.prototype.left = function(val) {
  if (this.view) {
    this.view.left(val)
  }
  return this
}
Lib.EventNav.prototype.right = function(val) {
  if (this.view) {
    this.view.right(val)
  }
  return this
}
Lib.EventNav.prototype.loading = function(val) {
  if (this.view) {
    this.view.loading(val)
  }
  return this
}

Lib.EventNav.prototype.present = function(view = null, completion = null, animated = true) {
  this._vue.present(view, completion, animated)
  return this
}
Lib.EventNav.prototype.dismiss = function(completion = null, animated = true) {
  this._vue.dismiss(completion, animated)
  return this
}
Lib.EventNav.prototype.push = function(view, completion = null, animated = true) {
  this._vue.push(view, completion, animated)
  return this
}
Lib.EventNav.prototype.pop = function(completion = null, animated = true) {
  this._vue.pop(completion, animated)
  return this
}
Lib.EventNav.prototype.root = function(completion = null, animated = true) {
  this._vue.root(completion, animated)
  return this
}
Lib.EventNav.prototype.emit = function(key, ...data) {
  if (this.view) {
    this.view.emit(key, ...data)
  }
  return this
}
Lib.EventNav.prototype.on = function(key, func) {
  if (this.view) {
    this.view.on(key, func)
  }
  return this
}

Lib.EventNav.Component = function(identifier, opt) {
  if (opt === undefined) {
    return opt
  }

  if (typeof opt == 'function') {
    opt = opt()
  }

  if (!(typeof opt == 'object' && opt !== null && !Array.isArray(opt))) {
    return opt
  }

  if (typeof opt.template == 'undefined') {
    opt.template = ''
  }

  if (typeof El3 != 'undefined') {
    if (typeof opt.template == 'string') {
      opt.template = El3(opt.template)
    }

    if (opt.template instanceof El3) {
      opt.template = opt.template.toString()
    }
  }

  if (typeof opt.template == 'object') {
    opt.template = opt.template.toString()
  }

  Lib.EventNav.Component.s[identifier] = opt
}
Lib.EventNav.Component.s = {}

Lib.EventNav.View = function(identifier, props = null) {
  if (!(this instanceof Lib.EventNav.View)) {
    return typeof identifier == 'string' && identifier !== '' && Lib.EventNav.Component.s[identifier]
      ? new Lib.EventNav.View(identifier, props)
      : null
  }

  this.identifier = identifier
  this.ing = false
  this.nav = null

  this.loadingStr = '讀取中，請稍候…'

  this._funcs = new Map()
  this.props = typeof props == 'object' && props !== null && !Array.isArray(props) ? props : {}

  this.header = null

  this.isMounted = false // for mounted
  this.status = {
    n0: false,
    n1: false,
    n2: false,
    n3: false,
    
    f0: false,
    f1: false,
    f2: false,
    f3: false,
  }
}

Lib.EventNav.View.prototype.title = function(val) {
  if (this.header === null) {
    this.header = Lib.EventNav.View.Header()
  }
  this.header.title = val
  return this
}
Lib.EventNav.View.prototype.left = function(text, click, opt = {}) {
  if (this.header === null) {
    this.header = Lib.EventNav.View.Header()
  }
  this.header.left = { text, click, ...opt }
  return this
}
Lib.EventNav.View.prototype.right = function(text, click, opt = {}) {
  if (this.header === null) {
    this.header = Lib.EventNav.View.Header()
  }
  this.header.right = { text, click, ...opt }
  return this
}
Lib.EventNav.View.prototype.loading = function(val) {
  this.loadingStr = val
  return this
}
Lib.EventNav.View.prototype.push = function(view, completion = null, animated = true) {
  if (this.nav) {
    this.nav.push(view, completion, animated)
  }
  return this
}
Lib.EventNav.View.prototype.pop = function(completion = null, animated = true) {
  if (this.nav) {
    this.nav.pop(completion, animated)
  }
  return this
}
Lib.EventNav.View.prototype.present = function(nav, completion = null, animated = true) {
  if (nav instanceof Lib.EventNav) {
    nav.present(this, completion, animated)
  }
  return this
}
Lib.EventNav.View.prototype.dismiss = function(completion = null, animated = true) {
  if (this.nav) {
    this.nav.dismiss(completion, animated)
  }
  return this
}
Lib.EventNav.View.prototype.root = function(completion = null, animated = true) {
  if (this.nav) {
    this.nav.root(completion, animated)
  }
  return this
}
Lib.EventNav.View.prototype.funcs = function(key) {
  let funcs = this._funcs.has(key)
    ? this._funcs.get(key)
    : []

  return Array.isArray(funcs)
    ? funcs
    : []
}
Lib.EventNav.View.prototype.on = function(key, func) {
  if (typeof func == 'function') {
    this._funcs.set(key, this.funcs(key).concat([func]))
  }
  return this
}
Lib.EventNav.View.prototype.emit = function(key, ...data) {
  this.funcs(key).forEach(func => func(...data))
  return this
}

Lib.EventNav.View.Header = function() {
  if (!(this instanceof Lib.EventNav.View.Header)) {
    return new Lib.EventNav.View.Header()
  }

  this._title = ''
  this._left = null
  this._right = null
}

Object.defineProperty(Lib.EventNav.View.Header.prototype, 'title', {
  get () { return this._title },
  set (val) {
    if (typeof val == 'string') { this._title = val }
  },
})
Object.defineProperty(Lib.EventNav.View.Header.prototype, 'left', {
  get () { return this._left },
  set (val) {
    if (typeof val == 'string' && val !== '') {
      val = { text: val }
    }
    if (!(typeof val == 'object' && val !== null && !Array.isArray(val))) {
      return
    }
    if (!(typeof val.text == 'string' && val.text !== '')) {
      return
    }
    if (val instanceof Lib.EventNav.View.Header.Button) {
      return this._left = val
    }

    const btn = Lib.EventNav.View.Header.Button()
    btn.text = val.text
    btn.className = val.className

    if (typeof val.click == 'function') {
      btn.click = val.click
    }

    this._left = btn
  },
})
Object.defineProperty(Lib.EventNav.View.Header.prototype, 'right', {
  get () { return this._right },
  set (val) {
    if (typeof val == 'string' && val !== '') {
      val = { text: val }
    }

    if (!(typeof val == 'object' && val !== null && !Array.isArray(val))) {
      return
    }

    if (!(typeof val.text == 'string' && val.text !== '')) {
      return
    }
    if (val instanceof Lib.EventNav.View.Header.Button) {
      return this._right = val
    }

    const btn = Lib.EventNav.View.Header.Button()
    btn.text = val.text
    btn.className = val.className

    if (typeof val.click == 'function') {
      btn.click = val.click
    }

    this._right = btn
  },
})

Lib.EventNav.View.Header.Button = function() {
  if (!(this instanceof Lib.EventNav.View.Header.Button)) {
    return new Lib.EventNav.View.Header.Button()
  }

  this.text = ''
  this.click = null
  this.className = null
}

Object.defineProperty(Lib.EventNav, 'shared', {
  get () {
    if (this._shared === undefined) {
      this._shared = this()
    }
    return this._shared
  }
})

  