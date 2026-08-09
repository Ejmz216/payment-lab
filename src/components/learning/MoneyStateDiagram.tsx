import { useState } from 'react'
import {
  BadgeCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CircleHelp,
  FileCheck2,
  Landmark,
  LockKeyhole,
  MapPin,
  ShieldAlert,
  UserRound,
} from 'lucide-react'
import clsx from 'clsx'
import type { MoneyStateBlock, MoneyStateTone, MoneyZoneKind } from '@/types/blocks'
import { Badge } from '@/components/ui/Badge'
import { Card, CardTitle } from '@/components/ui/Card'
import { useT } from '@/i18n/strings'

const zoneIcons: Record<MoneyZoneKind, typeof UserRound> = {
  party: UserRound,
  agent: Building2,
  infrastructure: Landmark,
}

const zoneStyles: Record<MoneyZoneKind, string> = {
  party: 'border-party/35 bg-party/10 text-party',
  agent: 'border-agent/35 bg-agent/10 text-agent',
  infrastructure: 'border-infra/35 bg-infra/10 text-infra',
}

const toneStyles: Record<MoneyStateTone, string> = {
  available: 'border-success/40 bg-success/10 text-success',
  reserved: 'border-warning/40 bg-warning/10 text-warning',
  settled: 'border-infra/40 bg-infra/10 text-infra',
  credited: 'border-camt/40 bg-camt/10 text-camt',
  uncertain: 'border-danger/40 bg-danger/10 text-danger',
}

const toneIcons: Record<MoneyStateTone, typeof CircleDollarSign> = {
  available: CircleDollarSign,
  reserved: LockKeyhole,
  settled: Landmark,
  credited: BadgeCheck,
  uncertain: CircleHelp,
}

export function MoneyStateDiagram({ block }: { block: MoneyStateBlock }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const t = useT()
  const selected = block.states[selectedIndex]
  const StateIcon = toneIcons[selected.tone]

  function move(offset: number) {
    setSelectedIndex((current) => Math.min(Math.max(current + offset, 0), block.states.length - 1))
  }

  return (
    <Card variant="public-scheme" className="technical-surface overflow-hidden p-0">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="mb-0 text-base">{block.heading}</CardTitle>
          {block.badge && <Badge type={block.badge} />}
        </div>
        {block.intro && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text/85">{block.intro}</p>}
      </div>

      <div className="grid grid-cols-2 border-b border-border bg-bg/40 md:grid-cols-4" role="tablist" aria-label={t('moneyState.states')}>
        {block.states.map((state, index) => {
          const Icon = toneIcons[state.tone]
          const active = index === selectedIndex
          return (
            <button
              key={state.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedIndex(index)}
              className={clsx(
                'flex min-h-16 items-center gap-2 border-b border-r border-border px-3 py-3 text-left text-xs transition-colors last:border-r-0 md:border-b-0',
                index === 1 && 'border-r-0 md:border-r',
                active ? toneStyles[state.tone] : 'bg-bg/30 text-muted hover:bg-surface2 hover:text-text',
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-current/35">
                <Icon size={15} />
              </span>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-wide opacity-70">{t('moneyState.state')} {index + 1}</span>
                <span className="mt-0.5 block font-semibold leading-tight">{state.label}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="px-4 py-5 sm:px-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-md border', toneStyles[selected.tone])}>
              <StateIcon size={20} />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">{t('moneyState.current')}</div>
              <h4 className="text-base font-semibold">{selected.label}</h4>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={selectedIndex === 0}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg/60 text-muted hover:text-text disabled:cursor-not-allowed disabled:opacity-35"
              aria-label={t('moneyState.previous')}
              title={t('moneyState.previous')}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={selectedIndex === block.states.length - 1}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg/60 text-muted hover:text-text disabled:cursor-not-allowed disabled:opacity-35"
              aria-label={t('moneyState.next')}
              title={t('moneyState.next')}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: `repeat(${block.zones.length * 2 - 1}, minmax(0, 1fr))`,
              minWidth: `${Math.max(block.zones.length * 8.4, 24)}rem`,
            }}
            aria-label={t('moneyState.whereValue')}
          >
            {block.zones.map((zone, index) => {
              const Icon = zoneIcons[zone.kind]
              const active = selected.activeZoneIds.includes(zone.id)
              return (
                <div key={zone.id} className="contents">
                  <div
                    className={clsx(
                      'flex min-h-24 flex-col items-center justify-center rounded-md border px-2 py-3 text-center transition-colors',
                      active ? zoneStyles[zone.kind] : 'border-border bg-bg/55 text-muted',
                    )}
                  >
                    <span className={clsx('flex h-8 w-8 items-center justify-center rounded border', active ? 'border-current/35' : 'border-border')}>
                      <Icon size={17} />
                    </span>
                    <span className="mt-2 text-[11px] font-semibold leading-tight">{zone.label}</span>
                    <span className="mt-1 text-[9px] font-semibold uppercase tracking-wide opacity-65">{t(`moneyState.zone.${zone.kind}`)}</span>
                  </div>
                  {index < block.zones.length - 1 && (
                    <div className="flex items-center px-1 text-border" aria-hidden="true">
                      <span className="h-px flex-1 bg-current" />
                      <ChevronRight size={14} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 border-l-2 border-primary pl-3">
          <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-primary">{t('moneyState.position')}</div>
            <p className="mt-1 text-sm font-medium">{selected.position}</p>
            <p className="mt-1 text-sm leading-relaxed text-text/80">{selected.summary}</p>
          </div>
        </div>
      </div>

      <div className="grid border-t border-border bg-bg/35 md:grid-cols-2">
        <div className="border-b border-border p-4 md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-success">
            <FileCheck2 size={15} /> {t('moneyState.evidence')}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text/80">{selected.evidence}</p>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-warning">
            <ShieldAlert size={15} /> {t('moneyState.notProven')}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text/80">{selected.notProven}</p>
        </div>
      </div>

      {block.schemeNote && (
        <div className="border-t border-scheme/30 bg-scheme/10 px-4 py-3 text-xs leading-relaxed text-text/80 sm:px-5">
          <span className="font-semibold text-scheme">{t('moneyState.schemeNote')}: </span>
          {block.schemeNote}
        </div>
      )}
    </Card>
  )
}
