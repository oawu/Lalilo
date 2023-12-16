/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    choMe: false,
    agree: false,
    pick: false,

    users: null,
    me: null,
    to: null,
  },
  mounted () {
    API.GET('/api/users')
      .done(users => this.users = users)
      .send()
  },
  computed: {
  },
  methods: {
    post() {
      this.pick = true
      setTimeout(_ => API.POST('/api/user')
      .raw ({ me: this.me.id })
      .done(user => this.to = user)
      .fail(errors => Alert('錯誤！', errors.join('')).button('了解', alert => alert.dismiss(_ => Reload())).present())
      .send(), 1000)
    }
  },
  template: `
    main#app
      template => *if=users !== null

        h1 => *text='🎄 2023 聖誕節線上交換禮物 🎄'

        div#me => *if=!choMe || me === null
          p => *text='嘿，聖誕禮物交換開始囉！準備好了嗎？'
          p => *text='讓我們掀起禮物浪潮，把愛和笑容一起擠進禮物盒裡，來場最瘋狂的聖誕交換！'
          label
            select => *model=me
              option => :value=null   *text='請選擇你是誰！？'   :disabled=true
              option => *for=(user, i) in users   :value=user   :key=user.id   *text=user.name

          button => *text='下一步'   :disabled=me === null   @click=choMe=true

        template => *else
          div#ready => *if=pick==false
            h2 => *text='遊戲規則'
            ol
              li => *text='先說出各自希望的禮物，價格在不包含運費 $500 上下。'
              li => *text='請各自先說可以收貨的地點。'
              li => *text='挑禮物必需要在禮拜日的晚上挑完將訂單送出！'
              li => *text='貨到後不可以自己開箱，必須要等所有參加的人員都有拿到貨，然後線上視訊一起開箱！'

            label => *text='我願意遵守以上規定'   :class=agree?'active':''   @click=agree=!agree

            button => *text='下一步'   :disabled=!agree   @click=post

          template => *else
            div#pick
              div#loading => *if=to===null
                span
                label => *text='讀取中…'
              
              div#result => *else
                h3 => *text='結果出爐！'
                div.c1
                  span => *text=me.name
                  span => *text='，您要將禮物要送給… 「'
                  b => *text=to.name
                  span => *text='」！'
                b => *text='您可以截圖下來，以免忘記！'
                div.c2
                  p => *text='※ 為了遊戲趣味性，要送給誰禮物千萬不能跟別人說喔！'
                  p
                    span => *text='※ 他的禮物條件是「'
                    b => *text=to.tip
                    span => *text='」。'
                  p
                    span => *text='※ 然後他希望寄送到「'
                    b => *text=to.address
                    span => *text='」，如果該地點無法配送請自己改選附近店家或超商取貨。'
                  p
                    span => *text='※ 記得要「'
                    b => *text='先付款'
                    span => *text='」喔，千萬別選取貨付款捏…'
                  p
                    span => *text='※ 禮物價格請斟酌在「'
                    b => *text='$500'
                    span => *text='」上下（不包含運費）。'

      `
})
