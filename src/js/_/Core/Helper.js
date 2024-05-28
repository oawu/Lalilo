/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Helper = {
  round: (val, digital = 0, d4 = '') => typeof val == 'number' && !isNaN(val) && val !== Infinity
    ? parseFloat(val.toFixed(digital))
    : d4,

  cluster: (objs, zoom, level, isLinear, closure) => {
    if (!objs.length) {
      closure && closure([])
      return []
    }

    objs = [...objs]

    const tmps = new WeakMap()
    const last = isLinear ? objs.pop() : undefined
    const sets = []

    for (const i in objs) {
      const _i = 1 * i
      const obj1 = objs[_i]

      if (tmps.get(obj1)) {
        continue
      }

      tmps.set(obj1, true)

      const subs = [obj1]
      const _objs = objs.slice(_i)
      for (const j in _objs) {
        const _j = 1 * j +  _i
        const obj2 = objs[_j]

        if (_j == _i || obj2 == obj1) {
          continue
        }

        if (tmps.get(obj2)) {
          if (isLinear) {
            break
          } else {
            continue
          }
        }

        const distance = Math.max(
          Math.abs(obj1.lat - obj2.lat),
          Math.abs(obj1.lng - obj2.lng)
        )

        if (30 / Math.pow(2, zoom) / level <= distance) {
          if (isLinear) {
            break
          } else {
            continue
          }
        }

        tmps.set(obj2, true)
        subs.push(obj2)
      }
      sets.push(subs)
    }

    if (last) {
      sets.push([last])
    }

    closure && closure(sets)

    return sets
  },

  timeFormat: (sec, min = false) => {
    sec /= 1000
    // sec = parseInt(sec, 10)

    const y = Math.floor(sec / (365 * 24 * 3600))
    sec %= (365 * 24 * 3600)

    const m = Math.floor(sec / (30 * 24 * 3600))
    sec %= (30 * 24 * 3600)

    const d = Math.floor(sec / (24 * 3600))
    sec %= (24 * 3600)

    const h = Math.floor(sec / 3600)
    sec %= 3600

    const i = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)

    const strs = []
    if (y > 0) strs.push(min ? `${y}年` : `${y} 年`)
    if (m > 0) strs.push(min ? `${m}月` : `${m} 月`)
    if (d > 0) strs.push(min ? `${d}天` : `${d} 天`)
    if (h > 0) strs.push(min ? `${h}時` : `${h} 時`)
    if (i > 0) strs.push(min ? `${i}分` : `${i} 分`)
    if (s > 0) strs.push(min ? `${s}秒` : `${s} 秒`)

    return strs.join(' ')
  },
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
  length ([lat1, lon1], [lat2, lon2]) {
    let aa = lat1 * Math.PI / 180
    let bb = lon1 * Math.PI / 180
    let cc = lat2 * Math.PI / 180
    let dd = lon2 * Math.PI / 180

    return (2 * Math.asin(Math.sqrt(Math.pow(Math.sin ((aa - cc) / 2), 2) + Math.cos(aa) * Math.cos(cc) * Math.pow(Math.sin((bb - dd) / 2), 2)))) * 6378137
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
