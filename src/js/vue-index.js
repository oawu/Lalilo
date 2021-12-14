/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.init({
  data: {
    style: {
      color: 'rgba(120, 120, 120, 1.00);'
    },
    version: '1.0.0'
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    date (format) {
      const pad0 = t => (t < 10 ? '0' : '') + t
      const date = new Date()
      return format.replace('Y', date.getFullYear())
        .replace('m', pad0(date.getMonth() + 1))
        .replace('d', pad0(date.getDate()))
        .replace('H', pad0(date.getHours()))
        .replace('i', pad0(date.getMinutes()))
        .replace('s', pad0(date.getSeconds()))
    }
  },
  template: El.render(`
    main#app
      div#device
        div.fire.ing
          i.icon-f0001 => *for=(_, i) in [1,2,3]   :key=i

        div.water.full
          i => *for=(_, i) in [1,2,3,4,5,6,7,8,9,10]   :key=i
        div.cover.open.ing
        header
          i.on
          span => *text='EC123432123'
        div.body
          div.shadow1
          div.shadow2
          div.gear.ing
            i.icon-f0002 => *for=(_, i) in [1,2,3,4,5]   :key=i
          b.sprinkler
          div.cup

        footer
      `)
})
