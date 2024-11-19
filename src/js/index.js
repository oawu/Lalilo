/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('unit', {
  props: {
    unit: { type: Object, required: true },
    isBtn: { type: Boolean, required: true, default: false },
  },
  computed: {
    is () {
      return this.isBtn ? 'button' : 'div'
    }
  },
  template: `
    .unit => :n=unit.unit   :is=is   :d=unit.d
      .border
      .top => :h=unit.h
      .btm
        .l => *text=unit.l
        .r => *text=unit.r
        .c => *text=unit.c
  `
})

Load.Vue({
  data: {
    rows: [
      {
        type: 'r4',
        units: [
          { unit: 1, l: '`', r: '~', c: '' },
          { unit: 1, l: '1', r: 'ㄅ', c: '!'},
          { unit: 1, l: '2', r: 'ㄉ', c: '@'},
          { unit: 1, l: '3', r: 'ˇ', c: '#'},
          { unit: 1, l: '4', r: 'ˋ', c: '$'},
          { unit: 1, l: '5', r: 'ㄓ', c: '%'},
          { unit: 1, l: '6', r: 'ˊ', c: '^'},
          { unit: 1, l: '7', r: '˙', c: '&'},
          { unit: 1, l: '8', r: 'ㄚ', c: '*'},
          { unit: 1, l: '9', r: 'ㄞ', c: '('},
          { unit: 1, l: '0', r: 'ㄢ', c: ')'},
          { unit: 1, l: '-', r: 'ㄦ', c: '_'},
          { unit: 1, l: '=', r: '+', c: ''},
          { unit: 2, l: '' , r: '', c: '← Backspace'},
          { unit: 1, l: '', r: '', c: 'Esc' },
          { unit: 1, l: '', r: '', c: '' },
        ],
      },
      {
        type: 'r3',
        units: [
          { unit: 1.5, l: '', r: '', c: 'Tab ↹' },
          { unit: 1, l: 'Q', r: 'ㄆ', c: '' },
          { unit: 1, l: 'W', r: 'ㄊ', c: '' },
          { unit: 1, l: 'E', r: 'ㄍ', c: '' },
          { unit: 1, l: 'R', r: 'ㄐ', c: '' },
          { unit: 1, l: 'T', r: 'ㄔ', c: '' },
          { unit: 1, l: 'Y', r: 'ㄗ', c: '' },
          { unit: 1, l: 'U', r: 'ㄧ', c: '' },
          { unit: 1, l: 'I', r: 'ㄛ', c: '' },
          { unit: 1, l: 'O', r: 'ㄟ', c: '' },
          { unit: 1, l: 'P', r: 'ㄣ', c: '' },
          { unit: 1, l: '[', r: '{', c: '' },
          { unit: 1, l: ']', r: '}', c: '' },
          { unit: 1.5, l: '\\', r: '|', c: '' },
          { unit: 1, l: '', r: '', c: 'Pg Up' },
          { unit: 1, l: '', r: '', c: '' },
        ],
      },
      {
        type: 'r2',
        units: [
          { unit: 1.75, l: '', r: '', c: '⇪ Caps Lock' },
          { unit: 1, l: 'A', r: 'ㄇ', c: '' },
          { unit: 1, l: 'S', r: 'ㄋ', c: '' },
          { unit: 1, l: 'D', r: 'ㄎ', c: '' },
          { unit: 1, l: 'F', r: 'ㄑ', c: '', h: true },
          { unit: 1, l: 'G', r: 'ㄕ', c: '' },
          { unit: 1, l: 'H', r: 'ㄘ', c: '' },
          { unit: 1, l: 'J', r: 'ㄨ', c: '', h: true },
          { unit: 1, l: 'K', r: 'ㄜ', c: '' },
          { unit: 1, l: 'L', r: 'ㄠ', c: '' },
          { unit: 1, l: ';', r: 'ㄤ', c: ':' },
          { unit: 1, l: '\'', r: '"', c: '' },
          { unit: 2.25, l: '', r: '', c: 'Enter ↵' },
          { unit: 1, l: '', r: '', c: 'Pg Dn' },
          { unit: 1, l: '', r: '', c: '' },
        ],
      },
      {
        type: 'r1',
        units: [
          { unit: 2.25, l: '', r: '', c: '⇧ Shift' },
          { unit: 1, l: 'Z', r: 'ㄈ', c: '' },
          { unit: 1, l: 'X', r: 'ㄌ', c: '' },
          { unit: 1, l: 'C', r: 'ㄏ', c: '' },
          { unit: 1, l: 'V', r: 'ㄒ', c: '' },
          { unit: 1, l: 'B', r: 'ㄖ', c: '' },
          { unit: 1, l: 'N', r: 'ㄙ', c: '' },
          { unit: 1, l: 'M', r: 'ㄩ', c: '' },
          { unit: 1, l: ',', r: 'ㄝ', c: '<' },
          { unit: 1, l: '.', r: 'ㄡ', c: '>' },
          { unit: 1, l: '/', r: 'ㄥ', c: '?' },
          { unit: 1.75, l: '', r: '', c: 'Shift ⇧' },
          { unit: 1, l: '', r: '', c: '↑' },
          { unit: 1, l: '', r: '', c: 'Esc' },
          { unit: 1, l: '', r: '', c: '' },
        ],
      },
      {
        type: 'r1',
        units: [
          { unit: 1.25, l: '', r: '', c: '⌃ Ctrl' },
          { unit: 1.25, l: '', r: '', c: 'Opt ⌥' },
          { unit: 1.25, l: '', r: '', c: 'Cmd ⌘' },
          { unit: 6.25, l: '', r: '', c: '' },
          { unit: 1, l: '', r: '', c: '⌘' },
          { unit: 1, l: '', r: '', c: 'fn1' },
          { unit: 1, l: '', r: '', c: 'fn2' },
          { unit: 1, l: '', r: '', c: '←' },
          { unit: 1, l: '', r: '', c: '↓' },
          { unit: 1, l: '', r: '', c: '→' },
          { unit: 1, l: '', r: '', c: '' },
        ],
      },
    ],
    infos: [],
    cnt: 0
  },
  mounted () {

    const units = this.rows.map(({ units }) => units).reduce((a, b) => a.concat(b), []).filter(({ d }) => !d)
    this.cnt = units.length
    const tmp = {}
    for (const unit of units) {
      if (tmp[unit.unit] === undefined) {
        const info = {
          unit: unit.unit,
          units: [],
          get title () {
            return `${this.unit}u`
          },
          get count () {
            return this.units.length
          },
        }
        tmp[unit.unit] = info
      }
      tmp[unit.unit].units.push(unit)
    }
    const keys = Object.keys(tmp).map(a => a * 1).sort((a, b) => a - b).map(a => `${a}`)
    this.infos = keys.map(key => tmp[key]).map(info => {
      info.units.sort((a, b) => {
        let c1 = 0
        if (a.l !== '') { c1++ }
        if (a.r !== '') { c1++ }
        if (a.c !== '') { c1++ }
        
        let c2 = 0
        if (b.l !== '') { c2++ }
        if (b.r !== '') { c2++ }
        if (b.c !== '') { c2++ }

        return c2 - c1
      })
      return info
    })
  },
  computed: {
  },
  methods: {
    date (format) {
    }
  },
  template: `
  main#app
    #title
      span => *text='全部共有 ' + cnt + ' 顆'
    #info1
      #tab
        span => *text='1.5u'
      #cap
        span => *text='1.75u'
      #l-shift
        span => *text='2.25u'
      #cmd
        i
        i
        span => *text='1.25u'
      #back
        span => *text='2u'
      #other
        span => *text='1.5u'
      #enter
        span => *text='2.25u'
      #r-shift
        span => *text='1.75u'
      #rs
        .row => *for=(row, i) in rows
          .info => *text=row.type
      #space
        span => *text='6.25u'
      #keyboard
        .row => *for=(row, i) in rows   :key=i   :class=row.type
          unit => *for=(unit, j) in row.units   :key=j   :unit=unit   :isBtn=true
    #info2 => *if=0
      .info => *for=(info, i) in infos   :key=i
        .title
          b => *text=info.title
          span => *text='共計 ' + info.count + ' 顆'

        .units
          unit => *for=(unit, j) in info.units   :key=j   :unit=unit
  `
})
