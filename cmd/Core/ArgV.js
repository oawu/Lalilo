/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Helper = require('@oawu/_Helper')
const cli    = require('@oawu/cli-progress')

const env = d4 => {
  cli.title('取得環境')
  cli.appendTitle(Helper.Display.cmd('取得參數', '-E 或 --env'))
  argvs = Helper.argV.byKey(['-E', '--env'])
  argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs
  argvs = argvs.map(argv => Helper.Type.isNotEmptyString(argv) && ['Development', 'Testing', 'Staging', 'Production', 'dev', 'test', 'stage', 'prod'].includes(argv) ? argv : null).filter(argv => argv !== null)
  argvs.unshift(d4)

  let env = argvs.pop()
  if (env == 'dev')   { env = 'Development' }
  if (env == 'test')  { env = 'Testing' }
  if (env == 'stage') { env = 'Staging' }
  if (env == 'prod')  { env = 'Production' }
  cli.done()

  return env
}
const buildUrl = _ => {
  cli.title('判斷基本網址')

  cli.appendTitle(Helper.Display.cmd('取得參數', '-U 或 --url'))
  let argvs = Helper.argV.byKey(['-U', '--url'])

  argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs
  argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv) && (argv === '/' || /(http(s?)):\/\//i.test(argv))).map(argv => argv === '' ? argv : `${argv.replace(/\/*$/, '')}/`)
  argvs.unshift('')
  const baseUrl = argvs.pop()

  cli.done()

  return baseUrl
}

const min = _ => {
  cli.title('確認是否合併 Js 與 Css 檔案')
  cli.appendTitle(Helper.Display.cmd('取得參數', '--merge'))
  argvs = Helper.argV.byKey(['--merge'])
  let isMerge = argvs !== undefined
  cli.done()
  return isMerge
}
const merge = _ => {
  cli.title('確認是否壓縮 Js 檔案')
  cli.appendTitle(Helper.Display.cmd('取得參數', '--min'))
  argvs = Helper.argV.byKey(['--min'])
  let isMinify = argvs !== undefined
  cli.done()
  return isMinify
}
const vals = _ => {
  cli.title('取得傳遞的參數')
  cli.appendTitle(Helper.Display.cmd('取得參數', '-V-{key}={val} 或 --val-{key}={val}'))
  let vals = Helper.argV.byVal()
  cli.done()
  return vals
}




