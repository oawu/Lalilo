/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    aid: null,
    did: null,

    queue: Queue(),

    activity: null,
    points: null,
    stopsList: null,
  },
  mounted () {
    Param.Query({ aid: 0, did: 0 })

    this.aid = 1 * Param.Query.aid
    this.did = 1 * Param.Query.did

    App.Bridge.on(`gps::refresh::${this.aid}`, _ => {
      this._refresh()
    })

    App.Bridge.on('_loadData', _ => this._loadData().catch(_ => {}))
    App.Action.Emit('_loadData').emit()


    App.VC.Nav.Bar.Title("活動內容").emit()
    App.VC.Mounted().emit()

    setTimeout(_ => (new ResizeObserver((entries) => entries[0].target == this.$el && this.$el.dispatchEvent(new CustomEvent('scroll')))).observe(this.$el))
  },
  methods: {
    _refresh () {
      if (this.aid === null || this.did === null) {
        return
      }

      if (this.activity === null || this.points === null || this.stopsList === null) {
        return
      }

      if (this.queue.size) {
        return
      }

      this.queue.enqueue(next => {
        const promise = App.isWeb
          ? new Promise((resolve, reject) => Api(`${window.baseUrl}json/sql/points.json`).done(resolve).fail(reject).send())
          : App.SqlLite.Model('Point').select('lat', 'lng', 'speedKmh', 'time').order('id DESC').where('activityId', this.activity.id).where('accLevel', '>', 3).all()

          promise.then(_points => {
            const { points, stopsList } = PointTool.valid(_points)

            this.points = points
            this.stopsList = stopsList
          })
          .catch(_ => {})
          .finally(next)
      })
    },
    async _loadData () {
      if (this.aid === null || this.did === null) {
        return
      }

      this.queue.enqueue(next => {
        App.VC.Nav.Bar.Button.Right().emit()

        this.activity = null
        this.points = null
        this.stopsList = null

        Promise.all(App.isWeb ? [
          new Promise((resolve, reject) => Api(`${window.baseUrl}json/sql/activity.json`).done(resolve).fail(reject).send()),
          new Promise((resolve, reject) => Api(`${window.baseUrl}json/sql/points.json`).done(resolve).fail(reject).send()),
        ] : [
          App.SqlLite.Model('Activity').one(this.aid),
          App.SqlLite.Model('Point').select('lat', 'lng', 'speedKmh', 'time').order('id DESC').where('activityId', this.aid).where('accLevel', '>', 3).all(),
        ])
        .then(([_activity, _points]) => {
          const { points, stopsList } = PointTool.valid(_points)

          this.activity = _activity
          this.points = points
          this.stopsList = stopsList

          App.VC.Nav.Bar.Button.Right('刷新', App.Action.Emit('_loadData')).emit()
          next()
        })
        .catch(_ => {})
      })
    },
    scroll (e) {
      setTimeout(_ => App.OnScroll(e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight).emit())
    },
  },
  computed: {
  },
  template: `
    main#app => @scroll=scroll
      .table-view-groups
        
        Group0 => *if=activity === null && points === null && stopsList === null

        template => *else
          

          Group1 => *if=activity !== null    :activity=activity
          Group2 => *if=points !== null      :points=points
          Group3 => *if=stopsList !== null   :stopsList=stopsList
          Group4 => *if=points !== null      :points=points
      `
})

Load.VueComponent('Group0', {
  template: `
    .group
      .items
        .item
          .content
            .info
              .key
                span.center => *text='讀取中…'
  `
})

