/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Sample = function(title) {
  if (!(this instanceof Api.Sample))
    return new Api.Sample(title)
  
  this._title = title
}

Object.defineProperty(Api.Sample.prototype, 'el', {
  get () { return 'tree-api-sample' }
})
Object.defineProperty(Api.Sample.prototype, 'title', {
  get () { return this._title }
})

Load.VueComponent('tree-api-sample', {
  props: {
    obj: { type: Api.Request.Sample, required: true },
  },
  template: `
    label => *text=obj.title
  `
})