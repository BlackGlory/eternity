import { useMemo } from 'react'
import { Button } from '@components/button.jsx'
import { createBackgroundClient } from '@delight-rpc/webextension'
import { IBackgroundAPI, IUserScript, IUserScriptListItem } from '@src/contract.js'
import { useMountAsync } from 'extra-react-hooks'
import { Checkbox } from '@components/checkbox.jsx'
import { each } from 'extra-promise'
import { isntEmptyArray } from '@blackglory/prelude'
import { ClientProxy } from 'delight-rpc'
import { useSelector, useUpdater } from 'extra-react-store'
import { OptionsStoreContext } from '@utils/options-store.js'

export function Options() {
  const client = useMemo(() => createBackgroundClient<IBackgroundAPI>(), [])
  const userScripts = useSelector(OptionsStoreContext, state => state.userScripts)
  const updateState = useUpdater(OptionsStoreContext)

  useMountAsync(refreshUserScriptList)

  return (
    <div>
      <nav>
        <Button onClick={async () => {
          const id = await client.createUserScriptId()

          await chrome.tabs.create({ url: getEditorURL(id) })
        }}>New Script</Button>

        <Button onClick={async () => {
          const updatableScriptIds = userScripts
            .filter(isUpdatable)
            .map(x => x.id)

          await each(updatableScriptIds, id => client.updateUserScriptToLatest(id))
        }}>Update All Scripts</Button>
      </nav>

      <ul>
        {userScripts.map(userScript => (
          <li key={userScript.id}>
            <UserScriptListItem client={client} userScript={userScript} />
          </li>
        ))}
      </ul>
    </div>
  )

  async function refreshUserScriptList(signal?: AbortSignal): Promise<void> {
    const userScripts = await client.getUserScriptList(signal)

    updateState(state => {
      state.userScripts = userScripts
    })
  }
}

interface IUserScriptListItemProps {
  client: ClientProxy<IBackgroundAPI>
  userScript: IUserScriptListItem
}

function UserScriptListItem({ client, userScript }: IUserScriptListItemProps) {
  const updateState = useUpdater(OptionsStoreContext)

  return (
    <>
      <a 
        className='cursor-pointer hover:underline'
        onClick={async () => {
          await chrome.tabs.create({ url: getEditorURL(userScript.id) })
        }}
      >
        {userScript.name}
      </a>

      <Checkbox
        value={userScript.enabled}
        onClick={async enabled => {
          await client.setUserScriptEnabled(userScript.id, enabled)

          updateState(state => {
            const item = state.userScripts.find(x => x.id === userScript.id)
            if (item) {
              item.enabled = enabled
            }
          })
        }}
      />

      <Button onClick={async () => {
        await client.removeUserScript(userScript.id)

        updateState(state => {
          const index = state.userScripts.findIndex(x => x.id === userScript.id)
          if (index >= 0) {
            state.userScripts.splice(index, 1)
          }
        })
      }}>Delete</Button>

      {isUpdatable(userScript) && (
        <Button onClick={async () => {
          await client.updateUserScriptToLatest(userScript.id)
        }}>Update</Button>
      )}
    </>
  )
}

function isUpdatable(userScript: IUserScriptListItem | IUserScript): boolean {
  return isntEmptyArray(userScript.updateURLs)
}

function getEditorURL(userScriptId: string): string {
  return chrome.runtime.getURL(`editor.html?id=${userScriptId}`)
}
