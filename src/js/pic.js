/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    oriPics: [

    ],
    choPics: [],
  },
  mounted () {
    

    // this.pics = this.oriPics
    // .map(({ main, files }) => ({ main, files: files.map(({ file }) => ({ file, clicked: })) }))
    
  },
  methods: {
    toFile(file) {
      return `"file://${file.file}"`
    },
    copy() {
      Helper.copyStr(this.cmd, _ => {
        Toastr.success("複製成功")
      }, _ => {
        Toastr.failure("複製師敗")
      })
    }
  },
  computed: {
    cmd () {
      return this.choPics.map(({ file }) => `rm "${file}"`).join(" && ")
    }
  },
  template: `
    main#app
      .rows
        .total => *text='全部共有 ' + oriPics.length + ' 個'
        .row => *for=({main, files}, i) in oriPics   :key=i
          .main
            .pic => :style={backgroundImage: 'url(' + toFile(main) + ')'}
            
          label.files
            label.pic => *for=(file, j) in files   :key=j   :style={backgroundImage: 'url(' + toFile(file) + ')'}   @click.stop=choPics.includes(file) ? choPics.splice(choPics.indexOf(file), 1) : choPics.push(file)   :class={_c: choPics.includes(file)}
      #log
        .json => *text=cmd
        label => *text='複製'   @click=copy


  `
})
