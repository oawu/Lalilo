/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Request.Url = function(paths) {
  if (!(this instanceof Api.Request.Url))
    return new Api.Request.Url(paths)

  this._paths = []
  for (let path of paths) {
    let tmp = Api.Token.dispatch(path)
    if (tmp !== null)
      this._paths.push(tmp)
  }
}

Object.defineProperty(Api.Request.Url.prototype, 'paths', { get () { return this._paths } })
Object.defineProperty(Api.Request.Url.prototype, 'vars', { get () { return this.paths.filter(path => path.isVar) } })
Object.defineProperty(Api.Request.Url.prototype, 'description', { get () { return this.paths.map(p => p.description).join('/') } })
// Api.Request.Url.prototype.toString = function() {  }
