/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2026, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */
(a=>{const{Type:t,Json:r}=window.Helper;window.Data={_enable:null,get enable(){return this._enable===null&&(this._enable=t.func(Storage)&&t.obj(localStorage)&&t.obj(JSON)),this._enable},set(n,l,e=null){if(!this.enable)return this;const o=r.encode({val:l,ttl:t.num(e)?Date.now()+e:null});return t.err(o)||localStorage.setItem(n,o),this},del(n){localStorage.removeItem(n)},get(n){if(!this.enable)return;const l=localStorage.getItem(n);if(l===null)return;const e=r.decode(l);if(!t.err(e)){if(e.ttl===null||Date.now()<=e.ttl)return e.val;localStorage.removeItem(n)}}}})();
