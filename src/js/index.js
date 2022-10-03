
Load.Vue({
  data: {
    items: [
      { cover: `${BASE}img/cover/heatmap/status8139.png`, path: `heatmap/status8139`, title: '沖煮熱點圖' },
      { cover: `${BASE}img/cover/heartbeat/devices.png`, path: `heartbeat/devices`, title: '各個咖啡機的 heartbeat 紀錄' },
      { cover: `${BASE}img/cover/mqtt/gui.png`, path: `mqtt/gui`, title: 'MQTT GUI 工具' },
    ]
  },
  mounted () {
  },
  methods: {
  },
  template: `
    main#app
      h1 => *text='iDrip 開發小工具！'
      div.items
        label => *for=(item, i) in items   :key=i   @click=Redirect(item.path)
          figure => :style={backgroundImage: 'url(' + item.cover + ')'}
          b => *text=item.title`
})
