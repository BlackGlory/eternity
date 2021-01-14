import Dexie from 'dexie'

export interface IUserScriptObject {
  id?: number // primary key
  name?: string
  code?: string
  enabled?: number // boolean
  urlPatterns?: string[]
}

export class Database extends Dexie {
  userScripts: Dexie.Table<IUserScriptObject, number>

  constructor() {
    super('Database')
    this.version(1).stores({ userScripts: '++id,enabled' })
    this.userScripts = this.table('userScripts')
  }
}
