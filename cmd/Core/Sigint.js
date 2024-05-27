/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Queue = require('@oawu/queue')

const Sigint = {
  $: [],
  run (closure = null) {
    let q = Queue()

    for (const sigint of this.$) {
      q.enqueue(_next => {
        if (typeof sigint != 'function') {
          return _next()
        }
        try {
          sigint(_next)
        } catch (_) {
          return _next()
        }
      })
    }

    if (typeof closure == 'function') {
      q.enqueue(_next => closure(_next))
    }

    q.enqueue(_next => _next(process.exit(1)))
  },
  push (...data) {
    this.$.push(...data)
    return this
  },
}

module.exports = Sigint