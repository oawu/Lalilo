/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
  Source: {
    path: 'src',

    dir: { // 開發目錄
      js: 'js',       // js
      css: 'css',     // css
      img: 'img',     // 圖片
      icon: 'icon',   // 圖示
      scss: 'scss',   // scss
      html: 'html',   // html
      model: 'model' // html
    },

    iconDirInScss: 'icon',
    modelTmpDir: '_model'
  },

  Server: {
    watch: { // Live reload
      exts: ['.html', '.css', '.js'], // 監聽的副檔名
      ignoreDirs: ['icon'] // 不監聽的目錄
    },

    server: {
      domain: '127.0.0.1', // 開發伺服器域名

      port: { // 開發伺服器端口
        min: 8000,
        max: 8999,
        default: 8000
      },

      utf8Exts: [ // 採用 utf8 編碼的副檔名
        '.html', '.css', '.js', '.json', '.txt'
      ]
    }
  },

  Build: {
    path: 'dist',

    jsMinify: { // JS minify 時外加的轉譯
      comments: false,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '> 0.25%, not dead', // 可自訂 target
            useBuiltIns: 'usage',
            corejs: 3
          }
        ]
      ]
    },

    copy: {
      // files: ['CNAME'], // 包含檔案
      // dirs: [''] // 包含目錄
    },

    exts: [ // 允許的副檔名
      '.html', '.txt', '.xml', '.json',
      '.css', '.js',
      '.eot', '.svg', '.ttf', '.woff',
      '.png', '.jpg', '.jpeg', '.gif', '.ico'
    ]
  },

  Deploy: {
    github: {
      account: '',
      repository: '',
      branch: 'gh-pages',
      message: '🚀 部署！',

      prefix: '',

      ignoreNames: ['.DS_Store', 'Thumbs.db', '.gitignore', '.gitkeep'], // 忽略的檔案
      ignoreExts: [], // 忽略的副檔名
      ignoreDirs: ['.git'], // 忽略的目錄
    },

    s3: {
      bucket: '',
      access: '',
      secret: '',
      region: '',

      prefix: '',

      ignoreNames: ['.DS_Store', 'Thumbs.db', '.gitignore', '.gitkeep'], // 忽略的檔案
      ignoreExts: [], // 忽略的副檔名
      ignoreDirs: ['.git'], // 忽略的目錄

      putOptions: {
        ACL: 'public-read',
        // CacheControl: 'max-age=5', // Cache 時間
      }
    }
  },
  get Comments () {
    return [
      `@author      OA Wu <oawu.tw@gmail.com>`,
      `@copyright   Copyright (c) 2015 - ${new Date().getFullYear()}, Lalilo`,
      `@license     http://opensource.org/licenses/MIT  MIT License`,
      `@link        https://www.ioa.tw/`,
    ]
  },
}