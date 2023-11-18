import { useState, useMemo } from 'react'
import { createBackgroundClient } from '@delight-rpc/webextension'
import { IBackgroundAPI } from '@src/contract.js'
import { useMountAsync } from 'extra-react-hooks'
import { Button } from '@components/button.jsx'
import { Checkbox } from '@components/checkbox.jsx'
import { Helmet } from 'react-helmet-async'
// import { editor } from 'monaco-editor'

export interface IEditorProps {
  id: string
}

export function Editor({ id }: IEditorProps) {
  const client = useMemo(() => createBackgroundClient<IBackgroundAPI>(), [])
  const [name, setName] = useState('Unamed')
  const [enabled, setEnabled] = useState(false)
  const [code, setCode] = useState('')

  useMountAsync(refreshUserScript)

  return (
    <div className='flex w-full h-full'>
      <Helmet>
        <title>{name} - Eternity Editor</title>
      </Helmet>

      <nav>
        <Button onClick={async () => {
          await client.setUserScript(id, code)

          await refreshUserScript()
        }}>Save</Button>

        <Button onClick={async () => {
          const userScript = await client.getUserScript(id)

          if (userScript) {
            setCode(userScript.code)
          } else {
            setCode('')
          }
        }}>Reset</Button>

        <Button onClick={async () => {
          if (await client.updateUserScriptToLatest(id)) {
            await refreshUserScript()
          }
        }}>Update</Button>

        <Button onClick={async () => {
          await client.removeUserScript(id)

          window.close()
        }}>Delete</Button>

        <Checkbox
          value={enabled}
          onClick={async enabled => {
            await client.setUserScriptEnabled(id, enabled)

            setEnabled(enabled)
          }}
        />
      </nav>

      <textarea
        className='flex-1'
        value={code}
        onChange={e => setCode(e.target.value)}
      />

      {/* <MonacoEditor
        height="90vh"
        language="javascript"
        value={props.code}
        editorDidMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false }
        , tabSize: 2
        }}
      /> */}
    </div>
  )

  async function refreshUserScript(signal?: AbortSignal): Promise<void> {
    const userScript = await client.getUserScript(id, signal)

    if (userScript) {
      setName(userScript.name)
      setCode(userScript.code)
      setEnabled(userScript.enabled)
    }
  }

  // function getEditorValue(): string {
  //   return editor.current!.getValue()
  // }

  // function handleEditorDidMount(instance: monaco.editor.IStandaloneCodeEditor) {
  //   editor.current = instance
  // }
}
