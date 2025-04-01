import { useState, useMemo, useEffect, useRef } from 'react'
import { createBackgroundClient } from '@delight-rpc/webextension'
import { IBackgroundAPI, IUserScript } from '@src/contract.js'
import { useMountAsync } from 'extra-react-hooks'
import { Button } from '@components/button.jsx'
import { Switch } from '@components/switch.jsx'
import { MonacoEditor } from '@components/monaco-editor.jsx'
import { RemoveButton } from '@components/remove-button.jsx'
import { UpdateButton } from '@components/update-button.jsx'
import * as monaco from 'monaco-editor'
import { useImmer } from 'use-immer'
import { toString } from '@blackglory/prelude'

export interface IEditorProps {
  id: string
  referrer?: string
}

export function Editor({ id, referrer }: IEditorProps) {
  const client = useMemo(() => createBackgroundClient<IBackgroundAPI>(), [])
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
  const [userScript, updateUserScript] = useImmer<IUserScript>({
    id
  , name: 'Unamed'
  , code: getCodePlaceholder()
  , enabled: true
  , matches: []
  , updateURLs: []
  })
  const [unsave, setUnsave] = useState(false)

  useMountAsync(loadUserScript)

  useEffect(() => {
    if (unsave) {
      window.addEventListener('beforeunload', beforeUnloadHandler)

      return () => window.removeEventListener('beforeunload', beforeUnloadHandler)

      function beforeUnloadHandler(e: Event) {
        e.preventDefault()
      }
    }
  }, [unsave])

  useEffect(() => {
    const editor = editorRef.current

    if (editor) {
      if (editor.getValue() !== userScript.code) {
        editor.setValue(userScript.code)
      }
    }
  }, [userScript.code])

  return (
    <div
      className='flex flex-col w-full h-screen max-h-screen overflow-hidden'
      onKeyDown={async e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          e.preventDefault()
          await saveUserScript()
        }
      }}
    >
      <title>{userScript.name}</title>

      <header className={`
        flex items-center gap-2 p-2

        border-b
        border-gray-200
      `}>
        <img
          className='w-6 h-6'
          src='assets/images/icon-128.png'
        />

        <h1 className='flex-1 text-base font-bold'>{userScript.name}</h1>

        <nav className='flex items-center gap-2'>
          <RemoveButton onClick={async () => {
            await client.removeUserScript(id)

            window.close()
          }}/>

          <UpdateButton
            disabled={userScript.updateURLs.length === 0}
            onClick={async () => {
              if (await client.upgradeUserScriptToLatest(id)) {
                await loadUserScript()
              }
            }}
          />

          <Switch
            value={userScript.enabled}
            onChange={async enabled => {
              await client.setUserScriptEnabled(id, enabled)

              updateUserScript(userScript => {
                userScript.enabled = enabled
              })
            }}
          />
        </nav>
      </header>

      <MonacoEditor
        editorRef={editorRef}
        className='flex-1'
        onReady={() => editorRef.current?.setValue(userScript.code)}
        onChange={value => setUnsave(userScript.code !== value)}
      />

      <footer className={`
        flex justify-end gap-2 p-2

        border-t
        border-gray-200
      `}>
        <Button onClick={async () => {
          const editor = editorRef.current

          if (editor) {
            const userScript = await client.getUserScript(id)

            editor.setValue(userScript?.code ?? getCodePlaceholder())

            setUnsave(false)
          }
        }}>Reset</Button>

        <Button
          disabled={!unsave}
          onClick={() => saveUserScript()}
        >Save</Button>
      </footer>
    </div>
  )

  async function loadUserScript(signal?: AbortSignal): Promise<void> {
    const userScript = await client.getUserScript(id, signal)

    if (userScript) {
      updateUserScript(userScript)
    }
  }

  async function saveUserScript(signal?: AbortSignal): Promise<void> {
    const editor = editorRef.current

    if (editor) {
      try {
        await client.setUserScript(id, editor.getValue(), signal)
        await loadUserScript(signal)
        setUnsave(false)
        editor.focus()
      } catch (e) {
        alert(toString(e))

        console.error(e)
      }
    }
  }

  function getCodePlaceholder(): string {
    const lines: string[] = []
    lines.push(`// @name `)

    if (referrer) {
      lines.push(`// @match ${referrer}`)
    } else {
      lines.push(`// @match <all_urls>`)
    }

    return lines.join('\n')
  }
}
