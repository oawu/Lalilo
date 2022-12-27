/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    u: parseInt(Data.get('bitmap-unit') || 10, 10),
    w: parseInt(Data.get('bitmap-width') || 10, 10),
    h: parseInt(Data.get('bitmap-height') || 10, 10),
    v: Data.get('bitmap-view') || false,
    c1: Data.get('bitmap-color1') || '#000000',
    c2: Data.get('bitmap-color2') || '#000000',

    down: false,
    map: []
  },
  mounted () {
  },
  methods: {
    toRBG (hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : [0, 0, 0];
    },
    add(i) {
      let obj = this.map.find(obj => obj.i == i)
      obj
        ? (obj.c = this.c1)
        : this.map.push({ i, c: this.c1 })
    },
    del(i) {
      let obj = this.map.find(obj => obj.i == i)
      obj
        ? (obj.c = this.c2)
        : this.map.push({ i, c: this.c2 })
    },
    color(i) {
      let obj = this.map.find(obj => obj.i == i)
      if (!obj) return 'transparent';
      return obj.c
    }
  },
  computed: {
    unit () { return this.u !== '' ? this.u : 0; },
    width () { return this.w !== '' ? this.w : 0; },
    height () { return this.h !== '' ? this.h : 0; },
    view () { return this.v; },
    c1RBG () { return this.toRBG(this.c1); },
    c2RBG () { return this.toRBG(this.c2); },
  },
  watch: {
    unit () { Data.set('bitmap-unit', this.unit) },
    width () { Data.set('bitmap-width', this.width) },
    height () { Data.set('bitmap-height', this.height) },
    view () { Data.set('bitmap-view', this.view) },
    
    c1 () { Data.set('bitmap-color1', this.c1) },
    c2 () { Data.set('bitmap-color2', this.c2) },
  },
  template: `
    main#app
      div#colors
      div#container
        div#map => :style={'--w': width * unit + 'px', '--u': unit + 'px', '--v': view ? '1px' : '0px'}   @mouseleave=down=false
          div => *for=(_, i) in Array(w * h).fill(0)   :key=i   @mousedown=down=true   @click=add(i)   @mouseup=down=false   @mouseenter=down&&1   :style={'--c': color(i)}   @contextmenu.prevent=del(i)
            span
      
      form#ctrl
        div.wh
          span => *text='寬高'

          div
            label
              span => *text='寬'
              input => type=number   *model.trim=w

            label
              span => *text='長'
              input => type=number   *model.trim=h
        
        i
        div.size
          span => *text='大小'
          div
            label => @click=u=parseInt(u,10),u=u > 1 ? u - 1 : 0
            input => type=number   *model.trim=u
            label => @click=u=parseInt(u,10),u=u+1

        i
        div.view
          span => *text='網格'
          label => @click=v=!v   :class={v}

        i
        div.color
          span => *text='顏色'
          div
            label.c1
              span => :style={'--bg': c1}
              input => type=color   *model.trim=c1
            label.c2
              span => :style={'--bg': c2}
              input => type=color   *model.trim=c2
            label.chg
              span

      `
})
