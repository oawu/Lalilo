/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Type: T, promisify, tryFunc } = window.Helper

  window.Copy = {
    str: (text, closure) => promisify(closure, async _ => {
      let el = document.createElement('textarea')
      el.style.position = 'fixed'
      el.style.left = '-100000px'
      el.style.top = '-100000px'
      el.style.zIndex = '-999999'
      el.style.opacity = '0'

      el.value = text
      document.body.appendChild(el)
      el.select()

      const result = await tryFunc(_ => document.execCommand('copy'))

      document.body.removeChild(el)
      el = null

      if (T.err(result)) {
        throw result
      }

      return null
    })
  }
})();