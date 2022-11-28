/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const GoogleMap = {
  closure: null,
  inited: false,
  base () {
    if (this.inited) return
    else this.inited = true

    void function() { // init GoogleMap.Marker
      GoogleMap.Marker.prototype = Object.create(google.maps.OverlayView.prototype)

      Object.assign(GoogleMap.Marker.prototype, {
        draw () {
          this._vue.pixel = this._vue.$el && this._vue.position ? this.getProjection().fromLatLngToDivPixel(this._vue.position) : null
          return this
        },
        onAdd () {
          this._vue.$el || this._el.appendChild(this._vue.$mount().$el)
          this._removeVue()._addVue()
          this._vue.$el && this.getPanes().overlayImage.appendChild(this._vue.$el)
          this._vue.$el && this._vue.$el.addEventListener('click', e => e.stopPropagation())
          this._vue.$el && this._vue.$el.addEventListener('dblclick', e => e.stopPropagation())
          return this
        },
        remove () {
          this._removeVue()
          this._vue.$el && this._vue.$el.parentNode.removeChild(this._vue.$el)
          this._vue.$el = null
          return this
        },
        setPosition (latLng) {
          if (latLng === null) {
            this._vue.position = null
            this.draw()
            return this
          }

          if (!(typeof latLng == 'object' && latLng !== null))
            return this

          if (Array.isArray(latLng))
            if (latLng.length < 2)
              return this
            else
              latLng = new google.maps.LatLng(latLng[0], latLng[1])

          if (!(latLng instanceof google.maps.LatLng))
            if (latLng.lat === undefined || latLng.lng === undefined)
              return this
            else
              latLng = new google.maps.LatLng(latLng.lat, latLng.lng)

          if (!(latLng instanceof google.maps.LatLng))
            return this
          
          this._vue.position = latLng
          this.draw()

          return this
        },
        setClassName (val) {
          val = GoogleMap.Marker._toStr(val, true)
          if (val === null || val === '')
            return this
          
          this._vue.className = val
          return this
        },
        setTop (val) {
          val = GoogleMap.Marker._toNum(val)
          if (val === null)
            return this

          this._vue.top = val
          return this
        },
        setLeft (val) {
          val = GoogleMap.Marker._toNum(val)
          if (val === null)
            return this
          
          this._vue.left = val
          return this
        },
        setWidth (val) {
          val = GoogleMap.Marker._toNum(val)
          if (val === null || val <= 0)
            return this

          this._vue.width = val
          return this
        },
        setHeight (val) {
          val = GoogleMap.Marker._toNum(val)
          if (val === null || val <= 0)
            return this

          this._vue.height = val
          return this
        },
        setText (val) {
          val = GoogleMap.Marker._toStr(val, true)
          if (val === null)
            return this
            
          this._vue.text = val
          return this
        },
        setHtml (val) {
          val = GoogleMap.Marker._toStr(val, true)
          if (val === null)
            return this
          
          this._vue.html = val
          return this
        },
        onDrag (func) {
          if (func === null) {
            if (this._vue.drag) {
              google.maps.event.removeListener(this._vue.drag.mouseleave)
              google.maps.event.removeListener(this._vue.drag.mousemove) 
            }

            this._vue.drag = null

            delete this._vue.events.mousedown;
            delete this._vue.events.mouseup;

            return this
          }

          if (typeof func != 'function')
            return this

          this._vue.drag = {
            able: true,
            ing: false,
            origin: null,
            mouseleave: null,
            mousemove: null,
            func,
            default: this.map.get('draggable')
          }

          this._vue.events.mousedown = e => {
            if (!this.map)
              return

            this.map.set('draggable', false)
            
            this._vue.drag.ing = true
            this._vue.drag.origin = e

            this._vue.drag.func.call(this, this.position, 0, this, e)

            this._vue.drag.mouseleave = this.getMap().getDiv().addEventListener('mouseleave', e => this._vue.events && this._vue.events.mouseup && this._vue.events.mouseup())
            this._vue.drag.mousemove = this.getMap().getDiv().addEventListener('mousemove', e => {
              if (!(this._vue.drag && this._vue.drag.origin))
                return

              let left   = this._vue.drag.origin.clientX - e.clientX
              let top    = this._vue.drag.origin.clientY - e.clientY
              let pos    = this.getProjection().fromLatLngToDivPixel(this.position)
              let latLng = this.getProjection().fromDivPixelToLatLng(new google.maps.Point(pos.x - left, pos.y-top))

              this._vue.drag.origin = e
              this.setPosition(latLng)

              this._vue.drag.func.call(this, latLng, 1, this, e)
            })
          }

          this._vue.events.mouseup = e => {
            if (!this.map)
              return

            this.map.set('draggable', this._vue.drag.default)

            google.maps.event.removeListener(this._vue.drag.mouseleave)
            google.maps.event.removeListener(this._vue.drag.mousemove)

            this._vue.drag.ing = false
            this._vue.drag.origin = null

            this._vue.drag.mouseleave = null
            this._vue.drag.mousemove = null
            this._vue.drag.func.call(this, this.position, -1, this, e)
          }

          return this
        },
        onClick (val) {
          if (typeof val != 'function')
            return this

          this._vue.events.click = val.bind(this, this.position, this)
          return this
        },
        onEvents (val) {
          if (!(typeof val == 'object' && val !== null && !Array.isArray(val)))
            return this

          let events = {}
          for (let key in val)
            if (typeof val[key] == 'function')
              events[key] = val[key].bind(this, this.position, this)

          this._vue.events = events
          return this
        },
        setCss (val) {
          if (val === undefined)
            return this

          if (!(typeof val == 'object' && val !== null && !Array.isArray(val)))
            return this

          this._vue.css = val
          return this
        },
        setVue (val) {
          if (val === undefined)
            return this

          if (typeof val == 'function')
            val = val()

          if (!(typeof val == 'object' && val !== null && !Array.isArray(val)))
            return this

          if (!(val instanceof Vue)) {

            if (typeof val.template == 'undefined')
              val.template = ''

            if (typeof El3 != 'undefined') {
              if (typeof val.template == 'string')
                val.template = El3(val.template)

              if (val.template instanceof El3)
                val.template = val.template.toString()
            }

            if (typeof val.template == 'object')
              val.template = val.template.toString()

            val = new Vue(val)
          }

          if (!(val instanceof Vue))
            return this
          
          this._removeVue()
          val.marker = this
          this._vue.vue = val
          this._addVue()

          return this
        },
        setOptions (options) {
          if (!(typeof options == 'object' && options !== null && !Array.isArray(options)))
            options = {}
          
          this.setTop(options.top).setTop(options.t)
          this.setLeft(options.left).setLeft(options.l)
          this.setWidth(options.width).setWidth(options.w)
          this.setHeight(options.height).setHeight(options.h)
          
          this.setHtml(options.html)
          this.setText(options.text)

          this.setVue(options.vue)

          this.setClassName(options.className).setClassName(options.class).setClassName(options.c)
          this.setCss(options.style)

          this.onEvents(options.events)

          this.setPosition(options.position)
          this.setMap(options.map)

          return this
        },
        _removeVue () {
          if (this._vue.vue && this._vue.vue.$el) {
            this._vue.vue.$el.parentNode.removeChild(this._vue.vue.$el)  
            this._vue.vue.$el = null
            this._vue.vue = null
          }

          return this
        },
        _addVue () {
          this._vue.vue && this._vue.$el && this._vue.$el.appendChild(this._vue.vue.$mount().$el)
          return this
        },
      })

      Object.defineProperty(GoogleMap.Marker.prototype, 'className', { get () { return this._vue.className } })
      Object.defineProperty(GoogleMap.Marker.prototype, 'class', { get () { return this._vue.className } })
      Object.defineProperty(GoogleMap.Marker.prototype, 'c', { get () { return this._vue.className } })

      Object.defineProperty(GoogleMap.Marker.prototype, 'width', { get () { return this._vue.width } })
      Object.defineProperty(GoogleMap.Marker.prototype, 'height', { get () { return this._vue.height } })
      Object.defineProperty(GoogleMap.Marker.prototype, 'w', { get () { return this._vue.width } })
      Object.defineProperty(GoogleMap.Marker.prototype, 'h', { get () { return this._vue.height } })

      Object.defineProperty(GoogleMap.Marker.prototype, 'top', { get () { return this._vue.top } })
      Object.defineProperty(GoogleMap.Marker.prototype, 'left', { get () { return this._vue.left } })
      Object.defineProperty(GoogleMap.Marker.prototype, 't', { get () { return this._vue.top } })
      Object.defineProperty(GoogleMap.Marker.prototype, 'l', { get () { return this._vue.left } })

      Object.defineProperty(GoogleMap.Marker.prototype, 'vue', { get () { return this._vue.vue } })
      Object.defineProperty(GoogleMap.Marker.prototype, 'position', { get () { return this._vue.position } })
    }()

    this.closure && this.closure()
  },
  init (keys, closure) {
    window.gmc = function() { $(window).trigger('gm') }
    $(window).bind('gm', GoogleMap.base.bind(GoogleMap))

    this.closure = closure
    keys = keys[Math.floor((Math.random() * keys.length))]

    $.getScript('https://maps.googleapis.com/maps/api/js?' + (keys ? 'key=' + keys + '&' : '') + 'language=zh-TW&libraries=visualization&callback=gmc', GoogleMap.base.bind(GoogleMap))
  }
}

