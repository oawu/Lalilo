/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

$(_ => {

  const move = {
    $scrollElement: null,
    timer: null,
    ranges: [],
    setScrollElement ($scrollElement) {
      this.$scrollElement = $scrollElement
      return this
    },
    setAreas ($section) {
      //          1        2        3
      // 0123456780123456780123456780123456
      // 012345678901234567890123456701234567
      //        A        A        A

      // let areas = [
      // {top: 0, height: 9},
      // {top: 9, height: 9},
      // {top: 18, height: 9},
      // {top: 27, height: 9},
      // {top: 36, height: 9},
      // ]
      // let ranges = [
      //   {start: -1, end: 6, top: 0},
      //   {start: 6, end: 15, top: 9},
      //   {start: 15, end: 24, top: 18},
      //   {start: 24, end: 33, top: 27}
      // ]

      let areas = $section.map(function() {
        return {
          top: $(this).offset().top,
          height: $(this).outerHeight(),
        }
      }).toArray()

      let ranges = []
      let last = null
      for (let area of areas) {
        last = last === null
          ? { start: -1, end: (area.height / 3 * 2), top: 0 }
          : { start: last.end, end: area.top + (area.height / 3 * 2), top: area.top }
        ranges.push(last)
      }
      this.ranges = ranges
      return this
    },
    getRange (top) {
      for (let range of this.ranges)
        if (top > range.start && top <= range.end)
          return range
      return null
    },
    goto (top, delay = 500) {
      if (this.$scrollElement === null) return 
      let range = this.getRange(top)
      if (range === null) return 
      clearTimeout(this.timer)
      this.timer = setTimeout(_ => this.$scrollElement.animate({ scrollTop: range.top }), delay)
    }
  }

  move
    .setScrollElement($('html'))
    .setAreas($('.section'))

  let $window = $(window)

  $window.scroll(_ => {
    move.goto($window.scrollTop())
  }).scroll()
})