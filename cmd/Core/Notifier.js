/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

let enable = true
const _Notifier = require('node-notifier').NotificationCenter

const gen = (title, message, subtitle) => {
  if (!enable)
    return

  const option = {
    sound: true,
    wait: false,
    timeout: 5,
    closeLabel: '關閉',
    actions: ['不再顯示'],
    dropdownLabel: '其他',
    withFallback: true,
    reply: true
  }

  if (typeof title == 'string' && title !== '') {
    option.title = title
  }
  
  if (typeof subtitle == 'string' && subtitle !== '') {
    option.subtitle = subtitle
  }
  
  if (typeof message == 'string' && message !== '') {
    option.message = message
  }

  let notifier = new _Notifier()
  notifier.notify(option, (error, response, metadata) => enable = !(response == 'activate' && metadata.activationValue == '不再顯示'))
}

const Notifier = function(title) {
  if (!(this instanceof Notifier)) {
    return new Notifier(title)
  }
  this.title = title
  this.rows = []
}

Notifier.prototype.row = function(key, val) {
  if (typeof key != 'string') {
    return this
  }
  if (typeof val != 'string') {
    return this
  }
  if (val === '') {
    return this
  }
  this.rows.push({ key, val })
  return this
}

Notifier.prototype.go = function() {
  gen(this.title, this.rows.map(({ key, val }) => `${key}：${val}`).join('\n'))
  return this
}

module.exports = Notifier