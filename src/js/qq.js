/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    model: {
      sym: null,
      pay: 0,
    },
    item: 45800,
    items: [
      {val: 27470, text: '27,470'},
      {val: 27600, text: '27,600'},
      {val: 28800, text: '28,800'},
      {val: 30300, text: '30,300'},
      {val: 31800, text: '31,800'},
      {val: 33300, text: '33,300'},
      {val: 34800, text: '34,800'},
      {val: 36300, text: '36,300'},
      {val: 38200, text: '38,200'},
      {val: 40100, text: '40,100'},
      {val: 42000, text: '42,000'},
      {val: 43900, text: '43,900'},
      {val: 45800, text: '45,800'},
    ]
  },
  mounted () {
  },
  computed: {
    unit () {
      // console.error(this.model.sym);
      // console.error(this.model.pay);

      if (this.model.sym === null) {
        return ''
      }

      const s = Date.parse(this.model.sym)
      if (isNaN(s)) {
        return ''
      }

      const n = Date.now()
      if (s > n) {
        return ''
      }

      return parseFloat(((n - s) / 31556926000).toFixed(2))
    },
    cases () {
      const pay = this.model.pay
      const unit = this.unit
      const item = this.item

      if (!(typeof pay == 'number' && !isNaN(pay) && pay !== Infinity && pay > 0)) {
        return []
      }
      if (!(typeof unit == 'number' && !isNaN(unit) && unit !== Infinity && pay > 0)) {
        return []
      }
      if (!(typeof item == 'number' && !isNaN(item) && item !== Infinity)) {
        return []
      }

      const all1 = Math.round(this.model.pay * (this.unit / 2))
      const all2 = Math.round(item * 0.6)
      

      const a = all1 + all2 * 3
      const b = Math.round(pay / 2) * 3


      return [
        {
          title: '選擇非自願離職，三個月後：',
          items: [
            `您的月薪是 ${Helper.numFormat(pay)} 元，年資是 ${unit} 年，按照公式「月薪 x (年資 / 2)」計算，資遣費用為 ${Helper.numFormat(pay)} x (${unit} / 2) = <b>${Helper.numFormat(all1)}</b> 元。`,
            `您的勞保薪資是 ${Helper.numFormat(item)} 元，按照公式「勞保薪資 x 0.6」計算，每月可領 <b>${Helper.numFormat(all2)}</b> 元。`,
            `三個月後，${Helper.numFormat(all1)} + ${Helper.numFormat(all2)} x 3，預計您會領到 <b>${Helper.numFormat(all1 + all2 * 3)}</b> 元。`,
          ],
        },
        {
          title: '選擇半薪，三個月後：',
          items: [
            `您的月薪是 ${Helper.numFormat(pay)} 元，半薪為 <b>${Helper.numFormat(Math.round(pay / 2))}</b> 元。`,
            `三個月後，${Helper.numFormat(Math.round(pay / 2))} x 3，預計您會領到 <b>${Helper.numFormat(Math.round(pay / 2) * 3)}</b> 元。`,
          ]
        },
        {
          title: '由系統結算結果建議是：',
          items: [
            a > b ? `您可以選擇非自願離職，因為這樣差了 <b>${Helper.numFormat(a - b)}</b> 元。` : `您可以選擇減半薪三個月，因為這樣差了 <b>${Helper.numFormat(b - a)}</b> 元。`,
          ]
        }
      ]
    },
  },
  methods: {
  },
  template: `
    main#app
      #container
        label#sym
          b => *text='請輸入您幾年幾月入職'   :after=unit
          input => type=date   *model=model.sym
        label#pay
          b => *text='請輸入您的月薪'
          input => type=number   *model.number=model.pay
        div#items
          b => *text='請選擇您的勞保投保金額'
          label => *for=(_item, i) in items   :key=i   *text=_item.text   :class={checked: _item.val === item}   @click=item = _item.val

        #result => *if=cases.length
          .case => *for=(_case, i) in cases   :key='aa' + i
            span => *text=_case.title
            div => *for=(item, j) in _case.items   :key='bb' + j   *html=item

      `
})
