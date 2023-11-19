import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import { twMerge } from 'tailwind-merge'

interface ICodeEditorProps {
  className?: string
  initialValue: string

  onChange(value: string): void
}

export function CodeEditor({ className, initialValue, onChange }: ICodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()

  useEffect(() => {
    if (containerRef.current) {
      const editor = monaco.editor.create(
        containerRef.current
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

      return () => {
        editor.dispose()
        editorRef.current = undefined
      }
    }
  }, [])

  useEffect(() => {
    editorRef.current?.setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current

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
