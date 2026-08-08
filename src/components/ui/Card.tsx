import clsx from 'clsx'
import type { ReactNode } from 'react'

export type CardVariant =
  | 'default'
  | 'study'
  | 'reference'
  | 'public-scheme'
  | 'simulation'
  | 'investigation'
  | 'warning'

const variantStyles: Record<CardVariant, string> = {
  default: 'border-border bg-surface',
  study: 'border-primary/35 bg-primary/5',
  reference: 'border-iso/35 bg-iso/5',
  'public-scheme': 'border-scheme/45 bg-scheme/10',
  simulation: 'border-camt/35 bg-camt/5',
  investigation: 'border-warning/40 bg-warning/10',
  warning: 'border-danger/40 bg-danger/10',
}

export function Card({
  children,
  className,
  id,
  variant = 'default',
}: {
  children: ReactNode
  className?: string
  id?: string
  variant?: CardVariant
}) {
  return (
    <div id={id} className={clsx('rounded-lg border p-4 shadow-sm shadow-bg/20', variantStyles[variant], className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={clsx('mb-1 text-sm font-semibold', className)}>{children}</h3>
}
