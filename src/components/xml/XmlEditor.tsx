import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { setupMonaco } from '@/lib/monacoSetup'
import type { editor } from 'monaco-editor'

const Editor = lazy(() => import('@monaco-editor/react'))

interface XmlEditorProps {
  value: string
  height?: string
  readOnly?: boolean
  onCursorLine?: (lineNumber: number) => void
  /** When this changes, the editor scrolls to and highlights the given 1-based line. */
  highlightLine?: number | null
}

export function XmlEditor({ value, height = '28rem', readOnly = true, onCursorLine, highlightLine }: XmlEditorProps) {
  const [ready, setReady] = useState(false)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    let cancelled = false
    setupMonaco().then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const editorInstance = editorRef.current
    if (!editorInstance || !highlightLine) return
    const model = editorInstance.getModel()
    if (!model) return
    editorInstance.revealLineInCenter(highlightLine)
    editorInstance.setSelection({
      startLineNumber: highlightLine,
      startColumn: 1,
      endLineNumber: highlightLine,
      endColumn: model.getLineMaxColumn(highlightLine),
    })
  }, [highlightLine])

  if (!ready) {
    return (
      <div style={{ height }} className="flex items-center justify-center rounded-md border border-border bg-surface2 text-sm text-muted">
        Loading editor…
      </div>
    )
  }

  return (
    <Suspense fallback={<div style={{ height }} className="rounded-md border border-border bg-surface2" />}>
      <div className="overflow-hidden rounded-md border border-border">
        <Editor
          height={height}
          defaultLanguage="xml"
          value={value}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            folding: true,
            renderLineHighlight: 'all',
          }}
          onMount={(editorInstance: editor.IStandaloneCodeEditor) => {
            editorRef.current = editorInstance
            editorInstance.onDidChangeCursorPosition((e) => {
              onCursorLine?.(e.position.lineNumber)
            })
          }}
        />
      </div>
    </Suspense>
  )
}
