/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Location = function(data) {
  if (!(this instanceof Location)) {
    return new Location(data)
  }

  this.position = null
  this.altitude = null
  this.speed = null
  this.course = null

  this.time = {
    gps: null,
    upload: null,
    server: null,
  }

  this.status = 'none'

  if (Location._isNum(data.accH) && data.accH > 0) {
    this.position = {
      acc: Location._round(data.accH, 1),
      lat: Location._round(data.lat, 10),
      lng: Location._round(data.lng, 10),
    }
  }
  if (Location._isNum(data.accV) && data.accV > 0) {
    this.altitude = {
      acc: Location._round(data.accV, 1),
      val: Location._round(data.alt, 2),
    }
  }

  if (Location._isNum(data.accS) && data.accS >= 0 && Location._isNum(data.speed) && data.speed >= 0) {
    this.speed = {
      acc: Location._round(data.accS, 1),
      ms: Location._round(data.speed, 2),
      kmh: Location._round(Location._round(data.speed, 2) * 3.6, 2),
    }
  }

  if (Location._isNum(data.accC) && data.accC >= 0 && Location._isNum(data.course) && data.course >= 0) {
    this.course = {
      acc: Location._round(data.accC, 1),
      val: Location._round(data.course, 1) }
  }

  if (Location._isNum(data.time) && data.time >= 0) {
    this.time.gps = Location._time(data.time * 1000)
  }
}

Location._isNum = v => typeof v == 'number' && !isNaN(v) && v !== Infinity
Location._round = (val, digital, d4 = '') => Location._isNum(val) ? parseFloat(val.toFixed(digital)) : d4
Location._time = unixtime => ({ val: unixtime, text: Helper.date('Y/m/d H:i:s', new Date(unixtime)), ago: Location._timeago(unixtime) })
Location._timeago = e => {
  const d = (new Date().getTime() - e * 1000) / 1000

  const c = [
    { b: 10, f: '現在'},
    { b: 6,  f: '不到 1 分鐘'},
    { b: 60, f: ' 分鐘前'},
    { b: 24, f: ' 小時前'},
    { b: 30, f: ' 天前'},
    { b: 12, f: ' 個月前'}
  ]

  let u = 1

  for (let i = 0, t; i < c.length; i++, u = t) {
    t = c[i].b * u
    
    if (d < t) {
      return `${i > 1 ? parseInt(d / u, 10) : ''}${c[i].f}`
    }
  }

  return `${parseInt(d / u, 10)} 年前`
}

const MapMyLocation = function(latlng, map = null) {
  if (!(this instanceof MapMyLocation)) {
    return new MapMyLocation(latlng, map)
  }
  this._map = null
  this._acc = null
  this._timer = null

  this._$icon = $('<div />')
  this._marker = L.marker(latlng, { icon: L.divIcon({
    className: 'marker-my-location',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: this._$icon.get(0),
    zIndexOffset: 999
  }) })

  this.map(map)
}
MapMyLocation.prototype.map = function(map) {
  if (map) {
    if (this._map !== map) {
      this._map = map
      this._marker.addTo(map)
    }
  } else if (this._map) {
    this._map.removeLayer(this._marker)
    this._map = null
  } else {
    this._map = null
  }
  return this.acc()
}
MapMyLocation.prototype.latlng = function(latlng) {
  if (this._marker) {
    this._marker.setLatLng(latlng)
  }
  return this
}
MapMyLocation.prototype.acc = function(val = undefined) {
  if (val === null || (typeof val == 'number' && !isNaN(val) && val !== Infinity)) {
    this._acc = val
  }

  clearTimeout(this._timer)
  this._timer = setTimeout(_ => {
    if (this._acc === null) {
      return this._$icon.removeAttr('style')
    }

    if (!this._map) {
      return this._$icon.removeAttr('style')
    }

    const mapHeightInMetres = this._map.getBounds().getSouthEast().distanceTo(this._map.getBounds().getNorthEast()) // 高度多少公尺
    const mapHeightInPixels = this._map.getSize().y // 高度多少 px
    this._$icon.attr('style', `--width: ${this._acc * (mapHeightInPixels / mapHeightInMetres)}px;`)
  }, 100)
  return this
}


