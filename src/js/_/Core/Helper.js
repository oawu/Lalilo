/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Helper = {
  numFormat: (n, d = 3) => {
    const w = []
    for (let i = 0, a = ('' + n).split('').reverse(); i < a.length; i++) {
      if (!i || (i % d)) {
        w.push(a[i])
      } else {
        w.push(',', a[i])
      }
    }
    return w.reverse().join('')
  },
  pad0: (t, n = 2, c = '0') => {
    t = '' + t
    c = '' + c
    n = '' + Math.pow(10, n - 1)
    if (t.length > n.length) {
      return t
    }
    n = n.length - t.length
    return c.repeat(n) + t
  },
  date: (format = 'Y-m-d H:i:s', now = new Date()) => {
    if (format instanceof Date) {
      now = format
      format = typeof now == 'string' ? now : 'Y-m-d H:i:s'
    }

    now = now instanceof Date
      ? now
      : new Date(now * 1000)

    return format.replace('Y', now.getFullYear()).replace('m', Helper.pad0(now.getMonth() + 1)).replace('d', Helper.pad0(now.getDate())).replace('H', Helper.pad0(now.getHours())).replace('i', Helper.pad0(now.getMinutes())).replace('s', Helper.pad0(now.getSeconds()))
  },
  copyStr: (text, done, fail) => {
    let error = null
    let el = document.createElement('textarea')
    el.className = '__lalilo_copy_str'
    el.value = text
    document.body.appendChild(el)
    el.select()

    try {
      document.execCommand('copy')
    } catch (e) {
      error = e.message
    }

    document.body.removeChild(el)

    el = null
    let func = error
      ? fail
      : done

    typeof func == 'function' && func()
  }
}
