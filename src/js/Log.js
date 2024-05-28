/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    oriGroups: null,
    activityIdMap: {},
  },
  mounted () {
    this._resetShow().catch(_ => {})

    App.Bridge.on('gps::start', _ => {
      this._resetHide().catch(_ => {})
      App.Action.Emit('_loadData').emit()
    })
    App.Bridge.on('gps::stop', _ => {
      this._resetShow().catch(_ => {})
    })

    App.Bridge.on('updateActivity', (_, activity) => {
      if (typeof activity == 'object' && activity !== null && !Array.isArray(activity)) {
        if (this.activityIdMap[activity.id] !== undefined) {
          this.activityIdMap[activity.id].title = activity.title
        }
      }
    })

    App.Bridge.on('_loadData', _ => this._loadData().catch(_ => {}))
    App.Action.Emit('_loadData').emit()

    App.VC.Nav.Bar.Title("活動紀錄").emit()

    App.VC.Tab.Bar.Title("紀錄").emit()

    this._resetShow().catch(_ => {})

    App.VC.Mounted().emit()

    setTimeout(_ => (new ResizeObserver((entries) => entries[0].target == this.$el && this.$el.dispatchEvent(new CustomEvent('scroll')))).observe(this.$el))
  },
  watch: {
  },
  methods: {
    async _resetHide () {
      App.VC.Nav.Bar.Button.Left().emit()
    },
    async _resetShow () {
      App.VC.Nav.Bar.Button.Left('清除', App.Alert(null, '你確定要全部移除？')
        .button('確定', _ => {
          
          App.HUD.Show.Loading('清除中，請稍後…').completion(_ => this._migration()
            .then(_ => {
              App.Action.Emit('_loadData').completion(App.HUD.Show.Done('已經全部移除').completion(App.HUD.Hide(400))).emit()
            })
            .catch(_ => {
              App.Action.Emit('_loadData').completion(App.HUD.Show.Done('清除失敗…').completion(App.HUD.Hide(400))).emit()
            })).emit()
        })
        .button('取消'), true).emit()
    },

    async _migration () {
      
      let tables = await App.SqlLite().tables()
      for (const table of tables) {
        await App.SqlLite(table).drop()
      }

      await App.SqlLite(PointTool.schema.date.table).columns(PointTool.schema.date.columns).create()
      for (const sql of PointTool.schema.date.indexes) {
        await App.SqlLite().sql(sql).exec()
      }

      await App.SqlLite(PointTool.schema.activity.table).columns(PointTool.schema.activity.columns).create()
      for (const sql of PointTool.schema.activity.indexes) {
        await App.SqlLite().sql(sql).exec()
      }

      await App.SqlLite(PointTool.schema.point.table).columns(PointTool.schema.point.columns).create()
      for (const sql of PointTool.schema.point.indexes) {
        await App.SqlLite().sql(sql).exec()
      }

      tables = await App.SqlLite().tables()
      
      return true
    },
    async _loadData () {
      App.VC.Nav.Bar.Button.Right().emit()

      this.activityIdMap = {}
      this.oriGroups = null

      const dates = App.isWeb
        ? await new Promise((resolve, reject) => Api(`${window.baseUrl}json/sql/dates.json`).done(resolve).fail(reject).send())
        : await App.SqlLite.Model('Date').order('id DESC').all()

      this.oriGroups = dates.map(date => {
        const group = {
          header: `${date.year}/${date.month}/${date.day}`,
          items: []
        }

        const activity = App.isWeb
          ? new Promise((resolve, reject) => Api(`${window.baseUrl}json/sql/activities.json`).done(resolve).fail(reject).send())
          : App.SqlLite.Model('Activity').where('dateId', date.id).order('id DESC').all()

        activity
          .then(activities => group.items = activities.map(activity => {
            const item = {
              query: { did: date.id, aid: activity.id },
              title: activity.title,
              subtitle: `共有 ${Helper.numFormat(activity.cntAccLevel0Points)} 個點座標`,
            }

            this.activityIdMap[activity.id] = item
            // setTimeout(_ => {
            //   this.activityIdMap[activity.id].title = 'xxxx'
            // }, 2000)
            
            return item
          }))

        return group
      })

      App.VC.Nav.Bar.Button.Right('刷新', App.Action.Emit('_loadData')).emit()
    },
    click (item) {
      const url = `${window.baseUrl}LogDetail.html?did=${item.query.did}&aid=${item.query.aid}`
      
      if (window.Bridge.type === 'Web') {
        return window.location.assign(url)
      }

      const web = App.VC.View.Web(url)
        .navBarTitle('活動內容')
        .navBarAppearance('auto')
        .tabBarAppearance('auto')

      App.VC.Nav.Push(web).emit()
    },
    scroll (e) {
      setTimeout(_ => App.OnScroll(e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight).emit())
    },
  },
  computed: {
    groups () {
      return this.oriGroups === null ? null : this.oriGroups.filter(group => group.items.length)
    }
  },
  template: `
    main#app => @scroll=scroll
      .table-view-groups
        
        .group => *if=groups === null
          .items
            .item
              .content
                .info
                  .key
                    span.center => *text='讀取中…'

        .group => *else-if=groups.length == 0
          .items
            .item
              .content
                .info
                  .key
                    span.center => *text='目前沒有任何資料。'

        .group => *for=(group, i) in groups   :key='groups_' + i
          .header => *if=typeof group.header == 'string' && group.header !== ''   *text=group.header
          .items
            label.item => *for=(item, j) in group.items   :key='items_' + j   @click=click(item)
              .cover => :style={'--width':'80px'}
                mapCover => :id=item.query.aid

              .content
                .info
                  .key => *if=(typeof item.title == 'string' && item.title !== '') || (typeof item.subtitle == 'string' && item.subtitle !== '')
                    b => *if=typeof item.title == 'string' && item.title !== ''   *text=item.title
                    span => *if=typeof item.subtitle == 'string' && item.subtitle !== ''   *text=item.subtitle
                  .val => *if=typeof item.value == 'string' && item.value !== ''
                    b => *text=item.value
                .icon
                  .arrowUI
      `
})

