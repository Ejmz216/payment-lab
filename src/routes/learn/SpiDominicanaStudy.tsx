import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, CheckCircle2, CircleHelp, Landmark, Layers3, Route, SearchCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Card, CardTitle, type CardVariant } from '@/components/ui/Card'
import { ScenarioCard } from '@/components/practice/ScenarioCard'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
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
    role: 'Instruccion interbancaria para mover una transferencia de credito de CUSTOMER_A hacia CUSTOMER_B.',
    when: 'Cuando BANK_A necesita instruir a BANK_B o a la infraestructura de pagos para procesar el pago.',
    notThis: 'No prueba por si solo que el pago fue aceptado, liquidado o acreditado.',
    variant: 'simulation',
    accent: 'text-pacs',
  },
  {
    id: 'pacs.004',
    family: 'pacs',
    title: 'PaymentReturn',
    role: 'Devolucion de un pago que ya progreso y debe regresar al lado originador.',
    when: 'Despues de aceptacion/progreso del pago, cuando algo impide completar o mantener el credito final.',
    notThis: 'No es un rechazo temprano. No es una consulta de cuenta.',
    variant: 'warning',
    accent: 'text-danger',
  },
  {
    id: 'camt.003',
    family: 'camt',
    title: 'GetAccount',
    role: 'Consulta de informacion de cuenta o balance; sirve para visibilidad operativa, no para mover dinero.',
    when: 'Cuando un participante o administrador necesita consultar estado de cuenta, liquidez o detalles de cuenta.',
    notThis: 'No instruye un pago. Su respuesta natural puede ser camt.004 ReturnAccount, no pacs.004.',
    variant: 'reference',
    accent: 'text-camt',
  },
]

const publicSteps = [
  'Cliente inicia un pago o transferencia en un canal autorizado.',
  'La entidad originadora recibe y valida la instruccion del cliente.',
  'El esquema SPI/SGPI publico permite pagos instantaneos entre entidades participantes.',
  'La entidad receptora recibe informacion suficiente para decidir si acredita o rechaza.',
  'El cliente beneficiario debe ver disponibilidad de fondos cuando el pago se completa correctamente.',
]

const verifyQuestions = [
  'Que mensaje exacto usa el SPI/SGPI dominicano para la instruccion interbancaria?',
  'Donde aparece pacs.008 si el esquema lo adopta: banco a infraestructura, infraestructura a banco receptor, o ambos?',
  'Que evento publico marca aceptacion del esquema versus aceptacion de la entidad receptora?',
  'Cuando aplica una devolucion tipo pacs.004 y que codigos/motivos permite el esquema?',
  'camt.003 se usa en SPI/SGPI para liquidez/cuenta, o solo en otro modulo operativo?',
  'La respuesta a camt.003 se hace con camt.004 ReturnAccount y en que version?',
]

function TruthLabel({ children, tone }: { children: string; tone: 'iso' | 'scheme' | 'verify' }) {
  const style = {
    iso: 'border-iso/40 bg-iso/10 text-iso',
    scheme: 'border-scheme/40 bg-scheme/10 text-scheme',
    verify: 'border-warning/40 bg-warning/10 text-warning',
  }[tone]
  return <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style}`}>{children}</span>
}

export function SpiDominicanaStudy() {
  const lang = useUIStore((s) => s.lang)
  const t = useT()
  const isEs = lang === 'es'
  const triageScenario = getScenarios(lang).find((scenario) => scenario.id === 'spi-rd-message-triage')
  const completedModules = useProgressStore((state) => state.completedModules ?? [])
  const completeModule = useProgressStore((state) => state.completeModule)
  const moduleComplete = completedModules.includes('spi-dominicana-overview')

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: t('nav.dashboard'), to: '/' }, { label: t('fp.title'), to: '/learn/fast-payments' }, { label: 'SPI Republica Dominicana' }]} />

      <section className="technical-surface rounded-lg border border-scheme/35 bg-scheme/10 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <TruthLabel tone="scheme">PUBLIC SCHEME</TruthLabel>
              <TruthLabel tone="iso">ISO 20022</TruthLabel>
              <TruthLabel tone="verify">TO VERIFY</TruthLabel>
            </div>
            <h1 className="mt-3 text-2xl font-semibold">SPI / SGPI Republica Dominicana</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text/90">
              {isEs
                ? 'Ruta corta para estudiar pacs.008, pacs.004 y camt.003 usando el sistema dominicano como caso publico. La regla principal: separar lo que ISO define, lo que el BCRD publica sobre el esquema, y lo que aun tendrias que confirmar en una guia tecnica autorizada.'
                : 'A short study path for pacs.008, pacs.004 and camt.003 using the Dominican instant-payments system as a public case study. The key rule: separate what ISO defines, what BCRD publicly says about the scheme, and what still needs confirmation from an authorized technical guide.'}
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
          <p className="text-sm text-text/90">Define mensajes y semantica: pacs.008 mueve una instruccion de credito, pacs.004 devuelve un pago, camt.003 consulta informacion de cuenta.</p>
        </Card>
        <Card variant="public-scheme">
          <div className="mb-2 flex items-center gap-2">
            <Route size={17} className="text-scheme" />
            <CardTitle className="mb-0">2. SPI / SGPI publico</CardTitle>
          </div>
          <p className="text-sm text-text/90">El BCRD presenta el SGPI/SPI como plataforma de pagos instantaneos. Esta app solo usa esa informacion publica como contexto del caso.</p>
        </Card>
        <Card variant="investigation">
          <div className="mb-2 flex items-center gap-2">
            <CircleHelp size={17} className="text-warning" />
            <CardTitle className="mb-0">3. Implementacion</CardTitle>
          </div>
          <p className="text-sm text-text/90">Versiones, endpoints, reglas de timeout, codigos, SLAs y mapeos exactos quedan como preguntas de verificacion, no como afirmaciones.</p>
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
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">Que hace</div>
                <p className="mt-1 text-sm text-text/90">{message.role}</p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">Cuando aparece</div>
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
            <CardTitle className="mb-0">Modelo publico simplificado del SPI/SGPI</CardTitle>
          </div>
          <ol className="flex flex-col gap-2">
            {publicSteps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-md border border-border bg-surface/50 p-2 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-scheme/20 text-xs font-bold text-scheme">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted">
            PUBLIC SCHEME: este flujo es conceptual y publico. No afirma arquitectura interna, colas, APIs, retries ni versiones ISO usadas por participantes.
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
            <p className="mt-1 text-sm text-text/90">Devuelve una transferencia que ya progreso. Se entiende mirando el pago original, usualmente pacs.008-style.</p>
          </div>
          <div className="rounded-md border border-camt/30 bg-camt/10 p-3">
            <div className="font-mono text-sm font-semibold text-camt">camt.004 ReturnAccount</div>
            <p className="mt-1 text-sm text-text/90">Responde una consulta de cuenta/balance. Se entiende junto con camt.003 GetAccount.</p>
          </div>
        </div>
      </Card>

      {triageScenario && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Micro-practica</h2>
          <ScenarioCard scenario={triageScenario} />
        </section>
      )}

      <div className="flex justify-end border-t border-border pt-4">
        {moduleComplete ? (
          <div className="flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 size={17} /> {isEs ? 'Módulo completado' : 'Module complete'}</div>
        ) : (
          <button onClick={() => completeModule('spi-dominicana-overview')} className="rounded-md bg-success px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            {isEs ? 'Marcar módulo como completado' : 'Mark module complete'}
          </button>
        )}
      </div>
    </div>
  )
}
