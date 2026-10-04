import MiniSearch from 'minisearch'
import { referenceEntries, categoryLabels } from '@/content/reference/entries'
import { normalizeQuery, parseStudyXml } from '@/lib/xmlStudy'

export const xmlFieldLink = (fieldId: string) => `/reference/pacs.008?tab=xml&field=${encodeURIComponent(fieldId)}`

export interface ReferenceResult { id: string; title: string; description: string; category: string; to: string; searchable: string }
let cached: { items: ReferenceResult[]; index: MiniSearch<ReferenceResult> } | undefined
function getIndex() {
  if (cached) return cached
  const items: ReferenceResult[] = referenceEntries.map((entry) => ({
    id: entry.id, title: entry.title, description: entry.summary, category: entry.category,
    to: `/reference/${entry.id}`, searchable: [entry.subtitle, categoryLabels[entry.category], ...entry.aliases, ...entry.facts.map((fact) => fact.value), entry.example?.text ?? ''].join(' '),
  }))
  for (const field of parseStudyXml().fields) {
    items.push({ id: `xml:${field.id}`, title: field.tag, description: field.note.meaning, category: 'xml', to: xmlFieldLink(field.id), searchable: `${field.path} ${field.note.name} ${field.note.note} ${field.value} pacs.008.001.10` })
  }
  const index = new MiniSearch<ReferenceResult>({ fields: ['title', 'description', 'searchable'], storeFields: ['title', 'description', 'category', 'to', 'searchable'], searchOptions: { prefix: true, fuzzy: 0.15, boost: { title: 5 } } })
  index.addAll(items)
  cached = { items, index }
  return cached
}

export function searchReference(query: string, category = 'all'): ReferenceResult[] {
  const { items, index } = getIndex()
  const q = query.trim()
  const normal = normalizeQuery(q)
  let found = items
  if (q) {
    const exact = items.filter((item) => normalizeQuery(item.title) === normal || normalizeQuery(item.id) === normal)
    const aliases = items.filter((item) => normalizeQuery(item.searchable).includes(normal))
    const matches = index.search(q).map((item) => ({ id: String(item.id), title: item.title, description: item.description, category: item.category, to: item.to, searchable: item.searchable } as ReferenceResult))
    found = [...new Map([...exact, ...matches, ...aliases].map((item) => [item.id, item])).values()]
  } else {
    found = items.filter((item) => category === 'xml' || item.category !== 'xml')
  }
  return found.filter((item) => category === 'all' || item.category === category)
}