Load.Vue({
  data: {
    status: 'always',

    queueSave: Queue(),
    queueCount: Queue(),
    queueUpload: Queue(),
    
    count: {
      gps: null,
      done: null,
      fail: null,
    },

    location: {
      gps: null,
      upload: null,
      server: null,
    },

    isRunning: false,

  },
  mounted () {


    App.Bridge.on('GPS::location', this._refresh)
    this._count()
    this._upload()

    App.VC.Mounted().emit(_ => {
      DB._clear(_ => {
        App.GPS.Refresh.Status()
        App.GPS.Refresh.isRunning()
      })
    })

  },
  methods: {
    _refresh (locations) {
      if (!locations.length) {
        return
      }

      for (let location of locations) {
        const _location = Location(location)
        this.location.gps = _location
        this.queueSave.enqueue(next => DB.Location.create(_location, _ => {
          this._count()
          next()
        }))
      }
    },
    _count (next) {
      this.queueCount.enqueue(next => {
        Promise.all([
          DB.Location.index('Status', 'none').count(),
          DB.Location.index('Status', 'done').count(),
          DB.Location.index('Status', 'fail').count(),
        ])
        .then(([none, done, fail]) => {
          this.count.gps = none
          this.count.done = done
          this.count.fail = fail
        })
        .finally(next)
      })
    },
    _upload () {
      this.queueUpload.enqueue(next => DB.Location.index('Status', 'none').first((error, location) => {
        if (error) {
          return console.error(error)
        }

        if (!(typeof location == 'object' && location !== null && !Array.isArray(location))) {
          next()
          return setTimeout(this._upload, 100)
        }

        location.val.time.upload = Location._time(Date.now())
        this.location.upload = location.val

        const timer = Math.random() * 5

        setTimeout(_ => { // upload
          const done = Math.random() < 0.5

          location.val.status = done ? 'done' : 'fail'
          location.val.time.server = Location._time(Date.now() + 2000)
          this.location.server = location.val

          DB.Location.update(location.key, location.val, (error, location) => {
            if (error) {
              return 
            }

            this._count()
            next()
            return setTimeout(this._upload, 100)
          })
        }, timer)

      }))
    },
  },
  template: `
    main#app
      .groups
        
        Ctrl
        Position => :location=location.gps
        Speed => :location=location.gps
        Alt => :location=location.gps

        Count => :count=count
        Timelog => :location=location
        Map => :location=location.gps
      `
})

