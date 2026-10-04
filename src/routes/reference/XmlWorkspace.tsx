import { Navigate, useSearchParams } from 'react-router-dom'

// The annotated XML now lives as a tab of the pacs.008 reference entry.
// Older links (#/xml, #/xml?field=...) keep working through this redirect.
export function XmlWorkspace() {
  const [params] = useSearchParams()
  const next = new URLSearchParams({ tab: 'xml' })
  const field = params.get('field')
  if (field) next.set('field', field)
  return <Navigate replace to={`/reference/pacs.008?${next.toString()}`} />
}
