/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path       = require('path')
const FileSystem = require('fs')

const Type = {
  isObject: obj => typeof obj == 'object' && obj !== null && !Array.isArray(obj),
  isFunction: func => typeof func == 'function',
  isString: str => typeof str == 'string',
  isNotEmptyString: str => typeof str == 'string' && str !== '',
  isPureNumber: num => typeof num == 'number' && !isNaN(num) && num !== Infinity,
  isBoolean: num => typeof num == 'boolean',
  isError: error => error !== null && error instanceof Error,
}

const Json = {
  decode: text => {
    let json = null
    let error = null

    try {
      json = JSON.parse(text)
      error = null
    } catch (e) {
      error = e
      json = null
    }

    return error !== null || error instanceof Error
      ? error instanceof Error
        ? error
        : new Error(`${error}`)
      : json
  },
  encode: (json, space = 0) => {
    let text = null
    let error = null

    try {
      text = JSON.stringify(json, null, space)
      error = null
    } catch (e) {
      error = e
      text = null
    }

    return error !== null || error instanceof Error
      ? error instanceof Error
        ? error
        : new Error(`${error}`)
      : text
  },
}

const Print = {
  cn: _    => process.stdout.write("\x1b[2J\x1b[0f"),
  ln: text => process.stdout.write(`${text}\n`), 
}

// Fs
const deSlash = path => path.split(Path.sep).filter(t => t !== '')

const dirOrEmpty = path => {
  path = deSlash(path)
  return path.length
    ? `${path.join(Path.sep)}${Path.sep}`
    : ''
}
const fileOrEmpty = path => {
  path = deSlash(path)
  return path.length
    ? `${path.join(Path.sep)}`
    : ''
}

const exists = dir => {
  let bool = false
  try { 
    bool = FileSystem.existsSync(dir)
  } catch (_) {
    bool = false
  }
  return bool
}
const access = (path, permission = FileSystem.constants.R_OK) => {
  let bool = false
  try {
    FileSystem.accessSync(path, permission)
    bool = true
  } catch (_) {
    bool = false
  }
  return bool
}

const mkdir = (dir, recursive = false) => {
  let bool = false
  try {
    let bool = FileSystem.mkdirSync(dir, { recursive })
  } catch (_) {
    bool = false
  }
  return bool
}
const isFile = path => !!FileSystem.statSync(path).isFile()

const isDirectory = path => !!FileSystem.statSync(path).isDirectory()

const scanDirSync = (dir, recursive = true) => {
  arr = []

  try {
    if (!exists(dir)) {
      arr = []
    } else {
      arr = FileSystem.readdirSync(dir)
        .map(file => !['.', '..'].includes(file)
          ? recursive && access(dir + file) && isDirectory(dir + file)
            ? scanDirSync(`${dir}${file}${Path.sep}`, recursive)
            : [`${dir}${file}`]
          : null)
        .filter(t => t !== null)
        .reduce((a, b) => a.concat(b), [])
    }
  } catch (_) {
    arr = []
  }

  return arr
}
const checkDirsExist = (base, dirs) => {
  dirs = dirs.reduce((a, b) => {
    const last = a.pop()

    if (last === undefined) {
      return [[b]]
    }

    return [...a, last, last.concat(b)]
  }, []).map(dirs => dirOrEmpty(dirs.join(Path.sep))).filter(t => t !== '')

  for (let dir of dirs) {
    dir = `${base}${dir}`

    if (access(dir) && isDirectory(dir)) {
      continue
    }

    mkdir(dir)
  
    if (access(dir) && isDirectory(dir)) {
      continue
    }
    
    return false
  }

  return true
}

const inDir = (parent, child) => Path.normalize(child).startsWith(Path.normalize(parent))

const remove = (path, closure) => FileSystem.exists(path, exists => {
  if (!exists) {
    return typeof closure == 'function'
      ? closure(null)
      : null
  }

  FileSystem.unlink(path, error => {
    if (error) {
      return typeof closure == 'function'
        ? closure(error)
        : null
    }

    FileSystem.exists(path, exists => {
      if (typeof closure != 'function') {
        return null
      }

      return exists
        ? closure(new Error('刪除失敗！'))
        : closure(null)
    })
  })
})

// Display
const LineColor = function(color, title) {
  if (!(this instanceof LineColor)) {
    return new LineColor(color, title)
  }
  this.color = color
  this.title = title
  this.rows = []
}

