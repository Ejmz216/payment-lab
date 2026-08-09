import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Building2, CheckCircle2, CircleHelp, Landmark, Layers3, Route, SearchCheck, UserRound } from 'lucide-react'
import { Card, CardTitle, type CardVariant } from '@/components/ui/Card'
import { ScenarioCard } from '@/components/practice/ScenarioCard'
import { useUIStore } from '@/store/uiStore'
import { getScenarios } from '@/lib/i18nContent'
import { useProgressStore } from '@/store/progressStore'

const messageCards: {
  id: string
  family: string
  title: string
  role: string
  when: string
  notThis: string
  variant: CardVariant
  accent: string
}[] = [
  {
    id: 'pacs.008',
    family: 'pacs',
    title: 'FIToFICustomerCreditTransfer',
    role: 'Instrucción interbancaria para mover una transferencia de crédito de CUSTOMER_A hacia CUSTOMER_B.',
    when: 'Cuando BANK_A necesita instruir a BANK_B o a la infraestructura de pagos para procesar el pago.',
    notThis: 'No prueba por sí solo que el pago fue aceptado, liquidado o acreditado.',
    variant: 'simulation',
    accent: 'text-pacs',
  },
  {
    id: 'pacs.004',
    family: 'pacs',
    title: 'PaymentReturn',
    role: 'Devolución de un pago que ya progresó y debe regresar al lado originador.',
    when: 'Después de aceptación/progreso del pago, cuando algo impide completar o mantener el crédito final.',
    notThis: 'No es un rechazo temprano ni una consulta de cuenta.',
    variant: 'warning',
    accent: 'text-danger',
  },
  {
    id: 'camt.003',
    family: 'camt',
    title: 'GetAccount',
    role: 'Consulta de información de cuenta o balance; sirve para visibilidad operativa, no para mover dinero.',
    when: 'Cuando un participante o administrador necesita consultar estado de cuenta, liquidez o detalles de cuenta.',
    notThis: 'No instruye un pago. Su respuesta natural puede ser camt.004 ReturnAccount, no pacs.004.',
    variant: 'reference',
    accent: 'text-camt',
  },
]

const actorRoles = [
  { label: 'CUSTOMER_A', role: 'Pagador', detail: 'Inicia la solicitud desde un canal ofrecido por un participante.', tone: 'border-party/35 bg-party/10 text-party' },
  { label: 'BANK_A', role: 'Participante originador', detail: 'Recibe la solicitud, controla los fondos y presenta la operación al esquema.', tone: 'border-agent/35 bg-agent/10 text-agent' },
  { label: 'SGPI / BCRD', role: 'Infraestructura pública', detail: 'El BCRD administra la plataforma que conecta y enruta operaciones entre participantes.', tone: 'border-scheme/40 bg-scheme/10 text-scheme' },
  { label: 'BANK_B', role: 'Participante receptor', detail: 'Decide sobre la operación y, cuando corresponde, acredita al beneficiario.', tone: 'border-agent/35 bg-agent/10 text-agent' },
  { label: 'CUSTOMER_B', role: 'Beneficiario', detail: 'Recibe disponibilidad de los fondos cuando el crédito se completa.', tone: 'border-party/35 bg-party/10 text-party' },
]

const verifyQuestions = [
  '¿Qué mensaje exacto usa el SGPI dominicano para la instrucción interbancaria?',
  '¿Dónde aparece pacs.008 si el esquema lo adopta: banco a infraestructura, infraestructura a banco receptor, o ambos?',
  '¿Qué evento público marca aceptación del esquema versus aceptación de la entidad receptora?',
  '¿Cuándo aplica una devolución tipo pacs.004 y qué códigos/motivos permite el esquema?',
  '¿camt.003 se usa en SGPI para liquidez/cuenta, o solo en otro módulo operativo?',
  '¿La respuesta a camt.003 se hace con camt.004 ReturnAccount y en qué versión?',
]

