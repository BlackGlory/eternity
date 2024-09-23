import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import { twMerge } from 'tailwind-merge'
import { useDarkMode } from '@hooks/use-dark-mode.js'
import { assert } from '@blackglory/prelude'
import { useMount } from 'extra-react-hooks'

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
  const isDarkMode = useDarkMode()

  useMount(() => {
    const container = containerRef.current
    assert(container)

    const editor = monaco.editor.create(
      container
    , {
        language: 'javascript'
      , minimap: { enabled: false }
      , tabSize: 2
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
  })

  useEffect(() => {
    const editor = editorRef.current
    assert(editor)

    editor.updateOptions({
      theme: isDarkMode
           ? 'vs-dark'
           : 'vs'
    })
  }, [isDarkMode])

  useEffect(() => {
    const editor = editorRef.current
    assert(editor)

    if (onChange) {
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
