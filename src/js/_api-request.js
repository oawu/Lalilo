/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Request = function(title, method, samples = []) {
  if (!(this instanceof Api.Request))
    return new Api.Request(title, method, samples)
  
  this._title = title
  this._method = method
  this._samples = samples
  this._open = true

}
Object.defineProperty(Api.Request.prototype, 'el', {
  get () { return 'tree-api-request' }
})
Object.defineProperty(Api.Request.prototype, 'title', {
  get () { return this._title }
})
Object.defineProperty(Api.Request.prototype, 'method', {
  get () { return this._method }
})
Object.defineProperty(Api.Request.prototype, 'samples', {
  get () { return this._samples }
})
Object.defineProperty(Api.Request.prototype, 'open', {
  get () { return this._open },
  set (val) { return this._open = val }
})

Load.VueComponent('tree-api-request', {
  props: {
    obj: { type: Api.Request, required: true },
  },
  template: `
    div.tree-api-request
      label.tree-api-title => :class={_open: obj.open, _s: obj.samples.length}   @click=obj.open=!obj.open
        b => *text=obj.method   :class=obj.method
        span => *text=obj.title
      div.tree-api-samples
        component => *for=(sample,i) in obj.samples   :key=i   :obj=sample   :is=sample.el
  `
})