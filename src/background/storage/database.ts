import { Dexie } from 'dexie'
import { uuid } from '@utils/uuid.js'

/**
 * @deprecated
 */
interface IUserScriptObjectV1 {
  id?: number // primary key
  code: string

  name: string
  enabled: number // boolean
  urlPatterns: string[]
}

export interface IUserScriptObjectV2 {
  id: string // primary key
  code: string

  enabled: number // boolean
}

export class Database extends Dexie {
  userScripts: Dexie.Table<IUserScriptObjectV2, string>

  constructor() {
    super('Database')

    this.version(1).stores({ userScripts: '++id,enabled' })
    this.version(2).stores({ userScripts: 'id,enabled' }).upgrade(async tx => {
      await tx.table('userScripts').toCollection().modify(userScript => {
        userScript.id = uuid()
        delete userScript.name
        delete userScript.urlPatterns
      })
    })
    this.userScripts = this.table('userScripts')
  }
}