Load.VueComponent('mapCover', {
  props: {
    id: { type: Number, required: false, default: 0 },
  },
  data: _ => ({
    map: null,
    observer: null,
    polyline: null,
  }),
  mounted () {
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting !== true) {
        return
      }
      this.observer.disconnect()
      setTimeout(this._init, 1)
    })
    this.observer.observe(this.$el)
  },
  methods: {
    async _init () {
      if (!this.map) {
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

        this.map.setView(PointTool.d4, PointTool.d4.zoom)
        setTimeout(_ => this.map.invalidateSize())
      }

      if (!this.map) {
        return
      }
      if (this.polyline) {
        return
      }

      this.polyline = L.polyline([], {
        weight: 3,
        pulseColor: 'red',
        color: 'rgba(252, 108, 181, 1.00)',
        paused: false,
        hardwareAccelerated: true,
      }).addTo(this.map)

      const _points = App.isWeb
        ? await new Promise((resolve, reject) => Api(`${window.baseUrl}json/sql/points.json`).done(resolve).fail(reject).send())
        : await App.SqlLite.Model('Point').select('lat', 'lng', 'speedKmh', 'time').order('id DESC').where('activityId', this.id).where('accLevel', '>', 3).all()

      const { points } = PointTool.valid(_points)

      setTimeout(_ => {
        const bounds = L.latLngBounds(points)
        if (points.length == 1) {
          this.map.setView(points[0], 15)
        } else if (bounds.isValid()) {
          this.map.flyToBounds(bounds, {
            padding: [5, 5],
            animate: false,
            noMoveStart: true
          })
        } else {
          this.map.setView(PointTool.d4, PointTool.d4.zoom)
        }
  
        this.polyline.setLatLngs(Helper.cluster(points, this.map.getZoom(), 3, true).map(points => points[0]))
      })

    },
  },
  template: `
    .map
      .el => :ref='el'
      .empty => *if=polyline === null
  `
})
