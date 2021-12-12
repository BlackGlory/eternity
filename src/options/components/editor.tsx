import React, { useRef } from 'react'
import MonacoEditor, { monaco } from 'react-monaco-editor'

export interface EditorProps {
  name: string
  code: string
  onSave: (code: string) => void
  onCancel: () => void
}

export const Editor: React.FC<EditorProps> = props => {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>()

  return (
    <div>
      <h2>{props.name}</h2>
      <MonacoEditor
        height="90vh"
        language="javascript"
        value={props.code}
        editorDidMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false }
        , tabSize: 2
        }}
      />
      <button onClick={() => props.onSave(getEditorValue())}>Save</button>
      <button onClick={() => props.onCancel()}>Cancel</button>
    </div>
  )

  function getEditorValue(): string {
    return editor.current!.getValue()
  }

  function handleEditorDidMount(instance: monaco.editor.IStandaloneCodeEditor) {
    editor.current = instance
  }
}
