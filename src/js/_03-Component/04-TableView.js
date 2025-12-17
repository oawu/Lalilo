/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Helper, Load } = window
  const T = Helper.Type

  Load.VueComponent('TableView', {
    methods: {
      ___isSubmit() {
        return T.func(this.$listeners.submit)
      },
      submit(...e) {
        this.$emit('submit', ...e)
      }
    },
    template: `
      component.TableView => :is=___isSubmit() ? 'form' : 'div'   @submit.prevent=submit
        slot
    `
  })

  Load.VueComponent('TableSection', {
    props: {
      header: { type: String, default: null },
      footer: { default: null },

      type: { type: String, default: null },
      title: { type: String, default: '' },
      required: { type: Boolean, default: false },

      paddingLeft: { type: Number, default: 16 },
      paddingRight: { type: Number, default: 16 },
    },
    mounted() {
    },
    computed: {
    },
    methods: {

      ___style() {
        const style = {
          '--section-padding-left': '16px',
          '--section-padding-right': '16px',
        }

        style['--section-padding-left'] = T.num(this.paddingLeft) && this.paddingLeft >= 0 ? `${this.paddingLeft}px` : '16px'
        style['--section-padding-right'] = T.num(this.paddingRight) && this.paddingRight >= 0 ? `${this.paddingRight}px` : '16px'

        return style
      },

      ___isHeaderSlot() { return T.arr(this.$slots.header) },
      ___isFooterSlot() { return T.arr(this.$slots.footer) },

      ___isHeaderText() { return !this.___isHeaderSlot() && ((T.arr(this.header) && this.header.length > 0) || T.str(this.header) || T.num(this.header)) },
      ___isFooterText() { return !this.___isFooterSlot() && ((T.arr(this.footer) && this.footer.length > 0) || T.str(this.footer) || T.num(this.footer)) },

      ___body() { return T.neStr(this.type) && ['cell', 'input', 'text'].includes(this.type) ? this.type : 'cell' },

      ___isCell() { return this.___body() == 'cell' },
      ___isInput() { return this.___body() == 'input' },
      ___isText() { return this.___body() == 'text' },

      ___isTitleSlot() {
        return (this.___isText() || this.___isInput()) && T.arr(this.$slots.title)
      },
      ___isTitleText() {
        return !this.___isTitleSlot() && (this.___isText() || this.___isInput()) && (T.neStr(this.title) || T.num(this.title))
      },
      ___isRequired() {
        return !this.___isTitleSlot() && (this.___isText() || this.___isInput()) && T.bool(this.required) ? this.required : false
      },
    },
    template: `
      .TableSection => :style=___style()

        .header => *if=___isHeaderSlot()
          slot => name=header

        template => *if=___isHeaderText()
          span.header => *if=!Array.isArray(header)   *text=header
          template => *else
            span.header => *for=(h, i) in header   :key='header_' + i   *text=h

        .body => *if=___isCell()
          slot

        label.body => *if=___isInput() || ___isText()   :class={ _title: ___isTitleSlot() || ___isTitleText(), _text: ___isText() }
          .title => *if=___isTitleSlot()
            slot => name=title
          span.title => *if=___isTitleText()   :class={_required: ___isRequired()}   *text=title

          slot

        .footer => *if=___isFooterSlot()
          slot => name=footer

        template => *if=___isFooterText()
          span.footer => *if=!Array.isArray(footer)   *text=footer
          template => *else
            span.footer => *for=(f, i) in footer   :key='footer_' + i   *text=f

    `
  })

  Load.VueComponent('TableCell', {
    props: {
      createUI: { type: Boolean, default: null },
      deleteUI: { type: Boolean, default: null },
      radioUI: { type: Boolean, default: null },
      switchUI: { type: Boolean, default: undefined },
      arrowUI: { type: Boolean, default: null },

      image: { type: String, default: null },
      imageWidth: { type: Number, default: 36 },
      imageHeight: { type: Number, default: 36 },
      imageRadius: { type: Number, default: 4 },

      title: { default: null },
      titleColor: { type: String, default: 'black' },
      titleAlign: { type: String, default: 'left' },
      titleWrap: { type: Boolean, default: true },
      titleSelect: { type: Boolean, default: false },
      titleBold: { type: Boolean, default: false },
      titleClass: { type: String, default: null },

      subtitle: { default: null },
      subtitleColor: { type: String, default: 'gray' },
      subtitleAlign: { type: String, default: 'left' },
      subtitleWrap: { type: Boolean, default: true },
      subtitleSelect: { type: Boolean, default: false },
      subtitleBold: { type: Boolean, default: false },
      subtitleClass: { type: String, default: null },

      value: { default: null },
      valueColor: { type: String, default: 'gray' },
      valueAlign: { type: String, default: 'right' },
      valueWrap: { type: Boolean, default: true },
      valueSelect: { type: Boolean, default: false },
      valueBold: { type: Boolean, default: false },
      valueClass: { type: String, default: null },
      valueLabelColor: { type: String, default: null },

      el: { type: Object, default: null }
    },
    data: _ => ({
      colors: ['black', 'gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'white'],
      aligns: ['left', 'center', 'right'],
    }),
    computed: {
    },
    methods: {
      click() {
        if (!this.___isClickAble()) {
          return
        }

        if (!this.___isMultiClick() && this.___isCreateUI()) {
          this.$emit('createUI')
          this.$emit('click')
          return
        }
        if (!this.___isMultiClick() && this.___isDeleteUI()) {
          this.$emit('deleteUI')
          this.$emit('click')
          return
        }
        if (!this.___isMultiClick() && this.___isSwitchUI()) {
          this.$emit('switchUI', this.switchUI)
          this.$emit('click', this.switchUI)
          return
        }
        if (!this.___isMultiClick() && this.___isRadioUI()) {
          this.$emit('radioUI', this.radioUI)
          this.$emit('click', this.radioUI)
          return
        }

        return this.$emit('click')
      },
      clickCreate() { return this.$emit('createUI') },
      clickDelete() { return this.$emit('deleteUI') },
      clickRadio() { return this.$emit('radioUI', this.radioUI) },
      clickSwitch() { return this.$emit('switchUI', this.switchUI) },

      ___isCreateUI() { return T.bool(this.createUI) && this.createUI == true },
      ___isDeleteUI() { return T.bool(this.deleteUI) && this.deleteUI == true },
      ___isRadioUI() { return T.bool(this.radioUI) },
      ___isSwitchUI() { return T.bool(this.switchUI) || this.switchUI === null },
      ___isArrowUI() { return T.bool(this.arrowUI) && this.arrowUI == true },

      ___isCtxSlot() { return T.arr(this.$slots.default) },

      ___isCtxText() {
        if (this.___isCtxSlot()) {
          return false
        }

        const hasTitle = this.___isTitleSlot() || this.___isTitleText()
        const hasSubtitle = this.___isSubtitleSlot() || this.___isSubtitleText()
        const hasValue = this.___isValueSlot() || this.___isValueText()

        return hasTitle || hasSubtitle || hasValue
      },
      ___isImageSlot() { return T.arr(this.$slots.image) },
      ___isImageText() { return !this.___isImageSlot() && T.neStr(this.image) },

      ___styleImage() {
        return this.___isImageText() ? {
          backgroundImage: `url('${this.image}')`,

        } : {}
      },
      ___isTitleSlot() { return T.arr(this.$slots.title) },
      ___isTitleText() { return !this.___isTitleSlot() && ((T.arr(this.title) && this.title.length > 0) || T.neStr(this.title) || T.num(this.title)) },

      ___isSubtitleSlot() { return T.arr(this.$slots.subtitle) },
      ___isSubtitleText() { return !this.___isSubtitleSlot() && ((T.arr(this.subtitle) && this.subtitle.length > 0) || T.neStr(this.subtitle) || T.num(this.subtitle)) },


      ___isValueSlot() { return T.arr(this.$slots.value) },
      ___isValueText() { return !this.___isValueSlot() && ((T.arr(this.value) && this.value.length > 0) || T.neStr(this.value) || T.num(this.value)) },

      ___clsCtx() {
        if (!this.___isCtxText()) {
          return ''
        }

        const hasSubtitle = this.___isSubtitleSlot() || this.___isSubtitleText()
        const hasValue = this.___isValueSlot() || this.___isValueText()

        if (hasSubtitle && hasValue) {
          return 'tsv'
        }
        if (hasSubtitle) {
          return 'ts'
        }
        if (hasValue) {
          return 'tv'
        }
        return 't'
      },
      ___isMultiClick() {
        let cnt = 0
        if (this.___isArrowUI() && T.func(this.$listeners.click)) { cnt += 1 }
        if (this.___isDeleteUI()) { cnt += 1 }
        if (this.___isRadioUI()) { cnt += 1 }
        if (this.___isSwitchUI()) { cnt += 1 }
        return cnt > 1
      },
      ___isClickAble() {
        return T.func(this.$listeners.click)
          || (this.___isCreateUI() && T.func(this.$listeners.createUI))
          || (this.___isDeleteUI() && T.func(this.$listeners.deleteUI))
          || (this.___isSwitchUI() && T.func(this.$listeners.switchUI))
          || (this.___isRadioUI() && T.func(this.$listeners.radioUI))
      },
      ___clsTitle() {
        const cls = []

        if (!(this.___isCtxText() && this.___isTitleText())) {
          return cls
        }

        cls.push(T.neStr(this.titleColor) && this.colors.includes(this.titleColor) ? `_c-${this.titleColor}` : '_c-black')
        cls.push(T.neStr(this.titleAlign) && this.aligns.includes(this.titleAlign) ? `_a-${this.titleAlign}` : '_a-left')
        cls.push(T.bool(this.titleWrap) && this.titleWrap ? '_w-yes' : '_w-no')
        cls.push(T.bool(this.titleSelect) && this.titleSelect ? '_s-yes' : '_s-no')
        cls.push(T.bool(this.titleBold) && this.titleBold ? '_b-yes' : '_b-no')
        if (T.str(this.titleClass) || T.arr(this.titleClass) || T.obj(this.titleClass)) {
          cls.push(this.titleClass)
        }

        return cls
      },
      ___clsSubtitle() {
        const cls = []

        if (!(this.___isCtxText() && this.___isSubtitleText())) {
          return cls
        }

        cls.push(T.neStr(this.subtitleColor) && this.colors.includes(this.subtitleColor) ? `_c-${this.subtitleColor}` : '_c-gray')
        cls.push(T.neStr(this.subtitleAlign) && this.aligns.includes(this.subtitleAlign) ? `_a-${this.subtitleAlign}` : '_a-left')
        cls.push(T.bool(this.subtitleWrap) && this.subtitleWrap ? '_w-yes' : '_w-no')
        cls.push(T.bool(this.subtitleSelect) && this.subtitleSelect ? '_s-yes' : '_s-no')
        cls.push(T.bool(this.subtitleBold) && this.subtitleBold ? '_b-yes' : '_b-no')
        if (T.str(this.subtitleClass) || T.arr(this.subtitleClass) || T.obj(this.subtitleClass)) {
          cls.push(this.subtitleClass)
        }

        return cls
      },
      __clsValue() {
        const cls = []

        if (!(this.___isCtxText() && this.___isValueText())) {
          return cls
        }

        cls.push(T.neStr(this.valueColor) && this.colors.includes(this.valueColor) ? `_c-${this.valueColor}` : '_c-gray')
        cls.push(T.neStr(this.valueAlign) && this.aligns.includes(this.valueAlign) ? `_a-${this.valueAlign}` : 'right')
        cls.push(T.bool(this.valueWrap) && this.valueWrap ? '_w-yes' : '_w-no')
        cls.push(T.bool(this.valueSelect) && this.valueSelect ? '_s-yes' : '_s-no')
        cls.push(T.bool(this.valueBold) && this.valueBold ? '_b-yes' : '_b-no')
        cls.push(T.neStr(this.valueLabelColor) && (this.valueLabelColor == 'click' || this.colors.includes(this.valueLabelColor)) ? `_l-yes _lc-${this.valueLabelColor}` : '_l-no')
        if (T.str(this.valueClass) || T.arr(this.valueClass) || T.obj(this.valueClass)) {
          cls.push(this.valueClass)
        }

        return cls
      },
      ___style() {
        return {
          '--image-width': T.num(this.imageWidth) && this.imageWidth >= 0 ? `${this.imageWidth}px` : '36px',
          '--image-height': T.num(this.imageHeight) && this.imageHeight >= 0 ? `${this.imageHeight}px` : '36px',
          '--image-radius': T.num(this.imageRadius) && this.imageRadius >= 0 ? `${this.imageRadius}px` : '4px',
        }
      },
      __isEl() {
        if (T.obj(this.el) && T.neStr(this.el.is)) {
          return this.el.is
        }
        return this.___isClickAble() ? 'label' : 'div'
      },
      ___elBind() {
        if (T.obj(this.el) && T.obj(this.el.attr)) {
          return this.el.attr
        }
        return {}
      },
    },
    template: `
      component.TableCell => :is=__isEl()   @click=click   :style=___style()   :class={'_no-multi-click': !___isMultiClick()}   *bind=___elBind()

        template => *if=___isCreateUI()
          label.create => *if=___isMultiClick()   @click.stop=clickCreate
          .create => *else

        template => *if=___isDeleteUI()
          label.delete => *if=___isMultiClick()   @click.stop=clickDelete
          .delete => *else

        template => *if=___isRadioUI()
          label.radio => *if=___isMultiClick()   :class=radioUI ? '_on' : '_off'   @click.stop=clickRadio
          .radio => *else   :class=radioUI ? '_on' : '_off'

        .image => *if=___isImageSlot()
          slot => name=image

        figure.image => *if=___isImageText()   :style=___styleImage()

        .ctx => *if=___isCtxSlot()
          slot

        template => *if=___isCtxText()
          div.ctx._tsv => *if=___clsCtx() === 'tsv'
            .key
              .title => *if=___isTitleSlot()
                slot => name=title
              template => *if=___isTitleText()
                span.title => *if=!Array.isArray(title)   *text=title   :class=___clsTitle()
                template => *else
                  span.title => *for=(t, i) in title   :key='title_' + i   *text=t   :class=___clsTitle()

              .subtitle => *if=___isSubtitleSlot()
                slot => name=subtitle
              template => *if=___isSubtitleText()
                span.subtitle => *if=!Array.isArray(subtitle)   *text=subtitle   :class=___clsSubtitle()
                template => *else
                  span.subtitle => *for=(st, i) in subtitle   :key='suttitle_' + i   *text=st   :class=___clsSubtitle()

            .val
              .value => *if=___isValueSlot()
                slot => name=value
              template => *if=___isValueText()
                span.value => *if=!Array.isArray(value)   *text=value   :class=__clsValue()
                template => *else
                  span.value => *for=(v, i) in value   :key='value_' + i   *text=v   :class=__clsValue()

          div.ctx._ts => *if=___clsCtx() === 'ts'
            .title => *if=___isTitleSlot()
              slot => name=title
            template => *if=___isTitleText()
              span.title => *if=!Array.isArray(title)   *text=title   :class=___clsTitle()
              template => *else
                span.title => *for=(t, i) in title   :key='title_' + i   *text=t   :class=___clsTitle()

            .subtitle => *if=___isSubtitleSlot()
              slot => name=subtitle
            template => *if=___isSubtitleText()
              span.subtitle => *if=!Array.isArray(subtitle)   *text=subtitle   :class=___clsSubtitle()
              template => *else
                span.subtitle => *for=(st, i) in subtitle   :key='suttitle_' + i   *text=st   :class=___clsSubtitle()

          div.ctx._tv => *if=___clsCtx() === 'tv'
            .title => *if=___isTitleSlot()
              slot => name=title
            template => *if=___isTitleText()
              span.title => *if=!Array.isArray(title)   *text=title   :class=___clsTitle()
              template => *else
                span.title => *for=(t, i) in title   :key='title_' + i   *text=t   :class=___clsTitle()

            .val
              .value => *if=___isValueSlot()
                slot => name=value
              template => *if=___isValueText()
                span.value => *if=!Array.isArray(value)   *text=value   :class=__clsValue()
                template => *else
                  span.value => *for=(v, i) in value   :key='value_' + i   *text=v   :class=__clsValue()

          div.ctx._tv => *if=___clsCtx() === 't'
            .title => *if=___isTitleSlot()
              slot => name=title
            template => *if=___isTitleText()
              span.title => *if=!Array.isArray(title)   *text=title   :class=___clsTitle()
              template => *else
                span.title => *for=(t, i) in title   :key='title_' + i   *text=t   :class=___clsTitle()

        .switch => *if=___isSwitchUI()
          template => *if=switchUI !== null
            label.ui => *if=___isMultiClick()   :class={_on: switchUI}   @click.stop=clickSwitch
            .ui => *else   :class={_on: switchUI}

          .loading => *if=switchUI === null
            i => *for=i in [0,1,2,3,4,5,6,7,8,9]   :key='loading_' + i   :class='_i' + i

        i.arrow => *if=___isArrowUI()

        .separator
    `
  })
})();
