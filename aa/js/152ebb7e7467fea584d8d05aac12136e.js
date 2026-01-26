/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2026, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */
(c=>{const{Helper:u}=window,{Type:s,Json:f}=u,t=new Vue;window.Bus=function(n){if(!(this instanceof window.Bus))return new window.Bus(n);this._vue=n instanceof Vue?n:null},window.Bus.prototype.emit=function(n,...o){return t.$emit(n,...o),this},window.Bus.prototype.on=function(n,o){if(!(s.func(o)||s.asyncFunc(o)))return this;const i=this._vue,e=i?(...r)=>o.apply(i,r):o;t.$on(n,e);const w=()=>t.$off(n,e);return i&&i.$once("hook:beforeDestroy",w),w},window.Bus.prototype.once=function(n,o){if(!(s.func(o)||s.asyncFunc(o)))return this;const i=this._vue,e=i?(...w)=>o.apply(i,w):o;return t.$once(n,e),this},window.Bus.prototype.off=function(n,o){return t.$off(n,o),this},window.Bus.$on=(n,o)=>t.$on(n,o),window.Bus.$once=(n,o)=>t.$once(n,o),window.Bus.$off=(n,o)=>t.$off(n,o),window.Bus.$emit=(n,...o)=>t.$emit(n,...o)})();
