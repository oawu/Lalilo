/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Type: T, Str } = window.Helper

  window.Load.VueComponent('Timepick', {
    props: {
      value: { type: Object, required: false, default: null },
    },
    data: _ => ({
      time: null,
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      mins: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
      secs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
    }),
    mounted() {
      const V = T.obj(this.value)
      const H = V && T.num(this.value.hour) && this.value.hour >= 0 && this.value.hour <= 23
      const M = V && T.num(this.value.min) && this.value.min >= 1 && this.value.min <= 59
      const S = V && T.num(this.value.sec) && this.value.sec >= 1 && this.value.sec <= 59

      if (!(V && H && M && S)) {
        this.value = null
      }

      this.time = {
        hour: H ? this.value.hour : new Date().getHours(),
        min: M ? this.value.min : new Date().getMinutes(),
        sec: S ? this.value.sec : new Date().getSeconds()
      }
    },
    methods: {
      pad(v) {
        return Str.pad(v)
      },
      change() {
        this.$emit('input', this.time)
      },
      click(type, val) {
        if (type == 'h') {
          this.time.hour = this.time.hour + val < 24 ? this.time.hour + val > -1 ? this.time.hour + val : 23 : 0
          this.change()
        }
        if (type == 'm') {
          this.time.min = this.time.min + val < 60 ? this.time.min + val > -1 ? this.time.min + val : 59 : 0
          this.change()
        }
        if (type == 's') {
          this.time.sec = this.time.sec + val < 60 ? this.time.sec + val > -1 ? this.time.sec + val : 59 : 0
          this.change()
        }
      },
      submit() {
        this.change()
        return this.$emit('submit', this.time)
      }
    },
    template: `
      .Timepick => *if=time
        .top
          label => @click=click('h', -1)
          label => @click=click('m', -1)
          label => @click=click('s', -1)
        .middle
          select => *model=time.hour   @change=change
            option => *for=hour in hours   :key=hour   :value=hour   *text=pad(hour)
          i
          select => *model=time.min   @change=change
            option => *for=min in mins   :key=min   :value=min   *text=pad(min)
          i
          select => *model=time.sec   @change=change
            option => *for=sec in secs   :key=sec   :value=sec   *text=pad(sec)

        .bottom
          label => @click=click('h', 1)
          label => @click=click('m', 1)
          label => @click=click('s', 1)

        label.button => *if=!value   *text='確定'   @click=submit
    `
  })
})();