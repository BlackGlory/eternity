import { useMemo } from 'react'
import { Button } from '@components/button.jsx'
import { createBackgroundClient } from '@delight-rpc/webextension'
import { IBackgroundAPI, IUserScript, IUserScriptListItem } from '@src/contract.js'
import { useMountAsync } from 'extra-react-hooks'
import { each } from 'extra-promise'
import { isntEmptyArray } from '@blackglory/prelude'
import { ClientProxy } from 'delight-rpc'
import { useSelector, useUpdater } from 'extra-react-store'
import { OptionsStoreContext } from '@utils/options-store.js'
import { Switch } from '@components/switch.jsx'
import { RemoveButton } from '@components/remove-button.jsx'
import { UpdateButton } from '@components/update-button.jsx'
import { appendSearchParam } from 'url-operator'
import { getActiveTab } from 'extra-webextension'

export function Options() {
  const client = useMemo(() => createBackgroundClient<IBackgroundAPI>(), [])
  const userScripts = useSelector(OptionsStoreContext, state => state.userScripts)
  const nameFilter = useSelector(OptionsStoreContext, state => state.nameFilter)
  const updateState = useUpdater(OptionsStoreContext)

  useMountAsync(loadUserScriptList)

  return (
    <div className='flex flex-col min-w-[300px] min-h-[400px] max-h-screen overflow-y-hidden'>
      <nav className={`
        flex gap-2 p-2

        border-b
        border-gray-200

        bg-gray-50
      `}>
        <Button onClick={async () => {
          const id = await client.generateUserScriptId()
          const activeTab = await getActiveTab()

          await chrome.tabs.create({ url: getEditorURL(id, activeTab.url) })
        }}>New Script</Button>

        <Button onClick={async () => {
          const updatableScriptIds = userScripts
            .filter(isUpdatable)
            .map(x => x.id)

          await each(updatableScriptIds, id => client.upgradeUserScriptToLatest(id))
        }}>Update All Scripts</Button>
      </nav>

      <input
        className={`
          h-8 p-2
          outline-none

          border-b
          border-gray-200

          bg-gray-50

          text-black
        `}
        type='search'
        placeholder='Filter'
        value={nameFilter}
        onChange={e => updateState(state => {
          state.nameFilter = e.target.value
        })}
      />

      <ul className='flex-1 overflow-y-auto'>
        {
          userScripts
            .filter(userScript => userScript.name.toLowerCase().includes(nameFilter.toLowerCase()))
            .map(userScript => (
              <li
                key={userScript.id}
                className={`
                  border-b
                  border-gray-200
                  hover:bg-gray-100
                `}
              >
                <UserScriptListItem client={client} userScript={userScript} />
              </li>
            ))
        }
      </ul>
    </div>
  )

  async function loadUserScriptList(signal?: AbortSignal): Promise<void> {
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
    <div className='flex items-center gap-2 px-2'>
      <Switch
        value={userScript.enabled}
        onChange={async enabled => {
          await client.setUserScriptEnabled(userScript.id, enabled)

          updateState(state => {
            const item = state.userScripts.find(x => x.id === userScript.id)
            if (item) {
              item.enabled = enabled
            }
          })
        }}
      />

      <a
        className='flex-1 py-2 cursor-pointer hover:underline'
        onClick={async () => {
          await chrome.tabs.create({ url: getEditorURL(userScript.id) })
        }}
      >
        {userScript.name}
      </a>

      <nav className='flex gap-1 items-center py-2'>
        <RemoveButton onClick={async () => {
          await client.removeUserScript(userScript.id)

          updateState(state => {
            const index = state.userScripts.findIndex(x => x.id === userScript.id)
            if (index >= 0) {
              state.userScripts.splice(index, 1)
            }
          })
        }} />

        <UpdateButton
          disabled={!isUpdatable(userScript)}
          onClick={async () => {
            await client.upgradeUserScriptToLatest(userScript.id)
          }}
        />
      </nav>
    </div>
  )
}

function isUpdatable(userScript: IUserScriptListItem | IUserScript): boolean {
  return isntEmptyArray(userScript.updateURLs)
}

function getEditorURL(userScriptId: string, referrer?: string): string {
  let url = new URL(chrome.runtime.getURL('editor.html'))

  url = appendSearchParam(url, 'id', userScriptId)

  if (referrer) {
    url = appendSearchParam(url, 'referrer', referrer)
  }

  return url.href
}
