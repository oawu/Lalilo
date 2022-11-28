/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const TableView = {
  TableView: {
    template: `<div class="__oaui-tbv"><slot></slot></div>`
  },
  Section: {
    props: {
      header: { type: String, default: '' },
      footer: { type: String, default: '' },
      isGroup: { type: Boolean, default: true },
    },
    template: `<div :class="{ _section: true, __group: isGroup }"><div v-if="$slots.header" class="_header"><slot name="header"></slot></div><span v-else-if="header !== ''" class="_header">{{ header }}</span><div class="_body"><slot></slot></div><div v-if="$slots.footer" class="_footer"><slot name="footer"></slot></div><span v-else-if="footer !== ''" class="_footer">{{ footer }}</span></div>`
  },
  Cell: {
    props: {
      title: { type: String, default: null },
      titleColor: { type: String, default: 'black' },
      titleAlign: { type: String, default: 'left' },
      titleWrap: { type: Boolean, default: false },

      subtitle: { type: String, default: null },
      subtitleColor: { type: String, default: 'gray' },
      subtitleAlign: { type: String, default: 'left' },
      subtitleWrap: { type: Boolean, default: false },

      value: { type: String, default: null },
      valueColor: { type: String, default: 'gray' },
      valueAlign: { type: String, default: 'right' },
      valueWrap: { type: Boolean, default: false },

      selectAble: { type: Boolean, default: null },
      clickAble: { type: Boolean, default: null },
      
      arrowUI: { type: Boolean, default: null },
      radioUI: { type: Boolean, default: null },

      switchUI: { type: Boolean, default: undefined },

      imageUI: { type: String, default: '' },
      imageUIWidth: { type: Number, default: null },
      imageUIHeight: { type: Number, default: null },
      imageUIRadius: { type: Number, default: null },
    },
    data: _ => ({ types: ['_cell'] }),
    computed: {
      layout () {
        let hasTitle = this.$slots.title !== undefined || typeof this.title == 'string'
        let hasSubtitle = this.$slots.subtitle !== undefined || typeof this.subtitle == 'string'
        let hasValue = this.$slots.value !== undefined || typeof this.value == 'string'
        if (hasTitle && hasSubtitle && hasValue) return 't-s-v'
        if (hasTitle && hasSubtitle && !hasValue) return 't-s'
        if (hasTitle && !hasSubtitle && hasValue) return 't-v'
        if (hasTitle && !hasSubtitle && !hasValue) return 't'
        if (!hasTitle && hasSubtitle && hasValue) return 't-s-v'
        if (!hasTitle && hasSubtitle && !hasValue) return 't-s'
        if (!hasTitle && !hasSubtitle && hasValue) return 't-v'
        if (!hasTitle && !hasSubtitle && !hasValue) return ''
        return ''
      },
      isClickAble () {
        return this.clickAble === true || (this.arrowUI === true && this.clickAble === null) || (typeof this.radioUI == 'boolean' && this.clickAble === null) || ((this.switchUI === true || this.switchUI === false) && this.clickAble === null)
      },
      className () {
        let types = [...this.types]
        this.arrowUI === true && types.push('__arrow')
        this.selectAble === true && types.push('__select')
        this.isClickAble && types.push('__click')

        types.push(`__title_color_${['black', 'gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown'].includes(this.titleColor) ? this.titleColor : 'black'}`)
        types.push(`__title_align_${['left', 'center', 'right'].includes(this.titleAlign) ? this.titleAlign : 'left'}`)
        
        types.push(`__subtitle_color_${['black', 'gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown'].includes(this.subtitleColor) ? this.subtitleColor : 'gray'}`)
        types.push(`__subtitle_align_${['left', 'center', 'right'].includes(this.subtitleAlign) ? this.subtitleAlign : 'left'}`)

        types.push(`__value_color_${['black', 'gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown'].includes(this.valueColor) ? this.valueColor : 'gray'}`)
        types.push(`__value_align_${['left', 'center', 'right'].includes(this.valueAlign) ? this.valueAlign : 'right'}`)

        types.push(`__title_wrap_${this.titleWrap ? 'y' : 'n'}`)
        types.push(`__subtitle_wrap_${this.subtitleWrap ? 'y' : 'n'}`)
        types.push(`__value_wrap_${this.valueWrap ? 'y' : 'n'}`)

        if (typeof this.radioUI == 'boolean')
          types.push(`__radio_${this.radioUI ? 'on' : 'off'}`)

        if (this.switchUI !== undefined)
          types.push(`__switch${this.switchUI !== null ? '' : '_loading'}`)

        typeof this.imageUI == 'string' && this.imageUI !== '' && types.push('__image')
        return types
      },
      style () {
        let style = {}
        let w = parseFloat(this.imageUIWidth)
        style['--tbv-cell-image-width'] = isNaN(w) ? this.imageUIWidth : `${w}px`

        let h = parseFloat(this.imageUIHeight)
        style['--tbv-cell-image-height'] = isNaN(h) ? this.imageUIHeight : `${h}px`

        let r = parseFloat(this.imageUIRadius)
        style['--tbv-cell-image-radius'] = isNaN(r) ? this.imageUIRadius : `${r}px`

        return style
      },
      ctxEl () {
        return this.isClickAble ? 'label' : 'div'
      }
    },
    methods: {
      click () {
        if (!this.isClickAble)
          return this

        let sw = this.switchUI === true || this.switchUI === false
        let ro = this.radioUI === true || this.radioUI === false

        if (this.arrowUI === true) return this.$emit('click', this), this
        if (sw && !ro) return this.$emit('switchUI', this.switchUI), this
        if (!sw && ro) return this.$emit('radioUI', this.radioUI), this
        return this
      },
      imageUrl(url) {
        return `url('${url}')`
      }
    },
    template: `<component :class="className" :is="ctxEl" :style="style" @click="click"><i class='_separator'></i><label v-if="typeof radioUI == 'boolean'" class='_radio' :class="radioUI ? '__on' : '__off'" @click.stop="_ => $emit('radioUI', radioUI)"></label><figure v-if="typeof imageUI == 'string' && imageUI !== ''" class="_image" :style="{backgroundImage:imageUrl(imageUI)}"></figure><template v-if="layout"><div v-if="layout == 't-s-v'" class="_ctx __t-s-v"><div class="_key"><div class="_title" v-if="$slots.title"><slot name="title"></slot></div><div class="_title" v-else>{{ title }}</div><div class="_subtitle" v-if="$slots.subtitle"><slot name="subtitle"></slot></div><div class="_subtitle" v-else>{{ subtitle }}</div></div><div class="_val _value" v-if="$slots.value"><slot name="value"></slot></div><div class="_val _value" v-else>{{ value }}</div></div><div v-if="layout == 't-v'" class="_ctx __t-v"><div class="_key _title" v-if="$slots.title"><slot name="title"></slot></div><div class="_key _title" v-else>{{ title }}</div><div class="_val _value" v-if="$slots.value"><slot name="value"></slot></div><div class="_val _value" v-else>{{ value }}</div></div><div v-if="layout == 't-s'" class="_ctx __t-s"><div class="_title" v-if="$slots.title"><slot name="title"></slot></div><div class="_title" v-else>{{ title }}</div><div class="_subtitle" v-if="$slots.subtitle"><slot name="subtitle"></slot></div><div class="_subtitle" v-else>{{ subtitle }}</div></div><template v-if="layout == 't'"><div class="_ctx __t _title" v-if="$slots.title"><slot name="title"></slot></div><div class="_ctx __t _title" v-else>{{ title }}</div></template></template><div v-else class="_ctx"><slot></slot></div><i v-if="arrowUI === true" class="_arrow"></i><template v-if="switchUI !== undefined"><label v-if="switchUI !== null" :class="['_switch', switchUI ? '__on' : '__off']" @click.stop="_ => $emit('switchUI', switchUI)"></label><div v-else class="_switch_loading"><i v-for="i in [0,1,2,3,4,5,6,7,8,9,10,11]" :key="i" :class="'__i' + i"></i></div></template></component>`
  }
}
