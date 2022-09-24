/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */



Load.view('page_1', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p1
      div.left
        p.l1 => *text='關就有故配地書不。接使及傷食不，立越的著些為這麼以康們面來它不，用手病動言要時到可己神給'
        p.l2 => *text='爭心、化種要因然很是麼理書有級死推車合但許走王工打當西發己聯一'
        p.l4 => *text='頭滿力不，費集星片下月不出木容實得再告中不林觀二優？假資別共可通好知初她，市'
        p.l5 => *text='收。數的了用幾大行這一真行對。活模要團電不產，半起房起東界考己人看就。上'
        span => *text='OA ❤️ Shari @ 2018.5.02 '
      div.right
        img_7505 => :h=750
      div.border
    `
})

Load.view('page_2', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p2
      img_7513 => :h=800
    `
})

Load.view('page_3', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p3
      div.left
        img_7490 => :h=800
      div.right
        img_7481 => :h=450
        div.border.b1
        // div.border.b2

    `
})

Load.view('page_4', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p4
      div.left
        img_7649 => :h=420
      div.right
        img_7645 => :w=800

    `
})
Load.view('page_5', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p5
      div.left
        img_7602 => :h=800
      div.right
        img_7607 => :h=800

    `
})
Load.view('page_6', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p6
      div.left
        img_7724 => :h=500
        img_7705 => :h=500
      div.right
        img_7713 => :h=800

    `
})
Load.view('page_7', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p7
      div.left
        img_7684 => :h=800
      div.right
        img_7690 => :h=360
        img_7691 => :h=360
    `
})
Load.view('page_8', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p8
      div.left
        img_7745 => :h=620
      div.right
        img_7778 => :h=800
    `
})

Load.view('page_9', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p9
      img_7786 => :h=800
      b => *text='Why do we use it?'
      span => *text='It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters'
    `
})
Load.view('page_10', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p10
      div.left
        img_7551 => :w=800
      div.right
        img_7565 => :w=800
    `
})
Load.view('page_11', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p11
      img_7582 => :h=800
    `
})
Load.view('page_12', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p12
      div.left
        img_7593 => :h=700
      div.right
        img_7596 => :h=700
    `
})
Load.view('page_13', {
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  template: `
    div.page.p13
      div.left
        img_7572 => :h=750

      div.right
        p.l1 => *text='關就有故配地書不。接使及傷食不，立越的著些為這麼以康們面來它不，用手病動言要時到可己神給'
        p.l2 => *text='爭心、化種要因然很是麼理書有級死推車合但許走王工打當西發己聯一'
        p.l4 => *text='頭滿力不，費集星片下月不出木容實得再告中不林觀二優？假資別共可通好知初她，市'
        p.l5 => *text='收。數的了用幾大行這一真行對。活模要團電不產，半起房起東界考己人看就。上'
        span => *text='OA ❤️ Shari @ 2023.5.21 '

      div.border
    `
})

Load.init({
  data: {
    idx: 1,
    total: 13
  },
  template: `
    main#app
      div#ctrl
        label => *text='上一頁'   @click=idx=idx-1 > 0 ? idx-1 : 1 
        span => *text=idx + '/' + total
        label => *text='下一頁'   @click=idx=idx+1 <= total ? idx+1 : total

      div#book
        div#pages => :class='n'+idx
          page_1
          page_2
          page_3
          page_4
          page_5
          page_6
          page_7
          page_8
          page_9
          page_10
          page_11
          page_12
          page_13
      `
})












for (let {name, width, height} of [{name: '7481', width: 4315, height: 2877},
  {name: '7490', width: 3401, height: 5102},
  {name: '7505', width: 3648, height: 5472},
  {name: '7513', width: 5436, height: 3624},
  {name: '7551', width: 5169, height: 3446},
  {name: '7565', width: 3802, height: 2535},
  {name: '7572', width: 3648, height: 5472},
  {name: '7582', width: 5472, height: 3648},
  {name: '7593', width: 5461, height: 3641},
  {name: '7596', width: 3507, height: 5261},
  {name: '7602', width: 5472, height: 3648},
  {name: '7607', width: 3648, height: 5472},
  {name: '7645', width: 3648, height: 5472},
  {name: '7649', width: 5472, height: 3648},
  {name: '7684', width: 3648, height: 5472},
  {name: '7690', width: 3648, height: 5472},
  {name: '7691', width: 4423, height: 2949},
  {name: '7705', width: 3271, height: 4906},
  {name: '7713', width: 5472, height: 3648},
  {name: '7724', width: 5331, height: 3554},
  {name: '7745', width: 5222, height: 3481},
  {name: '7778', width: 3648, height: 5472},
  {name: '7786', width: 4561, height: 3041}])
  Load.view(`img_${name}`, {
    props: {
      w: { type: Number, required: false, default: null },
      h: { type: Number, required: false, default: null },
    },
    data: _ => ({
      src: `/img/tinypng/IMG_${name}.jpg`,
      width,
      height,
      ww: 0,
      hh: 0,
    }),
    mounted () {
      let gradient = this.height / this.width
      if (this.w !== null && this.h !== null) {
        this.ww = this.w
        this.hh = this.h
      }
      if (this.w !== null && this.h === null) {

        this.ww = this.w
        this.hh = this.w * gradient
      }
      if (this.w === null && this.h !== null) {
        this.hh = this.h
        this.ww = this.h / gradient
      }
      if (this.w === null && this.h === null) {
        this.ww = 0
        this.hh = 0
      }
    },
    template: `
    div.pic_img.img_${name} => :style={width: ww + 'px', height: hh + 'px'}
      figure => :style={backgroundImage: 'url(' + src + ')',width: ww + 'px', height: hh + 'px'}`
  })