GoogleMap.Marker = function(className, options = {}, el = null) {
  if (!(this instanceof GoogleMap.Marker))
    return new GoogleMap.Marker(className, options)
  
  this._el = document.body

  if (el instanceof HTMLElement)
    this._el = el
  if (el instanceof Vue)
    this._el = el.$el

  this._vue = new Vue({
    data: {
      drag: null,

      top: null,
      left: null,
      width: null,
      height: null,

      className: null,
      css: {},

      text: null,
      html: null,
      events: {},

      pixel: null,
      position: null,
      vue: null,
    },
    computed: {
      style () {
        if (!(this.pixel && this.$el))
          return {
            display: 'none'
          }

        let h = this.height === null ? this.$el.offsetHeight : this.height
        let w = this.width === null ? this.$el.offsetWidth : this.width
        let t = this.top === null ? 0 : this.top
        let l = this.left === null ? 0 : this.left

        return {
          cursor: (drag => {
            if (!drag)     return 'default'
            if (drag.ing)  return 'grabbing'
            if (drag.able) return 'grab'
          })(this.drag),

          position: 'absolute',
          display: 'inline-block',
          top: `${this.pixel.y - h / 2 + t}px`,
          left: `${this.pixel.x - w / 2 + l}px`,
          width: `${w}px`,
          height: `${h}px`,
          ...this.css
        }
      },
      content () {
        if (this.vue !== null) return { }
        if (this.html !== null) return { innerHTML: this.html }
        if (this.text !== null) return { innerText: this.text }
        return {}
      }
    },
    template: `<div :class="className" :draggable="drag" :style="style" v-bind.prop="content" v-on="events"></div>`
  })
  this.setOptions(options).setClassName(className)
}

GoogleMap.Marker._toStr = (val, trim) => {
  if (typeof val == 'function')
    val = val()

  if (typeof val == 'object' && val !== null)
    val = `${val}`
  
  if (typeof val == 'number')
    if (isNaN(val))
      return null
    else
      val = `${val}`

  if (typeof val != 'string')
    return null

  return trim ? val.trim() : val
}
GoogleMap.Marker._toNum = val => {
  val = GoogleMap.Marker._toStr(val, true)
  
  if (val === null || val === '')
    return null

  val = parseFloat(val)
  return isNaN(val) ? null : val
}