function TruthLabel({ children, tone }: { children: string; tone: 'iso' | 'scheme' | 'verify' }) {
  const style = {
    iso: 'border-iso/40 bg-iso/10 text-iso',
    scheme: 'border-scheme/40 bg-scheme/10 text-scheme',
    verify: 'border-warning/40 bg-warning/10 text-warning',
  }[tone]
  return <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style}`}>{children}</span>
}

export function SpiDominicanaStudy() {
  const lang = useUIStore((s) => s.lang)
  const isEs = lang === 'es'
  const triageScenario = getScenarios(lang).find((scenario) => scenario.id === 'spi-rd-message-triage')
  const completedModules = useProgressStore((state) => state.completedModules ?? [])
  const completeModule = useProgressStore((state) => state.completeModule)
  const moduleComplete = completedModules.includes('spi-dominicana-overview')

  return (
    <div className="flex flex-col gap-6">
      <section className="technical-surface rounded-lg border border-scheme/35 bg-scheme/10 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <TruthLabel tone="scheme">PUBLIC SCHEME</TruthLabel>
              <TruthLabel tone="iso">ISO 20022</TruthLabel>
              <TruthLabel tone="verify">TO VERIFY</TruthLabel>
            </div>
            <h1 className="mt-3 text-2xl font-semibold">Actores y rol del SGPI</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text/90">
              {isEs
                ? 'Empieza ubicando a cada actor del pago instantáneo dominicano. Luego separa lo que ISO define, lo que el BCRD publica sobre el esquema y lo que todavía exige una guía técnica autorizada.'
                : 'Start by locating each actor in the Dominican instant-payment flow. Then separate what ISO defines, what BCRD publicly says about the scheme, and what still requires an authorized technical guide.'}
            </p>
          </div>
          <Landmark className="text-scheme" size={34} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card variant="reference">
          <div className="mb-2 flex items-center gap-2">
            <Layers3 size={17} className="text-iso" />
            <CardTitle className="mb-0">1. ISO</CardTitle>
          </div>
          <p className="text-sm text-text/90">Define mensajes y semántica: pacs.008 lleva una instrucción de crédito, pacs.004 devuelve un pago y camt.003 consulta información de cuenta.</p>
        </Card>
        <Card variant="public-scheme">
          <div className="mb-2 flex items-center gap-2">
            <Route size={17} className="text-scheme" />
            <CardTitle className="mb-0">2. SGPI público</CardTitle>
          </div>
          <p className="text-sm text-text/90">El BCRD presenta el SGPI como plataforma de pagos instantáneos. Esta app usa únicamente esa información pública como contexto del caso.</p>
        </Card>
        <Card variant="investigation">
          <div className="mb-2 flex items-center gap-2">
            <CircleHelp size={17} className="text-warning" />
            <CardTitle className="mb-0">3. Implementacion</CardTitle>
          </div>
          <p className="text-sm text-text/90">Versiones, endpoints, reglas de timeout, códigos, SLA y mapeos exactos quedan como preguntas de verificación, no como afirmaciones.</p>
        </Card>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Mensajes que necesitas dominar</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {messageCards.map((message) => (
            <Card key={message.id} variant={message.variant} className="flex h-full flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className={`font-mono text-lg font-semibold ${message.accent}`}>{message.id}</div>
                  <div className="text-xs text-muted">{message.title}</div>
                </div>
                <span className="rounded border border-border bg-surface/70 px-2 py-1 text-[10px] uppercase tracking-wide text-muted">{message.family}</span>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">Qué hace</div>
                <p className="mt-1 text-sm text-text/90">{message.role}</p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">Cuándo aparece</div>
                <p className="mt-1 text-sm text-text/90">{message.when}</p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">No confundas</div>
                <p className="mt-1 text-sm text-text/90">{message.notThis}</p>
              </div>
              <Link to={`/atlas/messages/${message.id}`} className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                Abrir en Atlas <ArrowRight size={14} />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card variant="public-scheme">
          <div className="mb-3 flex items-center gap-2">
            <BadgeCheck size={17} className="text-scheme" />
            <CardTitle className="mb-0">Actores del flujo público</CardTitle>
          </div>
          <ol className="flex flex-col gap-2">
            {actorRoles.map((actor, index) => (
              <li key={actor.label} className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-md border p-3 ${actor.tone}`}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-current/30">
                  {index === 0 || index === actorRoles.length - 1 ? <UserRound size={14} /> : index === 2 ? <Landmark size={14} /> : <Building2 size={14} />}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2"><span className="font-mono text-sm font-semibold">{actor.label}</span><span className="text-xs text-text/70">{actor.role}</span></div>
                  <p className="mt-1 text-sm text-text/85">{actor.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted">
            PUBLIC SCHEME: el BCRD administra el SGPI. La arquitectura, componentes y procesos internos de cada participante siguen como preguntas de implementación.
          </p>
        </Card>

        <Card variant="investigation">
          <div className="mb-3 flex items-center gap-2">
            <SearchCheck size={17} className="text-warning" />
            <CardTitle className="mb-0">Preguntas para verificar</CardTitle>
          </div>
          <ul className="flex flex-col gap-2">
            {verifyQuestions.map((question) => (
              <li key={question} className="flex gap-2 text-sm">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card variant="warning">
        <CardTitle>La confusion critica</CardTitle>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-danger/30 bg-danger/10 p-3">
              <div className="font-mono text-sm font-semibold text-danger">pacs.004 PaymentReturn</div>
            <p className="mt-1 text-sm text-text/90">Devuelve una transferencia que ya progresó. Se entiende mirando el pago original, normalmente de tipo pacs.008.</p>
          </div>
          <div className="rounded-md border border-camt/30 bg-camt/10 p-3">
            <div className="font-mono text-sm font-semibold text-camt">camt.004 ReturnAccount</div>
            <p className="mt-1 text-sm text-text/90">Responde una consulta de cuenta/balance. Se entiende junto con camt.003 GetAccount.</p>
          </div>
        </div>
      </Card>

      {triageScenario && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Micropráctica</h2>
          <ScenarioCard scenario={triageScenario} />
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        {moduleComplete ? (
          <div className="flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 size={17} /> {isEs ? 'Módulo completado' : 'Module complete'}</div>
        ) : (
          <button onClick={() => completeModule('spi-dominicana-overview')} className="rounded-md bg-success px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            {isEs ? 'Marcar módulo como completado' : 'Mark module complete'}
          </button>
        )}
        <Link to="/learn/fast-payments/sgpi-public-happy-path" className="inline-flex min-h-10 items-center gap-2 rounded-md border border-scheme/45 bg-scheme/10 px-4 py-2 text-sm font-medium text-scheme hover:bg-scheme/15">
          {isEs ? 'Continuar: Happy Path público' : 'Continue: Public happy path'} <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
