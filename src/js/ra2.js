/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    src: 'https://www.ra2web.com/',
    // o: 3,
    // s: 4,
    // p: 5,
    opacity: 0.8,
    scale: 0.75,
    position: 1,
    height: 0,
    window: null,
  },
  mounted () {
    
    this.window = $(window)
    this.window.resize(_ => {
      this.height = this.window.height()
    }).resize()
    
  },
  methods: {
  },
  computed: {
    calcScale () {
      if (this.position != 5) {
        return this.scale
      }
      return (this.height - (8 + 36)) / 600
    }
  },
  template: `
    main#app

      .slick-next
      .slick-prev

      
      // video#video => :muted=true   :autoplay=true   :loop=true
      //   source => src=img/video.mov

      // #iframe => :style={'--opacity': opacity, '--scale': calcScale}   :class='_p' + position
      //   .ctrl
      //     template => *if=position!=5
      //       .group
      //         label => *text='0.5'   @click=opacity=0.5
      //         label => *text='0.8'   @click=opacity=0.8
      //         label => *text='不透'   @click=opacity=1
      //       .group
      //         label => *text='小'   @click=scale=0.5
      //         label => *text='中'   @click=scale=0.75
      //         label => *text='大'   @click=scale=1
      //       .group
      //         label => *text='↘'   @click=position=1
      //         label => *text='↙'   @click=position=2
      //         label => *text='↗'   @click=position=3
      //         label => *text='↖'   @click=position=4
      //     .group
      //       label => *text='全螢幕'   @click=position=5
      //       label => *text='小螢幕'   @click=scale=0.75,position=1
      //   .game
      //     iframe => :src=src   :ref='iframe'



      // img#img => :src='img/code.png'
      // #iframe => :class=['_o' + o, '_s' + s, '_p' + p]
      //   #ctrl
      //     div
      //       label => *text='0.5 透'   @click=o=1
      //       label => *text='0.8 透'   @click=o=2
      //       label => *text='不透'   @click=o=3
      //     div
      //       label => *text='小'   @click=s=1
      //       label => *text='中'   @click=s=2
      //       label => *text='大'   @click=s=3
      //     div
      //       label => *text='右下'   @click=p=1
      //       label => *text='左下'   @click=p=2
      //       label => *text='右上'   @click=p=3
      //       label => *text='左上'   @click=p=4
      //     div
      //       label => *text='全螢幕'   @click=s=4,p=5
      //       label => *text='小螢幕'   @click=p=1,s=2

      //   iframe => :src1=src
      
  `
})
