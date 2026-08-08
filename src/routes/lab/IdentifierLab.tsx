import { Card, CardTitle } from '@/components/ui/Card'

const transactions = [
  { instrId: 'INS-001', endToEndId: 'E2E-ALICE-BOB-0001', txId: 'TX-000123-01' },
  { instrId: 'INS-002', endToEndId: 'E2E-ALICE-CARLA-0002', txId: 'TX-000123-02' },
  { instrId: 'INS-003', endToEndId: 'E2E-ALICE-DAVE-0003', txId: 'TX-000123-03' },
]

export function IdentifierLab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Identifier Lab</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          One message can carry several transactions, and each transaction can carry several identifiers. This lab makes the
          message-level vs. transaction-level distinction visible.
        </p>
      </div>

      <Card>
        <CardTitle>MESSAGE</CardTitle>
        <div className="mt-1 font-mono text-sm">MsgId: MSG-2026-000123</div>
        <p className="mt-1 text-xs text-muted">Message-level — identifies the envelope containing all transactions below.</p>
      </Card>

      <div className="flex flex-col gap-3">
        {transactions.map((t, i) => (
          <Card key={t.instrId} className="border-l-4 border-primary/40">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Transaction {i + 1}</div>
            <div className="grid grid-cols-1 gap-2 font-mono text-sm sm:grid-cols-3">
              <div>InstrId: {t.instrId}</div>
              <div>EndToEndId: {t.endToEndId}</div>
              <div>TxId: {t.txId}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle>Exercise</CardTitle>
        <p className="text-sm text-text/90">
          This single message contains three transactions. If you needed to trace transaction 2 all the way to a status report
          or a return sent by the receiving side, which identifier would you expect to remain most reliably unchanged, and
          which identifier would only make sense to compare within the context of this original message?
        </p>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-primary">Reveal reasoning</summary>
          <p className="mt-2 text-text/90">
            EndToEndId (e.g. E2E-ALICE-CARLA-0002) is designed to travel unchanged from the original debtor to the final
            creditor, so it is generally the most reliable field for end-to-end tracing across messages. MsgId only makes sense
            to reference this specific message envelope — a status report about transaction 2 would reference the original
            transaction's EndToEndId, not necessarily the original MsgId.
          </p>
        </details>
      </Card>
    </div>
  )
}
