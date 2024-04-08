/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

window.Group = function(json) {
  if (!(this instanceof window.Group)) {
    if (!(typeof json == 'object' && json !== null && !Array.isArray(json))) {
      return null
    }

    if (!(typeof json.header == 'string')) {
      return null
    }

    if (!Array.isArray(json.events)) {
      json.events = []
    }

    const group = new window.Group()
    group.header = json.header
    group.events = json.events.map(json => window.Group.Event(json)).filter(t => t !== null)

    return group
  }
  this.header = ''
  this.events = []
  this.isFocus = false
}

window.Group.prototype.toJson = function() {
  return {
    header: this.header,
    events: this.events.map(event => event.toJson()).filter(t => t !== null)
  }
}
window.Group.Event = function(json) {
  if (!(this instanceof window.Group.Event)) {
    if (!(typeof json == 'object' && json !== null && !Array.isArray(json))) {
      return null
    }

    if (!(typeof json.title == 'string' && json.title !== '')) {
      return null
    }

    const event = new window.Group.Event()
    event.title = json.title
    event.subtitle = json.subtitle
    
    let tip = (typeof json.tip == 'object' && json.tip !== null && !Array.isArray(json.tip))
      ? {title: typeof json.tip.title == 'string' ? json.tip.title : '', subtitle: typeof json.tip.subtitle == 'string' ? json.tip.subtitle : ''}
      : null

    if (tip !== null) {
      tip = tip.title === '' && tip.subtitle === '' ? null : tip
    }

    event.tip = tip
    event.points = Array.isArray(json.points) ? json.points.map(point => window.Group.Event.Point(point)).filter(t => t !== null) : []
    event.markers = Array.isArray(json.markers) ? json.markers.map(marker => window.Group.Event.Marker(marker)).filter(t => t !== null) : []

    event.points.reduce((a, b) => {
      if (a.length) { a[a.length - 1].next = b }
      return a.concat([b])
    }, [])

    return event
  }


  this._title = ''
  this._subtitle = ''
  this.tip = null

  this.isFocus = false
  this.isCurrent = false
  
  this.points = []
  this.markers = []
}

Object.defineProperty(window.Group.Event.prototype, 'title', {
  get () {
    return this._title
  },
  set (val) {
    if (!(typeof val == 'string' && val !== '')) {
      return
    }
    return this._title = val
  }
})

Object.defineProperty(window.Group.Event.prototype, 'subtitle', {
  get () {
    return this._subtitle
  },
  set (val) {
    if (!(typeof val == 'string')) {
      return
    }
    return this._subtitle = val
  }
})

window.Group.Event.prototype.pushMarker = function(marker) {
  this.markers.push(marker)
  return this
}
window.Group.Event.prototype.removeMarker = function(marker) {
  let index = this.markers.indexOf(marker)
  
  if (index == -1) {
    return this
  }

  this.markers[index].remove()
  this.markers.splice(index, 1)
  return this
}
window.Group.Event.prototype.pushPoint = function(point, index) {
  if (index < 0) {
    if (this.points.length) {
      this.points[this.points.length - 1].next = point
    }

    this.points.push(point)
  } else {
    point.next = this.points[index].next
    this.points[index].next = point
    this.points.splice(index + 1, 0, point)
  }

  return this
}
window.Group.Event.prototype.removePoint = function(point) {
  let index = this.points.indexOf(point)

  if (index == -1) {
    return this
  }

  if (index > 0) {
    this.points[index - 1].next = this.points[index].next
  }

  this.points[index].remove()
  this.points.splice(index, 1)
  return this
}
window.Group.Event.prototype.toJson = function() {
  return this.title !== '' ? {
    title: this.title,
    subtitle: this.subtitle,
    tip: this.tip != null
      ? this.tip.title === '' && this.tip.subtitle === ''
        ? null
        : this.tip
      : null,
    points: this.points.map(point => point.toJson()).filter(t => t !== null),
    markers: this.markers.map(marker => marker.toJson()).filter(t => t !== null),
  } : null
}

window.Group.Event.Point = function(json) {
  if (!(this instanceof window.Group.Event.Point)) {
    if (!Array.isArray(json)) {
      return null
    }

    if (json.length < 2) {
      return null
    }
    if (!(typeof json[0] == 'number' && !isNaN(json[0]) && json[0] != Infinity)) {
      return null
    }
    if (!(typeof json[1] == 'number' && !isNaN(json[1]) && json[1] != Infinity)) {
      return null
    }

    const point = new window.Group.Event.Point()
    point.position = json
    
    return point
  }

  this.position = null
  this._marker = null
  this._poly = null
  this.next = null
}

window.Group.Event.Point.prototype.init = function(map, func = {}) {
  if (!this.position) {
    return null
  }

  this._marker = GoogleMap.Marker('marker-point', {
    map,
    width: 16,
    height: 16,
    position: new google.maps.LatLng(...this.position),
    html: '<div></div>'
  })

  this._poly = new google.maps.Polyline({
    map,
    strokeColor: 'rgba(255, 59, 48, 1)',
    strokeWeight: 5
  })

  this._poly.addListener('click', e => {
    func.markerInsert && func.markerInsert(this, e.latLng)
  })
  this._marker.onDblClick(_ => {
    func.markerRemove && func.markerRemove(this)
  })
  this._marker.onDrag((latlng, status) => {
    this.position = [latlng.lat(), latlng.lng()]
    func.markerDrag && func.markerDrag(this, latlng, status)
  })

  return this
}
window.Group.Event.Point.prototype.draw = function() {
  if (!this._poly) {
    return this
  }

  this._poly.setPath(this.next ? [
    new google.maps.LatLng(...this.position),
    new google.maps.LatLng(...this.next.position)
  ] : [])

  return this
}
window.Group.Event.Point.prototype.remove = function() {
  if (this._marker) {
    this._marker.setMap(null)
  }
  if (this._poly) {
    this._poly.setMap(null)
  }
  this._marker = null
  this._poly = null

  return this
}
window.Group.Event.Point.prototype.toJson = function() {
  return this.position ? this.position : null
}

window.Group.Event.Marker = function(json) {
  if (!(this instanceof window.Group.Event.Marker)) {
    if (!Array.isArray(json)) {
      return null
    }

    if (json.length < 3) {
      return null
    }

    if (!(typeof json[0] == 'string' && json[0] !== '')) {
      return null
    }
    if (!(typeof json[1] == 'number' && !isNaN(json[1]) && json[1] != Infinity)) {
      return null
    }
    if (!(typeof json[2] == 'number' && !isNaN(json[2]) && json[2] != Infinity)) {
      return null
    }

    const marker = new window.Group.Event.Marker()
    marker.name = json[0]
    marker.position = [json[1], json[2]]
    return marker
  }

  this.position = null
  this._name = ''
  this._marker = null
  this._nameChange = null
}
window.Group.Event.Marker.prototype.init = function(map, func = {}) {
  if (!this.position) {
    return null
  }

  this._marker = GoogleMap.Marker('marker-marker', {
    map,
    width: 8,
    height: 8,
    position: new google.maps.LatLng(...this.position),
    html: `<div class="content"><div><label class="text">${this.name}</label></div></div>`
  })

  this._marker.onDblClick(_ => {
    func.markerDblClick && func.markerDblClick(this)
  })

  this._marker.onDrag((latLng, status) => {
    this.position = [latLng.lat(), latLng.lng()]
    func.markerDrag && func.markerDrag(this, latLng, status)
  })

  this._nameChange = func ? func.nameChange : null

  return this
}

window.Group.Event.Marker.prototype.remove = function() {
  if (this._marker) {
    this._marker.setMap(null)
  }
  
  this._marker = null
  return this
}

Object.defineProperty(window.Group.Event.Marker.prototype, 'name', {
  get () {
    return this._name
  },
  set (val) {
    if (!(typeof val == 'string' && val !== '')) {
      return
    }
    
    if (this._name == val) {
      return
    }

    this._name = val

    if (!this._marker) { return }

    this._marker.setHtml(`<div class="content"><div><label class="text">${this.name}</label></div></div>`)
    this._nameChange && this._nameChange(this, this.name)
  }
})

window.Group.Event.Marker.prototype.toJson = function() {
  if (this.name === '') {
    return null
  }
  if (!this.position) {
    return null
  }
  return [this.name, ...this.position]
}





Load.VueComponent('EventHeader', {
  props: {
    group: { type: window.Group, default: null, required: false },
  },
  methods: {
    edit (val) {
      if (val) {

        this.group.isFocus = true
        setTimeout(_ => {
          if (this.$refs.input) {
            this.$refs.input.focus()
          }
        }, 10)
      } else {
        this.group.isFocus = false
      }
    }
  },
  template: `
  form.header => @submit.prevent=edit(false)
    label.text => *if=!group.isFocus   *text=group.header   @dblclick=edit(true)
    input => type=text   *else   ref=input   @blur=edit(false)   *model.trim=group.header   :placeholder='請輸入標題…'
    .ctrl
      label.sub => @click=$emit('removeGroup', group)
  `
})

Load.VueComponent('EventEvent', {
  props: {
    event: { type: window.Group.Event, default: null, required: false },
  },
  methods: {
    edit (val) {
      if (val) {
        this.event.isFocus = true

        setTimeout(_ => {
          if (this.$refs.input) {
            this.$refs.input.focus()
          }
        }, 10)
      } else {
        this.event.isFocus = false
      }
    }
  },
  template: `
  form.row.event => @submit.prevent=edit(false)   :class={current: event.isCurrent}
    label.cho => @click=$emit('cho', event)
    label.str => *if=!event.isFocus   *text=event.title   @dblclick=edit(true)   @click=$emit('cho', event)
    input => type=text   *else   ref=input   @blur=edit(false)   *model.trim=event.title   :placeholder='請輸入標題…'

    label.edit => @click=$emit('editEvent', event)
  `
})

Lib.EventNav.Component(`Event`, {
  props: {
    groups: { type: Array, default: [], required: false },
    view: { type: Lib.EventNav.View, default: null, required: true },
  },
  template: `
    #event
      .group => *for=(group, i) in groups   :key=i
        EventHeader => :group=group   @removeGroup=g=>g == group && view.emit('removeGroup', group)

        .section
          EventEvent => *for=(event, j) in group.events   :key=j   :event=event   @cho=event => view.emit('choEvent', event)   @editEvent=r => r == event && view.emit('editEvent', group, event)
          .row.add => *text='新增活動'   @click=view.emit('addEvent', group)
  `
})

Lib.EventNav.Component(`EventEdit`, {
  props: {
    group: { type: window.Group, default: null, required: true },
    event: { type: window.Group.Event, default: null, required: true },
    view: { type: Lib.EventNav.View, default: null, required: true },
  },
  methods: {
    submit() {

    },
    tip () {
      if (this.event.tip === null) {
        this.event.tip = { title: '', subtitle: '' }
      } else {
        this.event.tip = null
      }
    }
  },
  template: `
    form#event-edit => @submit.prevent=submit
      label.title
        b => *text='標題'
        input => type=text   *model.trim=event.title   :placeholder='請輸入標題…'

      label.subtitle
        b => *text='副標題'
        input => type=text   *model.trim=event.subtitle   :placeholder='請輸入副標題…'

      label.is-tip => @click=tip
        b => *text='是否開啟提示？'
        span => :class={ __on: event.tip }

      template => *if=event.tip
        label.title
          b => *text='提示標題'
          input => type=text   *model.trim=event.tip.title   :placeholder='請輸入提示標題…'

        label.subtitle
          b => *text='提示副標題'
          input => type=text   *model.trim=event.tip.subtitle   :placeholder='請輸入提示副標題…'

      label.btn => *text='確定修改'   @click=view.pop()
  `
})

