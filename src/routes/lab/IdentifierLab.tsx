import { Card, CardTitle } from '@/components/ui/Card'
import { IdentifierTracer } from '@/components/learning/IdentifierTracer'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'

const traceMessages = [
  { messageId: 'pacs.008', linkFieldId: 'EndToEndId', linkFieldLabel: 'EndToEndId' },
  { messageId: 'pacs.002', linkFieldId: 'OrgnlEndToEndId', linkFieldLabel: 'OrgnlEndToEndId' },
  { messageId: 'pacs.004', linkFieldId: 'OrgnlEndToEndId', linkFieldLabel: 'OrgnlEndToEndId' },
]

const transactions = [
  { instrId: 'INS-001', endToEndId: 'E2E-ALICE-BOB-0001', txId: 'TX-000123-01' },
  { instrId: 'INS-002', endToEndId: 'E2E-ALICE-CARLA-0002', txId: 'TX-000123-02' },
  { instrId: 'INS-003', endToEndId: 'E2E-ALICE-DAVE-0003', txId: 'TX-000123-03' },
]

export function IdentifierLab() {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('idlab.title')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t('idlab.description')}</p>
      </div>

      <Card>
        <CardTitle>{t('idlab.message')}</CardTitle>
        <div className="mt-1 font-mono text-sm">MsgId: MSG-2026-000123</div>
        <p className="mt-1 text-xs text-muted">{t('idlab.messageNote')}</p>
      </Card>

      <div className="flex flex-col gap-3">
        {transactions.map((tx, i) => (
          <Card key={tx.instrId} className="border-l-4 border-primary/40">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{t('idlab.transaction')} {i + 1}</div>
            <div className="grid grid-cols-1 gap-2 font-mono text-sm sm:grid-cols-3">
              <div>InstrId: {tx.instrId}</div>
              <div>EndToEndId: {tx.endToEndId}</div>
              <div>TxId: {tx.txId}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle>{t('idlab.exercise')}</CardTitle>
        <p className="text-sm text-text/90">
          {lang === 'es'
            ? 'Este único mensaje contiene tres transacciones. Si necesitaras rastrear la transacción 2 hasta un reporte de estado o una devolución enviada por el lado receptor, ¿qué identificador esperarías que permanezca más confiablemente sin cambios, y qué identificador solo tendría sentido comparar dentro del contexto de este mensaje original?'
            : "This single message contains three transactions. If you needed to trace transaction 2 all the way to a status report or a return sent by the receiving side, which identifier would you expect to remain most reliably unchanged, and which identifier would only make sense to compare within the context of this original message?"}
        </p>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-primary">{t('idlab.reveal')}</summary>
          <p className="mt-2 text-text/90">
            {lang === 'es'
              ? 'EndToEndId (por ejemplo, E2E-ALICE-CARLA-0002) está diseñado para viajar sin cambios desde el deudor original hasta el acreedor final, por lo que generalmente es el campo más confiable para el rastreo de extremo a extremo entre mensajes. MsgId solo tiene sentido para referenciar este sobre de mensaje específico — un reporte de estado sobre la transacción 2 referenciaría el EndToEndId de la transacción original, no necesariamente el MsgId original.'
              : "EndToEndId (e.g. E2E-ALICE-CARLA-0002) is designed to travel unchanged from the original debtor to the final creditor, so it is generally the most reliable field for end-to-end tracing across messages. MsgId only makes sense to reference this specific message envelope — a status report about transaction 2 would reference the original transaction's EndToEndId, not necessarily the original MsgId."}
          </p>
        </details>
      </Card>

      <IdentifierTracer messages={traceMessages} />
    </div>
  )
}
