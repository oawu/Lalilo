/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path = require('path')

const Factory = function(file) {
  if (!(this instanceof Factory)) {
    return new Factory(file)
  }

  this.file = file
  this.name = Path.$.rRoot(file)
}

Factory.prototype.build = function(done) { return typeof done == 'function' && done([]) }
Factory.prototype.create = function(done) { return typeof done == 'function' && done() }
Factory.prototype.update = function(done) { return typeof done == 'function' && done() }
Factory.prototype.remove = function(done) { return typeof done == 'function' && done() }

module.exports = Factory