Load.Vue({
  data: {
    groups: [],

    currentEvent: null,

    menu: {
      point: null,
      latLng: null,

      set at (val) {
        if (val === null) {
          this.point  = null
          this.latLng = null
        } else {
          this.point  = val.point
          this.latLng = val.latLng
        }
      },
      get style () {
        return this.hide
          ? {}
          : {
            '--x': `${this.point.x + 5}px`,
            '--y': `${this.point.y + 5}px`
          }
      },
      get hide () {
        return this.point === null || this.latLng === null
      }
    },
  },
  mounted () {
    GoogleMap.init(['AIzaSyBiGOag9rRDb7-_ZE2y0OI4VTDAuKEWzvc'], _ => {
      this.gmap = new google.maps.Map(this.$refs.map, { zoom: 17, center: new google.maps.LatLng(23.5678056, 120.3046447), clickableIcons: false, disableDefaultUI: true, gestureHandling: 'greedy' })

      this.gmap.addListener('click', e => this.pointAdd(e.latLng))

      this.gmap.addListener('rightclick', e => this.showMenu(e.latLng))

      this.loadData()
    })

  },
  computed: {
  },
  methods: {
    fromLatLngToPoint (latLng, map) {
      let scale = Math.pow(2, map.getZoom())
      let topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast())
      let bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest())
      let worldPoint = map.getProjection().fromLatLngToPoint(latLng)
      return new google.maps.Point(
        (worldPoint.x - bottomLeft.x) * scale,
        (worldPoint.y - topRight.y) * scale)
    },
    
    showMenu(latLng) {
      if (!this.currentEvent) {
        return Toastr.failure('請先選擇活動。')
      }
      this.menu.at = {
        latLng, point: this.fromLatLngToPoint(latLng, this.gmap)
      }
    },

    addMarker () {
      if (this.menu.hide) {
        return this
      }
      const latLng = this.menu.latLng

      if (latLng === null) {
        return this
      }

      this.menu.at = null
      if (!this.currentEvent) {
        return
      }

      Alert.shared.reset()
        .message('請輸入名稱')
        .input('請輸入名稱…', '')
        .button('確定', (alert, name) => {
          if (name !== '') {
            const marker = this.initMarker(window.Group.Event.Marker([name, latLng.lat(), latLng.lng()]))
            if (marker) {
              this.currentEvent.pushMarker(marker)
              // this.save()
            }
            
          }
          alert.dismiss()
        })
        .button('取消', alert => alert.dismiss())
        .present()


    },
    markerEdit (marker) {
      Alert.shared.reset()
        .message('請輸入名稱')
        .input('請輸入名稱…', marker.name)
        .button('確定', (alert, name) => {
          marker.name = name
          alert.dismiss()
            // this.save()
        })
        .button('刪除', alert => {
          alert.reset().title('確定要刪除？')
            .button('確定', alert => this.markerRemove(alert, marker))
            .button('取消', alert => alert.dismiss())
        }, true)
        .button('取消', alert => alert.dismiss())
        .present()
    },
    markerRemove (alert, marker) {
      alert.loading()
      
      if (this.currentEvent) {
        this.currentEvent.removeMarker(marker)
      }

      alert.dismiss()
    },
    markerDrag () {
      if (status == -1) {
        // this.save()
      }
    },
    markerNameChange () {
      // this.save()
    },

    pointAdd(position, index = -1) {
      if (!this.currentEvent) {
        return Toastr.failure('請先選擇活動。')
      }

      const point = this.initPoint(window.Group.Event.Point([position.lat(), position.lng()]))
      if (!point) {
        return
      }
      this.currentEvent.pushPoint(point, index)
      this.drawLine()
      // this.save()
    },

    pointInsert (point, position) {
      return this.currentEvent
        ? this.pointAdd(position, this.currentEvent.points.indexOf(point))
        : Toastr.failure('請先選擇活動。')
    },
    pointRemove (point) {
      if (!this.currentEvent) {
        return Toastr.failure('請先選擇活動。')
      }

      this.currentEvent.removePoint(point)
      this.drawLine()
      // this.save()      
    },
    pointDrag (point, latLng, status) {
      this.drawLine()

      if (status == -1) {
        // this.save()
      }
    },
    drawLine () {
      if (!this.currentEvent) {
        return Toastr.failure('請先選擇活動。')
      }

      this.currentEvent.points.forEach(point => point.draw())
      this.menu.at = null
      return this
    },





    loadData () {
      this.groups = [
  {
    "header": "三月十九",
    "events": [
      {
        "title": "🔴 三月十九 上午",
        "subtitle": "陣頭、媽祖神轎 上午遶境路線",
        "tip": {
          "title": "「陣頭」三月十九 上午",
          "subtitle": "上午路線因官方路關未詳細標註路名，所以地圖路線是參考往年紀錄所繪製，故僅供參考。"
        },
        "points": [
          [
            23.567715,
            120.304579
          ],
          [
            23.567163,
            120.304451
          ],
          [
            23.566195,
            120.304281
          ],
          [
            23.564571,
            120.303965
          ],
          [
            23.565032,
            120.301792
          ],
          [
            23.565504,
            120.299395
          ],
          [
            23.565441,
            120.299103
          ],
          [
            23.565393,
            120.299049
          ],
          [
            23.565277,
            120.299272
          ],
          [
            23.564925,
            120.300663
          ],
          [
            23.564714,
            120.301664
          ],
          [
            23.560319,
            120.300799
          ],
          [
            23.560019,
            120.300775
          ],
          [
            23.559596,
            120.301263
          ],
          [
            23.559771,
            120.303874
          ],
          [
            23.559842,
            120.305189
          ],
          [
            23.558947,
            120.304947
          ],
          [
            23.558962,
            120.30506
          ],
          [
            23.55984,
            120.30531
          ],
          [
            23.559873,
            120.305701
          ],
          [
            23.559935,
            120.305772
          ],
          [
            23.560204,
            120.307463
          ],
          [
            23.56041,
            120.308295
          ],
          [
            23.560107,
            120.308248
          ],
          [
            23.559727,
            120.308255
          ],
          [
            23.559577,
            120.308378
          ],
          [
            23.558554,
            120.308221
          ],
          [
            23.55864,
            120.308525
          ],
          [
            23.559578,
            120.308685
          ],
          [
            23.559619,
            120.308423
          ],
          [
            23.55976,
            120.308315
          ],
          [
            23.560103,
            120.308312
          ],
          [
            23.560423,
            120.30837
          ],
          [
            23.560659,
            120.309201
          ],
          [
            23.560372,
            120.309683
          ],
          [
            23.560205,
            120.309804
          ],
          [
            23.55934,
            120.310529
          ],
          [
            23.559139,
            120.310346
          ],
          [
            23.558229,
            120.310633
          ],
          [
            23.557902,
            120.310729
          ],
          [
            23.557128,
            120.310887
          ],
          [
            23.556713,
            120.310935
          ],
          [
            23.556192,
            120.310825
          ],
          [
            23.554814,
            120.310421
          ],
          [
            23.554689,
            120.310505
          ],
          [
            23.554477,
            120.310686
          ],
          [
            23.554083,
            120.311112
          ],
          [
            23.553977,
            120.311327
          ],
          [
            23.553771,
            120.311509
          ],
          [
            23.553734,
            120.311724
          ],
          [
            23.553769,
            120.311957
          ],
          [
            23.553892,
            120.312078
          ],
          [
            23.553769,
            120.313022
          ],
          [
            23.55383,
            120.31319
          ],
          [
            23.555143,
            120.314368
          ],
          [
            23.556746,
            120.312883
          ],
          [
            23.556793,
            120.312945
          ],
          [
            23.556441,
            120.315909
          ],
          [
            23.557387,
            120.316017
          ],
          [
            23.557282,
            120.31625
          ],
          [
            23.557289,
            120.316306
          ],
          [
            23.55733,
            120.316343
          ],
          [
            23.557481,
            120.316389
          ],
          [
            23.557255,
            120.31731
          ],
          [
            23.557243,
            120.317414
          ],
          [
            23.557263,
            120.317519
          ],
          [
            23.557332,
            120.317637
          ],
          [
            23.557471,
            120.317748
          ],
          [
            23.557542,
            120.317768
          ],
          [
            23.560787,
            120.318172
          ],
          [
            23.561135,
            120.314736
          ],
          [
            23.561701,
            120.314578
          ],
          [
            23.561736,
            120.315126
          ],
          [
            23.562429,
            120.314941
          ],
          [
            23.562412,
            120.314606
          ],
          [
            23.561772,
            120.314737
          ],
          [
            23.561743,
            120.314386
          ],
          [
            23.562382,
            120.314233
          ],
          [
            23.56238,
            120.314048
          ],
          [
            23.562495,
            120.313989
          ],
          [
            23.562373,
            120.313492
          ],
          [
            23.561232,
            120.313688
          ],
          [
            23.561357,
            120.312263
          ],
          [
            23.56136,
            120.311887
          ],
          [
            23.561527,
            120.310736
          ],
          [
            23.561704,
            120.30947
          ],
          [
            23.561712,
            120.309207
          ],
          [
            23.561677,
            120.308594
          ],
          [
            23.561605,
            120.308518
          ],
          [
            23.561055,
            120.308518
          ],
          [
            23.560916,
            120.308323
          ],
          [
            23.560512,
            120.307496
          ],
          [
            23.560251,
            120.306394
          ],
          [
            23.560143,
            120.306235
          ],
          [
            23.560068,
            120.305879
          ],
          [
            23.560033,
            120.305698
          ],
          [
            23.559963,
            120.305627
          ],
          [
            23.559914,
            120.305009
          ],
          [
            23.55971,
            120.301328
          ],
          [
            23.560047,
            120.300949
          ],
          [
            23.560283,
            120.300972
          ],
          [
            23.56467,
            120.301817
          ],
          [
            23.56429,
            120.304009
          ],
          [
            23.564552,
            120.304061
          ],
          [
            23.566181,
            120.304379
          ],
          [
            23.567148,
            120.304555
          ],
          [
            23.567684,
            120.304679
          ]
        ],
        "markers": [
          [
            "炮場",
            23.564626529861002,
            120.30365532803647
          ],
          [
            "炮場",
            23.564907446448377,
            120.30230909346876
          ],
          [
            "炮場",
            23.568847039601334,
            120.30382359917394
          ],
          [
            "炮場",
            23.576986213115557,
            120.30607731785153
          ],
          [
            "炮場",
            23.573451766603085,
            120.301717434484
          ],
          [
            "炮場",
            23.573183428886566,
            120.30091660617006
          ],
          [
            "炮場",
            23.575010166046543,
            120.3023221471557
          ],
          [
            "炮場",
            23.57490087374231,
            120.30085122864459
          ],
          [
            "炮場",
            23.574708161481077,
            120.30024884091205
          ],
          [
            "炮場",
            23.576072538723576,
            120.29785765157527
          ],
          [
            "炮場",
            23.569122641421252,
            120.3015635719096
          ],
          [
            "炮場",
            23.569277276729874,
            120.30285022043736
          ],
          [
            "紅壇舞台",
            23.577226915570407,
            120.30610298522281
          ],
          [
            "紅壇舞台",
            23.577784949162183,
            120.30606006987857
          ],
          [
            "紅壇舞台",
            23.57843744458633,
            120.30101654280143
          ],
          [
            "炮場",
            23.576036472914513,
            120.30189403515153
          ],
          [
            "紅壇舞台",
            23.57541205680959,
            120.30246802788072
          ],
          [
            "紅壇舞台",
            23.5761818653609,
            120.30194524777804
          ],
          [
            "紅壇舞台",
            23.57670548702071,
            120.29994431985293
          ],
          [
            "紅壇舞台",
            23.575819689995363,
            120.2970463674045
          ],
          [
            "紅壇舞台",
            23.568716034400968,
            120.30134820459426
          ],
          [
            "炮場",
            23.574002674946634,
            120.30078309823627
          ],
          [
            "炮場",
            23.571151161694875,
            120.30271360134313
          ]
        ]
      },
      {
        "title": "🔴 三月十九 下午",
        "subtitle": "陣頭、媽祖神轎 下午遶境路線",
        "tip": {
          "title": "「陣頭」三月十九 下午",
          "subtitle": ""
        },
        "points": [
          [
            23.567701,
            120.304593
          ],
          [
            23.567164,
            120.304448
          ],
          [
            23.56461,
            120.303981
          ],
          [
            23.5647,
            120.303525
          ],
          [
            23.564679,
            120.303412
          ],
          [
            23.565029,
            120.301842
          ],
          [
            23.566458,
            120.302104
          ],
          [
            23.566539,
            120.302182
          ],
          [
            23.566376,
            120.303241
          ],
          [
            23.56697,
            120.303379
          ],
          [
            23.567276,
            120.303411
          ],
          [
            23.567362,
            120.303462
          ],
          [
            23.567719,
            120.303504
          ],
          [
            23.567787,
            120.303544
          ],
          [
            23.568119,
            120.303595
          ],
          [
            23.568843,
            120.303843
          ],
          [
            23.569325,
            120.304077
          ],
          [
            23.56954,
            120.304117
          ],
          [
            23.570471,
            120.304524
          ],
          [
            23.571492,
            120.304893
          ],
          [
            23.571654,
            120.304431
          ],
          [
            23.571934,
            120.304509
          ],
          [
            23.572018,
            120.30447
          ],
          [
            23.572128,
            120.30409
          ],
          [
            23.572442,
            120.304159
          ],
          [
            23.572971,
            120.304317
          ],
          [
            23.573064,
            120.304389
          ],
          [
            23.573234,
            120.304394
          ],
          [
            23.573352,
            120.304421
          ],
          [
            23.573713,
            120.304314
          ],
          [
            23.573924,
            120.304191
          ],
          [
            23.574143,
            120.30399
          ],
          [
            23.575273,
            120.304569
          ],
          [
            23.57533,
            120.30473
          ],
          [
            23.575293,
            120.305027
          ],
          [
            23.575334,
            120.305204
          ],
          [
            23.575477,
            120.305398
          ],
          [
            23.575532,
            120.305517
          ],
          [
            23.576178,
            120.305934
          ],
          [
            23.577018,
            120.306091
          ],
          [
            23.57766,
            120.306086
          ],
          [
            23.578198,
            120.306032
          ],
          [
            23.579591,
            120.305906
          ],
          [
            23.579786,
            120.304573
          ],
          [
            23.579341,
            120.303122
          ],
          [
            23.578677,
            120.30096
          ],
          [
            23.577271,
            120.301494
          ],
          [
            23.577202,
            120.301579
          ],
          [
            23.576255,
            120.301931
          ],
          [
            23.576602,
            120.302995
          ],
          [
            23.575402,
            120.302473
          ],
          [
            23.574734,
            120.303238
          ],
          [
            23.574534,
            120.302604
          ],
          [
            23.574454,
            120.302554
          ],
          [
            23.57302,
            120.303076
          ],
          [
            23.572718,
            120.302127
          ],
          [
            23.57348,
            120.301854
          ],
          [
            23.573101,
            120.300596
          ],
          [
            23.573861,
            120.300317
          ],
          [
            23.574486,
            120.302453
          ],
          [
            23.57458,
            120.302514
          ],
          [
            23.575305,
            120.302218
          ],
          [
            23.57442,
            120.299367
          ],
          [
            23.575357,
            120.299021
          ],
          [
            23.575592,
            120.299721
          ],
          [
            23.576216,
            120.301817
          ],
          [
            23.577159,
            120.301468
          ],
          [
            23.576892,
            120.30054
          ],
          [
            23.576314,
            120.298659
          ],
          [
            23.577101,
            120.298412
          ],
          [
            23.576569,
            120.296738
          ],
          [
            23.576056,
            120.295797
          ],
          [
            23.575384,
            120.295086
          ],
          [
            23.57512,
            120.294684
          ],
          [
            23.574706,
            120.294296
          ],
          [
            23.57461,
            120.29427
          ],
          [
            23.574454,
            120.294309
          ],
          [
            23.574036,
            120.29431
          ],
          [
            23.573387,
            120.294224
          ],
          [
            23.573513,
            120.293776
          ],
          [
            23.572862,
            120.293611
          ],
          [
            23.573078,
            120.292505
          ],
          [
            23.57449,
            120.292897
          ],
          [
            23.574219,
            120.293822
          ],
          [
            23.574585,
            120.29416
          ],
          [
            23.5747,
            120.294173
          ],
          [
            23.575219,
            120.293575
          ],
          [
            23.576737,
            120.295249
          ],
          [
            23.576997,
            120.295665
          ],
          [
            23.575527,
            120.296568
          ],
          [
            23.575846,
            120.297143
          ],
          [
            23.57607,
            120.297856
          ],
          [
            23.575096,
            120.298196
          ],
          [
            23.575323,
            120.298926
          ],
          [
            23.573639,
            120.299547
          ],
          [
            23.573175,
            120.29802
          ],
          [
            23.573888,
            120.297602
          ],
          [
            23.573708,
            120.297348
          ],
          [
            23.57321,
            120.296824
          ],
          [
            23.573015,
            120.297422
          ],
          [
            23.572734,
            120.29827
          ],
          [
            23.572174,
            120.300086
          ],
          [
            23.571968,
            120.300829
          ],
          [
            23.571621,
            120.301721
          ],
          [
            23.571217,
            120.302568
          ],
          [
            23.570827,
            120.303562
          ],
          [
            23.569276,
            120.302849
          ],
          [
            23.569676,
            120.301822
          ],
          [
            23.568836,
            120.301448
          ],
          [
            23.568849,
            120.301279
          ],
          [
            23.568735,
            120.301162
          ],
          [
            23.56859,
            120.301187
          ],
          [
            23.568517,
            120.301312
          ],
          [
            23.567696,
            120.301185
          ],
          [
            23.567221,
            120.30114
          ],
          [
            23.566693,
            120.301054
          ],
          [
            23.56656,
            120.301998
          ],
          [
            23.566638,
            120.302077
          ],
          [
            23.567502,
            120.302237
          ],
          [
            23.567579,
            120.302474
          ],
          [
            23.56763,
            120.302686
          ],
          [
            23.567642,
            120.302998
          ],
          [
            23.567738,
            120.303007
          ],
          [
            23.567766,
            120.303474
          ],
          [
            23.567712,
            120.303446
          ],
          [
            23.567331,
            120.303393
          ],
          [
            23.567309,
            120.303607
          ],
          [
            23.567038,
            120.303606
          ],
          [
            23.56695,
            120.303582
          ],
          [
            23.566826,
            120.303511
          ],
          [
            23.566687,
            120.303468
          ],
          [
            23.566617,
            120.30342
          ],
          [
            23.566419,
            120.304408
          ],
          [
            23.566194,
            120.304369
          ],
          [
            23.56608,
            120.305034
          ],
          [
            23.565825,
            120.304949
          ],
          [
            23.565171,
            120.304815
          ],
          [
            23.565359,
            120.303779
          ],
          [
            23.564592,
            120.303548
          ],
          [
            23.564487,
            120.304036
          ],
          [
            23.56452,
            120.304194
          ],
          [
            23.564378,
            120.304919
          ],
          [
            23.565146,
            120.305038
          ],
          [
            23.565534,
            120.305152
          ],
          [
            23.566064,
            120.30524
          ],
          [
            23.567011,
            120.305447
          ],
          [
            23.567038,
            120.3052
          ],
          [
            23.567148,
            120.304548
          ],
          [
            23.567678,
            120.304681
          ]
        ],
        "markers": [
          [
            "炮場",
            23.564626529861002,
            120.30365532803647
          ],
          [
            "炮場",
            23.564907446448377,
            120.30230909346876
          ],
          [
            "炮場",
            23.568847039601334,
            120.30382359917394
          ],
          [
            "炮場",
            23.576986213115557,
            120.30607731785153
          ],
          [
            "炮場",
            23.573451766603085,
            120.301717434484
          ],
          [
            "炮場",
            23.573183428886566,
            120.30091660617006
          ],
          [
            "炮場",
            23.575010166046543,
            120.3023221471557
          ],
          [
            "炮場",
            23.57490087374231,
            120.30085122864459
          ],
          [
            "炮場",
            23.574708161481077,
            120.30024884091205
          ],
          [
            "炮場",
            23.576072538723576,
            120.29785765157527
          ],
          [
            "炮場",
            23.569122641421252,
            120.3015635719096
          ],
          [
            "炮場",
            23.569277276729874,
            120.30285022043736
          ],
          [
            "紅壇舞台",
            23.577226915570407,
            120.30610298522281
          ],
          [
            "紅壇舞台",
            23.577784949162183,
            120.30606006987857
          ],
          [
            "紅壇舞台",
            23.57843744458633,
            120.30101654280143
          ],
          [
            "炮場",
            23.576036472914513,
            120.30189403515153
          ],
          [
            "紅壇舞台",
            23.57541205680959,
            120.30246802788072
          ],
          [
            "紅壇舞台",
            23.5761818653609,
            120.30194524777804
          ],
          [
            "紅壇舞台",
            23.57670548702071,
            120.29994431985293
          ],
          [
            "紅壇舞台",
            23.575819689995363,
            120.2970463674045
          ],
          [
            "紅壇舞台",
            23.568716034400968,
            120.30134820459426
          ],
          [
            "炮場",
            23.574002674946634,
            120.30078309823627
          ],
          [
            "炮場",
            23.571151161694875,
            120.30271360134313
          ]
        ]
      },
      {
        "title": "🔴 三月十九 晚間",
        "subtitle": "陣頭、媽祖神轎 晚間遶境路線",
        "tip": {
          "title": "「陣頭」三月十九 晚間",
          "subtitle": ""
        },
        "points": [
          [
            23.567728,
            120.304581
          ],
          [
            23.56716,
            120.304453
          ],
          [
            23.565279,
            120.304099
          ],
          [
            23.564611,
            120.303971
          ],
          [
            23.564499,
            120.304034
          ],
          [
            23.564474,
            120.30416
          ],
          [
            23.564507,
            120.304254
          ],
          [
            23.564274,
            120.305408
          ],
          [
            23.565425,
            120.305622
          ],
          [
            23.565506,
            120.305139
          ],
          [
            23.566061,
            120.305241
          ],
          [
            23.566522,
            120.305346
          ],
          [
            23.566992,
            120.305436
          ],
          [
            23.567304,
            120.30546
          ],
          [
            23.567615,
            120.305538
          ],
          [
            23.567895,
            120.305745
          ],
          [
            23.568339,
            120.306017
          ],
          [
            23.568898,
            120.3051
          ],
          [
            23.569923,
            120.305795
          ],
          [
            23.570253,
            120.305868
          ],
          [
            23.570776,
            120.305862
          ],
          [
            23.570928,
            120.305875
          ],
          [
            23.571174,
            120.305829
          ],
          [
            23.571376,
            120.305152
          ],
          [
            23.570987,
            120.30507
          ],
          [
            23.570643,
            120.305064
          ],
          [
            23.570461,
            120.30496
          ],
          [
            23.570302,
            120.304935
          ],
          [
            23.569884,
            120.304756
          ],
          [
            23.569611,
            120.304575
          ],
          [
            23.569377,
            120.304367
          ],
          [
            23.569534,
            120.304124
          ],
          [
            23.569318,
            120.304075
          ],
          [
            23.568751,
            120.304997
          ],
          [
            23.568453,
            120.304834
          ],
          [
            23.568382,
            120.304949
          ],
          [
            23.568266,
            120.305011
          ],
          [
            23.567723,
            120.304931
          ],
          [
            23.567652,
            120.304837
          ],
          [
            23.567623,
            120.304727
          ],
          [
            23.567659,
            120.304521
          ],
          [
            23.567747,
            120.304422
          ],
          [
            23.567866,
            120.304365
          ],
          [
            23.568,
            120.304372
          ],
          [
            23.568193,
            120.304405
          ],
          [
            23.568353,
            120.304465
          ],
          [
            23.568461,
            120.304561
          ],
          [
            23.568854,
            120.303821
          ],
          [
            23.569655,
            120.301878
          ],
          [
            23.570528,
            120.302293
          ],
          [
            23.57004,
            120.30323
          ],
          [
            23.570826,
            120.303559
          ],
          [
            23.570462,
            120.304539
          ],
          [
            23.571478,
            120.304899
          ],
          [
            23.572143,
            120.302995
          ],
          [
            23.570637,
            120.3023
          ],
          [
            23.570573,
            120.302225
          ],
          [
            23.569685,
            120.301788
          ],
          [
            23.569587,
            120.301794
          ],
          [
            23.568823,
            120.301439
          ],
          [
            23.568848,
            120.301332
          ],
          [
            23.568802,
            120.301205
          ],
          [
            23.568705,
            120.301169
          ],
          [
            23.568618,
            120.301168
          ],
          [
            23.568551,
            120.301222
          ],
          [
            23.56852,
            120.301302
          ],
          [
            23.567659,
            120.301187
          ],
          [
            23.567574,
            120.30077
          ],
          [
            23.567543,
            120.300714
          ],
          [
            23.567487,
            120.300736
          ],
          [
            23.567405,
            120.30077
          ],
          [
            23.567293,
            120.300878
          ],
          [
            23.567212,
            120.300905
          ],
          [
            23.56705,
            120.300393
          ],
          [
            23.567042,
            120.300066
          ],
          [
            23.567012,
            120.300013
          ],
          [
            23.566865,
            120.299997
          ],
          [
            23.56669,
            120.301048
          ],
          [
            23.567231,
            120.301142
          ],
          [
            23.567241,
            120.301397
          ],
          [
            23.567277,
            120.301476
          ],
          [
            23.567412,
            120.301639
          ],
          [
            23.56746,
            120.301796
          ],
          [
            23.567501,
            120.302232
          ],
          [
            23.567897,
            120.302305
          ],
          [
            23.568392,
            120.302423
          ],
          [
            23.568234,
            120.303118
          ],
          [
            23.568116,
            120.303601
          ],
          [
            23.567772,
            120.30354
          ],
          [
            23.567755,
            120.303483
          ],
          [
            23.567486,
            120.303442
          ],
          [
            23.56694,
            120.303365
          ],
          [
            23.566372,
            120.303233
          ],
          [
            23.56626,
            120.303945
          ],
          [
            23.565385,
            120.303715
          ],
          [
            23.565675,
            120.301939
          ],
          [
            23.565015,
            120.301807
          ],
          [
            23.564602,
            120.303786
          ],
          [
            23.56455,
            120.303824
          ],
          [
            23.564522,
            120.30394
          ],
          [
            23.564571,
            120.304061
          ],
          [
            23.565265,
            120.304195
          ],
          [
            23.56714,
            120.304555
          ],
          [
            23.567706,
            120.304675
          ]
        ],
        "markers": [
          [
            "炮場",
            23.564626529861002,
            120.30365532803647
          ],
          [
            "炮場",
            23.564907446448377,
            120.30230909346876
          ],
          [
            "炮場",
            23.568847039601334,
            120.30382359917394
          ],
          [
            "炮場",
            23.576986213115557,
            120.30607731785153
          ],
          [
            "炮場",
            23.573451766603085,
            120.301717434484
          ],
          [
            "炮場",
            23.573183428886566,
            120.30091660617006
          ],
          [
            "炮場",
            23.575010166046543,
            120.3023221471557
          ],
          [
            "炮場",
            23.57490087374231,
            120.30085122864459
          ],
          [
            "炮場",
            23.574708161481077,
            120.30024884091205
          ],
          [
            "炮場",
            23.576072538723576,
            120.29785765157527
          ],
          [
            "炮場",
            23.569122641421252,
            120.3015635719096
          ],
          [
            "炮場",
            23.569277276729874,
            120.30285022043736
          ],
          [
            "紅壇舞台",
            23.577226915570407,
            120.30610298522281
          ],
          [
            "紅壇舞台",
            23.577784949162183,
            120.30606006987857
          ],
          [
            "紅壇舞台",
            23.57843744458633,
            120.30101654280143
          ],
          [
            "炮場",
            23.576036472914513,
            120.30189403515153
          ],
          [
            "紅壇舞台",
            23.57541205680959,
            120.30246802788072
          ],
          [
            "紅壇舞台",
            23.5761818653609,
            120.30194524777804
          ],
          [
            "紅壇舞台",
            23.57670548702071,
            120.29994431985293
          ],
          [
            "紅壇舞台",
            23.575819689995363,
            120.2970463674045
          ],
          [
            "紅壇舞台",
            23.568716034400968,
            120.30134820459426
          ],
          [
            "炮場",
            23.574002674946634,
            120.30078309823627
          ],
          [
            "炮場",
            23.571151161694875,
            120.30271360134313
          ]
        ]
      }
    ]
  },
  {
    "header": "三月二十",
    "events": [
      {
        "title": "🔴 三月二十 上午",
        "subtitle": "陣頭、媽祖神轎 上午遶境路線",
        "tip": {
          "title": "「陣頭」三月二十 上午",
          "subtitle": "上午路線因官方路關未詳細標註路名，所以地圖路線是參考往年紀錄所繪製，故僅供參考。"
        },
        "points": [
          [
            23.567695,
            120.304601
          ],
          [
            23.567154,
            120.304453
          ],
          [
            23.566201,
            120.30428
          ],
          [
            23.566554,
            120.302066
          ],
          [
            23.568087,
            120.302337
          ],
          [
            23.568376,
            120.302429
          ],
          [
            23.570039,
            120.303222
          ],
          [
            23.570982,
            120.301452
          ],
          [
            23.571559,
            120.301819
          ],
          [
            23.571979,
            120.300792
          ],
          [
            23.572146,
            120.300212
          ],
          [
            23.572122,
            120.300047
          ],
          [
            23.572653,
            120.29836
          ],
          [
            23.578492,
            120.294693
          ],
          [
            23.578652,
            120.295487
          ],
          [
            23.578113001139826,
            120.29580046627045
          ],
          [
            23.57838133631551,
            120.29709986871721
          ],
          [
            23.578962,
            120.296965
          ],
          [
            23.579063,
            120.297439
          ],
          [
            23.579483,
            120.29736
          ],
          [
            23.579527,
            120.297249
          ],
          [
            23.579313,
            120.295736
          ],
          [
            23.578701,
            120.295801
          ],
          [
            23.578899,
            120.296874
          ],
          [
            23.578876,
            120.296951
          ],
          [
            23.578996,
            120.297493
          ],
          [
            23.57907,
            120.29756
          ],
          [
            23.579105956258477,
            120.2980125255875
          ],
          [
            23.578698843449757,
            120.29793079629516
          ],
          [
            23.578432803383198,
            120.29795028950085
          ],
          [
            23.577945960786984,
            120.29810341231064
          ],
          [
            23.577979965298898,
            120.29820575689277
          ],
          [
            23.57845326892581,
            120.29805704368493
          ],
          [
            23.578692200143756,
            120.2980306759894
          ],
          [
            23.579089566872177,
            120.2981295682885
          ],
          [
            23.57918642965089,
            120.2981028296956
          ],
          [
            23.580362,
            120.298407
          ],
          [
            23.58351,
            120.299249
          ],
          [
            23.583583,
            120.299189
          ],
          [
            23.583535,
            120.298713
          ],
          [
            23.58351,
            120.298213
          ],
          [
            23.584337,
            120.298401
          ],
          [
            23.584742,
            120.298514
          ],
          [
            23.584832,
            120.298483
          ],
          [
            23.585509,
            120.298657
          ],
          [
            23.585568,
            120.298769
          ],
          [
            23.585504,
            120.299092
          ],
          [
            23.586937,
            120.299382
          ],
          [
            23.587041,
            120.299484
          ],
          [
            23.587079,
            120.299651
          ],
          [
            23.586991,
            120.300202
          ],
          [
            23.586645,
            120.300112
          ],
          [
            23.586567,
            120.300033
          ],
          [
            23.585346,
            120.299671
          ],
          [
            23.585139,
            120.299702
          ],
          [
            23.584645,
            120.299591
          ],
          [
            23.584533,
            120.299507
          ],
          [
            23.583657,
            120.299301
          ],
          [
            23.583611,
            120.299397
          ],
          [
            23.583957,
            120.299905
          ],
          [
            23.584276,
            120.299816
          ],
          [
            23.585082,
            120.299913
          ],
          [
            23.5852,
            120.299869
          ],
          [
            23.585274,
            120.299636
          ],
          [
            23.584698,
            120.299488
          ],
          [
            23.5848,
            120.298595
          ],
          [
            23.584878,
            120.298566
          ],
          [
            23.585436,
            120.298714
          ],
          [
            23.585493,
            120.298804
          ],
          [
            23.585433,
            120.299112
          ],
          [
            23.58545,
            120.299217
          ],
          [
            23.585311,
            120.299777
          ],
          [
            23.585485,
            120.299826
          ],
          [
            23.585942,
            120.299969
          ],
          [
            23.585886,
            120.300773
          ],
          [
            23.585947,
            120.301113
          ],
          [
            23.585797,
            120.301355
          ],
          [
            23.58592,
            120.301411
          ],
          [
            23.586046,
            120.301427
          ],
          [
            23.586309,
            120.301747
          ],
          [
            23.586399,
            120.301813
          ],
          [
            23.586493,
            120.301806
          ],
          [
            23.586541,
            120.301685
          ],
          [
            23.586604,
            120.301507
          ],
          [
            23.586652,
            120.301341
          ],
          [
            23.586519,
            120.300714
          ],
          [
            23.586492,
            120.300124
          ],
          [
            23.586017,
            120.299982
          ],
          [
            23.585976,
            120.300772
          ],
          [
            23.586025,
            120.301126
          ],
          [
            23.585917,
            120.301333
          ],
          [
            23.585745,
            120.301251
          ],
          [
            23.585602,
            120.301231
          ],
          [
            23.585211,
            120.301015
          ],
          [
            23.58472,
            120.300692
          ],
          [
            23.584483,
            120.300619
          ],
          [
            23.585356,
            120.301695
          ],
          [
            23.585275,
            120.301768
          ],
          [
            23.584373,
            120.300644
          ],
          [
            23.583291,
            120.300574
          ],
          [
            23.583586,
            120.299517
          ],
          [
            23.584319,
            120.300579
          ],
          [
            23.583162,
            120.300499
          ],
          [
            23.583066,
            120.300462
          ],
          [
            23.581202,
            120.300554
          ],
          [
            23.580551,
            120.300602
          ],
          [
            23.578676,
            120.300984
          ],
          [
            23.578357,
            120.299884
          ],
          [
            23.578807,
            120.29976
          ],
          [
            23.578865,
            120.299664
          ],
          [
            23.578693,
            120.298788
          ],
          [
            23.57858,
            120.298725
          ],
          [
            23.578049,
            120.29884
          ],
          [
            23.5778894582906,
            120.2982236441803
          ],
          [
            23.577833624739235,
            120.2981888375414
          ],
          [
            23.576319,
            120.298641
          ],
          [
            23.572953,
            120.299808
          ],
          [
            23.572241,
            120.300084
          ],
          [
            23.572235,
            120.300001
          ],
          [
            23.572557,
            120.299022
          ],
          [
            23.5722,
            120.29895
          ],
          [
            23.571954,
            120.298947
          ],
          [
            23.571929,
            120.296986
          ],
          [
            23.571565,
            120.296986
          ],
          [
            23.571578,
            120.298944
          ],
          [
            23.571246,
            120.298931
          ],
          [
            23.571241,
            120.296983
          ],
          [
            23.570878,
            120.296991
          ],
          [
            23.5709,
            120.298944
          ],
          [
            23.569535,
            120.298976
          ],
          [
            23.569314,
            120.299001
          ],
          [
            23.569085,
            120.299133
          ],
          [
            23.569012,
            120.29933
          ],
          [
            23.568819,
            120.299301
          ],
          [
            23.568075,
            120.299047
          ],
          [
            23.567442,
            120.298691
          ],
          [
            23.566906,
            120.298582
          ],
          [
            23.565714,
            120.29856
          ],
          [
            23.565402,
            120.299074
          ],
          [
            23.565501,
            120.299377
          ],
          [
            23.564547,
            120.304017
          ],
          [
            23.566085,
            120.30431
          ],
          [
            23.566181,
            120.304377
          ],
          [
            23.567136,
            120.304536
          ],
          [
            23.567667,
            120.304667
          ]
        ],
        "markers": [
          [
            "炮場",
            23.564606185312314,
            120.30404869887306
          ],
          [
            "炮場",
            23.568499779398643,
            120.30484829219985
          ],
          [
            "炮場",
            23.574247423370817,
            120.29853445602468
          ],
          [
            "炮場",
            23.569275780841508,
            120.30289421586734
          ],
          [
            "炮場",
            23.568733691091047,
            120.30117638076925
          ],
          [
            "紅壇舞台",
            23.564545844014745,
            120.30410928789945
          ],
          [
            "紅壇舞台",
            23.569659819217275,
            120.3056411724967
          ],
          [
            "紅壇舞台",
            23.572977236381305,
            120.30020861330361
          ],
          [
            "紅壇舞台",
            23.569263032471536,
            120.30281774885127
          ],
          [
            "紅壇舞台",
            23.5684209292114,
            120.30232486358845
          ],
          [
            "紅壇舞台",
            23.56966228483159,
            120.30181628404837
          ],
          [
            "紅壇舞台",
            23.568646943283092,
            120.30152928768378
          ]
        ]
      },
      {
        "title": "🔴 三月二十 下午",
        "subtitle": "陣頭、媽祖神轎 下午遶境路線",
        "tip": {
          "title": "「陣頭」三月二十 下午",
          "subtitle": ""
        },
        "points": [
          [
            23.567763,
            120.304581
          ],
          [
            23.567147,
            120.304451
          ],
          [
            23.566196,
            120.304273
          ],
          [
            23.565262,
            120.304089
          ],
          [
            23.565108,
            120.304119
          ],
          [
            23.564549,
            120.304015
          ],
          [
            23.564386,
            120.30493
          ],
          [
            23.565141,
            120.305037
          ],
          [
            23.565224,
            120.304553
          ],
          [
            23.566127,
            120.304749
          ],
          [
            23.566048,
            120.305239
          ],
          [
            23.565515,
            120.305151
          ],
          [
            23.565286,
            120.306511
          ],
          [
            23.565795,
            120.306559
          ],
          [
            23.566196,
            120.306605
          ],
          [
            23.566083,
            120.306061
          ],
          [
            23.566001,
            120.305953
          ],
          [
            23.565996,
            120.305473
          ],
          [
            23.566186,
            120.305407
          ],
          [
            23.566433,
            120.30538
          ],
          [
            23.566463,
            120.305328
          ],
          [
            23.566526,
            120.30534
          ],
          [
            23.566551,
            120.305411
          ],
          [
            23.566611,
            120.305484
          ],
          [
            23.566622,
            120.305534
          ],
          [
            23.566601,
            120.30562
          ],
          [
            23.566605,
            120.30569
          ],
          [
            23.566633,
            120.30575
          ],
          [
            23.566745,
            120.30574
          ],
          [
            23.566913,
            120.305772
          ],
          [
            23.567188,
            120.30585
          ],
          [
            23.567286,
            120.305457
          ],
          [
            23.567607,
            120.305531
          ],
          [
            23.567652,
            120.305285
          ],
          [
            23.567738,
            120.304922
          ],
          [
            23.568226,
            120.305
          ],
          [
            23.568319,
            120.304989
          ],
          [
            23.568406,
            120.30493
          ],
          [
            23.568461,
            120.304821
          ],
          [
            23.568747,
            120.304999
          ],
          [
            23.568895,
            120.305106
          ],
          [
            23.569561,
            120.305566
          ],
          [
            23.569956,
            120.305805
          ],
          [
            23.570237,
            120.305861
          ],
          [
            23.570782,
            120.305869
          ],
          [
            23.570941,
            120.305874
          ],
          [
            23.571171,
            120.305821
          ],
          [
            23.571373,
            120.305157
          ],
          [
            23.571037,
            120.30507
          ],
          [
            23.570627,
            120.305055
          ],
          [
            23.570468,
            120.304966
          ],
          [
            23.570304,
            120.304923
          ],
          [
            23.570467,
            120.304513
          ],
          [
            23.569539,
            120.304134
          ],
          [
            23.569588,
            120.304038
          ],
          [
            23.569738,
            120.304027
          ],
          [
            23.570362,
            120.303893
          ],
          [
            23.570492,
            120.30386
          ],
          [
            23.570762,
            120.303713
          ],
          [
            23.570824,
            120.303563
          ],
          [
            23.571807,
            120.304018
          ],
          [
            23.572148,
            120.303006
          ],
          [
            23.572677,
            120.303217
          ],
          [
            23.573106,
            120.30344
          ],
          [
            23.574152,
            120.303973
          ],
          [
            23.573784,
            120.302862
          ],
          [
            23.573694,
            120.302823
          ],
          [
            23.573008,
            120.303069
          ],
          [
            23.572892,
            120.302679
          ],
          [
            23.57273,
            120.302121
          ],
          [
            23.572336,
            120.300865
          ],
          [
            23.573048,
            120.300612
          ],
          [
            23.573081,
            120.300535
          ],
          [
            23.572878,
            120.299907
          ],
          [
            23.573626,
            120.299643
          ],
          [
            23.573834,
            120.30033
          ],
          [
            23.57314,
            120.300583
          ],
          [
            23.573113,
            120.300647
          ],
          [
            23.573378,
            120.301496
          ],
          [
            23.574136,
            120.301251
          ],
          [
            23.574242,
            120.301612
          ],
          [
            23.573474,
            120.301851
          ],
          [
            23.573744,
            120.302739
          ],
          [
            23.573816,
            120.302772
          ],
          [
            23.574519,
            120.30254
          ],
          [
            23.575329,
            120.302211
          ],
          [
            23.576239,
            120.301876
          ],
          [
            23.577182,
            120.301522
          ],
          [
            23.576907,
            120.300614
          ],
          [
            23.575973,
            120.300977
          ],
          [
            23.575018,
            120.301307
          ],
          [
            23.574652,
            120.300121
          ],
          [
            23.574686,
            120.300026
          ],
          [
            23.575567,
            120.299723
          ],
          [
            23.57653,
            120.299363
          ],
          [
            23.577234,
            120.299115
          ],
          [
            23.57731,
            120.299148
          ],
          [
            23.577691,
            120.300361
          ],
          [
            23.578421,
            120.300102
          ],
          [
            23.57804,
            120.298861
          ],
          [
            23.577365,
            120.299066
          ],
          [
            23.577283,
            120.299043
          ],
          [
            23.577097,
            120.298415
          ],
          [
            23.576322,
            120.298653
          ],
          [
            23.576071,
            120.297887
          ],
          [
            23.576557,
            120.297715
          ],
          [
            23.576583,
            120.297678
          ],
          [
            23.576838,
            120.297579
          ],
          [
            23.576603,
            120.296834
          ],
          [
            23.576471,
            120.296537
          ],
          [
            23.576264,
            120.296656
          ],
          [
            23.576234,
            120.296746
          ],
          [
            23.576413,
            120.297375
          ],
          [
            23.576499,
            120.297674
          ],
          [
            23.576035,
            120.297842
          ],
          [
            23.575945,
            120.297904
          ],
          [
            23.575563,
            120.298046
          ],
          [
            23.575087,
            120.298208
          ],
          [
            23.575005,
            120.298221
          ],
          [
            23.574183,
            120.29856
          ],
          [
            23.574615,
            120.300002
          ],
          [
            23.574583,
            120.300067
          ],
          [
            23.573885,
            120.300308
          ],
          [
            23.573651,
            120.299533
          ],
          [
            23.573082,
            120.299727
          ],
          [
            23.572967,
            120.298952
          ],
          [
            23.57295,
            120.298898
          ],
          [
            23.572583,
            120.298782
          ],
          [
            23.572287,
            120.299677
          ],
          [
            23.57219,
            120.300086
          ],
          [
            23.57196,
            120.300829
          ],
          [
            23.571615,
            120.301693
          ],
          [
            23.571218,
            120.302561
          ],
          [
            23.570549,
            120.302251
          ],
          [
            23.570031,
            120.303223
          ],
          [
            23.56926,
            120.302853
          ],
          [
            23.568845,
            120.303854
          ],
          [
            23.568471,
            120.304546
          ],
          [
            23.568362,
            120.304478
          ],
          [
            23.568225,
            120.304434
          ],
          [
            23.567996,
            120.304381
          ],
          [
            23.568111,
            120.303591
          ],
          [
            23.568395,
            120.302412
          ],
          [
            23.568654,
            120.301533
          ],
          [
            23.568727,
            120.30153
          ],
          [
            23.568789,
            120.301491
          ],
          [
            23.568833,
            120.301443
          ],
          [
            23.569664,
            120.301819
          ],
          [
            23.570197,
            120.300369
          ],
          [
            23.569126,
            120.299673
          ],
          [
            23.568937,
            120.300404
          ],
          [
            23.568734,
            120.301171
          ],
          [
            23.568648,
            120.301171
          ],
          [
            23.56855,
            120.30123
          ],
          [
            23.568511,
            120.301304
          ],
          [
            23.567664,
            120.301173
          ],
          [
            23.567575,
            120.300763
          ],
          [
            23.567523,
            120.300716
          ],
          [
            23.567392,
            120.30077
          ],
          [
            23.567303,
            120.300867
          ],
          [
            23.567213,
            120.30091
          ],
          [
            23.56706,
            120.300429
          ],
          [
            23.567038,
            120.30005
          ],
          [
            23.566986,
            120.300002
          ],
          [
            23.56687,
            120.299989
          ],
          [
            23.566688,
            120.301055
          ],
          [
            23.566539,
            120.302121
          ],
          [
            23.565665,
            120.30196
          ],
          [
            23.565548,
            120.302817
          ],
          [
            23.56595,
            120.302991
          ],
          [
            23.565987,
            120.303046
          ],
          [
            23.565981,
            120.303128
          ],
          [
            23.56594,
            120.303247
          ],
          [
            23.565489,
            120.303089
          ],
          [
            23.565378,
            120.303722
          ],
          [
            23.565274,
            120.304208
          ],
          [
            23.566181,
            120.304377
          ],
          [
            23.566318,
            120.303573
          ],
          [
            23.566386,
            120.303243
          ],
          [
            23.566964,
            120.303372
          ],
          [
            23.567339,
            120.303413
          ],
          [
            23.567132,
            120.30458
          ],
          [
            23.567737,
            120.304706
          ]
        ],
        "markers": [
          [
            "炮場",
            23.564606185312314,
            120.30404869887306
          ],
          [
            "炮場",
            23.568499779398643,
            120.30484829219985
          ],
          [
            "炮場",
            23.574247423370817,
            120.29853445602468
          ],
          [
            "炮場",
            23.569275780841508,
            120.30289421586734
          ],
          [
            "炮場",
            23.568733691091047,
            120.30117638076925
          ],
          [
            "紅壇舞台",
            23.564545844014745,
            120.30410928789945
          ],
          [
            "紅壇舞台",
            23.569659819217275,
            120.3056411724967
          ],
          [
            "紅壇舞台",
            23.572977236381305,
            120.30020861330361
          ],
          [
            "紅壇舞台",
            23.569263032471536,
            120.30281774885127
          ],
          [
            "紅壇舞台",
            23.5684209292114,
            120.30232486358845
          ],
          [
            "紅壇舞台",
            23.56966228483159,
            120.30181628404837
          ],
          [
            "紅壇舞台",
            23.568646943283092,
            120.30152928768378
          ]
        ]
      },
      {
        "title": "🔴 三月二十 晚間",
        "subtitle": "陣頭、媽祖神轎 晚間遶境路線",
        "tip": {
          "title": "「陣頭」三月二十 晚間",
          "subtitle": ""
        },
        "points": [
          [
            23.567752,
            120.304583
          ],
          [
            23.567156,
            120.304452
          ],
          [
            23.564555,
            120.303967
          ],
          [
            23.564835,
            120.302738
          ],
          [
            23.5651,
            120.302826
          ],
          [
            23.565284,
            120.302938
          ],
          [
            23.565496,
            120.302998
          ],
          [
            23.565487,
            120.303084
          ],
          [
            23.565942,
            120.303245
          ],
          [
            23.566363,
            120.303357
          ],
          [
            23.566392,
            120.303247
          ],
          [
            23.566434,
            120.302833
          ],
          [
            23.566549,
            120.302074
          ],
          [
            23.566693,
            120.301041
          ],
          [
            23.567234,
            120.30114
          ],
          [
            23.567243,
            120.301422
          ],
          [
            23.567396,
            120.301615
          ],
          [
            23.567444,
            120.301725
          ],
          [
            23.567477,
            120.301929
          ],
          [
            23.567508,
            120.302238
          ],
          [
            23.567602,
            120.302543
          ],
          [
            23.567628,
            120.302741
          ],
          [
            23.567638,
            120.302987
          ],
          [
            23.567826,
            120.303005
          ],
          [
            23.567919,
            120.303021
          ],
          [
            23.568231,
            120.303112
          ],
          [
            23.568452,
            120.303227
          ],
          [
            23.5686,
            120.30333
          ],
          [
            23.568677,
            120.303365
          ],
          [
            23.568729,
            120.303368
          ],
          [
            23.568759,
            120.30335
          ],
          [
            23.568985,
            120.30272
          ],
          [
            23.56927,
            120.302846
          ],
          [
            23.569658,
            120.301814
          ],
          [
            23.568815,
            120.301443
          ],
          [
            23.568845,
            120.301348
          ],
          [
            23.568813,
            120.301236
          ],
          [
            23.568731,
            120.301176
          ],
          [
            23.568937,
            120.300402
          ],
          [
            23.56912,
            120.299713
          ],
          [
            23.569156,
            120.299693
          ],
          [
            23.570191,
            120.300377
          ],
          [
            23.569982,
            120.300917
          ],
          [
            23.570506,
            120.301146
          ],
          [
            23.570983,
            120.301454
          ],
          [
            23.571551,
            120.301804
          ],
          [
            23.571209,
            120.302567
          ],
          [
            23.570825,
            120.303563
          ],
          [
            23.570035,
            120.303223
          ],
          [
            23.569647,
            120.30395
          ],
          [
            23.569544,
            120.304123
          ],
          [
            23.569319,
            120.304086
          ],
          [
            23.568874,
            120.303859
          ],
          [
            23.568112,
            120.303585
          ],
          [
            23.567993,
            120.304378
          ],
          [
            23.568355,
            120.304465
          ],
          [
            23.568456,
            120.304544
          ],
          [
            23.56848,
            120.304621
          ],
          [
            23.568483,
            120.304716
          ],
          [
            23.568458,
            120.304821
          ],
          [
            23.568749,
            120.304998
          ],
          [
            23.568905,
            120.305113
          ],
          [
            23.569369,
            120.304364
          ],
          [
            23.569514,
            120.304503
          ],
          [
            23.569779,
            120.304692
          ],
          [
            23.569965,
            120.304799
          ],
          [
            23.570301,
            120.30493
          ],
          [
            23.570171,
            120.305252
          ],
          [
            23.569966,
            120.305808
          ],
          [
            23.569473,
            120.305953
          ],
          [
            23.568725,
            120.306149
          ],
          [
            23.568561,
            120.306158
          ],
          [
            23.568432,
            120.306105
          ],
          [
            23.568324,
            120.306015
          ],
          [
            23.567596,
            120.305537
          ],
          [
            23.567284,
            120.30547
          ],
          [
            23.567191,
            120.305814
          ],
          [
            23.567073,
            120.306119
          ],
          [
            23.566891,
            120.306292
          ],
          [
            23.566518,
            120.306625
          ],
          [
            23.566401,
            120.306636
          ],
          [
            23.56581,
            120.306569
          ],
          [
            23.565876,
            120.306094
          ],
          [
            23.565891,
            120.305999
          ],
          [
            23.565927,
            120.30596
          ],
          [
            23.566004,
            120.305942
          ],
          [
            23.566,
            120.305467
          ],
          [
            23.565487,
            120.305307
          ],
          [
            23.565425,
            120.305626
          ],
          [
            23.56427,
            120.305407
          ],
          [
            23.564378,
            120.304938
          ],
          [
            23.564534,
            120.304059
          ],
          [
            23.56714,
            120.304557
          ],
          [
            23.56773,
            120.304677
          ]
        ],
        "markers": [
          [
            "炮場",
            23.564606185312314,
            120.30404869887306
          ],
          [
            "炮場",
            23.568499779398643,
            120.30484829219985
          ],
          [
            "炮場",
            23.574247423370817,
            120.29853445602468
          ],
          [
            "炮場",
            23.569275780841508,
            120.30289421586734
          ],
          [
            "炮場",
            23.568733691091047,
            120.30117638076925
          ],
          [
            "紅壇舞台",
            23.564545844014745,
            120.30410928789945
          ],
          [
            "紅壇舞台",
            23.569659819217275,
            120.3056411724967
          ],
          [
            "紅壇舞台",
            23.572977236381305,
            120.30020861330361
          ],
          [
            "紅壇舞台",
            23.569263032471536,
            120.30281774885127
          ],
          [
            "紅壇舞台",
            23.5684209292114,
            120.30232486358845
          ],
          [
            "紅壇舞台",
            23.56966228483159,
            120.30181628404837
          ],
          [
            "紅壇舞台",
            23.568646943283092,
            120.30152928768378
          ]
        ]
      }
    ]
  },
  {
    "header": "藝閣",
    "events": [
      {
        "title": "🔵 三月十九 下午",
        "subtitle": "藝閣 下午遊行路線",
        "tip": {
          "title": "🔵 「藝閣」三月十九下午",
          "subtitle": ""
        },
        "points": [
          [
            23.568115,
            120.303596
          ],
          [
            23.567992,
            120.304366
          ],
          [
            23.567839,
            120.30437
          ],
          [
            23.567721,
            120.304445
          ],
          [
            23.56762,
            120.304617
          ],
          [
            23.567679849457093,
            120.3048146322937
          ],
          [
            23.56779021539818,
            120.3049059967117
          ],
          [
            23.568227143587535,
            120.30497868521115
          ],
          [
            23.56839489796068,
            120.30490894777677
          ],
          [
            23.568483190496643,
            120.3047190238342
          ],
          [
            23.56844447062777,
            120.30453770967867
          ],
          [
            23.568746695778398,
            120.30403273638964
          ],
          [
            23.56925607816584,
            120.30287298924337
          ],
          [
            23.569646,
            120.301824
          ],
          [
            23.570556,
            120.302251
          ],
          [
            23.571223,
            120.302561
          ],
          [
            23.571965,
            120.30082
          ],
          [
            23.572165,
            120.300147
          ],
          [
            23.574335,
            120.299397
          ],
          [
            23.57444,
            120.299396
          ],
          [
            23.575283,
            120.302136
          ],
          [
            23.575243,
            120.302228
          ],
          [
            23.574516,
            120.30253
          ],
          [
            23.574732,
            120.303212
          ],
          [
            23.57414,
            120.303979
          ],
          [
            23.574457,
            120.304158
          ],
          [
            23.575241,
            120.304563
          ],
          [
            23.575307,
            120.304654
          ],
          [
            23.575317,
            120.304782
          ],
          [
            23.575297,
            120.304957
          ],
          [
            23.575327,
            120.30515
          ],
          [
            23.575379,
            120.305257
          ],
          [
            23.575455,
            120.305364
          ],
          [
            23.575504,
            120.305448
          ],
          [
            23.575514,
            120.305504
          ],
          [
            23.576018,
            120.305834
          ],
          [
            23.576167,
            120.305919
          ],
          [
            23.576325,
            120.305967
          ],
          [
            23.57702,
            120.306101
          ],
          [
            23.577669,
            120.306088
          ],
          [
            23.578404,
            120.306023
          ],
          [
            23.579589,
            120.305894
          ],
          [
            23.579778,
            120.304677
          ],
          [
            23.579766,
            120.304513
          ],
          [
            23.57933,
            120.303132
          ],
          [
            23.579231,
            120.303155
          ],
          [
            23.577925,
            120.303616
          ],
          [
            23.577798,
            120.303614
          ],
          [
            23.57736,
            120.303396
          ],
          [
            23.576584,
            120.302987
          ],
          [
            23.575675,
            120.302613
          ],
          [
            23.575402,
            120.302468
          ],
          [
            23.575338,
            120.302285
          ],
          [
            23.575365,
            120.302198
          ],
          [
            23.576214,
            120.301895
          ],
          [
            23.578676,
            120.300957
          ],
          [
            23.577868,
            120.298168
          ],
          [
            23.577091,
            120.298417
          ],
          [
            23.576834,
            120.297586
          ],
          [
            23.576057,
            120.297865
          ],
          [
            23.575104,
            120.298203
          ],
          [
            23.574976,
            120.29823
          ],
          [
            23.574185,
            120.298565
          ],
          [
            23.574379,
            120.299196
          ],
          [
            23.574302,
            120.2993
          ],
          [
            23.573631,
            120.299534
          ],
          [
            23.572286,
            120.300006
          ],
          [
            23.572084,
            120.300049
          ],
          [
            23.57119,
            120.299839
          ],
          [
            23.571111,
            120.30007
          ]
        ],
        "markers": []
      },
      {
        "title": "🔵 三月十九 晚間",
        "subtitle": "藝閣 晚間遊行路線",
        "tip": {
          "title": "🔵 「藝閣」三月十九晚間",
          "subtitle": ""
        },
        "points": [
          [
            23.568107,
            120.30361
          ],
          [
            23.56798,
            120.304361
          ],
          [
            23.567837,
            120.304363
          ],
          [
            23.567729,
            120.304436
          ],
          [
            23.56766,
            120.304548
          ],
          [
            23.567626,
            120.304618
          ],
          [
            23.567141,
            120.3045
          ],
          [
            23.566163,
            120.304334
          ],
          [
            23.565299,
            120.304165
          ],
          [
            23.564569,
            120.30402
          ],
          [
            23.5645,
            120.304007
          ],
          [
            23.564309,
            120.303972
          ],
          [
            23.564562,
            120.30236
          ],
          [
            23.56469,
            120.30173
          ],
          [
            23.566556,
            120.302067
          ],
          [
            23.568123,
            120.302368
          ],
          [
            23.568408,
            120.302454
          ],
          [
            23.569262,
            120.302856
          ],
          [
            23.570034,
            120.303215
          ],
          [
            23.570821,
            120.303559
          ],
          [
            23.571219,
            120.302527
          ],
          [
            23.571971,
            120.300821
          ],
          [
            23.572033,
            120.300827
          ],
          [
            23.572212,
            120.300851
          ],
          [
            23.57233,
            120.300859
          ],
          [
            23.572733,
            120.302122
          ],
          [
            23.573122,
            120.303445
          ],
          [
            23.574134,
            120.303959
          ],
          [
            23.57376,
            120.302768
          ],
          [
            23.573104,
            120.300598
          ],
          [
            23.572881,
            120.299866
          ],
          [
            23.57365,
            120.299587
          ],
          [
            23.573185,
            120.298019
          ],
          [
            23.573875,
            120.297618
          ],
          [
            23.574712,
            120.297046
          ],
          [
            23.574893,
            120.297431
          ],
          [
            23.57511,
            120.298188
          ],
          [
            23.575343,
            120.298987
          ],
          [
            23.575583,
            120.29973
          ],
          [
            23.575989,
            120.300975
          ],
          [
            23.576215,
            120.301868
          ],
          [
            23.577181,
            120.301533
          ],
          [
            23.576911,
            120.300618
          ],
          [
            23.576316,
            120.298655
          ],
          [
            23.577098,
            120.298413
          ],
          [
            23.577867,
            120.29818
          ],
          [
            23.577357,
            120.296392
          ],
          [
            23.576983,
            120.295673
          ],
          [
            23.576766,
            120.295268
          ],
          [
            23.574971,
            120.29331
          ],
          [
            23.574583,
            120.292937
          ],
          [
            23.574487,
            120.292908
          ],
          [
            23.574024,
            120.294326
          ],
          [
            23.572863,
            120.2979
          ],
          [
            23.572731,
            120.298259
          ],
          [
            23.572197,
            120.300089
          ],
          [
            23.572046832009793,
            120.300104364418
          ],
          [
            23.570950299435612,
            120.29983114351654
          ],
          [
            23.570474292147647,
            120.29967022453692
          ],
          [
            23.569144464316096,
            120.29929172023773
          ],
          [
            23.56911979668405,
            120.299429635582
          ],
          [
            23.569127,
            120.299676
          ],
          [
            23.568988,
            120.300211
          ],
          [
            23.568721,
            120.301164
          ]
        ],
        "markers": []
      },
      {
        "title": "🔵 三月二十 下午",
        "subtitle": "藝閣 下午遊行路線",
        "tip": {
          "title": "🔵 「藝閣」三月二十下午",
          "subtitle": ""
        },
        "points": [
          [
            23.568119,
            120.303585
          ],
          [
            23.568003,
            120.304371
          ],
          [
            23.567869890830295,
            120.30435801979685
          ],
          [
            23.56772221498879,
            120.30444269452133
          ],
          [
            23.567633088825083,
            120.3045905732429
          ],
          [
            23.567667968692948,
            120.30475547484804
          ],
          [
            23.567758660827266,
            120.30488603075793
          ],
          [
            23.568250153609213,
            120.30497721726611
          ],
          [
            23.56834845621654,
            120.30495510681536
          ],
          [
            23.568454047585604,
            120.30484498776627
          ],
          [
            23.568476369345372,
            120.30469748346711
          ],
          [
            23.56845424292269,
            120.3045452678757
          ],
          [
            23.568491351873426,
            120.30448540279389
          ],
          [
            23.568826274404163,
            120.30386220635987
          ],
          [
            23.569273,
            120.302865
          ],
          [
            23.57084,
            120.30358
          ],
          [
            23.57197,
            120.300837
          ],
          [
            23.572174,
            120.300153
          ],
          [
            23.57295,
            120.299888
          ],
          [
            23.573017,
            120.299793
          ],
          [
            23.573612,
            120.299587
          ],
          [
            23.574429,
            120.299324
          ],
          [
            23.573868,
            120.297597
          ],
          [
            23.575528,
            120.296572
          ],
          [
            23.576265,
            120.296154
          ],
          [
            23.576064,
            120.295826
          ],
          [
            23.575412,
            120.295121
          ],
          [
            23.574645,
            120.294231
          ],
          [
            23.575213,
            120.293579
          ],
          [
            23.576419,
            120.294878
          ],
          [
            23.576829,
            120.295366
          ],
          [
            23.576972,
            120.295691
          ],
          [
            23.577691,
            120.295206
          ],
          [
            23.578479,
            120.294707
          ],
          [
            23.578612,
            120.295221
          ],
          [
            23.578656,
            120.295515
          ],
          [
            23.579064,
            120.297631
          ],
          [
            23.579101,
            120.297878
          ],
          [
            23.579093,
            120.298122
          ],
          [
            23.580354,
            120.298457
          ],
          [
            23.583542,
            120.299299
          ],
          [
            23.585253,
            120.29976
          ],
          [
            23.587541,
            120.30042
          ],
          [
            23.587573,
            120.300313
          ],
          [
            23.585296,
            120.29966
          ],
          [
            23.583548,
            120.299182
          ],
          [
            23.580347,
            120.298346
          ],
          [
            23.578918,
            120.297954
          ],
          [
            23.578805,
            120.297986
          ],
          [
            23.578676,
            120.297968
          ],
          [
            23.577873,
            120.298171
          ],
          [
            23.578419,
            120.300113
          ],
          [
            23.577891083418994,
            120.30030831779099
          ],
          [
            23.577677,
            120.300356
          ],
          [
            23.577947,
            120.301236
          ],
          [
            23.577178,
            120.301537
          ],
          [
            23.576907,
            120.300614
          ],
          [
            23.575977,
            120.300984
          ],
          [
            23.575003,
            120.301319
          ],
          [
            23.574239,
            120.30162
          ],
          [
            23.573481,
            120.30185
          ],
          [
            23.5731,
            120.300595
          ],
          [
            23.572852,
            120.299799
          ],
          [
            23.572247,
            120.30001
          ],
          [
            23.572095,
            120.300045
          ],
          [
            23.571202,
            120.299831
          ],
          [
            23.571111,
            120.300131
          ]
        ],
        "markers": []
      },
      {
        "title": "🔵 三月二十 晚間",
        "subtitle": "藝閣 晚間遊行路線",
        "tip": {
          "title": "🔵 「藝閣」三月二十晚間",
          "subtitle": ""
        },
        "points": [
          [
            23.568064,
            120.303579
          ],
          [
            23.567941,
            120.304314
          ],
          [
            23.56785,
            120.304325
          ],
          [
            23.567724,
            120.304365
          ],
          [
            23.567641,
            120.304475
          ],
          [
            23.567584,
            120.304574
          ],
          [
            23.567146,
            120.304453
          ],
          [
            23.566192,
            120.3043
          ],
          [
            23.565288,
            120.304105
          ],
          [
            23.564565,
            120.303978
          ],
          [
            23.565015,
            120.301857
          ],
          [
            23.566537,
            120.302129
          ],
          [
            23.567421,
            120.302283
          ],
          [
            23.568073,
            120.302383
          ],
          [
            23.568207,
            120.302423
          ],
          [
            23.568422,
            120.302511
          ],
          [
            23.568705,
            120.301519
          ],
          [
            23.568757,
            120.3015
          ],
          [
            23.568787,
            120.301473
          ],
          [
            23.569646,
            120.301856
          ],
          [
            23.569269,
            120.302845
          ],
          [
            23.568839,
            120.303847
          ],
          [
            23.568462,
            120.304522
          ],
          [
            23.568487,
            120.304681
          ],
          [
            23.568458,
            120.304828
          ],
          [
            23.568733,
            120.304995
          ],
          [
            23.568888,
            120.305108
          ],
          [
            23.569587,
            120.305581
          ],
          [
            23.569957,
            120.305798
          ],
          [
            23.570301,
            120.30493
          ],
          [
            23.570459,
            120.304523
          ],
          [
            23.570823,
            120.303565
          ],
          [
            23.571209,
            120.302583
          ],
          [
            23.57198,
            120.300797
          ],
          [
            23.572154,
            120.300856
          ],
          [
            23.572332,
            120.300872
          ],
          [
            23.573102,
            120.300601
          ],
          [
            23.573869,
            120.300319
          ],
          [
            23.574636,
            120.300051
          ],
          [
            23.575596,
            120.299707
          ],
          [
            23.576528,
            120.299383
          ],
          [
            23.577303,
            120.299093
          ],
          [
            23.577109,
            120.298407
          ],
          [
            23.575346,
            120.29897
          ],
          [
            23.575857,
            120.300542
          ],
          [
            23.576238,
            120.301885
          ],
          [
            23.575319,
            120.302213
          ],
          [
            23.574526,
            120.302537
          ],
          [
            23.57265,
            120.303208
          ],
          [
            23.572306,
            120.303082
          ],
          [
            23.571537,
            120.302722
          ],
          [
            23.570543,
            120.302257
          ],
          [
            23.569788,
            120.301889
          ],
          [
            23.569734,
            120.301805
          ],
          [
            23.569631,
            120.301759
          ],
          [
            23.568871,
            120.301426
          ],
          [
            23.568826,
            120.30141
          ],
          [
            23.568838,
            120.301327
          ],
          [
            23.568826,
            120.301269
          ],
          [
            23.568792,
            120.301215
          ],
          [
            23.568737,
            120.301187
          ],
          [
            23.568688,
            120.301174
          ],
          [
            23.56862,
            120.301179
          ],
          [
            23.568564,
            120.30122
          ],
          [
            23.568525,
            120.301265
          ],
          [
            23.568511,
            120.301333
          ],
          [
            23.568519,
            120.301415
          ],
          [
            23.568554,
            120.301486
          ],
          [
            23.568615,
            120.301518
          ],
          [
            23.568365,
            120.30238
          ],
          [
            23.568213,
            120.302315
          ],
          [
            23.568073,
            120.302272
          ],
          [
            23.567434,
            120.302162
          ],
          [
            23.566554,
            120.302003
          ],
          [
            23.565027,
            120.301723
          ],
          [
            23.56472,
            120.301656
          ],
          [
            23.564285,
            120.303968
          ],
          [
            23.564469,
            120.304006
          ],
          [
            23.56458,
            120.304062
          ],
          [
            23.56528,
            120.304207
          ],
          [
            23.566173,
            120.304395
          ],
          [
            23.567124,
            120.304553
          ],
          [
            23.567654,
            120.304682
          ],
          [
            23.567698,
            120.304598
          ],
          [
            23.567747,
            120.304507
          ],
          [
            23.567821,
            120.304437
          ],
          [
            23.567917,
            120.304427
          ],
          [
            23.568023,
            120.304435
          ],
          [
            23.568155,
            120.303606
          ]
        ],
        "markers": []
      },
      {
        "title": "🔵 三月廿ㄧ 晚間",
        "subtitle": "藝閣 晚間遊行路線",
        "tip": {
          "title": "🔵 「藝閣」三月廿ㄧ晚間",
          "subtitle": ""
        },
        "points": [
          [
            23.568104,
            120.303598
          ],
          [
            23.567976,
            120.304376
          ],
          [
            23.567833,
            120.304368
          ],
          [
            23.567725,
            120.30444
          ],
          [
            23.567649,
            120.304566
          ],
          [
            23.567167,
            120.304448
          ],
          [
            23.566142,
            120.304273
          ],
          [
            23.566092,
            120.30432
          ],
          [
            23.565284,
            120.304161
          ],
          [
            23.564531,
            120.304024
          ],
          [
            23.564369,
            120.304928
          ],
          [
            23.565121,
            120.305046
          ],
          [
            23.565521,
            120.305146
          ],
          [
            23.566049,
            120.305234
          ],
          [
            23.566685,
            120.305379
          ],
          [
            23.566991,
            120.305439
          ],
          [
            23.567286,
            120.305458
          ],
          [
            23.567613,
            120.305538
          ],
          [
            23.567874,
            120.305718
          ],
          [
            23.568152,
            120.305903
          ],
          [
            23.568326,
            120.306016
          ],
          [
            23.56851,
            120.306147
          ],
          [
            23.568616,
            120.306166
          ],
          [
            23.568742,
            120.306134
          ],
          [
            23.569956,
            120.305812
          ],
          [
            23.570299,
            120.304925
          ],
          [
            23.570474,
            120.304525
          ],
          [
            23.570808,
            120.303557
          ],
          [
            23.570036,
            120.303219
          ],
          [
            23.569274,
            120.302852
          ],
          [
            23.568824,
            120.30385
          ],
          [
            23.568458,
            120.304539
          ],
          [
            23.568463,
            120.304692
          ],
          [
            23.568414,
            120.304912
          ],
          [
            23.568293,
            120.305008
          ],
          [
            23.568153,
            120.305
          ],
          [
            23.56773,
            120.304922
          ],
          [
            23.567654,
            120.304815
          ],
          [
            23.56761,
            120.30467
          ],
          [
            23.56715,
            120.304554
          ],
          [
            23.566184,
            120.304387
          ],
          [
            23.566246,
            120.303949
          ],
          [
            23.566347,
            120.303361
          ],
          [
            23.566391,
            120.30324
          ],
          [
            23.566541,
            120.302071
          ],
          [
            23.566686,
            120.301049
          ],
          [
            23.567188,
            120.301126
          ],
          [
            23.567662,
            120.301177
          ],
          [
            23.567955,
            120.301212
          ],
          [
            23.56851,
            120.301303
          ],
          [
            23.568508,
            120.301411
          ],
          [
            23.568557,
            120.301483
          ],
          [
            23.568614,
            120.301521
          ],
          [
            23.568715,
            120.301521
          ],
          [
            23.568791,
            120.301489
          ],
          [
            23.568828,
            120.301389
          ],
          [
            23.568825,
            120.30129
          ],
          [
            23.568752,
            120.301196
          ],
          [
            23.568737,
            120.301116
          ],
          [
            23.568946,
            120.300389
          ]
        ],
        "markers": []
      },
      {
        "title": "🔵 三月廿二 晚間",
        "subtitle": "藝閣 晚間遊行路線",
        "tip": null,
        "points": [
          [
            23.568062,
            120.303591
          ],
          [
            23.567948,
            120.304302
          ],
          [
            23.567818,
            120.304308
          ],
          [
            23.567717,
            120.304364
          ],
          [
            23.567632,
            120.30447
          ],
          [
            23.567582,
            120.304568
          ],
          [
            23.56715,
            120.304448
          ],
          [
            23.566194,
            120.304284
          ],
          [
            23.565289,
            120.304096
          ],
          [
            23.564612,
            120.303976
          ],
          [
            23.564504,
            120.304061
          ],
          [
            23.564524,
            120.304148
          ],
          [
            23.56437,
            120.304928
          ],
          [
            23.565143,
            120.305043
          ],
          [
            23.565508,
            120.305145
          ],
          [
            23.566058,
            120.305236
          ],
          [
            23.566993,
            120.30544
          ],
          [
            23.567325,
            120.305473
          ],
          [
            23.567618,
            120.305537
          ],
          [
            23.568331,
            120.306017
          ],
          [
            23.568894,
            120.305108
          ],
          [
            23.56954,
            120.304118
          ],
          [
            23.570032,
            120.303209
          ],
          [
            23.570549,
            120.302248
          ],
          [
            23.569664,
            120.301817
          ],
          [
            23.568813,
            120.301433
          ],
          [
            23.568845,
            120.301326
          ],
          [
            23.568806,
            120.301224
          ],
          [
            23.568727,
            120.301168
          ],
          [
            23.568618,
            120.301178
          ],
          [
            23.568539,
            120.301237
          ],
          [
            23.568498,
            120.30132
          ],
          [
            23.568517,
            120.301422
          ],
          [
            23.568601,
            120.301505
          ],
          [
            23.568353,
            120.302396
          ],
          [
            23.568149,
            120.302356
          ],
          [
            23.567804,
            120.302278
          ],
          [
            23.566796,
            120.302109
          ],
          [
            23.566534,
            120.302082
          ],
          [
            23.566446,
            120.302114
          ],
          [
            23.565027,
            120.301849
          ],
          [
            23.5648,
            120.302841
          ],
          [
            23.564577,
            120.303895
          ],
          [
            23.564527,
            120.303949
          ],
          [
            23.564601,
            120.304072
          ],
          [
            23.56528,
            120.304201
          ],
          [
            23.566183,
            120.304398
          ],
          [
            23.567132,
            120.304548
          ],
          [
            23.567658,
            120.304688
          ],
          [
            23.567716,
            120.304555
          ],
          [
            23.567799,
            120.304475
          ],
          [
            23.567888,
            120.304432
          ],
          [
            23.568018,
            120.304445
          ],
          [
            23.568153,
            120.303608
          ],
          [
            23.568438,
            120.302462
          ],
          [
            23.568711,
            120.301585
          ]
        ],
        "markers": []
      },
      {
        "title": "🔵 三月廿三 晚間",
        "subtitle": "藝閣 晚間遊行路線",
        "tip": null,
        "points": [
          [
            23.56806,
            120.303602
          ],
          [
            23.567942,
            120.304307
          ],
          [
            23.567802,
            120.304318
          ],
          [
            23.567693,
            120.304399
          ],
          [
            23.567598,
            120.304549
          ],
          [
            23.56715,
            120.304444
          ],
          [
            23.566199,
            120.304286
          ],
          [
            23.565279,
            120.304095
          ],
          [
            23.564571,
            120.303961
          ],
          [
            23.564827,
            120.302746
          ],
          [
            23.565016,
            120.30181
          ],
          [
            23.566548,
            120.302076
          ],
          [
            23.567448,
            120.302237
          ],
          [
            23.567925,
            120.302312
          ],
          [
            23.568188,
            120.302366
          ],
          [
            23.568385,
            120.30243
          ],
          [
            23.569273,
            120.302845
          ],
          [
            23.57004,
            120.30322
          ],
          [
            23.570824,
            120.303561
          ],
          [
            23.571207,
            120.302549
          ],
          [
            23.571552,
            120.301816
          ],
          [
            23.570991,
            120.301449
          ],
          [
            23.570504,
            120.301135
          ],
          [
            23.570012,
            120.300918
          ],
          [
            23.569653,
            120.301822
          ],
          [
            23.569262,
            120.302908
          ],
          [
            23.568849,
            120.303849
          ],
          [
            23.568453,
            120.304539
          ],
          [
            23.568482,
            120.304665
          ],
          [
            23.568455,
            120.30482
          ],
          [
            23.568768,
            120.305011
          ],
          [
            23.568895,
            120.305115
          ],
          [
            23.56996,
            120.305813
          ],
          [
            23.56874,
            120.306143
          ],
          [
            23.568563,
            120.306153
          ],
          [
            23.568431,
            120.306094
          ],
          [
            23.568305,
            120.305995
          ],
          [
            23.567606,
            120.305553
          ],
          [
            23.567284,
            120.30548
          ],
          [
            23.566649,
            120.305378
          ],
          [
            23.566062,
            120.305244
          ],
          [
            23.565528,
            120.305153
          ],
          [
            23.565139,
            120.305049
          ],
          [
            23.564378,
            120.30493
          ],
          [
            23.564557,
            120.304053
          ],
          [
            23.565265,
            120.304198
          ],
          [
            23.566183,
            120.304386
          ],
          [
            23.567118,
            120.304537
          ],
          [
            23.567658,
            120.304671
          ],
          [
            23.567758,
            120.304488
          ],
          [
            23.567866,
            120.304419
          ],
          [
            23.568026,
            120.304437
          ],
          [
            23.568166,
            120.303606
          ],
          [
            23.568147,
            120.303429
          ],
          [
            23.568377,
            120.302512
          ],
          [
            23.568626,
            120.301653
          ],
          [
            23.568665,
            120.301517
          ]
        ],
        "markers": []
      }
    ]
  }
]
      .map(json => window.Group(json)).filter(t => t !== null)

      Lib.EventNav.View('Event', { groups: this.groups })
        .title('活動')
        .loading(false)
        .left('複製', _ => {
          // const str = JSON.stringify(this.groups.map(group => group.toJson()), null, 2)
          const str = JSON.stringify(this.groups.map(group => group.toJson()))
          copy(str, _ => Toastr.success('複製成功！'), _ => Toastr.failure('複製失敗！'))
        })
        .right('新增', this.addGroup)
        .on('removeGroup', this.removeGroup)
        .on('addEvent', this.addEvent)
        .on('editEvent', this.editEvent)
        .on('choEvent', this.choEvent)
        .present(Lib.EventNav.shared, _ => {
          // this.editEvent(this.groups[0], this.groups[0].event[0])
        })
    },
    addGroup () {
      this.groups.push(window.Group({ header: '' }))
    },
    removeGroup (group) {
      if (!this.groups.includes(group)) {
        return
      }
      const index = this.groups.indexOf(group)
      if (index < 0) {
        return
      }

      this.groups.splice(index, 1)
    },

    addEvent (group) {
      if (!this.groups.includes(group)) {
        return
      }

      return group.events.push(window.Group.Event({ title: 'a' }))

      Alert.shared.reset()
        .message('請輸入活動名稱')
        .input('請輸入活動名稱…', '')
        .button('確定', (alert, title) => {
          if (title !== '') {
            group.events.push(window.Group.Event({ title }))
          }
          alert.dismiss()
        })
        .button('取消', alert => alert.dismiss())
        .present()
    },
    editEvent (group, event) {
      if (!this.groups.includes(group)) {
        return
      }
      const _index = this.groups.indexOf(group)
      if (_index < 0) {
        return
      }

      if (!group.events.includes(event)) {
        return
      }
      const index = group.events.indexOf(event)
      if (index < 0) {
        return
      }
      
      Lib.EventNav.shared.push(Lib.EventNav.View('EventEdit', { group, event })
        .title('編輯活動')
        .right('刪除', view => Alert.shared.reset()
          .title('是否移除')
          .message(`確定要將「${event.title}」移除嗎？`)
          .button('確定', alert => {
            alert.loading('移除中…')

            this.removeEvent(group, event, error => alert.dismiss(_ => view.pop(_ => error
              ? Toastr.failure(`移除失敗，原因：${error.message}`)
              : Toastr.success('移除成功。'))))
          })
          .button('取消', alert => alert.dismiss())
          .present(), { className: '__red'})
        .loading(false))
    },
    removeEvent (group, event, closure) {
      if (!this.groups.includes(group)) {
        return
      }

      const _index = this.groups.indexOf(group)

      if (_index < 0) {
        return closure && closure(new Error('找不到此群組'))
      }

      if (!group.events.includes(event)) {
        return closure && closure(new Error('此群組內找不到此活動'))
      }
      const index = group.events.indexOf(event)
      if (index < 0) {
        return closure && closure(new Error('此群組內找不到此活動'))
      }

      if (this.currentEvent == event) {
        this.currentEvent.isCurrent = false
        this.currentEvent = null
      }

      group.events.splice(index, 1)
      closure && closure(null)
    },
    initPoint(point) {
      return point ? point.init(this.gmap, {
        markerInsert: this.pointInsert,
        markerRemove: this.pointRemove,
        markerDrag: this.pointDrag,
      }) : null
    },
    initMarker(marker) {
      return marker ? marker.init(this.gmap, {
        markerDblClick: this.markerEdit,
        markerDrag: this.markerDrag,
        nameChange: this.markerNameChange,
      }) : null
    },
    choEvent (event) {
      if (event === null && this.currentEvent !== null) {
        this.currentEvent.points.forEach(point => point.remove())
        this.currentEvent.markers.forEach(marker => marker.remove())

        this.currentEvent.isCurrent = false
        this.currentEvent = null

      } else if (event === null && this.currentEvent === null) {
        this.currentEvent = null
      } else if (event !== null && this.currentEvent === null) {
        this.currentEvent = event
        this.currentEvent.isCurrent = true
        this.currentEvent.points.forEach(this.initPoint)
        this.currentEvent.markers.forEach(this.initMarker)
        this.drawLine()
      } else {
        if (this.currentEvent !== event) {
          this.currentEvent.points.forEach(point => point.remove())
          this.currentEvent.markers.forEach(marker => marker.remove())
          this.currentEvent.isCurrent = false

          this.currentEvent = event
          this.currentEvent.isCurrent = true
          this.currentEvent.points.forEach(this.initPoint)
          this.currentEvent.markers.forEach(this.initMarker)

          this.drawLine()
        }
      }
    }
  },
  template: `
  #app
    #map => ref=map

    div#menu => :class={ hide: menu.hide }   :style=menu.style
      label => *text='新增'   @click=addMarker

  `
})
