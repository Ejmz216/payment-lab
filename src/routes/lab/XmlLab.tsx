import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { Card, CardTitle } from '@/components/ui/Card'
import { XmlEditor } from '@/components/xml/XmlEditor'
import { MessageTree } from '@/components/messages/MessageTree'
import { xmlSamples } from '@/content/xmlSamples'
import { getMessage } from '@/lib/i18nContent'
import { buildXmlSyncMaps, findPath } from '@/lib/tree'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import type { MessageFieldNode } from '@/types/content'

export function XmlLab() {
  const [sampleId, setSampleId] = useState(xmlSamples[0].id)
  const [selectedNode, setSelectedNode] = useState<MessageFieldNode | null>(null)
  const [highlightLine, setHighlightLine] = useState<number | null>(null)
  const lang = useUIStore((s) => s.lang)
  const t = useT()

  const sample = xmlSamples.find((s) => s.id === sampleId)!
  const message = getMessage(sample.messageId, lang)
  const tree = message?.versions[0].tree

  const syncMaps = useMemo(() => {
    if (!tree) return null
    return buildXmlSyncMaps(sample.xml, tree)
  }, [sample, tree])

  const path = useMemo(() => {
    if (!tree || !selectedNode) return null
    return findPath(tree, selectedNode.id)
  }, [tree, selectedNode])

  function handleCursorLine(lineNumber: number) {
    const node = syncMaps?.lineToNode.get(lineNumber)
    if (node) setSelectedNode(node)
  }

  function handleTreeSelect(node: MessageFieldNode) {
    setSelectedNode(node)
    const line = syncMaps?.nodeIdToLine.get(node.id)
    if (line) setHighlightLine(line)
  }

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-semibold">{t('xmllab.title')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t('xmllab.description')}</p>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
        <span>{t('xmllab.safety')}</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-muted">{t('xmllab.sample')}</label>
        <select
          value={sampleId}
          onChange={(e) => { setSampleId(e.target.value); setSelectedNode(null); setHighlightLine(null) }}
          className="rounded-md border border-border bg-surface2 px-2 py-1 text-sm"
        >
          {xmlSamples.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        {message && (
          <Link to={`/atlas/messages/${message.id}`} className="ml-auto text-xs text-primary hover:underline">
            {t('xmllab.viewMessage')}: {message.id} →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">XML</div>
          <XmlEditor value={sample.xml} onCursorLine={handleCursorLine} highlightLine={highlightLine} />
          <p className="text-xs text-muted">{t('xmllab.clickHint')}</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">{t('xmllab.structure')}</div>
          {tree && <MessageTree root={tree} selectedId={selectedNode?.id ?? null} onSelect={handleTreeSelect} />}
          <p className="text-xs text-muted">{t('xmllab.treeClickHint')}</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">{t('xmllab.meaning')}</div>

          {path && path.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 rounded-md border border-border bg-surface2 px-2 py-1.5 font-mono text-[11px] text-muted">
              {path.map((node, i) => (
                <span key={node.id} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={11} className="shrink-0" />}
                  <button
                    onClick={() => handleTreeSelect(node)}
                    className={i === path.length - 1 ? 'font-semibold text-primary' : 'hover:text-text'}
                  >
                    {node.xmlTag}
                  </button>
                </span>
              ))}
            </div>
          )}

          {selectedNode ? (
            <Card>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="font-mono text-sm font-semibold text-primary">{selectedNode.xmlTag}</span>
                <span className="text-xs text-muted">{selectedNode.name}</span>
              </div>
              <dl className="flex flex-col gap-2 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">{t('msg.businessMeaning')}</dt>
                  <dd className="mt-0.5 text-text/90">{selectedNode.businessMeaning}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">{t('msg.cardinality')}</dt>
                  <dd className="mt-0.5 text-text/90">{selectedNode.cardinality}</dd>
                </div>
                {selectedNode.whyItMatters && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">{t('msg.whyMatters')}</dt>
                    <dd className="mt-0.5 text-text/90">{selectedNode.whyItMatters}</dd>
                  </div>
                )}
                {selectedNode.relatedFields && selectedNode.relatedFields.length > 0 && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">{t('msg.relatedFields')}</dt>
                    <dd className="mt-0.5 font-mono text-xs text-text/90">{selectedNode.relatedFields.join(', ')}</dd>
                  </div>
                )}
              </dl>
            </Card>
          ) : (
            <Card className="flex min-h-[10rem] items-center justify-center text-center text-sm text-muted">
              {t('xmllab.selectHint')}
            </Card>
          )}

          <Card>
            <CardTitle>{t('xmllab.pipeline')}</CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
              {['XML', t('xmllab.dataModel'), t('xmllab.businessMeaning'), t('xmllab.paymentBehavior')].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-1.5">
                  <span className="rounded-full border border-border bg-surface2 px-2 py-1">{step}</span>
                  {i < arr.length - 1 && <span className="text-muted">→</span>}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
