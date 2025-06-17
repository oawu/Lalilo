/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Net = require('net')
const { promisify, Type: T } = require('@oawu/helper')

module.exports = async (port, closure = null) => promisify(closure, done => {
  const net = Net.createServer()

  net.once('error', error => error.code == 'EADDRINUSE'
    ? done(new Error('Port 已經被使用', { cause: error }))
    : done(error))

  net.once('listening', _ => {
    net.once('close', _ => done())
    net.close()
  })

  net.listen(port)
})