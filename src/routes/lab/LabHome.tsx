import { Link } from 'react-router-dom'
import { Card, CardTitle } from '@/components/ui/Card'

const tools = [
  { to: '/lab/simulator', title: 'Payment Simulator', desc: 'Configure and run a payment through a synthetic end-to-end flow.' },
  { to: '/lab/debugger', title: 'Payment Debugger', desc: 'Investigate a failed payment: find where it broke and what to check next.' },
  { to: '/lab/identifiers', title: 'Identifier Lab', desc: 'Understand MsgId, InstrId, EndToEndId and TxId across a multi-transaction message.' },
  { to: '/lab/reject-return', title: 'Reject vs. Return Trainer', desc: 'Place a failure on the lifecycle and decide: reject, return, or something else?' },
]

export function LabHome() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Lab</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Hands-on tools: simulate payments, debug failures, and experiment with identifiers — all using synthetic data.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <Link key={t.to} to={t.to}>
            <Card className="h-full hover:border-primary/50">
              <CardTitle>{t.title}</CardTitle>
              <p className="text-sm text-muted">{t.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