LineColor.prototype.row = function(key, val) {
  if (typeof key != 'string') {
    return this
  }
  if (typeof val != 'string') {
    return this
  }
  if (val === '') {
    return this
  }
  this.rows.push({ key, val })
  return this
}
LineColor.prototype.go = function() {
  Print.ln(`${'   ● '[this.color]}${this.title}${this.rows
    .map(({ key, val }) => `${"\n     ↳ "[this.color].dim}${key !== '' ? `${key}：`.dim : ''}${val}`).join('')}`)
  return this
}

const LineRed = function(title) { if (this instanceof LineRed) { LineColor.call(this, 'red', title); } else { return new LineRed(title) } }
LineRed.prototype = Object.create(LineColor.prototype)

const LineYellow = function(title) { if (this instanceof LineYellow) { LineColor.call(this, 'yellow', title); } else { return new LineYellow(title) } }
LineYellow.prototype = Object.create(LineColor.prototype)

const LineGreen = function(title) { if (this instanceof LineGreen) { LineColor.call(this, 'green', title); } else { return new LineGreen(title) } }
LineGreen.prototype = Object.create(LineColor.prototype)

const LineBlue = function(title) { if (this instanceof LineBlue) { LineColor.call(this, 'lightBlue', title); } else { return new LineBlue(title) } }
LineBlue.prototype = Object.create(LineColor.prototype)

const LineCyan = function(title) { if (this instanceof LineCyan) { LineColor.call(this, 'cyan', title); } else { return new LineCyan(title) } }
LineCyan.prototype = Object.create(LineColor.prototype)

const cmdColor = (desc, action = null) => desc.lightGray.dim + (action !== null ? '：'.dim + action.lightGray.dim.italic : '')

const during = startAt => {
  const units = []
  const contitions = [
    { base: 60, format: '秒' },
    { base: 60, format: '分鐘' },
    { base: 24, format: '小時' },
    { base: 30, format: '天' },
    { base: 12, format: '個月' }
  ]

  let now = parseInt((Date.now() - startAt) / 1000, 10)
  let nowUnit = null

  if (now === 0) {
    return '太快了…'
  }

  for (let i in contitions) {
    nowUnit = now % contitions[i].base
    nowUnit == 0 || units.push(nowUnit + contitions[i].format)
    now = Math.floor(now / contitions[i].base)
    if (now < 1) {
      break
    }
  }

  if (now > 0) {
    units.push(`${now} 年`)
  }

  if (units.length < 1) {
    units.push(`${now} 秒`)
  }

  return units.reverse().join(' ')
}


const args = _ => {
  const argvs = process.argv.slice(2)
  const cmds = {}

  let key = null;
  for (let argv of argvs) {
    if (argv[0] == '-') {
      key = argv
      if (cmds[key] === undefined)
        cmds[key] = []
    } else {
      if (cmds[key] === undefined)
        cmds[key] = []
      cmds[key].push(argv)
    }
  }

  return cmds
}
const argvByVal = keys => {
  const cmds = args()
  const kvs = [];

  for (let key in cmds)
    if (typeof key == 'string') {
      const match = key.match(/(\-V|\-var)\-(?<key>.*)=(?<val>.*)/)
      match === null || match.groups.key === '' || kvs.push({ key: match.groups.key, val: match.groups.val})
    }

  return kvs
}
const argvByKey = keys => {
  const cmds = args()
  
  if (typeof keys == 'string')
    keys = [keys]

  let arrs = undefined
  for (let key of keys)
    if (Array.isArray(cmds[key])) {
      if (arrs === undefined)
        arrs = []
      arrs.push(cmds[key])
    }

  return arrs !== undefined ? arrs.pop() || [] : undefined
}

module.exports = {
  Json,
  Print,
  Type,

  argV: {
    byKey: argvByKey, // [-A, --a]
    byVal: argvByVal // var-{key}={val}
  },

  Fs: {
    deSlash,
    dirOrEmpty,
    fileOrEmpty,
    exists,
    access,
    mkdir,
    isFile,
    isDirectory,
    scanDirSync,
    checkDirsExist,
    inDir,
    remove
  },

  Display: {
    LineRed,
    LineYellow,
    LineGreen,
    LineBlue,
    LineCyan,
    cmd: cmdColor,
    during,
  },
}
