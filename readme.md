# Lalilo

版本：2.0.1

用自己做出來的工具開發，就想再品嚐自己做的一道菜，美味只有自己知道。

## 說明

這是一套 [OA Wu](https://www.ioa.tw/) 所製作的個人網頁前端框架，主功能是快速編寫網頁。
主要語言為 [HTML](https://zh.wikipedia.org/zh-tw/HTML)、[SCSS](https://sass-lang.com/guide)、[JsvaScript](https://zh.wikipedia.org/wiki/JavaScript) 的框架，並寫在 `cmd` 目錄可使用 `Node.js` 協助開發，使用之前只需要安裝 [Node.js](https://nodejs.org/)。

## 環境

* 需要可以執行 `node` 指令的環境。

### 安裝

* MacOS
  * Node.js ─ 請參考 [Node.js](https://www.ioa.tw/macOS/Node.js.html)

## 開發

1. 終端機進入專案目錄下的 `cmd` 目錄。
2. 第一次使用請先於 `cmd` 目錄下執行指令 `npm install .`，接著繼續於 `cmd` 目錄內再執行指令 `node Serve.js` 即可。
3. 開發皆在 `src` 目錄內開發。

### 參數

* `--env` 縮寫 `-E`，用來代表「環境」，分別有 `Development`、`Testing`、`Staging`、`Production`，預設為 `Development`，可在 `Config.env` 提取使用。
* `--merge`，是否將 css 與 js 合併至 HTML 的參數，可在 `Config.isMerge` 提取使用。
* `--val-{key}={val}`，過度資料使用，可在 `Config.argVals` 提取使用。


## 編譯

1. 終端機進入專案目錄下的 `cmd` 目錄。
2. 在 `cmd` 目錄下執行指令 `node Build.js` 即可。
3. 結果會產生在 `dist` 目錄內。

### 參數

* `--env` 縮寫 `-E`，用來代表「環境」，分別有 `Development`、`Testing`、`Staging`、`Production`，預設為 `Production`，可在 `Config.env` 提取使用。
* `--merge`，是否將 css 與 js 合併至 HTML 的參數，可在 `Config.isMerge` 提取使用。
* `--val-{key}={val}`，過度資料使用，可在 `Config.argVals` 提取使用。
* `--url` 縮寫 `-U`，用來代表「baseUrl」，若不給予則為 **空字串**，可在 `Config.baseUrl` 提取使用。
* `--isMinify`，是否壓縮 css 與 js 檔案，可在 `Config.isMinify` 提取使用。

## 部署

### 參數

* `--goal` 縮寫 `-G`，代表平台，有 `github` 與 `s3` 兩個項目，分別代表部署至 `GitHub Pages` 與 `AWS S3`。

### 部署 GitHub

1. 終端機進入專案目錄下的 `cmd` 目錄。
2. 在 `cmd` 目錄下執行指令 `node Deploy.js -G github`

### 參數
* `--gh-account`，代表 Github 帳號，未給予時則會以 `cmd/Config.js` 內的設定為主，若無設定則會自動解析目前專案的 `.git` 資訊。
* `--gh-repository`，代表 Github Repository，未給予時則會以 `cmd/Config.js` 內的設定為主，若無設定則會自動解析目前專案的 `.git` 資訊。
* `--gh-branch`，代表分支，未給予時則會以 `cmd/Config.js` 內的設定為主，預設值為 `gh-pages`。
* `--gh-message`，代表 Commit 訊息，未給予時則會以 `cmd/Config.js` 內的設定為主，預設值為 `🚀 部署！`。

### 部署 S3

1. 終端機進入專案目錄下的 `cmd` 目錄。
2. 在 `cmd` 目錄下執行指令 `node Deploy.js --goal s3 --s3-bucket {bucket} --s3-access {access} --s3-secret {secret} --s3-region {region}`

### 參數
* `--s3-bucket`，代表 AWS S3 中的 Bucket。
* `--s3-access`，代表 AWS S3 中的 Access ID。
* `--s3-secret`，代表 AWS S3 中的 Secret Key。
* `--s3-region`，代表 AWS S3 中的 Region，未給予時則會以 `cmd/Config.js` 內的設定為主

