/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

// Element
const El = {
  splitLength: 3,
  split: (line, regex) => {
    let match = line.match(regex)
    if (match) return regex = line.indexOf(match[0]), match = match.shift(), { header: line.substring(0, regex).trim(), tokens: line.substring(regex + match.length).trim(), match }
    else return { header: line.trim(), tokens: '', match: '' }
  },
  toVue: (key, val) => key && val ? { key: key.replace(/^\*/, 'v-').replace(/^@/, 'v-on:'), val: val.replace(/"/g, "'") } : null,
  render (str) {
    const lines = str.split("\n").filter(t => t.trim().length).map(line => {
      const space = line.search(/\S|$/)
      const splitLine = this.split(line, /\s+=\>\s+/gm)
      const tmpHeader = this.split(splitLine.header, /\.|#/gm)
      const tokens = (splitLine.tokens + (tmpHeader.match + tmpHeader.tokens).replace(/#/gm, ' '.repeat(this.splitLength) + '#').replace(/\./gm, ' '.repeat(this.splitLength) + '.')).split(new RegExp('\\s{' + this.splitLength + ',}', 'gm')).map(attr => {
        if (attr === '*else')
          return { key: 'v-else', val: null }

        attr[0] === '#' && !attr.includes('=') && (attr = 'id=' + attr.substr(1))
        attr[0] === '.' && !attr.includes('=') && (attr = 'class=' + attr.substr(1).replace('.', ' '))
        attr.includes(':slot:') && (attr = attr.replace(/^:slot:/, 'v-slot:'))
        if (!attr.includes('=') && attr.includes('v-slot:')) return { key: attr, val: null }

        const i = attr.indexOf('=')
        attr = [attr.substr(0, i).trim(), attr.substr(i + 1).trim()].filter(t => t.length)
        return this.toVue(attr.shift(), attr.shift())
      }).filter(unit => unit)

      const attrs = {}
      for (let token of tokens)
        attrs[token.key] = token.key == 'class' && attrs[token.key] ? attrs[token.key] + ' ' + token.val : token.val

      const attr = ['']
      for (let key in attrs)
        attr.push(key + (attrs[key] !== null ? '="' + attrs[key] + '"' : ''))

      return {
        header: tmpHeader.header,
        space: space,
        tokens: attr.join(' '),
        children: [],
        toString () { return this.header[0] !== '|'
          ? 'area,base,br,col,command,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'.split(/,/).indexOf(this.header) != -1
            ? '<' + this.header + this.tokens + ' />'
            : '<' + this.header + this.tokens + '>' + this.children.join('') + '</' + this.header + '>'
          : this.header.substr(1).trim()
        }
      }
    })

    const els = [], tmp = {}

    for (let line of lines) {
      const parent = tmp[line.space - 2]
      parent
        ? line.space > parent.space && parent.children.push(line)
        : els.push(line)
      tmp[line.space] = line
    }

    return els.join('')
  }
}

$(_ => {
  const Toastr = new Vue({
    data: {
      toastrs: [],
      id: 0,
    },
    methods: {
      close (toastr) {
        return setTimeout(_ => setTimeout(_ => {
          let i = this.toastrs.indexOf(toastr)
          i == -1 || this.toastrs.splice(i, 1)
        }, 100, toastr.disappear = true), 10, toastr.predisappear = true), this
      },
      push (message, type) {
        this.$el || this.$mount() && document.body.append(this.$el)
        const object = { id: ++this.id, message, type, appear: false, appeared: false, disappear: false, predisappear: false }
        return setTimeout(_ => setTimeout(_ => setTimeout(_ => this.close(object), 5000, object.appeared = true), 300, object.appear = true), 100, this.toastrs.push(object)), this
      },
      failure (failure) { return this.push(failure, 'failure') },
      success (success) { return this.push(success, 'success') },
      warning (warning) { return this.push(warning, 'warning') },
      info (info) { return this.push(info, 'info') }
    },
    template: El.render(`
      div#toastr => *if=toastrs.length
        div => *for=toastr in toastrs   :key=toastr.id   :class=['toastr', { appear: toastr.appear, appeared: toastr.appeared, predisappear: toastr.predisappear, disappear: toastr.disappear }]   :type=toastr.type   @click=close(toastr)
          span => *if=toastr.message   *text=toastr.message`)
  })


  const $menu = $('#menu')
  $('#cover, #hamburger').click(_ => $menu.toggleClass('show'))
  
  $('#article figure[src]:not([src=""])').click(function() {
    const src = $(this).attr('src')
    src && window.open(src, '_blank').focus();
  })

  $('#article *[copy]:not([copy=""])').click(function() {
    const copy = $(this).attr('copy')
    if (!copy) return Toastr.failure('複製失敗…')

    const el = document.createElement('textarea')
    el.className = 'copy'
    el.value = copy
    document.body.appendChild(el)
    el.select()

    try { document.execCommand('copy'), Toastr.success('複製成功！') }
    catch (_) { Toastr.failure('複製失敗…') }

    document.body.removeChild(el)
  })
})