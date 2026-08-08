import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MiniSearch from 'minisearch'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getLessons, getMessages, getGlossary, getConfusions, getScenarios } from '@/lib/i18nContent'

interface Item {
  id: string
  label: string
  sub: string
  to: string
  group: string
}

export function CommandPalette() {
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const lang = useUIStore((s) => s.lang)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const t = useT()

  const items: Item[] = useMemo(() => {
    const lessonItems: Item[] = getLessons(lang).map((l) => ({
      id: `lesson-${l.id}`,
      label: l.title,
      sub: l.subtitle ?? t('palette.groupLessons'),
      to: `/learn/fast-payments/${l.id}`,
      group: t('palette.groupLessons'),
    }))
    const messageItems: Item[] = getMessages(lang).map((m) => ({
      id: `msg-${m.id}`,
      label: m.id,
      sub: m.name,
      to: `/atlas/messages/${m.id}`,
      group: t('palette.groupMessages'),
    }))
    const glossaryItems: Item[] = getGlossary(lang).map((g) => ({
      id: `gloss-${g.id}`,
      label: g.term,
      sub: g.oneLine,
      to: `/glossary#${g.id}`,
      group: t('palette.groupGlossary'),
    }))
    const confusionItems: Item[] = getConfusions(lang).map((c) => ({
      id: `confusion-${c.id}`,
      label: c.title,
      sub: t('palette.groupConfusions'),
      to: '/confusions',
      group: t('palette.groupConfusions'),
    }))
    const scenarioItems: Item[] = getScenarios(lang).map((s) => ({
      id: `scenario-${s.id}`,
      label: s.title,
      sub: t('palette.groupScenarios'),
      to: '/practice/scenarios',
      group: t('palette.groupScenarios'),
    }))
    const labItems: Item[] = [
      { id: 'lab-sim', label: t('lab.simulatorTitle'), sub: t('lab.simulatorDesc'), to: '/lab/simulator', group: t('palette.groupLab') },
      { id: 'lab-debug', label: t('lab.debuggerTitle'), sub: t('lab.debuggerDesc'), to: '/lab/debugger', group: t('palette.groupLab') },
      { id: 'lab-id', label: t('lab.identifierTitle'), sub: 'MsgId, InstrId, EndToEndId, TxId', to: '/lab/identifiers', group: t('palette.groupLab') },
      { id: 'lab-xml', label: t('lab.xmlTitle'), sub: t('lab.xmlDesc'), to: '/lab/xml', group: t('palette.groupLab') },
      { id: 'lab-break', label: t('lab.breakTitle'), sub: t('lab.breakDesc'), to: '/lab/break-message', group: t('palette.groupLab') },
    ]
    return [...lessonItems, ...messageItems, ...glossaryItems, ...confusionItems, ...scenarioItems, ...labItems]
  }, [lang, t])

  const miniSearch = useMemo(() => {
    const ms = new MiniSearch<Item>({
      idField: 'id',
      fields: ['label', 'sub', 'group'],
      storeFields: ['label', 'sub', 'to', 'group'],
      searchOptions: { prefix: true, fuzzy: 0.2, boost: { label: 3, group: 1 } },
    })
    ms.addAll(items)
    return ms
  }, [items])

  const filtered: Item[] = useMemo(() => {
    if (!query.trim()) return items.slice(0, 20)
    return miniSearch.search(query).slice(0, 20).map((r) => ({ id: r.id as string, label: r.label, sub: r.sub, to: r.to, group: r.group }))
  }, [query, miniSearch, items])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-24" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('palette.placeholder')}
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none"
        />
        <div className="max-h-96 overflow-y-auto py-1">
          {filtered.length === 0 && <div className="px-4 py-6 text-center text-sm text-muted">{t('palette.noResults')}</div>}
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.to)
                setOpen(false)
              }}
              className="flex w-full flex-col items-start gap-0.5 px-4 py-2 text-left hover:bg-surface2"
            >
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-xs text-muted">{item.sub} · {item.group}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
