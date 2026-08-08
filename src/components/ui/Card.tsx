import clsx from 'clsx'
import type { ReactNode } from 'react'

export function Card({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return <div id={id} className={clsx('rounded-lg border border-border bg-surface p-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={clsx('mb-1 text-sm font-semibold', className)}>{children}</h3>
}
