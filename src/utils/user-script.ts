import { pass } from '@blackglory/prelude'
import { esm } from '@utils/esm.js'
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

export async function registerUserScript(
  id: string
, matches: string[]
, code: string
, world?: chrome.userScripts.ExecutionWorld
): Promise<void> {
  await unregisterUserScript(id)

  await chrome.userScripts.register([{
    id
  , matches
  , js: [{ code: esm(code) }]
  , runAt: 'document_start'
  , allFrames: true
  , world: world ?? undefined
  }])
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
