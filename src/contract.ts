export interface IUserScript {
  id: string
  code: string
  enabled: boolean

  name: string
  matches: string[]
  updateURLs: string[]
}

export interface IUserScriptListItem {
  id: string
  enabled: boolean

  name: string
  matches: string[]
  updateURLs: string[]
}

export interface IBackgroundAPI {
  getUserScriptList(): IUserScriptListItem[]

  createUserScriptId(): string
  setUserScriptEnabled(id: string, enabled: boolean): null
  removeUserScript(id: string): null

  getUserScript(id: string): IUserScript | null
  setUserScript(id: string, code: string): null

  updateUserScriptToLatest(id: string): boolean
}
