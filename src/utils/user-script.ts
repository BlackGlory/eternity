import { pass } from '@blackglory/prelude'
import { esm } from '@utils/esm.js'
import { KeyedMutex } from 'extra-promise'
import { v4 } from 'uuid'

export function isUserScriptsAPIAvailable(): boolean {
  try {
    chrome.userScripts
    return true
  } catch {
    return false
  }
}

export async function configureCSP(): Promise<void> {
  await chrome.userScripts.configureWorld({
    csp: "default-src * data: blob: 'unsafe-eval' 'unsafe-inline'"
  })
}

export async function unregisterAllUserScripts(): Promise<void> {
  await chrome.userScripts.unregister()
}

const scriptIdMutex = new KeyedMutex((id: string) => id)

export async function registerUserScript(
  id: string
, matches: string[]
, code: string
, world?: chrome.userScripts.ExecutionWorld
): Promise<void> {
  // 由于取消注册和注册是两个非事务的异步操作, 此处存在竞争条件.
  // 如果有其他注册者注册了相同id的脚本, 就会在注册时抛出错误`Duplicate script ID`.
  await scriptIdMutex.acquire(id, async () => {
    await unregisterUserScript(id)

    await chrome.userScripts.register([{
      id
    , matches
    , js: [{ code: esm(code) }]
    , runAt: 'document_start'
    , allFrames: true
    , world: world ?? undefined
    }])
  })
}

export async function unregisterUserScript(id: string): Promise<void> {
  try {
    await chrome.userScripts.unregister({ ids: [id] })
  } catch {
    pass()
  }
}

export function generateUserScriptId(): string {
  // Chrome文档规定了脚本Id不能以`_`开头, 因此这里不能使用nanoid这样的UUID.
  return v4()
}
