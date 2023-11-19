import { parseMetadata } from '@utils/metadata.js'
import { IUserScript } from '@src/contract.js'
import { Database, IUserScriptObjectV2 } from './database.js'

enum Boolean {
  True = 1
, False = 0
}

export class DAO {
  private db = new Database()

  async getAllUserScripts(): Promise<IUserScript[]> {
    const objects = await this.db.userScripts.toArray()
    return objects.map(convertUserScriptObjectToUserScript)
  }

  async getAllEnabledUserScripts(): Promise<IUserScript[]> {
    const objects = await this.db.userScripts
      .where('enabled')
      .equals(Boolean.True)
      .toArray()

    return objects.map(convertUserScriptObjectToUserScript)
  }

  async getUserScript(id: string): Promise<IUserScript | null> {
    const object = await this.db.userScripts.get(id)

    if (object) {
      return convertUserScriptObjectToUserScript(object)
    } else {
      return null
    }
  }

  async deleteUserScript(id: string): Promise<void> {
    await this.db.userScripts.delete(id)
  }

  async updateUserScriptEnabled(id: string, enabled: boolean): Promise<void> {
    await this.db.userScripts.update(id, {
      enabled: enabled
             ? Boolean.True
             : Boolean.False
    })
  }

  async upsertUserScript(id: string, code: string): Promise<void> {
    await this.db.transaction('rw', this.db.userScripts, async () => {
      const object = await this.db.userScripts.get(id)

      if (object) {
        await this.db.userScripts.update(id, { code })
      } else {
        await this.db.userScripts.add({
          id
        , code
        , enabled: Boolean.True
        })
      }
    })
  }
}

function convertUserScriptObjectToUserScript(obj: IUserScriptObjectV2): IUserScript {
  const metadata = parseMetadata(obj.code)

  return {
    id: obj.id
  , code: obj.code
  , enabled: obj.enabled === Boolean.True
  , name: metadata.name
  , matches: metadata.matches
  , updateURLs: metadata.updateURLs
  }
}
