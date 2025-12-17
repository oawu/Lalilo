/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const fs = require('fs/promises')
const Path = require('path')
const { cli, Concat, checkDir, Exist, scanFiles, inDir, checkDirs, execModel } = require('@oawu/_Helper')
const Config = require('@oawu/_Config')
const { Type: T, Sigint, tryFunc, Argv, Print } = require('@oawu/helper')
const exec = require('child_process').exec
const FactoryIcon = require('@oawu/_FactoryIcon')
const FactoryScss = require('@oawu/_FactoryScss')
const MinifyCss = require('clean-css')
const MinifyHtml = require('html-minifier').minify
const crypto = require('crypto')
const Handlebars = require('handlebars')
const Terser = require('terser');

const _CommentJS = Config.Comments.length ? [
  '/**',
  ...Config.Comments.map(comment => ` * ${comment}`),
  ' */',
  '',
].join('\n') : ''

const _CommentHTML = Config.Comments.length ? [
  '<!--',
  ...Config.Comments.map(comment => ` * ${comment}`),
  '-->',
  '',
].join('\n') : ''

const _buildHtml = async file => {
  const html = await tryFunc(fs.readFile(file.src.file, { encoding: 'utf8' }))
  if (T.err(html)) {
    throw new Error(`無法讀取 ${Path.$.rRoot(file.src.file)}`, { cause: html })
  }

  if (file.src.model === null) {
    return html
  }

  const model = await tryFunc(fs.readFile(file.src.model, { encoding: 'utf8' }))
  if (T.err(model)) {
    throw new Error(`無法讀取 ${Path.$.rRoot(file.src.model)}`, { cause: model })
  }

  const md5 = crypto.createHash('md5').update(model).digest('hex')
  const tmpPath = `${Config.Source.modelTmpDir}${md5}.js`

  const copy = await tryFunc(fs.copyFile(file.src.model, tmpPath))
  if (T.err(copy)) {
    throw new Error(`無法複製 Model`, { cause: copy })
  }

  const obj = await tryFunc(require(tmpPath))
  await tryFunc(fs.unlink(tmpPath))

  if (T.err(obj)) {
    throw new Error(`執行 Model 錯誤`, { cause: obj })
  }

  const tmp = await execModel(obj)
  const template = Handlebars.compile(html)
  return template(tmp)
}


const _Goal = {
  _git: async _ => {
    let result = { account: '', repository: '', branch: '', message: '' }
    const output = await tryFunc(new Promise((resolve, reject) => exec('git remote get-url origin', (error, stdout, stderr) => error ? reject(error) : resolve({ stdout, stderr }))))
    if (T.err(output)) {
      return result
    }

    const { groups: { account = '', repository = '' } = {} } = /^git@github\.com:(?<account>.*)\/(?<repository>.*)\.git/gi.exec(output.stdout) || /^https:\/\/github\.com\/(?<account>.*)\/(?<repository>.*)\.git/gi.exec(output.stdout) || {}

    result.account = account
    result.repository = repository

    return result
  },
  bucket: async (Config, cli) => {
    const key = '--s3-bucket'
    cli.cmdSubtitle('取得參數', key)
    const argvs = Argv.dash()
    let vals = T.arr(argvs[key]) ? argvs[key] : []
    vals.unshift(Config.Deploy.s3.bucket)
    vals = vals.filter(T.neStr)
    vals.unshift('')
    return vals.pop()
  },
  access: async (Config, cli) => {
    const key = '--s3-access'
    cli.cmdSubtitle('取得參數', key)
    const argvs = Argv.dash()
    let vals = T.arr(argvs[key]) ? argvs[key] : []
    vals.unshift(Config.Deploy.s3.access)
    vals = vals.filter(T.neStr)
    vals.unshift('')
    return vals.pop()
  },
  secret: async (Config, cli) => {
    const key = '--s3-secret'
    cli.cmdSubtitle('取得參數', key)
    const argvs = Argv.dash()
    let vals = T.arr(argvs[key]) ? argvs[key] : []
    vals.unshift(Config.Deploy.s3.secret)
    vals = vals.filter(T.neStr)
    vals.unshift('')
    return vals.pop()
  },
  region: async (Config, cli) => {
    const key = '--s3-region'
    cli.cmdSubtitle('取得參數', key)
    const argvs = Argv.dash()
    let vals = T.arr(argvs[key]) ? argvs[key] : []
    vals.unshift(Config.Deploy.s3.region)
    vals = vals.filter(T.neStr)
    vals.unshift('')
    return vals.pop()
  },
  account: async (Config, cli) => {
    const key = '--gh-account'
    cli.cmdSubtitle('取得參數', key)
    const argvs = Argv.dash()
    let vals = T.arr(argvs[key]) ? argvs[key] : []
    vals.unshift(Config.Deploy.github.account)

    let project = await _Goal._git()
    vals.unshift(project.account)

    vals = vals.filter(T.neStr)
    vals.unshift('')
    return vals.pop()
  },
  repository: async (Config, cli) => {
    const key = '--gh-repository'
    cli.cmdSubtitle('取得參數', key)
    const argvs = Argv.dash()
    let vals = T.arr(argvs[key]) ? argvs[key] : []
    vals.unshift(Config.Deploy.github.repository)

    let project = await _Goal._git()
    vals.unshift(project.repository)

    vals = vals.filter(T.neStr)
    vals.unshift('')
    return vals.pop()
  },
  branch: async (Config, cli) => {
    const key = '--gh-branch'
    cli.cmdSubtitle('取得參數', key)
    const argvs = Argv.dash()
    let vals = T.arr(argvs[key]) ? argvs[key] : []
    vals.unshift(Config.Deploy.github.branch)

    vals = vals.filter(T.neStr)
    vals.unshift('gh-pages')
    return vals.pop()
  },
  message: async (Config, cli) => {
    const key = '--gh-message'
    cli.cmdSubtitle('取得參數', key)
    const argvs = Argv.dash()
    let vals = T.arr(argvs[key]) ? argvs[key] : []
    vals.unshift(Config.Deploy.github.message)

    vals = vals.filter(T.neStr)
    vals.unshift('🚀 部署！')
    return vals.pop()
  }
}

