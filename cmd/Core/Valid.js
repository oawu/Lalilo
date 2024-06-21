/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const FileSystem = require('fs')
const Path       = require('path')
const crypto     = require('crypto')
const Handlebars = require('handlebars')

const cli        = require('@oawu/cli-progress')
const Queue      = require('@oawu/queue')
const Dog        = require('@oawu/dog')

const Helper     = require('@oawu/_Helper')
const Config     = require('@oawu/_Config')
const Sigint     = require('@oawu/_Sigint')

const buildHtml = (file, closure) => {
  const dog = Dog().bite(food => {
    if (food instanceof Error) {
      return closure([null, food], null)
    }

    if (Array.isArray(food) && food.length) {
      return closure([null, ...food], null)
    }

    if (food) {
      return closure([], food)
    }
  })

  FileSystem.readFile(file.src, 'utf8', (error, data) => {
    if (error) {
      return dog.eat([null, `無法讀取 ${Path.$.rRoot(file.src)}`, error])
    }
    if (file.model === null) {
      return dog.eat(data)
    }

    const _input = FileSystem.createReadStream(file.model)
    _input.on('error', error => dog.eat([null, `無法讀取 ${Path.$.rRoot(file.model)}`, error]))

    const _output = crypto.createHash('md5')

    _output.once('readable', _ => {
      const tmp = `${Config.Source.modelTmpDir}${_output.read().toString('hex')}.js`
      
      FileSystem.copyFile(file.model, tmp, error => {
        if (error) {
          return dog.eat([null, '無法複製 Model', error])
        }

        let exp = null
        try {
          exp = require(tmp)
          error = null
        } catch (e) {
          error = e
          exp = null
        }
        FileSystem.unlink(tmp, _ => {})

        if (error) {
          return dog.eat([null, '執行 Model 錯誤', error])
        }

        const template = Handlebars.compile(data)
        dog.eat(template(exp))
      })
    })
    _input.pipe(_output)
  })
}
module.exports = {
  Path: (closure = null) => {
    cli.title('定義路徑結構')

    Path.$ = {
      root: `${Path.resolve(__dirname, ('..' + Path.sep).repeat(2))}${Path.sep}`,
      cmd:  `${Path.resolve(__dirname, ('..' + Path.sep).repeat(1))}${Path.sep}`, 
      rRoot (path, isDir = false) {
        return `${Path.relative(this.root, path)}${isDir ? Path.sep : ''}`
      }
    }

    cli.appendTitle(Helper.Display.cmd('根目錄', Path.$.root))
    cli.appendTitle(Helper.Display.cmd('CMD 目錄', Path.$.cmd))
    cli.done()

    if (Helper.Type.isFunction(closure)) {
      closure()
    }
  },
  Config: (closure = null) => {
    cli.title('載入設定檔')
       .appendTitle(Helper.Display.cmd('路徑', `${Path.$.root}Core${Path.sep}Config.js`))

    let Config = null
    let error = null
    try {
      Config = require('@oawu/_Config')
      error = null
    } catch (e) {
      error = e
      Config = null
    }

    if (Helper.Type.isError(error)) {
      return cli.fail(null, '載入設定檔失敗。', error)
    }

    if (!Helper.Type.isObject(Config)) {
      return cli.fail(null, '設定檔案格式錯誤(1)。')
    }

    if (!Helper.Type.isObject(Config.Source)) {
      return cli.fail(null, '設定檔案格式錯誤(2)。')
    }

    if (!Helper.Type.isObject(Config.Serve)) {
      return cli.fail(null, '設定檔案格式錯誤(3)。')
    }

    cli.done()

    if (Helper.Type.isFunction(closure)) {
      closure(Config)
    }
  },
  
  Source: (closure, Config) => {
    cli.title('檢查設定檔內 Source 的格式')
    cli.appendTitle(Helper.Display.cmd('檢查', '入口路徑是否正確'))


    Config.Source.path = `${Path.$.root}${Helper.Fs.dirOrEmpty(Helper.Type.isNotEmptyString(Config.Source.path)
      ? Config.Source.path
      : 'src')}`

    cli.appendTitle(Helper.Display.cmd('檢查', '入口路徑是否有讀取權限'))

    if (!Helper.Fs.access(Config.Source.path)) {
      return cli.fail(null, `沒有「${Path.$.rRoot(Config.Source.path, true)}」讀取權限。`)
    }

    cli.appendTitle(Helper.Display.cmd('檢查', '入口路徑是否為目錄'))

    if (!Helper.Fs.isDirectory(Config.Source.path)) {
      return cli.fail(null, `路徑「${Path.$.rRoot(Config.Source.path, true)}」不是目錄類型。`)
    }

    cli.appendTitle(Helper.Display.cmd('檢查', '開發目錄設定'))


    if (!Helper.Type.isObject(Config.Source.dir)) {
      return cli.fail(null, `開發目錄「Config.Source.dir」格式錯誤。`)
    }

    const r  = FileSystem.constants.R_OK
    const rw = r | FileSystem.constants.W_OK
    const config = {
      js:    { dir: 'js',    permission: r },
      css:   { dir: 'css',   permission: rw },
      img:   { dir: 'img',   permission: r },
      icon:  { dir: 'icon',  permission: r },
      scss:  { dir: 'scss',  permission: rw },
      html:  { dir: 'html',  permission: r },
      model: { dir: 'model', permission: r },
    }

    for (let key in config) {
      const dir = Helper.Type.isNotEmptyString(Config.Source.dir[key]) ? Config.Source.dir[key] : config[key].dir
      Config.Source.dir[key] = `${Config.Source.path}${Helper.Fs.dirOrEmpty(dir)}`

      if (!Helper.Fs.exists(Config.Source.dir[key])) {
        Helper.Fs.mkdir(Config.Source.dir[key])
      }
      
      if (!Helper.Fs.access(Config.Source.dir[key], config[key].permission)) {
        return cli.fail(null, `沒有「${Path.$.rRoot(Config.Source.dir[key], true)}」目錄的「${config[key].permission == rw ? '讀寫' : '讀取'}」權限。`)
      }
      
      if (!Helper.Fs.isDirectory(Config.Source.dir[key])) {
        return cli.fail(null, `路徑「${Path.$.rRoot(Config.Source.dir[key], true)}」不是目錄類型。`)
      }
    }

    cli.appendTitle(Helper.Display.cmd('檢查', '在 scss 中的圖示目錄'))

    Config.Source.iconDirInScss = `${Config.Source.dir.scss}${Helper.Fs.dirOrEmpty(Helper.Type.isNotEmptyString(Config.Source.iconDirInScss) ? Config.Source.iconDirInScss : '')}`

    if (!Helper.Fs.exists(Config.Source.iconDirInScss)) {
      Helper.Fs.mkdir(Config.Source.iconDirInScss)
    }

    if (!Helper.Fs.access(Config.Source.iconDirInScss, FileSystem.constants.R_OK | FileSystem.constants.W_OK)) {
      return cli.fail(null, `沒有「${Path.$.rRoot(Config.Source.iconDirInScss, true)}」目錄的「讀寫」權限。`)
    }

    if (!Helper.Fs.isDirectory(Config.Source.iconDirInScss)) {
      return cli.fail(null, `路徑「${Path.$.rRoot(Config.Source.iconDirInScss, true)}」不是目錄類型。`)
    }

    cli.appendTitle(Helper.Display.cmd('檢查', '在 Model 暫存目錄'))

    Config.Source.modelTmpDir = `${Path.$.cmd}${Helper.Fs.dirOrEmpty(Helper.Type.isNotEmptyString(Config.Source.modelTmpDir) ? Config.Source.modelTmpDir : '_model')}`

    if (!Helper.Fs.exists(Config.Source.modelTmpDir)) {
      Helper.Fs.mkdir(Config.Source.modelTmpDir)
    }

    if (!Helper.Fs.access(Config.Source.modelTmpDir, FileSystem.constants.R_OK | FileSystem.constants.W_OK)) {
      return cli.fail(null, `沒有「${Path.$.rRoot(Config.Source.modelTmpDir, true)}」目錄的「讀寫」權限。`)
    }

    if (!Helper.Fs.isDirectory(Config.Source.modelTmpDir)) {
      return cli.fail(null, `路徑「${Path.$.rRoot(Config.Source.modelTmpDir, true)}」不是目錄類型。`)
    }

    const dog = Dog().bite(food => {
      if (food instanceof Error) {
        return cli.fail(null, food)
      }

      if (Array.isArray(food) && food.length) {
        return cli.fail(null, ...food)
      }

      cli.done()

      Sigint.push(_closure => require('child_process').exec(`rm -rf ${Config.Source.modelTmpDir}*`, _ => _closure()))

      if (Helper.Type.isFunction(closure)) {
        closure(Config)
      }
    })

    require('child_process')
      .exec(`rm -rf ${Config.Source.modelTmpDir}*`, error => {

        if (error) {
          return dog.eat([`目錄「${Path.$.rRoot(Config.Source.modelTmpDir, true)}」無法被清空。`, error])
        }

        FileSystem.writeFile(`${Config.Source.modelTmpDir}.gitignore`, `*`, error => {
          if (error) {
            return dog.eat([`目錄「${Path.$.rRoot(Config.Source.modelTmpDir, true)}」內無法建立「.gitignore」。`])
          }

          dog.eat(null)
        })
      })
  },

  Serve: (closure, Config) => {
    cli.title('檢查設定檔內 Serve 的格式')
    cli.appendTitle(Helper.Display.cmd('檢查', '是否需要開啟瀏覽器'))

    Config.Serve.autoOpenBrowser = typeof Config.Serve.autoOpenBrowser == 'boolean'
      ? Config.Serve.autoOpenBrowser
      : false

    cli.appendTitle(Helper.Display.cmd('檢查', '監聽設定'))

    if (!Helper.Type.isObject(Config.Serve.watch)) {
      Config.Serve.watch = {}
    }

    Config.Serve.watch.exts = Array.isArray(Config.Serve.watch.exts)
      ? Config.Serve.watch.exts
      : ['.html', '.css', '.js']

    Config.Serve.watch.exts = Config.Serve.watch.exts.map(format => format.toLowerCase())

    Config.Serve.watch.ignoreDirs = (Array.isArray(Config.Serve.watch.ignoreDirs) ? Config.Serve.watch.ignoreDirs : ['icon'])
      .map(dir => `${Config.Source.path}${Helper.Fs.dirOrEmpty(dir)}`)
      .filter(dir => Helper.Fs.access(dir) && Helper.Fs.exists(dir))

    cli.appendTitle(Helper.Display.cmd('檢查', '伺服器設定'))

    if (!Helper.Type.isObject(Config.Serve.server)) {
      Config.Serve.server = {}
    }

    Config.Serve.server.domain = (Helper.Type.isNotEmptyString(Config.Serve.server.domain)
      ? Config.Serve.server.domain
      : '127.0.0.1').replace(/\/+$/, '')

    if (!Helper.Type.isObject(Config.Serve.server.port)) {
      Config.Serve.server.port = {}
    }


    Config.Serve.server.port.min = typeof Config.Serve.server.port.min == 'number'
      ? Config.Serve.server.port.min
      : 8000
    Config.Serve.server.port.max = typeof Config.Serve.server.port.max == 'number'
      ? Config.Serve.server.port.max
      : 8999
    Config.Serve.server.port.default = typeof Config.Serve.server.port.default == 'number'
      ? Config.Serve.server.port.default
      : 8000
    Config.Serve.server.port.value = typeof Config.Serve.server.port.value == 'number'
      ? Config.Serve.server.port.value
      : Config.Serve.server.port.default
    Config.Serve.server.utf8Exts = Array.isArray(Config.Serve.server.utf8Exts)
      ? Config.Serve.server.utf8Exts
      : ['.html', '.css', '.js', '.json', '.txt']


    cli.appendTitle(Helper.Display.cmd('設定', 'asset dir'))
    Object.defineProperty(Config, 'assetDir', { get () { return {
      css: Config.Source.dir.css,
      js: Config.Source.dir.js,
      entry: Config.Source.path,
    } } })

    cli.done()

    if (Helper.Type.isFunction(closure)) {
      closure(Config)
    }

  },
  Build: (closure, Config) => {
    cli.title('檢查設定檔內 Build 的格式')

    cli.appendTitle(Helper.Display.cmd('檢查', '出口路徑是否正確'))


    Config.Build.path = `${Path.$.root}${Helper.Fs.dirOrEmpty(Helper.Type.isNotEmptyString(Config.Build.path)
      ? Config.Build.path
      : 'dist')}`

    if (!Helper.Fs.exists(Config.Build.path)) {
      Helper.Fs.mkdir(Config.Build.path)
    }

    cli.appendTitle(Helper.Display.cmd('檢查', '出口路徑是否有讀取權限'))

    if (!Helper.Fs.access(Config.Build.path)) {
      return cli.fail(null, `沒有「${Path.$.rRoot(Config.Build.path, true)}」讀取權限。`)
    }

    cli.appendTitle(Helper.Display.cmd('檢查', '出口路徑是否為目錄'))

    if (!Helper.Fs.isDirectory(Config.Build.path)) {
      return cli.fail(null, `路徑「${Path.$.rRoot(Config.Build.path, true)}」不是目錄類型。`)
    }

    cli.appendTitle(Helper.Display.cmd('檢查', '是否需要開啟目錄'))

    Config.Serve.autoOpenFolder = typeof Config.Serve.autoOpenFolder == 'boolean'
      ? Config.Serve.autoOpenFolder
      : false

    cli.appendTitle(Helper.Display.cmd('檢查', 'Javascript 壓縮設定'))

    Config.Build.jsMinify = Helper.Type.isObject(Config.Build.jsMinify)
      ? Config.Build.jsMinify
      : []

    cli.appendTitle(Helper.Display.cmd('檢查', '複製檔案與目錄路徑'))

    if (!Helper.Type.isObject(Config.Build.copy)) {
      Config.Build.copy = { files: [], dirs: [] }
    }

    Config.Build.copy.files = Array.isArray(Config.Build.copy.files)
      ? Config.Build.copy.files
      : []

    Config.Build.copy.files = Config.Build.copy.files.map(path => {
      if (!Helper.Type.isNotEmptyString(path)) {
        return null
      }

      path = Helper.Fs.fileOrEmpty(path)
      return Helper.Type.isNotEmptyString(path)
        ? `${Config.Source.path}${path}`
        : null
    }).filter(t => t !== null)


    Config.Build.copy.dirs = Array.isArray(Config.Build.copy.dirs)
      ? Config.Build.copy.dirs
      : []

    Config.Build.copy.dirs = Config.Build.copy.dirs.map(path => {
      if (!Helper.Type.isNotEmptyString(path)) {
        return null
      }

      path = Helper.Fs.dirOrEmpty(path)
      return Helper.Type.isNotEmptyString(path)
        ? `${Config.Source.path}${path}`
        : null
    }).filter(t => t !== null)

    cli.appendTitle(Helper.Display.cmd('檢查', '允許的副檔名'))

    Config.Build.exts = Array.isArray(Config.Build.exts)
      ? Config.Build.exts
      : ['.html', '.txt', '.xml', '.json', '.css', '.js', '.eot', '.svg', '.ttf', '.woff', '.png', '.jpg', '.jpeg', '.gif', '.ico']

    Config.Build.exts = Config.Build.exts.map(ext => ext.toLowerCase())

    cli.appendTitle(Helper.Display.cmd('設定', 'asset dir'))
    Object.defineProperty(Config, 'assetDir', { get () { return {
      css: `${Config.Build.path}${Helper.Fs.dirOrEmpty(Path.relative(Config.Source.path, Config.Source.dir.css))}`,
      js: `${Config.Build.path}${Helper.Fs.dirOrEmpty(Path.relative(Config.Source.path, Config.Source.dir.js))}`,
      entry: `${Config.Build.path}${Helper.Fs.dirOrEmpty(Path.relative(Config.Source.path, Config.Source.path))}`,
    } } })

    cli.done()

    if (Helper.Type.isFunction(closure)) {
      closure(Config)
    }
  },
  Deploy: (closure, Config) => {
    cli.title('檢查設定檔內 Deploy 的格式')

    if (!Helper.Type.isObject(Config.Deploy)) {
      Config.Deploy = { github: {}, s3: {} }
    }

    if (!Helper.Type.isObject(Config.Deploy.s3)) {
      Config.Deploy.s3 = {
        bucket: '',
        access: '',
        secret: '',
        region: 'ap-northeast-1',

        prefix: '',

        ignoreNames: [],
        ignoreExts: [],
        ignoreDirs: [],

        putOptions: { ACL: 'public-read' },
      }
    }

    if (!Helper.Type.isObject(Config.Deploy.github)) {
      Config.Deploy.github = {
        account:    '',
        repository: '',
        branch:     'gh-pages',
        message:    '🚀 部署！',

        prefix: '',

        ignoreNames: [], // 忽略的檔案
        ignoreExts: [], // 忽略的副檔名
        ignoreDirs: [], // 忽略的目錄
      }
    }

    Config.Deploy.s3.bucket = Helper.Type.isNotEmptyString(Config.Deploy.s3.bucket) ? Config.Deploy.s3.bucket : ''
    Config.Deploy.s3.access = Helper.Type.isNotEmptyString(Config.Deploy.s3.access) ? Config.Deploy.s3.access : ''
    Config.Deploy.s3.secret = Helper.Type.isNotEmptyString(Config.Deploy.s3.secret) ? Config.Deploy.s3.secret : ''
    Config.Deploy.s3.region = Helper.Type.isNotEmptyString(Config.Deploy.s3.region) ? Config.Deploy.s3.region : 'ap-northeast-1'

    Config.Deploy.s3.prefix = Helper.Type.isNotEmptyString(Config.Deploy.s3.prefix) ? Config.Deploy.s3.prefix : ''

    Config.Deploy.s3.ignoreNames = Array.isArray(Config.Deploy.s3.ignoreNames) ? Config.Deploy.s3.ignoreNames.filter(t => Helper.Type.isNotEmptyString(t)) : []
    Config.Deploy.s3.ignoreExts  = Array.isArray(Config.Deploy.s3.ignoreExts) ? Config.Deploy.s3.ignoreExts.filter(t => Helper.Type.isNotEmptyString(t)) : []
    Config.Deploy.s3.ignoreDirs  = Array.isArray(Config.Deploy.s3.ignoreDirs) ? Config.Deploy.s3.ignoreDirs.filter(t => Helper.Type.isNotEmptyString(t)) : []
    Config.Deploy.s3.putOptions  = Helper.Type.isObject(Config.Deploy.s3.putOptions) ? Config.Deploy.s3.putOptions : { ACL: 'public-read' }

    Config.Deploy.github.account    = Helper.Type.isNotEmptyString(Config.Deploy.github.account)    ? Config.Deploy.github.account    : ''
    Config.Deploy.github.repository = Helper.Type.isNotEmptyString(Config.Deploy.github.repository) ? Config.Deploy.github.repository : ''
    Config.Deploy.github.branch     = Helper.Type.isNotEmptyString(Config.Deploy.github.branch)     ? Config.Deploy.github.branch     : 'gh-pages'
    Config.Deploy.github.message    = Helper.Type.isNotEmptyString(Config.Deploy.github.message)    ? Config.Deploy.github.message    : '🚀 部署！'

    Config.Deploy.github.prefix     = Helper.Type.isNotEmptyString(Config.Deploy.github.prefix)     ? Config.Deploy.github.prefix     : ''

    Config.Deploy.github.ignoreNames = Array.isArray(Config.Deploy.github.ignoreNames) ? Config.Deploy.github.ignoreNames.filter(t => Helper.Type.isNotEmptyString(t)) : []
    Config.Deploy.github.ignoreExts  = Array.isArray(Config.Deploy.github.ignoreExts)  ? Config.Deploy.github.ignoreExts.filter(t => Helper.Type.isNotEmptyString(t))  : []
    Config.Deploy.github.ignoreDirs  = Array.isArray(Config.Deploy.github.ignoreDirs)  ? Config.Deploy.github.ignoreDirs.filter(t => Helper.Type.isNotEmptyString(t))  : []

    cli.done()

    if (Helper.Type.isFunction(closure)) {
      closure(Config)
    }
  },
  _CssIconScss: (closure, Config) => {
    Helper.Print.ln(`\n ${'【編譯檔案】'.yellow}`)

    Queue()
      .enqueue(next => {
        cli.title('清空 css 目錄')
        cli.appendTitle(Helper.Display.cmd('執行指令', `rm -rf ${Path.$.rRoot(Config.Source.dir.css, true)}*`))

        require('child_process').exec('rm -rf ' + Config.Source.dir.css + '*', error => error
          ? cli.fail(null, error)
          : next(cli.done()))
      })
      .enqueue(next => {
        cli.title('執行 icon 功能')
        cli.appendTitle(Helper.Display.cmd('執行動作', 'verify src/icon/**/style.css'))

        const FactoryIcon = require('@oawu/_FactoryIcon')

        const dog = Dog().bite(food => {
          if (food instanceof Error) {
            return cli.fail(null, food)
          }

          if (Array.isArray(food) && food.length) {
            return cli.fail(null, ...food)
          }

          next(cli.done())
        })

        Promise.all(Helper.Fs.scanDirSync(Config.Source.dir.icon, false)
          .map(path => `${path}${Path.sep}style.css`)
          .filter(file => Helper.Fs.exists(file))
          .map(file => new Promise((resolve, reject) => FactoryIcon(file).build(errors => errors.length > 0
            ? reject(errors)
            : resolve()))))
        .then(_ => dog.eat())
        .catch(dog.eat)

      })
      .enqueue(next => {
        cli.title('執行 scss 功能')
        cli.appendTitle(Helper.Display.cmd('執行動作', 'verify src/scss/**/*.scss'))

        const FactoryScss = require('@oawu/_FactoryScss')

        const dog = Dog().bite(food => {
          if (food instanceof Error) {
            return cli.fail(null, food)
          }

          if (Array.isArray(food) && food.length) {
            return cli.fail(null, ...food)
          }
  
          next(cli.done())
        })

        Promise.all(Helper.Fs.scanDirSync(Config.Source.dir.scss)
          .filter(file => Path.extname(file) == '.scss')
          .map(file => new Promise((resolve, reject) => FactoryScss(file).build(errors => errors.length > 0
            ? reject(errors)
            : resolve()))))
        .then(_ => dog.eat())
        .catch(dog.eat)
      })
      .enqueue(next => closure(Config, next()))
  },
  
  _Build: (closure, Config) => {
    Helper.Print.ln(`\n ${'【編譯並輸出目錄】'.yellow}`)

    Queue()
      .enqueue(next => {
        cli.title('清空輸出目錄')
        cli.appendTitle(Helper.Display.cmd('執行指令', `rm -rf ${Path.$.rRoot(Config.Build.path, true)}`))

        require('child_process').exec(`rm -rf ${Config.Build.path}*`, error => {
          if (error) {
            return cli.fail(null, '錯誤', error)
          }
          cli.done()
          next()
        })
      })
      .enqueue(next => {
        cli.title('掃描開發目錄')
        cli.appendTitle(Helper.Display.cmd('執行動作', `scan ${Path.$.rRoot(Config.Source.path, true)}*`))

        let files = Helper.Fs.scanDirSync(Config.Source.path)
          .map(src => ({
            src,
            ext: Path.extname(src).toLowerCase()
          }))
          .filter(({ src, ext }) => {
            // 排除 Model
            if (Helper.Fs.inDir(Config.Source.dir.model, src)) {
              return false
            }

            // 在指定的 Dir 內
            if (Config.Build.copy.dirs.filter(dir => Helper.Fs.inDir(dir, src)).length) {
              return true
            }

            // 在指定的檔案內
            if (Config.Build.copy.files.includes(src)) {
              return true
            }

            // 允許的副檔名
            return Config.Build.exts.includes(ext)
          })
          .map(file => {
            const isHtml = Helper.Fs.inDir(Config.Source.dir.html, file.src)
            const base = isHtml ? Config.Source.dir.html : Config.Source.path
            const dirs = Helper.Fs.deSlash(Path.relative(base, Path.dirname(file.src)))
            const name = Path.basename(file.src, file.ext)
            const model = `${Config.Source.dir.model}${Helper.Fs.dirOrEmpty(dirs.join(Path.sep))}${name}.js`

            return {
              ...file,
              model: isHtml && Helper.Fs.exists(model) ? model : null,
              dist: {
                base: Config.Build.path,
                dirs: dirs,
                name: `${name}${file.ext}`,
                get path () { return this.base + [...this.dirs, this.name].join(Path.sep) }
              }
            }
          })

        cli.done()

        cli.title('整理分類檔案')
        cli.appendTitle(Helper.Display.cmd('執行動作', `dispatch files`))

        files = {
          jsFiles: files.filter(({ ext }) => ext == '.js'),
          cssFiles: files.filter(({ ext }) => ext == '.css'),
          htmlFiles: files.filter(({ ext }) => ext == '.html'),
          otherFiles: files.filter(({ ext }) => !['.css', '.js', '.html', '.php'].includes(ext))
        }
        
        cli.done()
        next(files)
      })
      .enqueue((next, files) => {
        cli.title('建立 .gitignore 檔案')
        cli.appendTitle(Helper.Display.cmd('執行動作', 'create .gitignore file'))

        FileSystem.writeFile(`${Config.Build.path}.gitignore`, `*\n`, 'utf8', error => {
          if (error) {
            return cli.fail(null, '建立 .gitignore 時發生錯誤！', error)
          }
          cli.done()
          next(files)
        })
      })
      .enqueue((next, files) => {
        cli.title(`複製${Config.isMinify ? '並壓縮' : ''} CSS 檔案`)
        cli.appendTitle(Helper.Display.cmd('執行動作', `copy${Config.isMinify ? ', and minify' : ''} .css files`))
        cli.total(files.cssFiles.length)

        const Minify = require('clean-css')
        const queue = Queue()

        files.cssFiles.forEach(file => {
          queue.enqueue(_next => {
            if (!Helper.Fs.checkDirsExist(file.dist.base, file.dist.dirs)) {
              return cli.fail(null, `無法建立 ${Path.$.rRoot(`${file.dist.base}${Helper.Fs.dirOrEmpty(file.dist.dirs.join(Path.sep))}`)}`, error)
            }
            
            FileSystem.readFile(file.src, 'utf8', (error, data) => {
              if (error) {
                return cli.fail(null, `無法讀取 ${Path.$.rRoot(file.src)}`, error)
              }

              FileSystem.writeFile(file.dist.path, Config.isMinify
                ? new Minify().minify(data).styles
                : data, 'utf8', error => {
                  
                  if (error) {
                    return cli.fail(null, `無法寫入 ${Path.$.rRoot(file.dist.path)}`, error)
                  }

                  _next(cli.advance)
              })
            })
          })
        })

        queue.enqueue(_next => next(files, cli.done(), _next()))
      })
      .enqueue((next, files) => {
        cli.title(`複製 JavaScript 檔案`)
        cli.appendTitle(Helper.Display.cmd('執行動作', `copy .js files`))
        cli.total(files.jsFiles.length)
        
        const Babel = require("@babel/core")
        const queue = Queue()

        files.jsFiles.forEach(file => {
          queue.enqueue(_next => {
            if (!Helper.Fs.checkDirsExist(file.dist.base, file.dist.dirs)) {
              return cli.fail(null, `無法建立 ${Path.$.rRoot(`${file.dist.base}${Helper.Fs.dirOrEmpty(file.dist.dirs.join(Path.sep))}`)}`, error)
            }

            FileSystem.readFile(file.src, 'utf8', (error, data) => {
              if (error) {
                return cli.fail(null, `無法讀取 ${Path.$.rRoot(file.src)}`, error)
              }

              FileSystem.writeFile(file.dist.path, data, 'utf8', error => {
                  if (error) {
                    return cli.fail(null, `無法寫入 ${Path.$.rRoot(file.dist.path)}`, error)
                  }

                  _next(cli.advance)
              })
            })
          })
        })

        queue.enqueue(_next => next(files, cli.done(), _next()))
      })
      .enqueue((next, files) => {
        cli.title(`編譯後${['複製', Config.isMinify ? '壓縮' : '', Config.isMerge ? '合併' : ''].filter(t => t !== '').join('、')} Html 檔案`)
        cli.appendTitle(Helper.Display.cmd('執行動作', `compile ${['copy', Config.isMinify ? 'minify' : '', Config.isMerge ? 'merge' : ''].filter(t => t !== '').join('、')} .js files`))
        cli.total(files.htmlFiles.length)

        const Minify = require('html-minifier').minify
        const queue = Queue()

        files.htmlFiles.forEach(file => {
          queue.enqueue(_next => {
            if (!Helper.Fs.checkDirsExist(file.dist.base, file.dist.dirs)) {
              return cli.fail(null, `無法建立 ${Path.$.rRoot(`${file.dist.base}${Helper.Fs.dirOrEmpty(file.dist.dirs.join(Path.sep))}`)}`, error)
            }

            buildHtml(file, (errors, data) => {
              if (errors.length) {
                return cli.fail(null, ...errors)
              }

              FileSystem.writeFile(file.dist.path, Config.isMinify
                ? Minify(data, { collapseWhitespace: true, continueOnParseError: false })
                : data, 'utf8', error => {

                  if (error) {
                    return cli.fail(null, `無法寫入 ${Path.$.rRoot(file.dist.path)}`, error)
                  }

                  _next(cli.advance)
              })
            })
          })
        })

        queue.enqueue(_next => next(files, cli.done(), _next()))
      })
      .enqueue((next, files) => {
        cli.title(`複製其他檔案`)
        cli.appendTitle(Helper.Display.cmd('執行動作', `copy other files`))
        cli.total(files.otherFiles.length)

        const queue = Queue()
        files.otherFiles.forEach(file => {
          queue.enqueue(_next => {
            if (!Helper.Fs.checkDirsExist(file.dist.base, file.dist.dirs)) {
              return cli.fail(null, `無法建立 ${Path.$.rRoot(`${file.dist.base}${Helper.Fs.dirOrEmpty(file.dist.dirs.join(Path.sep))}`)}`, error)
            }

            FileSystem.copyFile(file.src, file.dist.path, error => {
              if (error) {
                return cli.fail(null, `無法複製 ${Path.$.rRoot(file.src)} 至 ${file.dist.path}`, error)
              }

              _next(cli.advance)
            })
          })
        })

        queue.enqueue(_next => next(files, cli.done(), _next()))
      })
      .enqueue(next => closure(Config, next()))
  }
}