Load.VueComponent('Ctrl', {
  props: {
  },
  data: _ => ({
    status: null,
    isRunning: false,
  }),
  mounted () {
    App.Bridge.on('GPS::isRunning', isRunning => this.isRunning = isRunning)
    App.Bridge.on('GPS::status', status => this.status = status)
  },
  methods: {
    start () {
      App.Alert(null, '你確定要啟動？')
        .button('取消')
        .button('確定', App.HUD.Show.Loading('開啟中，請稍後…').completion(
          _ => setTimeout(
            _ => App.GPS.Start(result => result && App.HUD.Show.Done('已開啟').completion(App.HUD.Hide(400)).emit()).emit(), 500))).emit()
    },
    stop () {
      App.Alert(null, '你確定要停止？')
        .button('取消')
        .button('確定', App.HUD.Show.Loading('關閉中，請稍後…').completion(
          _ => setTimeout(
            _ => App.GPS.Stop(result => result && App.HUD.Show.Done('已關閉').completion(App.HUD.Hide(400)).emit()).emit(), 500))).emit()
    },
    determine () {
      App.GPS.Require.Always().emit()
    },
  },
  template: `
    .group
      .items._clear
        .ctrl.bg => *if=status=='notDetermined'
          b => *text='請同意定位'
          span => *text='請點擊這裡，並且同意「APP」讀取您的裝置定位。'
          span => *text='請求會連續兩次，請先按「使用 App 期間允許」後再按「改為永遠允許」。'
          label => *text='同意'   @click=determine

        template => *else-if=status=='always'
          .ctrl.bg => *if=isRunning
            b => *text='GPS 正在紀錄'
            span => *text='目前 GPS 紀錄正常作業中！'
            label => *text='停止紀錄'   @click=stop
          
          .ctrl.bg => *else
            b => *text='GPS 尚未開始'
            span => *text='目前未開啟 GPS 紀錄，請點擊下方「開始記錄」即可開始記錄，即便在背景模式依然可以做紀錄。'
            label => *text='開始紀錄'   @click=start
        
        .ctrl.bg => *else-if=status=='inUse'
          b => *text='無法背景定位'
          span => *text='您尚未同意使用「背景定位」！'
          span => *text='請至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'
          label => *text='設定'
          
        .ctrl.bg => *else
          b => *text='無法取得定位狀態'
          span => *text='系統未開啟定位功能，或您拒絕了「APP」取用您的裝置定位！'
          span => *text='請至「設定 > 隱私權 > 定位服務」確認是否有開啟定位服務，或至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'
          label => *text='設定'
  `
})
Load.VueComponent('Position', {
  props: {
    location: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  computed: {
    lat () { return this.location && this.location.position ? this.location.position.lat : '' },
    lng () { return this.location && this.location.position ? this.location.position.lng : '' },
    accH () { return this.location && this.location.position ? this.location.position.acc : '' },
  },
  template: `
    .group
      .header => *text='座標資料'
      .items._clear
        .position
          .latlng
            .lat.bg.unit._left
              span => *text='緯度'
              b => *text=lat
            .lng.bg.unit._left
              span => *text='經度'
              b => *text=lng
          .accH.bg.unit._center
            span => *text='誤差範圍'
            b => *text=accH
            i => *text='公尺'
  `
})
Load.VueComponent('Speed', {
  props: {
    location: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  computed: {
    speed1 () { return this.location && this.location.speed ? this.location.speed.kmh : '' },
    speed () { return this.location && this.location.speed ? this.location.speed.ms : '' },
    accS () { return this.location && this.location.speed ? this.location.speed.acc : '' },
  },
  template: `
    .group
      .header => *text='移動速度'
      .items._clear
        .speeds
          .unit.bg._center
            span => *text='時速'
            b => *text=speed1
            i => *text='公里/小時'

          .unit.bg._center
            span => *text='秒速'
            b => *text=speed
            i => *text='公尺/秒'

          .unit.bg._center
            span => *text='誤差值'
            b => *text=accS
            i => *text='公尺/秒'
  `
})
Load.VueComponent('Alt', {
  props: {
    location: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  computed: {
    alt () { return this.location && this.location.altitude ? this.location.altitude.val : '' },
    accV () { return this.location && this.location.altitude ? this.location.altitude.acc : '' },
  },
  template: `
    .group
      .header => *text='海拔高度'
      .items._clear
        .alts
          .unit.bg._left
            span => *text='高度'
            b => *text=alt   :after='公尺'
          .unit.bg._left
            span => *text='誤差值'
            b => *text=accV   :after='公尺'
  `
})
Load.VueComponent('Count', {
  props: {
    count: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  template: `
    .group
      .header => *text='數據'
      .items._clear
        .counts
          .unit.bg._center
            span => *text='未上傳'
            b => *text=count.gps === null ? '' : count.gps
            i => *text='次'

          .unit.bg._center
            span => *text='上傳成功'
            b.done => *text=count.done === null ? '' : count.done
            i => *text='次'

          .unit.bg._center
            span => *text='上傳失敗'
            b.fail => *text=count.fail === null ? '' : count.fail
            i => *text='次'
  `
})
Load.VueComponent('Timelog', {
  props: {
    location: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  template: `
    .group
      .header => *text='時間'
      .items.bg
        .item.log
          .content
            .info
              .key
                b => *text='GPS 擷取時間'
                span => *if=location && location.gps && location.gps.time && location.gps.time.gps   *text=location.gps.time.gps.text   :after=location.gps.time.gps.ago
                span => *else

        .item.log
          .content
            .info
              .key
                b => *text='最新上傳時間'
                span => *if=location && location.upload && location.upload.time && location.upload.time.upload   *text=location.upload.time.upload.text   :after=location.upload.time.upload.ago
                span => *else

        .item.log
          .content
            .info
              .key
                b => *text='伺服器回應時間'
                span => *if=location && location.server && location.server.time && location.server.time.upload   *text=location.server.time.upload.text   :after=location.server.time.upload.ago
                span => *else
  `
})
Load.VueComponent('Map', {
  props: {
    location: { type: Object, required: true, default: null }
  },
  data: _ => ({
    map: null,
    d4View: { latlng: [23.5678056, 120.3046447], zoom: 15 },
    myLocation: null,
  }),
  mounted () {
    setTimeout(this._initMap, 1)
  },
  methods: {
    _initMap() {
      this.map = L.map(this.$refs.el, {
        tap: false,
        dragging: false,
        zoomControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        attributionControl: false
      })

      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        minZoom: 1,
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      }).addTo(this.map)

      this.map.setView(this.d4View.latlng, this.d4View.zoom)

      this.myLocation = MapMyLocation(this.d4View.latlng)
    },
    zoom (level) {
      if (!this.map) { return this }
      this.map.setZoom(this.map.getZoom() + level)
      this.myLocation.acc()
    },
  },
  watch: {
    'location.position' (val) {
      if (!this.map) {
        return
      }

      if (!val) {
        return this.myLocation.map(null)
      }

      this.map.setView([val.lat, val.lng])

      this.myLocation.map(this.map)
      this.myLocation.latlng([val.lat, val.lng])
      this.myLocation.acc(val.acc)
    }
  },
  template: `
    .group
      .header => *text='地圖'
      .items._clear
        .map
          .el => :ref='el'
          .zoom
            label.add => @click=zoom(+1)
            i
            label.sub => @click=zoom(-1)
  `
})





















// Load.VueComponent('CellPosition', {
//   template: `
//     .cell
//       .lat-lng
//         .lat
//           span.title => *text='緯度'
//           span.value => *text='lat'
//         .lng
//           span.title => *text='經度'
//           span.value => *text='lng'
//       .accH
//         span.title => *text='誤差範圍'
//         span.value => *text='accH'
//         span.unit => *text='公尺'
//   `
// })
// Load.VueComponent('CellCtrls', {
//   props: {
//     status: { type: String, required: true, default: null },
//   },
//   data: _ => ({
//     isRunning: false,
//   }),
//   mounted () {
//     App.Bridge.on('GPS::isRunning', isRunning => this.isRunning = isRunning)
//   },
//   template: `
//     .cell.ctrls
//       .ctrl => *if=status=='notDetermined'
//         b => *text='請同意定位'
//         span => *text='請點擊這裡，並且同意「APP」讀取您的裝置定位。'
//         span => *text='請求會連續兩次，請先按「使用 App 期間允許」後再按「改為永遠允許」。'
//         label => *text='同意'

//       template => *else
//         template => *if=status=='always'
          
//           .ctrl => *if=isRunning
//             b => *text='GPS 正在紀錄'
//             span => *text='目前 GPS 紀錄正常作業中！'
//             label => *text='停止紀錄'
          
//           .ctrl => *else
//             b => *text='GPS 尚未開始'
//             span => *text='目前未開啟 GPS 紀錄，請點擊下方「開始記錄」即可開始記錄，即便在背景模式依然可以做紀錄。'
//             label => *text='開始紀錄'

//         template => *else

//           .ctrl => *if=status=='inUse'
//             b => *text='無法背景定位'
//             span => *text='您尚未同意使用「背景定位」！'
//             span => *text='請至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'
//             label => *text='設定'

//           .ctrl => *else
//             b => *text='無法取得定位狀態'
//             span => *text='系統未開啟定位功能，或您拒絕了「APP」取用您的裝置定位！'
//             span => *text='請至「設定 > 隱私權 > 定位服務」確認是否有開啟定位服務，或至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'
//             label => *text='設定'
//   `
// })

// Load.VueComponent('Status', {
//   props: {
//     status: { type: String, required: true, default: null }
//   },
//   template: `
//     #status => :class=status
//       label.content => *if=status=='notDetermined'   @click=determine
//         i
//         .info
//           b => *text='請同意定位'
//           span => *text='請點擊這裡，並且同意「APP」讀取您的裝置定位。'

//       label.content => *if=status=='other'
//         i
//         .info
//           b => *text='無法取得定位狀態'
//           span => *text='請檢查手機是否有有開啟定位功能。'
//           a => *text='可至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'

//       label.content => *if=status=='restricted'
//         i
//         .info
//           b => *text='定位受限制'
//           span => *text='無法更改此應用程序的狀態，這可能是由於存在家長控制等活動限制。'


//       label.content => *if=status=='denied'
//         i
//         .info
//           b => *text='無法定位'
//           span => *text='系統未開啟定位功能，或您拒絕了「APP」取用您的裝置定位！'
//           a => *text='請至「設定 > 隱私權 > 定位服務」確認是否開啟定位服務；或至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'


//       label.content => *if=status=='inUse'
//         i
//         .info
//           b => *text='無法背景定位'
//           span => *text='您尚未同意使用背景定位！'
//           a => *text='請至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'

//   `
// })
// Load.VueComponent('Info', {
//   template: `
//     #info
//       .cell.ctrl => *if=isRunning
//         b => *text='GPS 正在紀錄'
//         span => *text='目前 GPS 紀錄正常作業中！'
//         label => *text='停止紀錄'   @click=stop
      
//       .cell.ctrl => *else
//         b => *text='GPS 尚未開始'
//         span => *text='目前未開啟 GPS 紀錄，請點擊下方「開始記錄」即可開始記錄，即便在背景模式依然可以做紀錄。'
//         label => *text='開始紀錄'   @click=start

//       span.header => *text='座標資料'

//       .cell.lat-lng-accH
//         .lat-lng
//           .lat
//             span.title => *text='緯度'
//             span.value => *text=lat
//           .lng
//             span.title => *text='經度'
//             span.value => *text=lng
//         .accH
//           span.title => *text='誤差範圍'
//           span.value => *text=accH
//           span.unit => *text='公尺'
      
//       .cell.maps
//         .map => :ref='map'
//         .zoom
//           label.add => @click=mapZoom(1)
//           i
//           label.sub => @click=mapZoom(-1)

      
//       // span.header => *text='移動速度'
//       // .cell.speeds
//       //   .speed
//       //     span.title => *text='時速'
//       //     span.value => *text=speed1
//       //     span.unit => *text='公里/小時'

//       //   .speed
//       //     span.title => *text='秒速'
//       //     span.value => *text=speed
//       //     span.unit => *text='公尺/秒'

//       //   .speed
//       //     span.title => *text='誤差值'
//       //     span.value => *text=accS
//       //     span.unit => *text='公尺/秒'
      
//       // span.header => *text='海拔高度'
//       // .cell.alts
//       //   .alt
//       //     span.title => *text='高度'
//       //     span.value => *text=alt   :after='公尺'
//       //   .alt
//       //     span.title => *text='誤差值'
//       //     span.value => *text=accV   :after='公尺'

//       // span.header => *text='數據'
//       // .cell.counts
//       //   .count
//       //     span.title => *text='未上傳'
//       //     span.value => *text=count.gps === null ? '?' : count.gps
//       //     span.unit => *text='次'

//       //   .count
//       //     span.title => *text='上傳成功'
//       //     span.value.done => *text=count.done
//       //     span.unit => *text='次'

//       //   .count
//       //     span.title => *text='上傳失敗'
//       //     span.value.fail => *text=count.fail
//       //     span.unit => *text='次'
      
//       // span.header => *text='時間'

//       // .cell.logs
//       //   .log
//       //     .title => *text='GPS 擷取時間'
//       //     .value => *if=location.gps && location.gps.time && location.gps.time.gps   *text=location.gps.time.gps.text   :after=location.gps.time.gps.ago
//       //     .value => *else   *text=''   :after=''

//       //   .log
//       //     .title => *text='最新上傳時間'
//       //     .value => *if=location.upload && location.upload.time && location.upload.time.upload   *text=location.upload.time.upload.text   :after=location.upload.time.upload.ago
//       //     .value => *else   *text=''   :after=''

//       //   .log
//       //     .title => *text='伺服器回應時間'
//       //     .value => *if=location.server && location.server.time && location.server.time.upload   *text=location.server.time.upload.text   :after=location.server.time.upload.ago
//       //     .value => *else   *text=''   :after=''
        
//   `
// })