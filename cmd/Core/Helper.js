/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const cli = require('@oawu/cli-progress')
const fs = require('fs/promises')

const { Type: T, tryFunc } = require('@oawu/helper')
const Path = require('path')

cli.option.color = true
cli.cmdSubtitle = (desc, action = null) => cli.appendTitle(desc.lightGray.dim + (action !== null ? '：'.dim + action.lightGray.dim.italic : ''))

const _access = async (path, permission, type = 0, rRoot = null) => {
  const access = await tryFunc(fs.access(path, permission))
  if (T.err(access)) {
    throw new Error(`路徑「${rRoot ? rRoot(path, true) : path}」沒有訪問權限。`, { cause: access })
  }
  if (type === 0) {
    return true
  }

  const stats = await fs.stat(path)

  if (type === 1 && !stats.isFile()) {
    throw new Error(`路徑「${rRoot ? rRoot(path, true) : path}」不是檔案類型。`)
  }

  if (type === -1 && !stats.isDirectory()) {
    throw new Error(`路徑「${rRoot ? rRoot(path, true) : path}」不是目錄類型。`)
  }

  return true
}

const inDir = (parent, child) => Path.normalize(child).startsWith(Path.normalize(parent))

const checkDir = async (dir, permission, rRoot = null) => {
  if (T.err(await tryFunc(fs.access(dir)))) {
    await tryFunc(fs.mkdir(dir, { recursive: false }))
  }

  return _access(dir, permission, -1, rRoot)
}
const checkDirs = async (base, dirs) => {
  for (let dir of dirs) {
    base = base + dir + Path.sep
    await checkDir(base, fs.constants.R_OK | fs.constants.W_OK, null)
  }
}
const fileExt = path => {
  const idx = path.lastIndexOf('.')
  return idx !== -1 && idx !== path.length - 1 ? path.substring(idx).toLowerCase() : ''
}

const fileName = path => {
  const idx = path.lastIndexOf('.')
  return idx !== -1 && idx !== path.length - 1 ? path.substring(0, idx).toLowerCase() : path
}

const scanFiles = async (path, recursive) => {
  const files = []
  try {
    files.push(...await fs.readdir(path, { encoding: 'utf-8' }))
  } catch (error) {
    return []
  }

  const infos = []
  for (const file of files) {
    const filePath = path + file

    let _infos = []
    try {
      await fs.access(filePath, fs.constants.R_OK)
      const stats = await fs.stat(filePath)

      if (stats.isFile()) {
        _infos = [{
          type: 'file',
          fullpath: filePath,
          fullname: file,
          path: path,
          name: fileName(file),
          ext: fileExt(file),
        }]
      }

      if (stats.isDirectory()) {
        _infos = [
          {
            type: 'dir',
            path: filePath + Path.sep,
            name: file,
          },
          ...recursive ? await scanFiles(filePath + Path.sep, recursive) : []
        ]
      }
    } catch (_) {
      _infos = []
    }

    infos.push(..._infos)
  }

  return infos
}

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

  if (now <= 0) {
    return '太快了…'
  }

  for (const i in contitions) {
    nowUnit = now % contitions[i].base
    if (nowUnit != 0) {
      units.push(nowUnit + contitions[i].format)
    }
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

const execModel = async obj => {
  if (obj === undefined) {
    return undefined
  }
  if (obj === null) {
    return null
  }
  if (T.num(obj)) {
    return obj
  }
  if (T.bool(obj)) {
    return obj
  }
  if (T.str(obj)) {
    return obj
  }
  if (T.func(obj)) {
    return obj()
  }
  if (T.asyncFunc(obj)) {
    return await obj()
  }
  if (T.promise(obj)) {
    return await obj
  }

  if (T.arr(obj)) {
    return await Promise.all(obj.map(execModel))
  }

  if (T.obj(obj)) {
    if (obj.toString == Object.prototype.toString) {
      const tmp = {}
      for (const key in obj) {
        tmp[key] = await execModel(await execModel(obj[key]))
      }
      return tmp
    } else if (T.func(obj.toString)) {
      return obj.toString()
    } else if (T.asyncFunc(obj.toString)) {
      return await obj.toString()
    } else if (T.promise(obj.toString)) {
      return await obj.toString
    } else {
      return obj.toString
    }
  }

  return obj
}

module.exports = {
  Exist: {
    file: async (path, permission, rRoot = null) => _access(path, permission, 1, rRoot),
    dir: async (path, permission, rRoot = null) => _access(path, permission, -1, rRoot),
  },

  Concat: {
    dir: (path, dir, d4) => {
      dir = T.str(dir) ? dir : ''
      dir = dir.split(Path.sep).filter(t => t !== '').join(Path.sep)
      if (dir === '') {
        dir = d4
      }
      return path + (dir !== '' ? `${dir}${Path.sep}` : '')
    },
    file: (path, file, d4) => {
      file = T.str(file) ? file : ''
      file = file.split(Path.sep).filter(t => t !== '').join(Path.sep)
      if (file === '') {
        file = d4
      }
      return path + (file !== '' ? file : '')
    },
  },
  fileExt,
  inDir,
  checkDir,
  checkDirs,
  scanFiles,

  during,
  execModel,

  cli: async (title, func) => {
    cli.title(title)

    let result = null
    try {
      if (T.func(func)) {
        result = func(cli)
      } else if (T.asyncFunc(func)) {
        result = await func(cli)
      } else if (T.promise(func)) {
        result = await func
      }
    } catch (e) {
      cli.fail(null)
      throw e
    }

    if (T.err(result)) {
      cli.fail(null)
    } else {
      cli.done()
    }

    return result
  }
}