import { waitForLaunch, LaunchReason } from 'extra-webextension'
import { IBackgroundAPI } from '@src/contract.js'
import { DAO } from './storage/index.js'
import { migrate } from './migrate.js'
import { ImplementationOf } from 'delight-rpc'
import { Deferred, each } from 'extra-promise'
import { createServer } from '@delight-rpc/webextension'
import { applyPropertyDecorators } from 'extra-proxy'
import { pass } from '@blackglory/prelude'
import { generateUserScriptId } from '@utils/user-script.js'
import { fetch } from 'extra-fetch'
import { ok, toText } from 'extra-response'
import { configureCSP, registerUserScript, unregisterAllUserScripts, unregisterUserScript } from '@utils/user-script.js'

const launched = new Deferred<void>()

const dao = new DAO()
const api: ImplementationOf<IBackgroundAPI> = {
  async getUserScriptList() {
    const userScripts = await dao.getAllUserScripts()

    return userScripts.map(x => ({
      id: x.id
    , enabled: x.enabled
    , name: x.name
    , matches: x.matches
    , updateURLs: x.updateURLs
    }))
  }
, generateUserScriptId
, async setUserScriptEnabled(id, enabled) {
    await dao.updateUserScriptEnabled(id, enabled)

    if (enabled) {
      const userScript = await dao.getUserScript(id)
      if (userScript) {
        await registerUserScript(
          userScript.id
        , userScript.matches
        , userScript.code
        , userScript.world
        )
      }
    } else {
      await unregisterUserScript(id)
    }

    return null
  }
, async removeUserScript(id) {
    await dao.deleteUserScript(id)

    await unregisterUserScript(id)

    return null
  }
, async getUserScript(id) {
    return await dao.getUserScript(id)
  }
, async setUserScript(id, code) {
    await dao.upsertUserScript(id, code)

    const userScript = await dao.getUserScript(id)
    if (userScript?.enabled) {
      await registerUserScript(
        userScript.id
      , userScript.matches
      , userScript.code
      , userScript.world
      )
    }

    return null
  }
, async upgradeUserScriptToLatest(id) {
    const userScript = await dao.getUserScript(id)

    if (userScript) {
      for (const updateURL of userScript.updateURLs) {
        try {
          const code = await fetch(updateURL)
            .then(ok)
            .then(toText)

          await this.setUserScript(id, code)

          return true
        } catch {
          pass()
        }
      }
    }

    return false
  }
}

// 确保尽早启动服务器, 以免拒绝来自客户端的连接, 造成功能失效.
createServer<IBackgroundAPI>(
  applyPropertyDecorators(
    api
  , Object.keys(api) as Array<keyof IBackgroundAPI>
  , (fn: (...args: unknown[]) => unknown) => {
      return async function (this: unknown, ...args: unknown[]): Promise<unknown> {
        // 等待初始化/迁移执行完毕
        await launched

        return await Reflect.apply(fn, this, args)
      }
    }
  ) as ImplementationOf<IBackgroundAPI>
)

waitForLaunch().then(async details => {
  console.info(`Launched by ${LaunchReason[details.reason]}`)

  switch (details.reason) {
    case LaunchReason.Install: {
      // 在安装后初始化.
      pass()
      break
    }
    case LaunchReason.Update: {
      // 在升级后执行迁移.
      await migrate(details.previousVersion)
      break
    }
  }

  launched.resolve()

  await configureCSP()
  await unregisterAllUserScripts()
  const enabledScripts = await dao.getAllEnabledUserScripts()
  await each(enabledScripts, async userScript => {
    try {
      await registerUserScript(userScript.id, userScript.matches, userScript.code)
    } catch {
      pass()
    }
  })
})
