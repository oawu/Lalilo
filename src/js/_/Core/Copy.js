/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

window.Copy = {
  str: (text, closure) => window.Helper.promisify(closure, async _ => {
    let el = document.createElement('textarea')
    el.className = '__lalilo_copy_str'
    el.value = text
    document.body.appendChild(el)
    el.select()

    const result = await window.Helper.tryFunc(_ => document.execCommand('copy'))

    document.body.removeChild(el)
    el = null

    if (window.Helper.Type.err(result)) {
      throw result
    }

    return null
  })
}
