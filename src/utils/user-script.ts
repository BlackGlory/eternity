import { pass } from '@blackglory/prelude'
import { esm } from '@utils/esm.js'
import { v4 } from 'uuid'

export function isUserScriptsAPIAvailable(): boolean {
  try {
    // @ts-ignore
    chrome.userScripts
    return true
  } catch {
    return false
  }
}

export async function configureCSP(): Promise<void> {
  // @ts-ignore
  await chrome.userScripts.configureWorld({
    csp: "default-src * data: blob: 'unsafe-eval' 'unsafe-inline'"
  })
}

export async function unregisterAllUserScripts(): Promise<void> {
  // @ts-ignore
  await chrome.userScripts.unregister()
}

export async function registerUserScript(
  id: string
, matches: string[]
, code: string
): Promise<void> {
  await unregisterUserScript(id)

  // @ts-ignore
  await chrome.userScripts.register([{
    id
  , matches
  , js: [{ code: esm(code) }]
  , runAt: 'document_start'
  }])
}

export async function unregisterUserScript(id: string): Promise<void> {
  try {
    // @ts-ignore
    await chrome.userScripts.unregister({ ids: [id] })
  } catch {
    pass()
  }
}

export function generateUserScriptId(): string {
  return v4()
}
