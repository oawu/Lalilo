
Load.VueComponent('layout', {
  props: {
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  computed: {
  },
  template: `
  main#app
    aside#main-lebel1
      label
        figure._icon-apis
        span => *text='API'

      label._active
        figure._icon-stories
        span => *text='故事'

      label
        figure._icon-envs
        span => *text='環境'
    
    aside#main-lebel2 => *if=0

    div#main => :style={'--left-padding': null, '--right-padding': null}
      div#main-container
        slot => name=main

    header#main-header => :style={'--left-padding': null, '--right-padding': null}
      nav#main-nav
      slot => *else   name=header
  `
})
