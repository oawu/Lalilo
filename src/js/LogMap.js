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
    
    map: null,
    layer: null,

    stopShow: true,
    speedsShow: true,
    zoomendTimer: null,

    queue: Queue(),

    speed: null,
    length: null,
    points: null,
    stopsList: null,

    isUserMove: false,
    isUserMoveTimer: null,
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

    App.emits([
      App.VC.Nav.Bar.Title("活動紀錄"),
      App.VC.Nav.Bar.Appearance('show'),
      App.VC.Tab.Bar.Appearance('show'),
      
    ])
    App.VC.Mounted().emit()

  },
  methods: {
    _refresh () {
      if (this.aid === null || this.did === null) {
        return
      }
      if (this.points === null || this.stopsList === null || this.length === null || this.speed === null) {
        return
      }
      if (this.queue.size) {
        return
      }
      this.queue.enqueue(next => {
        const promise = App.isWeb
          ? new Promise((resolve, reject) => Api(`${window.baseUrl}json/sql/points.json`).done(resolve).fail(reject).send())
          : App.SqlLite.Model('Point').select('lat', 'lng', 'speedKmh', 'time').order('id DESC').where('activityId', this.aid).where('accLevel', '>', 3).all()

        promise
          .then(_points => {
            const { points, stopsList } = PointTool.valid(_points)

            this.points    = points
            this.stopsList = stopsList
            this.length    = PointTool.length(points)
            this.speed     = PointTool.speed.calc(points)

            this._refreshMap(this.isUserMove ? 0 : 2)
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

        this.points    = null
        this.stopsList = null
        this.length    = null
        this.speed     = null
        
        this._initMap()

        const promise = App.isWeb
          ? new Promise((resolve, reject) => Api(`${window.baseUrl}json/sql/points.json`).done(resolve).fail(reject).send())
          : App.SqlLite.Model('Point').select('lat', 'lng', 'speedKmh', 'time').order('id DESC').where('activityId', this.aid).where('accLevel', '>', 3).all()

        promise
          .then(_points => {
            const { points, stopsList } = PointTool.valid(_points)

            this.points    = points
            this.stopsList = stopsList
            this.length    = PointTool.length(points)
            this.speed     = PointTool.speed.calc(points)

            this._refreshMap(1)

            App.VC.Nav.Bar.Button.Right('刷新', App.Action.Emit('_loadData')).emit()

            next()
          })
          .catch(_ => {})
      })
    },
    _initMap () {
      if (!this.map) {
        this.map = L.map(this.$refs.map, {
          tap: true,
          tapHold: true,
          dragging: true,
          zoomControl: false,
          doubleClickZoom: true,
          scrollWheelZoom: true,
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
          this.zoomendTimer = setTimeout(_ => this._refreshMap(0), 100)

          // this.isUserMove = true
          // clearTimeout(this.isUserMoveTimer)
          // this.isUserMoveTimer = setTimeout(_ => this.isUserMove = false, 5000)
        })
        this.map.on('dragstart', _ => {
          this.isUserMove = true
          clearTimeout(this.isUserMoveTimer)
          this.isUserMoveTimer = setTimeout(_ => this.isUserMove = false, 5000)
        })
        setTimeout(_ => this.map.invalidateSize())
      }
      if (!this.layer) {
        this.layer = L.layerGroup().addTo(this.map)
      }
    },

    _refreshMap (move) {
      if (!this.map) { return this }
      if (!this.layer) { return this }
      if (this.points === null) { return this }
      if (this.stopsList === null) { return this }

      if (move != 0) {
        setTimeout(_ => {
          if (move == 1) {
            let bounds = L.latLngBounds(this.points)
            if (this.points.length == 1) {
              this.map.setView(this.points[0], 15)
            } else if (bounds.isValid()) {
              this.map.flyToBounds(bounds, {
                padding: [8, 8],
                animate: false,
                noMoveStart: true })
            } else {
              this.map.setView(PointTool.d4, PointTool.d4.zoom)
            }
          }
          if (move == 2) {
            this.map.setView(this.points[0], this.map.getZoom())
          }
        })
      }

      setTimeout(_ => {
        const points = Helper.cluster(this.points, this.map.getZoom(), 3, true).map(points => points[0])

        this.layer.clearLayers()
        
        let _point = null
        for (const point of points) {
          if (_point !== null) {
            this.layer.addLayer(L.polyline([_point, point], {
              weight: 6,
              color: PointTool.speed.color(this.speed, point.speed),
              paused: false,
              hardwareAccelerated: true,
            }))
          }
          _point = point
        }

        if (!this.stopShow) {
          return
        }

        const stopsList = Helper.cluster(this.stopsList.filter(stops => stops.length > 1).map(stops => {
          const times = stops.map(({ time }) => time)
          const maxT = times.reduce((a, b) => a > b ? a : b)
          const minT = times.reduce((a, b) => a < b ? a : b)

          return {
            lat: stops[0].lat,
            lng: stops[0].lng,
            cnt: stops.length,
            time: maxT - minT
          }
        }), this.map.getZoom(), 2, false)


        for (let stops of stopsList) {
          const during = Helper.timeFormat(stops.map(({ time }) => time).reduce((a, b) => a + b, 0) * 1000, true)

          if (during === '') {
            continue
          }

          this.layer.addLayer(L.marker(stops[0], {
            icon: L.divIcon({
              className: 'marker-stops',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
              html: `<div>${during}</div>`,
              zIndexOffset: 995
            })
          }))
        }
      })
    },
    
    zoom (level) {
      if (!this.map) { return this }
      this.map.setZoom(this.map.getZoom() + level)
    },
  },
  computed: {
  },
  template: `
    main#mapview
      #map => :ref='map'

      #content
        label#sw => *if=stopsList !== null && stopsList.length   @click=stopShow=!stopShow,_refreshMap(1)   :class={_on: stopShow}
          i
          span => *text='顯示停留'

        #lb
          label#speeds => *if=speed    @click=speedsShow=!speedsShow   :class={ _show: speedsShow }
            .speed => *for=({ val, color }, i) in speed.vals   :key=i   :before=val   :style={'--color': color}   :after='km/h'

          #length => *if=length!==null
            span => *text='總長度'
            template => *if=length > 1000
              b => *text=Helper.round(length / 1000, 3)
              span => *text='公里'
            template => *else
              b => *text=Helper.round(length)
              span => *text='公尺'

        #zoom
          label.add => @click=zoom(+1)
          i
          label.sub => @click=zoom(-1)
      `
})