module.exports = {
  path: async _ => {
    await cli('定義路徑結構', async cli => {
      Path.$ = {
        root: `${Path.resolve(__dirname, ('..' + Path.sep).repeat(2))}${Path.sep}`,
        cmd: `${Path.resolve(__dirname, ('..' + Path.sep).repeat(1))}${Path.sep}`,
        rRoot(path, isDir = false) {
          return `${Path.relative(this.root, path)}${isDir ? Path.sep : ''}`
        }
      }
      cli.cmdSubtitle('根目錄', Path.$.root)
      cli.cmdSubtitle('CMD 目錄', Path.$.cmd)
      return Path
    })
  },
  config: async _ => {
    await cli('載入設定檔', async cli => {
      cli.cmdSubtitle('路徑', `${Path.$.root}Core${Path.sep}Config.js`)

      if (!T.obj(Config)) {
        throw new Error('設定檔案格式錯誤(1)。')
      }

      if (!T.obj(Config.Source)) {
        throw new Error('設定檔案格式錯誤(2)。')
      }

      if (!T.obj(Config.Server)) {
        throw new Error('設定檔案格式錯誤(3)。')
      }

      if (!T.obj(Config.Build)) {
        throw new Error('設定檔案格式錯誤(4)。')
      }

      if (!T.obj(Config.Deploy)) {
        throw new Error('設定檔案格式錯誤(5)。')
      }

      return Config
    })
  },
  sourceConfig: async _ => {
    await cli('檢查設定檔內 Source 的格式', async cli => {
      cli.cmdSubtitle('檢查', '入口路徑是否正確')

      Config.Source.path = Concat.dir(Path.$.root, Config.Source.path, 'src')

      cli.cmdSubtitle('檢查', '入口路徑是否有讀取權限')
      await checkDir(Config.Source.path, fs.constants.R_OK, Path.$.rRoot)

      cli.cmdSubtitle('檢查', '開發目錄設定')
      if (!T.obj(Config.Source.dir)) {
        Config.Source.dir = {}
      }

      const r = fs.constants.R_OK
      const rw = r | fs.constants.W_OK
      const _dir = {
        js: { dir: 'js', permission: r },
        css: { dir: 'css', permission: rw },
        img: { dir: 'img', permission: r },
        icon: { dir: 'icon', permission: r },
        scss: { dir: 'scss', permission: rw },
        html: { dir: 'html', permission: r },
        model: { dir: 'model', permission: r },
      }
      for (let key in _dir) {
        const dir = Concat.dir(Config.Source.path, Config.Source.dir[key], _dir[key].dir)
        await checkDir(dir, _dir[key].permission, Path.$.rRoot)
        Config.Source.dir[key] = dir
      }

      cli.cmdSubtitle('檢查', '在 scss 中的圖示目錄')
      const iconDirInScss = Concat.dir(Config.Source.dir.scss, Config.Source.iconDirInScss, 'icon')
      await checkDir(iconDirInScss, fs.constants.R_OK | fs.constants.W_OK, Path.$.rRoot)
      Config.Source.iconDirInScss = iconDirInScss

      cli.cmdSubtitle('檢查', '在 Model 暫存目錄')
      const modelTmpDir = Concat.dir(Path.$.cmd, Config.Source.modelTmpDir, '_model')
      await checkDir(modelTmpDir, fs.constants.R_OK | fs.constants.W_OK, Path.$.rRoot)
      Config.Source.modelTmpDir = modelTmpDir

      await new Promise((resolve, reject) => exec(`rm -rf ${Config.Source.modelTmpDir}*`, error => error ? reject(new Error(`目錄「${Path.$.rRoot(Config.Source.modelTmpDir, true)}」無法被清空。`, { cause: error })) : resolve()))
      await fs.writeFile(Concat.file(Config.Source.modelTmpDir, '.gitignore'), '*', { encoding: 'utf8' })
      Sigint.push(async _ => await new Promise(resolve => exec(`rm -rf ${Config.Source.modelTmpDir}`, _ => resolve())))
    })
  },
  serverConfig: async _ => {
    await cli('檢查設定檔內 Server 的格式', async cli => {
      cli.cmdSubtitle('檢查', '監聽設定')

      if (!T.obj(Config.Server.watch)) {
        Config.Server.watch = {}
      }
      if (!T.arr(Config.Server.watch.exts)) {
        Config.Server.watch.exts = ['.html', '.css', '.js']
      }
      Config.Server.watch.exts = Config.Server.watch.exts.filter(ext => T.neStr(ext) && ext.startsWith('.')).map(ext => ext.toLowerCase())

      if (!T.arr(Config.Server.watch.ignoreDirs)) {
        Config.Server.watch.ignoreDirs = ['icon']
      }
      Config.Server.watch.ignoreDirs = Config.Server.watch.ignoreDirs.filter(dir => T.neStr(dir))
      const _dirs = await Promise.all(Config.Server.watch.ignoreDirs.map(async dir => {
        dir = Concat.dir(Config.Source.path, dir)
        return T.err(await tryFunc(Exist.dir(dir, fs.constants.R_OK))) ? null : dir
      }))
      Config.Server.watch.ignoreDirs = _dirs.filter(dir => dir !== null)

      cli.cmdSubtitle('檢查', '伺服器設定')

      if (!T.obj(Config.Server.server)) {
        Config.Server.server = {}
      }

      if (!T.neStr(Config.Server.server.domain)) {
        Config.Server.server.domain = '127.0.0.1'
      }
      Config.Server.server.domain = Config.Server.server.domain.replace(/\/+$/, '')

      if (!T.obj(Config.Server.server.port)) {
        Config.Server.server.port = {}
      }
      if (!T.num(Config.Server.server.port.min)) {
        Config.Server.server.port.min = 8000
      }
      if (!T.num(Config.Server.server.port.max)) {
        Config.Server.server.port.max = 8999
      }
      if (!T.num(Config.Server.server.port.default)) {
        Config.Server.server.port.default = 8000
      }
      if (!T.num(Config.Server.server.port.value)) {
        Config.Server.server.port.value = Config.Server.server.port.default
      }

      if (!T.arr(Config.Server.server.utf8Exts)) {
        Config.Server.server.utf8Exts = ['.html', '.css', '.js', '.json', '.txt']
      }
      Config.Server.server.utf8Exts = Config.Server.server.utf8Exts.filter(ext => T.neStr(ext) && ext.startsWith('.')).map(ext => ext.toLowerCase())

      cli.cmdSubtitle('設定', 'asset dir')
      Object.defineProperty(Config, 'assetDir', {
        get() {
          return {
            css: Config.Source.dir.css,
            js: Config.Source.dir.js,
            entry: Config.Source.path,
          }
        }
      })
    })
  },
  buildConfig: async _ => {
    await cli('檢查設定檔內 Build 的格式', async cli => {
      cli.cmdSubtitle('檢查', '出口路徑是否正確')

      Config.Build.path = Concat.dir(Path.$.root, Config.Build.path, 'dist')

      await tryFunc(checkDir(Config.Build.path, fs.constants.R_OK | fs.constants.W_OK, Path.$.rRoot))

      cli.cmdSubtitle('檢查', '出口路徑是否有讀寫權限')
      await checkDir(Config.Build.path, fs.constants.R_OK | fs.constants.W_OK, Path.$.rRoot)

      cli.cmdSubtitle('檢查', 'Javascript 壓縮設定')
      if (!T.obj(Config.Build.jsMinify)) {
        Config.Build.jsMinify = {}
      }

      cli.cmdSubtitle('檢查', '複製檔案與目錄路徑')
      if (!T.obj(Config.Build.copy)) {
        Config.Build.copy = {}
      }

      if (!T.arr(Config.Build.copy.files)) {
        Config.Build.copy.files = []
      }
      Config.Build.copy.files = Config.Build.copy.files.filter(dir => T.neStr(dir))
      const _files = await Promise.all(Config.Build.copy.files.map(async file => {
        file = Concat.file(Config.Source.path, file)
        return T.err(await tryFunc(Exist.file(file, fs.constants.R_OK))) ? null : file
      }))
      Config.Build.copy.files = _files.filter(file => file !== null)

      if (!T.arr(Config.Build.copy.dirs)) {
        Config.Build.copy.dirs = []
      }
      Config.Build.copy.dirs = Config.Build.copy.dirs.filter(dir => T.neStr(dir))
      const _dirs = await Promise.all(Config.Build.copy.dirs.map(async dir => {
        dir = Concat.dir(Config.Source.path, dir)
        return T.err(await tryFunc(Exist.dir(dir, fs.constants.R_OK))) ? null : dir
      }))
      Config.Build.copy.dirs = _dirs.filter(dir => dir !== null)

      cli.cmdSubtitle('檢查', '允許的副檔名')
      if (!T.arr(Config.Build.exts)) {
        Config.Build.exts = ['.html', '.txt', '.xml', '.json', '.css', '.js', '.eot', '.svg', '.ttf', '.woff', '.png', '.jpg', '.jpeg', '.gif', '.ico']
      }
      Config.Build.exts = Config.Build.exts.filter(ext => T.neStr(ext) && ext.startsWith('.')).map(ext => ext.toLowerCase())


      cli.cmdSubtitle('設定', 'asset dir')
      Object.defineProperty(Config, 'assetDir', {
        get() {
          return {
            css: Concat.dir(Config.Build.path, Path.relative(Config.Source.path, Config.Source.dir.css), ''),
            js: Concat.dir(Config.Build.path, Path.relative(Config.Source.path, Config.Source.dir.js), ''),
            entry: Concat.dir(Config.Build.path, Path.relative(Config.Source.path, Config.Source.path), ''),
          }
        }
      })
    })
  },
  deployConfig: async _ => {
    await cli('檢查設定檔內 Deploy 的格式', async cli => {
      if (!T.obj(Config.Deploy)) {
        Config.Deploy = {}
      }
      if (!T.obj(Config.Deploy.github)) {
        Config.Deploy.github = {}
      }
      if (!T.obj(Config.Deploy.s3)) {
        Config.Deploy.s3 = {}
      }

      if (!T.neStr(Config.Deploy.github.account)) {
        Config.Deploy.github.account = ''
      }
      if (!T.neStr(Config.Deploy.github.repository)) {
        Config.Deploy.github.repository = ''
      }
      if (!T.neStr(Config.Deploy.github.branch)) {
        Config.Deploy.github.branch = 'gh-pages'
      }
      if (!T.neStr(Config.Deploy.github.message)) {
        Config.Deploy.github.message = '🚀 部署！'
      }
      if (!T.neStr(Config.Deploy.github.prefix)) {
        Config.Deploy.github.prefix = ''
      }
      if (!T.arr(Config.Deploy.github.ignoreNames)) {
        Config.Deploy.github.ignoreNames = ['.DS_Store', 'Thumbs.db', '.gitignore', '.gitkeep']
      }
      Config.Deploy.github.ignoreNames = Config.Deploy.github.ignoreNames.filter(T.neStr)
      if (!T.arr(Config.Deploy.github.ignoreExts)) {
        Config.Deploy.github.ignoreExts = []
      }
      Config.Deploy.github.ignoreExts = Config.Deploy.github.ignoreExts.filter(T.neStr)
      if (!T.arr(Config.Deploy.github.ignoreDirs)) {
        Config.Deploy.github.ignoreDirs = ['.git']
      }
      Config.Deploy.github.ignoreDirs = Config.Deploy.github.ignoreDirs.filter(T.neStr)

      if (!T.neStr(Config.Deploy.s3.bucket)) {
        Config.Deploy.s3.bucket = ''
      }
      if (!T.neStr(Config.Deploy.s3.access)) {
        Config.Deploy.s3.access = ''
      }
      if (!T.neStr(Config.Deploy.s3.secret)) {
        Config.Deploy.s3.secret = ''
      }
      if (!T.neStr(Config.Deploy.s3.region)) {
        Config.Deploy.s3.region = 'ap-northeast-1'
      }
      if (!T.neStr(Config.Deploy.s3.prefix)) {
        Config.Deploy.s3.prefix = ''
      }
      if (!T.arr(Config.Deploy.s3.ignoreNames)) {
        Config.Deploy.s3.ignoreNames = ['.DS_Store', 'Thumbs.db', '.gitignore', '.gitkeep']
      }
      Config.Deploy.s3.ignoreNames = Config.Deploy.s3.ignoreNames.filter(T.neStr)
      if (!T.arr(Config.Deploy.s3.ignoreExts)) {
        Config.Deploy.s3.ignoreExts = []
      }
      Config.Deploy.s3.ignoreExts = Config.Deploy.s3.ignoreExts.filter(T.neStr)
      if (!T.arr(Config.Deploy.s3.ignoreDirs)) {
        Config.Deploy.s3.ignoreDirs = ['.git']
      }
      Config.Deploy.s3.ignoreDirs = Config.Deploy.s3.ignoreDirs.filter(T.neStr)
      if (!T.obj(Config.Deploy.s3.putOptions)) {
        Config.Deploy.s3.putOptions = { ACL: 'public-read' }
      }
    })
  },
  argv: async defaultEnv => {
    const env = await cli('取得環境', async cli => {
      cli.cmdSubtitle('取得參數', '-E 或 --env')

      const allow = {
        development: 'Development',
        dev: 'Development',
        beta: 'Beta',
        staging: 'Staging',
        production: 'Production',
        prod: 'Production',
        local: 'Local',
      }

      const argvs = Argv.dash()

      const envs = [
        ...(T.arr(argvs['-E']) ? argvs['-E'] : []),
        ...(T.arr(argvs['--env']) ? argvs['--env'] : []),
      ]
        .reduce((a, b) => a.includes(b) ? a : a.concat(b.toLowerCase()), [])
        .map(env => T.neStr(allow[env]) ? allow[env] : null)
        .filter(env => env !== null)

      return envs.pop() || defaultEnv
    })
    const isMerge = await cli('確認是否合併 Js 與 Css 檔案', async cli => {
      cli.cmdSubtitle('取得參數', '-M 或 --merge')
      const argvs = Argv.dash()
      return T.arr(argvs['-M']) || T.arr(argvs['--merge'])
    })
    const isMinify = await cli('確認是否壓縮 Js 檔案', async cli => {
      cli.cmdSubtitle('取得參數', '-N 或 --minify')
      const argvs = Argv.dash()
      return T.arr(argvs['-N']) || T.arr(argvs['--minify'])
    })
    const vals = await cli('取得傳遞的參數', async cli => {
      cli.cmdSubtitle('取得參數', '{key}={val}')
      return Argv.query()
    })

    return { env, isMerge, isMinify, vals }
  },
  setConfig: async ({ env, isMerge, isMinify, vals, baseUrl, goal = undefined }) => {
    await cli('配置設定檔', async cli => {
      if (goal !== undefined) {
        Object.defineProperty(Config, 'goal', { get() { return goal } })
      }
      Object.defineProperty(Config, 'env', { get() { return env } })
      Object.defineProperty(Config, 'baseUrl', { get() { return baseUrl } })
      Object.defineProperty(Config, 'isMerge', { get() { return isMerge } })
      Object.defineProperty(Config, 'isMinify', { get() { return isMinify } })
      Object.defineProperty(Config, 'vals', { get() { return vals } })

      if (goal !== undefined) {
        cli.cmdSubtitle('goal', Config.goal.type)
      }
      cli.cmdSubtitle('baseUrl', Config.baseUrl)
      cli.cmdSubtitle('env', Config.env)
      cli.cmdSubtitle('merge', Config.isMerge ? 'yes' : 'no')
      cli.cmdSubtitle('minify', Config.isMinify ? 'yes' : 'no')


      for (const key in Config.vals) {
        cli.cmdSubtitle(key, Config.vals[key])
      }
    })
  },
  cssIconScss: async _ => {
    await cli('清空 css 目錄', async cli => {
      cli.cmdSubtitle('執行指令', `rm -rf ${Path.$.rRoot(Config.Source.dir.css, true)}*`)
      await new Promise(
        (resolve, reject) => exec(`rm -rf ${Config.Source.dir.css}*`,
          error => error
            ? reject(new Error(`目錄「${Path.$.rRoot(Config.Source.dir.css, true)}」無法被清空。`, { cause: error }))
            : resolve()))
    })

    await cli('執行 icon 功能', async cli => {
      cli.cmdSubtitle('執行動作', 'verify src/icon/**/style.css')

      const files = await scanFiles(Config.Source.dir.icon, false)
      const icons = await Promise.all(files.filter(({ type }) => type === 'dir').map(({ path }) => path + 'style.css').map(async file => T.err(await tryFunc(Exist.file(file, fs.constants.R_OK))) ? null : file))
      await Promise.all(icons.filter(file => file !== null).map(async file => await FactoryIcon(file).build()))
    })

    await cli('執行 scss 功能', async cli => {
      cli.cmdSubtitle('執行動作', 'verify src/scss/**/*.scss')

      const files = await scanFiles(Config.Source.dir.scss, true)
      await Promise.all(files.filter(({ type, ext, name }) => type === 'file' && ext === '.scss' && !name.startsWith('_')).map(async ({ fullpath }) => await FactoryScss(fullpath).build()))
    })
  },
  build: async _ => {
    await cli('清空輸出目錄', async cli => {
      cli.cmdSubtitle('執行指令', `rm -rf ${Path.$.rRoot(Config.Build.path, true)}`)
      await new Promise((resolve, reject) => exec(`rm -rf ${Config.Build.path}*`, error => error ? reject(new Error(`目錄「${Path.$.rRoot(Config.Source.modelTmpDir, true)}」無法被清空。`, { cause: error })) : resolve()))
    })
    const _files = await cli('掃描開發目錄', async cli => {
      cli.cmdSubtitle('執行動作', `scan ${Path.$.rRoot(Config.Source.path, true)}*`)
      const files = await scanFiles(Config.Source.path, true)
      return files.filter(({ type, fullpath, ext }) => {
        if (type !== 'file') {
          return false
        }

        // 排除 Model
        if (inDir(Config.Source.dir.model, fullpath)) {
          return false
        }

        // 在指定的 Dir 內
        if (Config.Build.copy.dirs.filter(dir => inDir(dir, fullpath)).length) {
          return true
        }

        // 在指定的檔案內
        if (Config.Build.copy.files.includes(fullpath)) {
          return true
        }

        // 允許的副檔名
        return Config.Build.exts.includes(ext)
      }).map(({ fullpath, fullname, path, name, ext }) => {
        const isHtml = inDir(Config.Source.dir.html, fullpath)
        const base = isHtml ? Config.Source.dir.html : Config.Source.path
        const dirs = Path.relative(base, path).split(Path.sep).filter(t => t !== '')
        const model = isHtml ? Concat.file(Config.Source.dir.model, [...dirs, name + '.js'].join(Path.sep)) : null

        const dist = {
          base: Config.Build.path,
          dirs,
          name: fullname,
          get file() { return this.base + [...this.dirs, this.name].join(Path.sep) }
        }

        const src = {
          file: fullpath,
          model
        }

        return { src, dist, ext }
      })
    })

    const files = await cli('整理分類檔案', async cli => {
      cli.cmdSubtitle('執行動作', 'dispatch files')

      return {
        jsFiles: _files.filter(({ ext }) => ext == '.js'),
        cssFiles: _files.filter(({ ext }) => ext == '.css'),
        htmlFiles: _files.filter(({ ext }) => ext == '.html'),
        otherFiles: _files.filter(({ ext }) => !['.css', '.js', '.html', '.php'].includes(ext))
      }
    })

    await cli('建立 .gitignore 檔案', async cli => {
      cli.cmdSubtitle('執行動作', 'create .gitignore file')
      await fs.writeFile(Config.Build.path + '.gitignore', '*\n', { encoding: 'utf8' })
    })

    await cli(`複製${Config.isMinify ? '並壓縮' : ''} CSS 檔案`, async cli => {
      cli.cmdSubtitle('執行動作', `copy${Config.isMinify ? ', and minify' : ''} .css files`)
      cli.total(files.cssFiles.length)

      for (const file of files.cssFiles) {
        const mkdir = await tryFunc(checkDirs(file.dist.base, file.dist.dirs))
        if (T.err(mkdir)) {
          throw new Error(`無法建立 ${Path.$.rRoot(`${Concat.dir(file.dist.base, file.dist.dirs.join(Path.sep), '')}`)}`, { cause: mkdir })
        }
        const content = await tryFunc(fs.readFile(file.src.file, { encoding: 'utf8' }))
        if (T.err(content)) {
          throw new Error(`無法讀取 ${Path.$.rRoot(file.src.file)}`, { cause: content })
        }
        const result = await tryFunc(fs.writeFile(file.dist.file, Config.isMinify ? new MinifyCss().minify(content).styles : content, { encoding: 'utf8' }))
        if (T.err(result)) {
          throw new Error(`無法寫入 ${Path.$.rRoot(file.dist.file)}`, { cause: result })
        }
        cli.advance()
      }
    })

    await cli(`複製${Config.isMinify ? '並壓縮' : ''} JavaScript 檔案`, async cli => {
      cli.cmdSubtitle('執行動作', `copy${Config.isMinify ? ', and minify' : ''} .js files`)
      cli.total(files.jsFiles.length)

      for (const file of files.jsFiles) {
        const mkdir = await tryFunc(checkDirs(file.dist.base, file.dist.dirs))
        if (T.err(mkdir)) {
          throw new Error(`無法建立 ${Path.$.rRoot(`${Concat.dir(file.dist.base, file.dist.dirs.join(Path.sep), '')}`)}`, { cause: mkdir })
        }
        const content = await tryFunc(fs.readFile(file.src.file, { encoding: 'utf8' }))
        if (T.err(content)) {
          throw new Error(`無法讀取 ${Path.$.rRoot(file.src.file)}`, { cause: content })
        }

        let code = content
        if (Config.isMinify) {
          const minified = await Terser.minify(content, { format: { comments: false } })
          if (T.err(minified.error)) {
            throw new Error(`無法壓縮 ${Path.$.rRoot(file.src.file)}`, { cause: minified.error })
          }
          code = _CommentJS + minified.code
        }

        const result = await tryFunc(fs.writeFile(file.dist.file, code, { encoding: 'utf8' }))
        if (T.err(result)) {
          throw new Error(`無法寫入 ${Path.$.rRoot(file.dist.file)}`, { cause: result })
        }
        cli.advance()
      }
    })

    await cli(`編譯後${['複製', Config.isMinify ? '壓縮' : '', Config.isMerge ? '合併' : ''].filter(t => t !== '').join('、')} Html 檔案`, async cli => {
      cli.cmdSubtitle('執行動作', `compile ${['copy', Config.isMinify ? 'minify' : '', Config.isMerge ? 'merge' : ''].filter(t => t !== '').join('、')} .js files`)
      cli.total(files.htmlFiles.length)

      for (const file of files.htmlFiles) {
        const mkdir = await tryFunc(checkDirs(file.dist.base, file.dist.dirs))
        if (T.err(mkdir)) {
          throw new Error(`無法建立 ${Path.$.rRoot(`${Concat.dir(file.dist.base, file.dist.dirs.join(Path.sep), '')}`)}`, { cause: mkdir })
        }

        const content = await tryFunc(_buildHtml(file))
        if (T.err(content)) {
          throw content
        }

        const result = await tryFunc(fs.writeFile(file.dist.file, _CommentHTML + (Config.isMinify ? MinifyHtml(content, { collapseWhitespace: true, continueOnParseError: false }) : content), { encoding: 'utf8' }))
        if (T.err(result)) {
          throw new Error(`無法寫入 ${Path.$.rRoot(file.dist.file)}`, { cause: result })
        }
        cli.advance()
      }
    })

    await cli(`複製其他檔案`, async cli => {
      cli.cmdSubtitle('執行動作', 'copy other files')
      cli.total(files.otherFiles.length)
      for (const file of files.otherFiles) {
        const mkdir = await tryFunc(checkDirs(file.dist.base, file.dist.dirs))
        if (T.err(mkdir)) {
          throw new Error(`無法建立 ${Path.$.rRoot(`${Concat.dir(file.dist.base, file.dist.dirs.join(Path.sep), '')}`)}`, { cause: mkdir })
        }

        const copy = await tryFunc(fs.copyFile(file.src.file, file.dist.file))
        if (T.err(copy)) {
          throw new Error(`無法複製 ${Path.$.rRoot(file.src.file)} 至 ${Path.$.rRoot(file.dist.file)}`, { cause: copy })
        }
        cli.advance()
      }
    })
  },
  error: async error => {
    Print.ln('')
    Print.ln(' 【錯誤訊息】'.red)

    if (T.neStr(error.message)) {
      Print.ln(`   ${'◉'.purple} 錯誤訊息：`, `${error.message}`)
    }

    if (error.cause !== undefined) {
      if (T.err(error.cause) && T.neStr(error.cause.message)) {
        Print.ln(`   ${'◉'.purple} 錯誤原因：`, `${error.cause.message}`)
      }
      if (T.neStr(error.cause)) {
        Print.ln(`   ${'◉'.purple} 錯誤原因：`, `${error.cause}`)
      }
    }

    if (T.neStr(error.stdout)) {
      Print.ln(`   ${'◉'.purple} 錯誤輸出：`, `${error.stdout}`)
    }

    if (T.neStr(error.stack)) {
      Print.ln(`   ${'◉'.purple} 錯誤追蹤：`, '\n\n', `${error.stack}`)
    }
    Print.ln('')
  },
  file: async _ => await cli('判斷平台', async cli => {
    cli.cmdSubtitle('取得參數', '-F 或 --file')
    const _argvs = Argv.dash()

    const files = [
      ...(T.arr(_argvs['-F']) ? _argvs['-F'] : []),
      ...(T.arr(_argvs['--file']) ? _argvs['--file'] : []),
    ].reduce((a, b) => a.includes(b) ? a : a.concat(b), [])

    const file = files.pop()
    if (!T.neStr(file)) {
      return null
    }

    const filepath = Concat.file(Path.$.cmd, `${file}.Deploy.js`)

    const __argvs = await tryFunc(_ => require(filepath))

    if (T.err(__argvs)) {
      return null
    }
    if (!T.arr(__argvs)) {
      return null
    }

    process.argv = [process.argv[0], process.argv[1], ...__argvs]
    return
  }),
  goal: async _ => await cli('判斷平台', async cli => {
    cli.cmdSubtitle('取得參數', '-G 或 --goal')

    const allow = {
      s3: 's3',
      gh: 'github',
      github: 'github',
      'gh-pages': 'github',
    }

    const argvs = Argv.dash()

    const goals = [
      ...(T.arr(argvs['-G']) ? argvs['-G'] : []),
      ...(T.arr(argvs['--goal']) ? argvs['--goal'] : []),
    ].reduce((a, b) => a.includes(b) ? a : a.concat(b.toLowerCase()), [])
      .map(env => T.neStr(allow[env]) ? allow[env] : null)
      .filter(env => env !== null)

    const goal = goals.pop()

    if (goal == 's3') {
      return {
        type: 's3',
        bucket: await _Goal.bucket(Config, cli),
        access: await _Goal.access(Config, cli),
        secret: await _Goal.secret(Config, cli),
        region: await _Goal.region(Config, cli),
      }
    }

    if (goal == 'github') {
      return {
        type: 'github',
        account: await _Goal.account(Config, cli),
        repository: await _Goal.repository(Config, cli),
        branch: await _Goal.branch(Config, cli),
        message: await _Goal.message(Config, cli),
      }
    }

    throw new Error('請給予部署目標，請使用參數 -G 或 --goal 來設定網址。', '共有兩種可以設定，分別是 s3 或 github')
  })
}