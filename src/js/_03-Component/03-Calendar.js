/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  // 農曆計算需要 https://cdn.jsdelivr.net/npm/lunar-calendar@0.1.4/lib/LunarCalendar.min.js

  const { LunarCalendar, Helper, Load } = window
  const { Type: T } = Helper

  Load.VueComponent('Calendar', {
    props: {
      value: { type: Object, required: false, default: null },
      onlyInMonth: { type: Boolean, required: false, default: true },
      showLunarCalendar: { type: Boolean, required: false, default: true }
    },
    data: _ => ({
      month: null,
      today: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      },
      weeks: ['日', '一', '二', '三', '四', '五', '六']
    }),
    mounted() {
      const isOk = T.obj(this.value)
        && T.num(this.value.year) && this.value.year > 0
        && T.num(this.value.month) && this.value.month >= 1 && this.value.month <= 12
        && T.num(this.value.day) && this.value.day >= 1 && this.value.day <= 31

      this.month = this._initMonth(isOk ? this.value : this.today)
    },
    methods: {
      _prevMonth: ({ year, month }) => ({
        year: month == 1 ? year - 1 : year,
        month: month != 1 ? month - 1 : 12
      }),
      _nextMonth: ({ year, month }) => ({
        year: month == 12 ? year + 1 : year,
        month: month != 12 ? month + 1 : 1
      }),

      _initMonth({ year, month }) {
        const prev = this._prevMonth({ year, month })
        const next = this._nextMonth({ year, month })

        const __monthDayCount = ({ year, month }) => (--month == 1) ? ((year % 4) === 0) && ((year % 100) !== 0) || ((year % 400) === 0) ? 29 : 28 : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
        const monthCount = __monthDayCount({ year, month })
        const firstDayWeek = new Date(year, month - 1, 1).getDay()
        const weekCount = parseInt((firstDayWeek + monthCount) / 7, 10) + (((firstDayWeek + monthCount) % 7) ? 1 : 0)

        return {
          year,
          month,

          weeks: Array.apply(null, Array(weekCount)).map((_, i) => Array.apply(null, Array(7)).map((_, j) => {
            const day = i * 7 + j - firstDayWeek + 1

            const data = {
              year: day > 0 ? day > monthCount ? next.year : year : prev.year,
              month: day > 0 ? day > monthCount ? next.month : month : prev.month,
              day: (day > 0 ? day > monthCount ? -monthCount : 0 : __monthDayCount(prev)) + day,
            }

            const lunar = LunarCalendar === undefined ? null : LunarCalendar.solarToLunar(data.year, data.month, data.day)
            const inRange = day >= 1 && day <= monthCount

            const that = this
            Object.defineProperty(data, 'cls', {
              get() {
                return {
                  _outOfRange: !inRange,
                  _inRange: inRange,
                  _today: that.today.year == this.year && that.today.month == this.month && that.today.day == this.day,
                  _select: that.value && that.value.year == this.year && that.value.month == this.month && that.value.day == this.day
                }
              }
            })

            data.lunar = lunar !== null ? {
              year: lunar.GanZhiYear,
              month: lunar.GanZhiMonth,
              day: lunar.lunarDay == 1 ? lunar.lunarMonthName : lunar.lunarDayName
            } : null

            return data
          }))
        }
      },

      submit(day) {
        if (day.cls._outOfRange && this.onlyInMonth) {
          return
        }
        this.value = {
          year: day.year,
          month: day.month,
          day: day.day
        }

        this.$emit('input', this.value)
        return this.$emit('submit', this.value)
      },
      prev() {
        this.month = this._initMonth(this._prevMonth(this.month))
      },
      next() {
        this.month = this._initMonth(this._nextMonth(this.month))
      },
    },
    template: `
      .Calendar => *if=month
        .title
          label => @click=prev
          span => :year=month.year   :month=month.month
          label => @click=next
        .month
          .weeks
            .week => *for=(week, i) in weeks   :key=i   *text=week

          .days => *for=(week, i) in month.weeks   :key=i
            .day => *for=(day, j) in week   :key=j   :class=day.cls   @click=submit(day)
              span.num => *text=day.day
              span.lunar => *if=showLunarCalendar && day.lunar   *text=day.lunar.day
    `
  })
})();