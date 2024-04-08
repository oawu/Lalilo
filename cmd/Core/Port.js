/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Net = require('net')

module.exports = {
  status: (port, closure) => {
    const net = Net.createServer()

    net.once('error', error => {
      if (typeof closure != 'function') {
        return null
      }

      if (error.code == 'EADDRINUSE') {
        closure(new Error('Port 已經被使用'))
      } else {
        closure(error)
      }
    })

    net.once('listening', _ => {
      net.once('close', _ => typeof closure == 'function'
        ? closure()
        : null)

      net.close()
    })
    
    net.listen(port)
  },
  scan (val, min, max, each, closure) {
    if (val < min) {
      return this.scan(min, max, each, closure)
    }

    if (typeof each == 'function') {
      each(val)
    }
    
    if (val > max) {
      return typeof closure == 'function'
        ? closure(new Error(`${min} ~ ${max} 的 port 皆已被使用中！`, val, false))
        : null
    }

    this.status(
      val,
      error => {
        if (error) {

          if (val >= max) {
            return typeof closure == 'function'
              ? closure(new Error(`${min} ~ ${max} 的 port 皆已被使用中！`, val, false))
              : null
          }
          
          typeof closure == 'function'
            ? closure(null, val, false)
            : null

          return this.scan(val + 1, min, max, each, closure)
        }

        typeof closure == 'function'
          ? closure(null, val, true)
          : null
      })
  }
}
