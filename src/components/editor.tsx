import { useState, useMemo, useEffect, useRef } from 'react'
import { createBackgroundClient } from '@delight-rpc/webextension'
import { IBackgroundAPI } from '@src/contract.js'
import { useMountAsync } from 'extra-react-hooks'
import { Button } from '@components/button.jsx'
import { Switch } from '@components/switch.jsx'
import { Helmet } from 'react-helmet-async'
import { CodeEditor } from '@components/code-editor.jsx'
import { RemoveButton } from '@components/remove-button.jsx'
import { UpdateButton } from '@components/update-button.jsx'

export interface IEditorProps {
  id: string
}

export function Editor({ id }: IEditorProps) {
  const client = useMemo(() => createBackgroundClient<IBackgroundAPI>(), [])
  const [name, setName] = useState('Unamed')
  const [enabled, setEnabled] = useState(false)
  const [code, setCode] = useState('')
  const [unsave, setUnsave] = useState(false)
  const liveCodeRef = useRef<string>(code)

  useMountAsync(refreshUserScript)

  useEffect(() => {
    if (unsave) {
      window.addEventListener('beforeunload', beforeUnloadHandler)

      return () => window.removeEventListener('beforeunload', beforeUnloadHandler)

      function beforeUnloadHandler(e: Event) {
        e.preventDefault()
      }
    }
  }, [unsave])

  return (
    <div className='flex flex-col w-full h-screen max-h-screen overflow-hidden'>
      <Helmet>
        <title>{name}</title>
      </Helmet>

      <header className='flex items-center gap-2 p-2'>
        <img
          className='w-6 h-6'
          src='assets/images/icon-128.png'
        />

        <h1 className='flex-1 text-base font-bold'>{name}</h1>

        <nav className='flex items-center gap-2'>
          <RemoveButton onClick={async () => {
            await client.removeUserScript(id)

            window.close()
          }}/>

          <UpdateButton onClick={async () => {
            if (await client.updateUserScriptToLatest(id)) {
              await refreshUserScript()
            }
          }}/>

          <Switch
            value={enabled}
            onClick={async enabled => {
              await client.setUserScriptEnabled(id, enabled)

              setEnabled(enabled)
            }}
          />
        </nav>
      </header>

      <CodeEditor
        className='flex-1'
        initialValue={code}
        onChange={value => {
          setUnsave(value !== code)

          liveCodeRef.current = value
        }}
      />

      <footer className='flex justify-end gap-2 p-2'>
        <Button onClick={async () => {
          const userScript = await client.getUserScript(id)

          if (userScript) {
            setCode(userScript.code)
          } else {
            setCode('')
          }

          setUnsave(false)
        }}>Reset</Button>

        <Button onClick={async () => {
          await client.setUserScript(id, liveCodeRef.current)

          await refreshUserScript()
        }}>Save</Button>
      </footer>
    </div>
  )

  async function refreshUserScript(signal?: AbortSignal): Promise<void> {
    const userScript = await client.getUserScript(id, signal)

    if (userScript) {
      setName(userScript.name)
      setCode(userScript.code)
      setEnabled(userScript.enabled)
      setUnsave(false)
    }
  }
}