Load.VueComponent('Group1', {
  props: {
    activity: { type: Object, default: null, required: true }
  },
  methods: {
    click () {
      if (!this.activity) {
        return
      }

      const _title = this.activity.title.trim()

      App.Alert('修改')
        .input(_title, '請輸入標題…')
        .button('取消')
        .button('確定', ([title]) => {
          title = title.trim()

          if (title == _title) {
            return App.HUD.Show.Done('已更新').completion(App.HUD.Hide(400)).emit()
          }

          if (title === '') {
            return
          }

          this.activity.title = title
          this.activity.save()
            .then(_ => {
              App.Action.Emit('updateActivity', { id: this.activity.id, title: this.activity.title }).prev().emit()
              App.HUD.Show.Done('已更新').completion(App.HUD.Hide(400)).emit()
            })
            .catch(_ => App.HUD.Show.Fail('更新失敗').completion(App.HUD.Hide(400)).emit())
        })
        .emit()
    },
  },
  template: `
    .group
      .items
        .item
          .content
            .info
              .key
                b => *text=activity.title
              .val
                label => *text='修改'   @click=click
  `
})

Load.VueComponent('Group2', {
  props: {
    points: { type: Array, default: [], required: true }
  },
  data: _ => ({
    myPoints: [],

    length: '',

    sTime: '',
    eTime: '',
    dTime: '',
    speedMax: '',
  }),
  mounted () {
    this.myPoints = this.points
    this._refresh()
  },
  watch: {
    points (points) {
      this.myPoints = points
      this._refresh()
    }
  },
  methods: {
    _refresh () {
      const length = PointTool.length(this.myPoints)

      this.length = length > 0
        ? length > 1000
          ? `${Helper.round(length / 1000, 2)} 公里`
          : `${Helper.round(length)} 公尺`
        : ''

      if (this.myPoints.length) {
        const sTime = this.myPoints[this.myPoints.length - 1].time
        const eTime = this.myPoints[0].time

        this.sTime = Helper.date('Y/m/d H:i:s', new Date(sTime * 1000))
        this.eTime = Helper.date('Y/m/d H:i:s', new Date(eTime * 1000))
        this.dTime = Helper.timeFormat((eTime - sTime) * 1000)
      } else {
        this.sTime = ''
        this.eTime = ''
        this.dTime = ''
      }

      this.speedMax = this.points.length
        ? `${Helper.round(this.points.map(({ speed }) => speed).reduce((a, b) => a > b ? a : b), 1)} 公里/小時`
        : ''
    }
  },
  template: `
    .group
      .items
        div.item
          .content
            .info
              .key
                span => *text='總長度'
              .val
                b => *text=length   :empty='--'
        div.item
          .content
            .info
              .key
                span => *text='總耗時'
              .val
                b => *text=dTime   :empty='--'
        div.item
          .content
            .info
              .key
                span => *text='最高時速'
              .val
                b => *text=speedMax   :empty='--'
        div.item
          .content
            .info
              .key
                span => *text='第一個定位點的時間'
              .val
                b => *text=sTime   :empty='--'
        div.item
          .content
            .info
              .key
                span => *text='最新定位點的時間'
              .val
                b => *text=eTime   :empty='--'
  `
})

Load.VueComponent('Group3', {
  props: {
    // points: { type: Array, default: [], required: true },
    stopsList: { type: Array, default: [], required: true },
  },
  data: _ => ({
    myStopsList: [],

    timeAll: '',
    count: '',
    timeMax: '',
    timeMin: '',
    timeAvg: '',
  }),
  mounted () {
    this.myStopsList = this.stopsList
    this._refresh()
  },
  watch: {
    stopsList (stopsList) {
      this.myStopsList = stopsList
      this._refresh()
    }
  },
  methods: {
    _refresh () {

      const times = this.myStopsList
        .filter(stops => stops.length > 1)
        .map(stops => stops[0].time - stops[stops.length - 1].time)
      
      const count = this.myStopsList.length
      const timeAll = times.length
        ? times.reduce((a, b) => a + b)
        : null

      this.count = `${Helper.numFormat(count)} 次`
      this.timeAll = timeAll !== null ? Helper.timeFormat(timeAll * 1000) : ''
      this.timeMax = times.length ? Helper.timeFormat(times.reduce((a, b) => a > b ? a : b) * 1000) : ''
      this.timeMin = times.length ? Helper.timeFormat(times.reduce((a, b) => a < b ? a : b) * 1000) : ''
      this.timeAvg = timeAll !== null && count > 0 ? `${Helper.timeFormat(Helper.round(timeAll / count) * 1000)} / 次` : ''
    }
  },
  template: `
    .group
      .header => *text='停留'
      .items
        div.item
          .content
            .info
              .key
                span => *text='次數'
              .val
                b => *text=count
        div.item => *if=timeMax !== ''
          .content
            .info
              .key
                span => *text='最久'
              .val
                b => *text=timeMax
        div.item => *if=timeMin !== ''
          .content
            .info
              .key
                span => *text='最短'
              .val
                b => *text=timeMin
        div.item => *if=timeAvg !== ''
          .content
            .info
              .key
                span => *text='平均'
              .val
                b => *text=timeAvg
        div.item => *if=timeAll !== ''
          .content
            .info
              .key
                span => *text='總花費'
              .val
                b => *text=timeAll
      
      .footer => *text='停留標準判定是以移動速度低於「0.5 公里/小時」為標準。'
  `
})