const Goal = {
  gitInfo: _ => {
    let result = { account: '', repository: '', branch: '', message: '' }
    try {
      const output = require('child_process').execSync('git remote get-url origin', { stdio: 'pipe' }).toString()
      const { groups: { account = '', repository = '' } = {} } = /^git@github\.com:(?<account>.*)\/(?<repository>.*)\.git/gi.exec(output) || /^https:\/\/github\.com\/(?<account>.*)\/(?<repository>.*)\.git/gi.exec(output) || {}

      result.account = account
      result.repository = repository
    } catch (_) {}

    return result
  },
  bucket: Config => {
    cli.appendTitle(Helper.Display.cmd('取得參數', '--s3-bucket'))
    let argvs = Helper.argV.byKey(['--s3-bucket'])
    argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs
    argvs.unshift(Config.Deploy.s3.bucket)
    argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv))
    argvs.unshift('')
    
    return argvs.pop()
  },
  access: Config => {
    cli.appendTitle(Helper.Display.cmd('取得參數', '--s3-access'))
    let argvs = Helper.argV.byKey(['--s3-access'])
    argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs
    argvs.unshift(Config.Deploy.s3.access)
    argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv))
    argvs.unshift('')
    
    return argvs.pop()
  },
  secret: Config => {
    cli.appendTitle(Helper.Display.cmd('取得參數', '--s3-secret'))
    let argvs = Helper.argV.byKey(['--s3-secret'])
    argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs
    argvs.unshift(Config.Deploy.s3.secret)
    argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv))
    argvs.unshift('')
    
    return argvs.pop()
  },
  region: Config => {
    cli.appendTitle(Helper.Display.cmd('取得參數', '--s3-region'))
    let argvs = Helper.argV.byKey(['--s3-region'])
    argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs
    argvs.unshift(Config.Deploy.s3.region)
    argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv))
    argvs.unshift('')
    
    return argvs.pop()
  },
  account: Config => {
    cli.appendTitle(Helper.Display.cmd('取得參數', '--gh-account'))
    let argvs = Helper.argV.byKey(['--gh-account'])
    argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs

    argvs.unshift(Config.Deploy.github.account)
    let project = Goal.gitInfo()
    argvs.unshift(project.account)

    argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv))
    argvs.unshift('')

    return argvs.pop()
  },
  repository: Config => {
    cli.appendTitle(Helper.Display.cmd('取得參數', '--gh-repository'))
    let argvs = Helper.argV.byKey(['--gh-repository'])
    argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs

    argvs.unshift(Config.Deploy.github.repository)
    let project = Goal.gitInfo()
    argvs.unshift(project.repository)

    argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv))
    argvs.unshift('')
    
    return argvs.pop()
  },
  branch: Config => {
    cli.appendTitle(Helper.Display.cmd('取得參數', '--gh-branch'))
    let argvs = Helper.argV.byKey(['--gh-branch'])
    argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs

    argvs.unshift(Config.Deploy.github.branch)

    argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv))
    argvs.unshift('gh-pages')
    
    return argvs.pop()
  },
  message: Config => {
    cli.appendTitle(Helper.Display.cmd('取得參數', '--gh-message'))
    let argvs = Helper.argV.byKey(['--gh-message'])
    argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs

    argvs.unshift(Config.Deploy.github.message)

    argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv))
    argvs.unshift('🚀 部署！')

    return argvs.pop()
  }
}
const goal = (Config, allows) => {
  cli.title('判斷平台')

  cli.appendTitle(Helper.Display.cmd('取得參數', '-G 或 --goal'))
  let argvs = Helper.argV.byKey(['-G', '--goal'])
  argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs
  argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv) && allows.includes(argv.toLowerCase())).map(argv => argv.toLowerCase())
  let goal = argvs.pop()

  if (!Helper.Type.isNotEmptyString(goal)) {
    return cli.fail(null, '請給予部署目標，請使用參數 -G 或 --goal 來設定網址。', '共有兩種可以設定，分別是 s3 或 github')
  }

  if (['gh-pages', 'gh'].includes(goal)) {
    goal = 'github'
  }

  goal = goal == 's3' ? {
    type: 's3',
    bucket:     Goal.bucket(Config),
    access:     Goal.access(Config),
    secret:     Goal.secret(Config),
    region:     Goal.region(Config)
  } : {
    type: 'github',
    account:    Goal.account(Config),
    repository: Goal.repository(Config),
    branch:     Goal.branch(Config),
    message:    Goal.message(Config),
  }
  cli.done()

  return goal
}

const deployUrl = goal => {
  cli.title('判斷基本網址')

  cli.appendTitle(Helper.Display.cmd('取得參數', '-U 或 --url'))
  argvs = Helper.argV.byKey(['-U', '--url'])
  argvs = argvs === undefined || !Array.isArray(argvs) || argvs.length <= 0 ? [] : argvs
  argvs = argvs.filter(argv => Helper.Type.isNotEmptyString(argv) && (argv === '/' || /(http(s?)):\/\//i.test(argv))).map(argv => argv === '' ? argv : `${argv.replace(/\/*$/, '')}/`)

  if (goal.type == 'github' && Helper.Type.isNotEmptyString(goal.account) && Helper.Type.isNotEmptyString(goal.repository)) {
    argvs.unshift(`https://${goal.account}.github.io/${goal.repository}/`)
  }

  let baseUrl = argvs.pop()
  if (!Helper.Type.isNotEmptyString(baseUrl)) {
    return cli.fail(null, '錯誤，請給予網址，請使用參數 -U 或 --url 來設定網址。')
  }
  cli.done()
  
  return baseUrl
}
module.exports = {
  env,
  buildUrl,
  min,
  merge,
  vals,

  goal,
  deployUrl,
}