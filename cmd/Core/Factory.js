/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path = require('path')
const { promisify } = require('@oawu/helper')

const Factory = function (file) {
  if (!(this instanceof Factory)) {
    return new Factory(file)
  }

  this._file = file
  this._name = Path.$.rRoot(file)
}

Factory.prototype.build = function (done) { return promisify(done, async _ => { }) }
Factory.prototype.create = function (done) { return promisify(done, async _ => { }) }
Factory.prototype.update = function (done) { return promisify(done, async _ => { }) }
Factory.prototype.remove = function (done) { return promisify(done, async _ => { }) }

module.exports = Factory
