/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

PrettyJson.Null = function() {
  if (this instanceof PrettyJson.Null)
    PrettyJson.call(this, 'null')
  else
    return new PrettyJson.Null()
}
PrettyJson.Null.prototype = Object.create(PrettyJson.prototype)
// PrettyJson.Null.prototype.toString = function() { return 'null' }
PrettyJson.Null.prototype.toStructString = function() { return 'null' }
