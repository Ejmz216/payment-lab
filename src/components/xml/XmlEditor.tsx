import { lazy, Suspense, useEffect, useState } from 'react'
import { setupMonaco } from '@/lib/monacoSetup'
import type { editor } from 'monaco-editor'

const Editor = lazy(() => import('@monaco-editor/react'))

interface XmlEditorProps {
  value: string
  height?: string
  readOnly?: boolean
  onCursorLine?: (lineContent: string) => void
}

export function XmlEditor({ value, height = '28rem', readOnly = true, onCursorLine }: XmlEditorProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    setupMonaco().then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

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
            editorInstance.onDidChangeCursorPosition((e) => {
              const model = editorInstance.getModel()
              if (!model || !onCursorLine) return
              onCursorLine(model.getLineContent(e.position.lineNumber))
            })
          }}
        />
      </div>
    </Suspense>
  )
}