Load.VueComponent('Group4', {
  props: {
    points: { type: Array, default: [], required: true },
  },
  data: _ => ({
    myPoints: [],

    speed: null,

    map: null,
    layer: null,
    zoomendTimer: null,

  }),
  mounted () {
    this.myPoints = this.points
    this._speeds()

    this.observer = new IntersectionObserver(entries => {
      if (entries[0].target == this.$el && entries[0].isIntersecting === true) {
        this.observer.disconnect()
        setTimeout(this._initMap, 1)
      }
    })
    this.observer.observe(this.$el)
  },
  watch: {
    points (points) {
      this.myPoints = points
      this._speeds()
    },
  },
  methods: {
    async _speeds () {
      this.speed = PointTool.speed.calc(this.myPoints)
      return this._refresh(true)
    },

    _refresh (move) {
      if (!this.map) { return this }
      if (!this.layer) { return this }
      
      if (move) {
                
        setTimeout(_ => {
          let bounds = L.latLngBounds(this.myPoints)
          if (this.myPoints.length == 1) {
            this.map.setView(this.myPoints[0], 15)
          } else if (bounds.isValid()) {
            this.map.flyToBounds(bounds, {
              padding: [5, 5],
              animate: false,
              noMoveStart: true })
          } else {
            this.map.setView(PointTool.d4, PointTool.d4.zoom)
          }
        })
      }
      setTimeout(_ => {
        const points = Helper.cluster(this.myPoints, this.map.getZoom(), 3, true).map(points => points[0])

        this.layer.clearLayers()

        let _point = null
        for (const point of points) {
          if (_point !== null) {
            this.layer.addLayer(L.polyline([_point, point,], {
              weight: 5,
              color: PointTool.speed.color(this.speed, point.speed),
              paused: false,
              hardwareAccelerated: true,
            }))
          }
          _point = point
        }
      })
    },

    _initMap() {
      this.map = L.map(this.$refs.el, {
        tap: true,
        dragging: true,
        zoomControl: false,
        doubleClickZoom: true,
        scrollWheelZoom: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        minZoom: 1,
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      }).addTo(this.map)

      this.map.setView(PointTool.d4, PointTool.d4.zoom)
      this.map.on('zoomend', _ => {
        clearTimeout(this.zoomendTimer)
        this.zoomendTimer = setTimeout(_ => this._refresh(false), 100)
      })

      this.layer = L.layerGroup().addTo(this.map)

      setTimeout(_ => this.map.invalidateSize())
      this._refresh(true)
    },
    click () {
      const aid = 1 * Param.Query.aid
      const did = 1 * Param.Query.did

      if (aid === null || did === null) {
        return
      }

      const url = `${window.baseUrl}LogMap.html?did=${did}&aid=${aid}`
      
      if (window.Bridge.type === 'Web') {
        return window.location.assign(url)
      }
      
      const web = App.VC.View.Web(url)
        .navBarTitle('活動紀錄')
        .navBarAppearance('show')
        .tabBarAppearance('show')

      App.VC.Nav.Push(web).emit()
    },
  },
  template: `
    .group
      .items._clear
        .map => @click=click
          .el => :ref='el'
  `
})
