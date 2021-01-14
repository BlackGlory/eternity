import { Database, IUserScriptObject } from './database'
import { parseMetadata } from './metadata'

const db = new Database()

export interface IUserScript {
  id: number
  name: string
  code: string
  enabled: boolean
  urlPatterns: string[]
}

enum Boolean {
  True = 1
, False = 0
}

export async function insertUserScript(code: string): Promise<number> {
  const { name, urlPatterns } = parseMetadata(code)
  const id = await db.userScripts.add({
    name
  , code
  , enabled: Boolean.True
  , urlPatterns
  })
  return id
}

export async function updateUserScript(id: number, code: string): Promise<void> {
  const { name, urlPatterns } = parseMetadata(code)
  await db.userScripts.update(id, {
    name
  , code
  , urlPatterns
  })
}

export async function getUserScript(id: number): Promise<IUserScript | null> {
  const record = await db.userScripts.get(id)
  if (record) {
    return convertUserScriptObjectToUserScript(record)
  } else {
    return null
  }
}

export async function enableUserScript(id: number): Promise<void> {
  await db.userScripts.update(id, {
    enabled: Boolean.True
  })
}

export async function disableUserScript(id: number): Promise<void> {
  await db.userScripts.update(id, {
    enabled: Boolean.False
  })
}

export async function deleteUserScript(id: number): Promise<void> {
  await db.userScripts.delete(id)
}

export async function listAllUserScripts(): Promise<IUserScript[]> {
  const records = await db.userScripts.toArray()
  return records.map(convertUserScriptObjectToUserScript)
}

export async function filterEnabledUserScripts(predicate: (script: IUserScript) => boolean): Promise<IUserScript[]> {
  const records = await db.userScripts
                          .where('enabled')
                          .equals(Boolean.True)
                          .filter((script: IUserScriptObject) => {
                            return predicate(convertUserScriptObjectToUserScript(script))
                          })
                          .toArray()
  return records.map(convertUserScriptObjectToUserScript)
}

function convertUserScriptObjectToUserScript(obj: IUserScriptObject): IUserScript {
  return {
    id: obj.id!
  , name: obj.name!
  , code: obj.code!
  , enabled: obj.enabled === Boolean.True
  , urlPatterns: obj.urlPatterns!
  }
}
