import { loader } from '@monaco-editor/react'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'

let setupPromise: Promise<void> | null = null

// Configures Monaco to run entirely from bundled assets — no CDN fetches at
// runtime. Imports only the core editor API plus XML syntax highlighting
// (not the full monaco-editor barrel, which would also pull in JSON/CSS/
// HTML/TypeScript language services and their multi-MB workers that this
// app never uses). Everything here is lazily imported only when an XML Lab
// route is actually visited (see the route-level React.lazy in App.tsx).
export function setupMonaco(): Promise<void> {
  if (!setupPromise) {
    setupPromise = (async () => {
      const monaco = await import('monaco-editor/editor/editor.api')
      await import('monaco-editor/languages/definitions/xml/register')
      self.MonacoEnvironment = {
        getWorker() {
          return new EditorWorker()
        },
      }
      loader.config({ monaco })
    })()
  }
  return setupPromise
}
