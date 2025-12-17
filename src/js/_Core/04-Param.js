/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Type: T } = window.Helper;

  // ---- 小工具（新的） ----------------------------------------------------
  const deepClone = obj => obj == null ? obj : JSON.parse(JSON.stringify(obj));
  const isPlainObject = v => Object.prototype.toString.call(v) === '[object Object]';

  const parseKey = (raw) => {
    // "back[a][b]" -> ["back","a","b"]
    // "tags[]"     -> ["tags",""]  // 空字串代表 []
    const parts = [];
    const m = raw.match(/^([^\[\]]+)/);
    if (m) parts.push(m[1]);
    const re = /\[([^\]]*)\]/g;
    let mm;
    while ((mm = re.exec(raw))) parts.push(mm[1]); // 可能是 ''
    return parts;
  };

  const setByPath = (obj, path, value) => {
    // 依照 path 寫入，遇到 "" 表示陣列 push
    let cur = obj;
    for (let i = 0; i < path.length; i++) {
      const k = path[i];
      const last = i === path.length - 1;

      if (last) {
        if (k === '') {
          if (!Array.isArray(cur)) cur = []; // 防呆
          cur.push(value);
        } else {
          cur[k] = value;
        }
        return;
      }

      const nextK = path[i + 1];
      if (k === '') {
        throw new Error('Unexpected empty key in middle of path');
      }

      if (!(k in cur) || typeof cur[k] !== 'object' || cur[k] == null) {
        cur[k] = (nextK === '' ? [] : {});
      }
      cur = cur[k];

      if (nextK === '' && !Array.isArray(cur)) {
        cur = (cur[k] = []); // 理論上不會進來，保守處理
      }
    }
  };

  const getByPath = (obj, path) =>
    path.reduce((acc, k) => (acc != null ? acc[k] : undefined), obj);

  const toBool = (v, fallback = false) => {
    const s = String(v).toLowerCase();
    if (s === 'true' || s === '1' || s === 'yes') return true;
    if (s === 'false' || s === '0' || s === 'no') return false;
    return fallback;
  };

  const smartCast = (v) => {
    const s = String(v);
    if (/^[+-]?\d+(\.\d+)?$/.test(s)) {
      const n = Number(s);
      if (Number.isFinite(n)) return n;
    }
    const low = s.toLowerCase();
    if (['true', 'false', '1', '0', 'yes', 'no'].includes(low)) {
      return toBool(s);
    }
    return v;
  };

  const castBySchemaDefault = (input, defaultValue) => {
    if (defaultValue === undefined || defaultValue === null) return smartCast(input);
    const t = typeof defaultValue;
    if (t === 'number') {
      const n = Number(input);
      return Number.isFinite(n) ? n : defaultValue;
    }
    if (t === 'boolean') return toBool(input, defaultValue);
    // 若 default 是陣列/物件，這裡回傳原字串；由上層再決定
    return input;
  };

  const encodeBracket = (prefix, key) =>
    key === '' ? `${prefix}[]` : `${prefix}[${encodeURIComponent(key)}]`;

  const flattenToQueryPairs = (obj, prefix = '', out = []) => {
    // 物件/陣列遞迴展開成 `key=value` pair（支援 bracket notation）
    if (Array.isArray(obj)) {
      for (const v of obj) {
        const k = encodeBracket(prefix, '');
        if (isPlainObject(v) || Array.isArray(v)) {
          // 陣列元素是 object：展成 k[][sub]=v
          flattenToQueryPairs(v, k, out);
        } else {
          out.push(`${k}=${encodeURIComponent(v)}`);
        }
      }
      return out;
    }

    if (isPlainObject(obj)) {
      for (const [k, v] of Object.entries(obj)) {
        const keyStr = prefix ? encodeBracket(prefix, k) : encodeURIComponent(k);
        if (isPlainObject(v) || Array.isArray(v)) {
          flattenToQueryPairs(v, keyStr, out);
        } else {
          // null => 不輸出參數
          if (v !== null && v !== undefined)
            out.push(`${keyStr}=${encodeURIComponent(v)}`);
        }
      }
      return out;
    }

    if (prefix) out.push(`${prefix}=${encodeURIComponent(obj)}`);
    return out;
  };

  // ---- 你的 API（升級版） ------------------------------------------------
  window.Param = {
    _: {
      // 將 "?a=1&b[c]=2&tags[]=x" 解析為 entries: [{path:['a'],v:'1'}, {path:['b','c'],v:'2'}, {path:['tags',''],v:'x'}]
      split: (str) => {
        const entries = [];
        if (!str) return entries;
        str.split('&').forEach(kv => {
          if (!kv) return;
          const i = kv.indexOf('=');
          if (i < 0) return;
          const rawK = decodeURIComponent(kv.slice(0, i));
          const rawV = decodeURIComponent(kv.slice(i + 1));
          entries.push({ path: parseKey(rawK), v: rawV });
        });
        return entries;
      },

      // 把 entries merge 進 result（遵守 schema 型別）
      mergeEntriesIntoResult(entries, schema) {
        const result = deepClone(schema);

        // 先聚合相同 path（用 JSON.stringify 當 key）
        const grouped = new Map();
        for (const e of entries) {
          const k = JSON.stringify(e.path);
          if (!grouped.has(k)) grouped.set(k, []);
          grouped.get(k).push(e.v);
        }

        for (const [k, values] of grouped) {
          const path = JSON.parse(k);
          const parentPath = path.slice(0, -1);
          const lastKey = path[path.length - 1];
          const defaultAtPath = getByPath(schema, path);

          // 若最後一段是 "" => arr[]，直接整包成陣列
          if (lastKey === '') {
            // 查一下 parent 的 default 元素型別
            const elemDefault = Array.isArray(getByPath(schema, parentPath)) && getByPath(schema, parentPath).length
              ? getByPath(schema, parentPath)[0]
              : undefined;
            const casted = values.map(v => castBySchemaDefault(v, elemDefault));
            // 寫入 parent 路徑
            let cursor = result;
            for (let i = 0; i < parentPath.length; i++) {
              const seg = parentPath[i];
              console.error(cursor);
              process.exit()

              cursor[seg] = cursor[seg] !== undefined && cursor[seg] !== null ? cursor[seg] : (Number.isFinite(Number(parentPath[i + 1])) ? [] : {});
              cursor = cursor[seg];
            }
            // 直接覆蓋成陣列
            if (Array.isArray(cursor)) {
              // 罕見情況：parent 本來就是 array（例如 foo[][bar]=1），保守處理
              cursor.push(...casted);
            } else {
              cursor[parentPath[parentPath.length - 1]] = casted;
            }
            continue;
          }

          // 單值路徑（若重複同 key，取最後）
          const val = castBySchemaDefault(values[values.length - 1], defaultAtPath);
          setByPath(result, path, val);
        }

        return result;
      },

      // 建立 Meta Map 與可觀察物件（top-level）
      init: (key, sets, prototype, entries) => {
        if (window.Param._[key] === undefined) {
          window.Param._[key] = new Map();
        }

        // 1) 先依 entries + schema merge 出完整 result
        const merged = window.Param._.mergeEntriesIntoResult(entries, sets);
        const object = new prototype();

        // 2) 為 top-level key 建立 Meta 與 getter/setter
        for (const k of Object.keys(sets)) {
          const schemaVal = sets[k];
          const gotVal = Object.prototype.hasOwnProperty.call(merged, k) ? merged[k] : sets[k];
          const isDefault = !Object.prototype.hasOwnProperty.call(merged, k);

          window.Param._[key].set(k, window.Param._.Meta(gotVal, isDefault, key === 'hash'));

          Object.defineProperty(object, k, {
            set(val) {
              const data = window.Param._[key].get(k);
              if (data instanceof window.Param._.Meta) {
                data.val = val;
              }
            },
            get() {
              const data = window.Param._[key].get(k);
              return data instanceof window.Param._.Meta ? data.val : undefined;
            }
          });
        }

        return object;
      },

      // 將目前狀態序列化（支援巢狀/陣列）
      string: (key, object, splitter) => {
        if (window.Param._[key] === undefined) {
          window.Param._[key] = new Map();
        }

        const output = {};

        // 先把 Meta Map 的值寫回一個乾淨物件（只輸出非預設 d4=false）
        for (let [k, meta] of window.Param._[key]) {
          if (meta instanceof window.Param._.Meta && !meta.d4) {
            output[k] = meta.val;
          }
        }

        // 若 object 還有動態 key（你原本設計允許），也一併序列化
        if (object instanceof window.Param._.Object.Hash || object instanceof window.Param._.Object.Query) {
          for (const k of Object.keys(object)) {
            if (!(k in output)) output[k] = object[k];
          }
        }

        const pairs = flattenToQueryPairs(output);
        return pairs.length > 0 ? `${splitter}${pairs.join('&')}` : '';
      },

      // 舊的 kv 已升級由 flattenToQueryPairs 取代；保留介面避免外部呼叫壞掉
      kv: (object) => flattenToQueryPairs(object),

      Meta: function (v, d, h) {
        if (!(this instanceof window.Param._.Meta)) {
          return new window.Param._.Meta(v, d, h);
        }
        this._val = v;
        this._d4 = d;
        this._hs = h;
      },

      Object: {
        Hash: function () {
          if (this instanceof window.Param._.Object.Hash) return;
          return new window.Param._.Object.Hash();
        },
        Query: function () {
          if (this instanceof window.Param._.Object.Query) return;
          return new window.Param._.Object.Query();
        },
      }
    },

    Query: function (sets) {
      this.Query = this._.init(
        'query',
        sets,
        window.Param._.Object.Query,
        this._.split(window.location.search.replace(/^\?/, ''))
      );
    },

    Hash: function (sets) {
      this.Hash = this._.init(
        'hash',
        sets,
        window.Param._.Object.Hash,
        this._.split(window.location.hash.replace(/^#/, ''))
      );
    },
  };

  // ---- 你的既有行為（保留） ---------------------------------------------
  Object.defineProperty(window.Param._.Meta.prototype, 'd4', {
    get() { return this._d4; }
  });
  Object.defineProperty(window.Param._.Meta.prototype, 'val', {
    get() { return this._val; },
    set(val) {
      this._val = val;
      this._d4 = false;
      history.pushState(
        {},
        null,
        `${window.location.protocol}//${window.location.host}${window.location.pathname}` +
        `${T.obj(window.Param.Query) ? window.Param.Query : ''}` +
        `${T.obj(window.Param.Hash) ? window.Param.Hash : ''}`
      );
      return this;
    }
  });
  window.Param._.Object.Query.prototype.toString = function () {
    return window.Param._.string('query', this, '?');
  };
  window.Param._.Object.Hash.prototype.toString = function () {
    return window.Param._.string('hash', this, '#');
  };
  window.Param.toString = function () {
    const q = this.Query instanceof this._.Object.Query ? this.Query : '';
    const h = this.Hash instanceof this._.Object.Hash ? this.Hash : '';
    return `${q}${h}`;
  };
})();
