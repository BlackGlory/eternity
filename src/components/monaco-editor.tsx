import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import { twMerge } from 'tailwind-merge'

interface IMonacoEditorProps {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>

  className?: string
  onReady?(): void
  onChange?(value: string): void
}

export function MonacoEditor(
  {
    editorRef
  , className
  , onReady
  , onChange
  }: IMonacoEditorProps
) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current

    if (container) {
      const editor = monaco.editor.create(
        container
      , {
          language: 'javascript'
        , minimap: { enabled: false }
        , tabSize: 2
        , theme: 'vs-dark'
        , wordWrap: 'on'
        , scrollBeyondLastLine: false
        , automaticLayout: true
        }
      )

      editorRef.current = editor

      onReady?.()

      return () => {
        editor.dispose()
        editorRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const editor = editorRef.current

    if (editor && onChange) {
      const disposable = editor.onDidChangeModelContent(() => {
        onChange(editor.getValue())
      })

      return () => disposable.dispose()
    }
  }, [onChange])

  return (
    <div
      className={twMerge('overflow-hidden', className)}
      ref={containerRef}
    />
  )
}
