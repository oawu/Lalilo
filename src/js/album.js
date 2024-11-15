/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    title: '',
    size: 2,
    oa: ``,
    pictures: [
    ],
  },
  mounted () {
    Param.Query({ id: '00' })
    console.error(Param.Query.id);

    Api(`${window.baseUrl}json/${Param.Query.id}.json`)
      .done(({ title, baseURL, srcPath, thumbPath, pictures }) => {
        this.title = title
        
        const srcURL = `${baseURL}${srcPath}/`
        const thumbURL = `${baseURL}${thumbPath}/`

        let pics = pictures.map(picture => ({
          src: `${srcURL}${picture}`,
          thumb: `${thumbURL}${picture}`,
        }))

        this.pictures = pics
        
        const opt = {
          startIndex: 0,
          toolbar: {
             arrow: false
          },
          slug: "a"
        };

        if (Fancybox.Plugins.Hash && !Fancybox.getInstance()) {
          const { hash, slug, index } = Fancybox.Plugins.Hash.parseURL();

          if (hash && slug === opt.slug) {
            opt.startIndex = index - 1;
            Fancybox.show(pics.map(({ thumb, src }) => ({ thumb, src })), opt);
          }
        }

      })
      .fail(e => {
        console.error(e);
      })
      .send()
  },
  computed: {
  },
  methods: {
    show (index) {
      this.fancybox = Fancybox.show(this.pictures.map(({ thumb, src }) => ({ thumb, src })), {
        startIndex: index,
        toolbar: {
           arrow: false
        },
        slug: "a",
      })
    }
  },
  template: `
  main#app
    #nav
      .left
        b.logo => *text='PicMate'
        span.title => *text=title
      .right => *if=0
        .user
          figure
            img => :src=oa
    #ctrl
      a.back => :href='/'
        svg => :viewBox='0 0 49.853515625 86.6689453125'   :version='1.1'   :xmlns='http://www.w3.org/2000/svg'   :style='height: 14.1455px; width: 8.13675px;'
          g => :transform='matrix(1 0 0 1 -6.005883789062409 78.564453125)'
            path => :d='M 6.00586 -35.2539 C 6.00586 -33.5449 6.64062 -32.0801 8.00781 -30.8105 L 45.9961 6.39648 C 47.0703 7.4707 48.4375 8.05664 50.0488 8.05664 C 53.2715 8.05664 55.8594 5.51758 55.8594 2.24609 C 55.8594 0.634766 55.1758 -0.78125 54.1016 -1.9043 L 19.873 -35.2539 L 54.1016 -68.6035 C 55.1758 -69.7266 55.8594 -71.1914 55.8594 -72.7539 C 55.8594 -76.0254 53.2715 -78.5645 50.0488 -78.5645 C 48.4375 -78.5645 47.0703 -77.9785 45.9961 -76.9043 L 8.00781 -39.7461 C 6.64062 -38.4277 6.00586 -36.9629 6.00586 -35.2539 Z'
        span => *text='返回'
      segmented-auto => :items=['大','中','小']   *model=size

    #pictures => :size=size
      album-pictures => *for=(picture, i) in pictures   :key=i   :picture=picture   @click=_=>show(i)
  `
})

Load.VueComponent('album-pictures', {
  props: {
    picture: { type: Object, default: null, required: true }
  },
  data: _ => ({
    src: '',
  }),
  mounted () {
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].target == this.$el && entries[0].isIntersecting === true) {
        this.observer.disconnect()
        setTimeout(this._init, 1)
      }
    })
    this.observer.observe(this.$el)
  },
  methods: {
    _init () {
      if (this.src !== '') {
        return
      }

      this.src = this.picture.thumb
    }
  },
  template: `
    label.picture => *if=picture   @click=$emit('click')
      figure => *if=src
        img => :src=src
    `
})
