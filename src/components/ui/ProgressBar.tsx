import clsx from 'clsx'

const toneStyles = {
  primary: 'bg-primary',
  success: 'bg-success',
  scheme: 'bg-scheme',
  iso: 'bg-iso',
  warning: 'bg-warning',
}

export function ProgressBar({ value, tone = 'primary' }: { value: number; tone?: keyof typeof toneStyles }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface2">
      <div className={clsx('h-full rounded-full transition-all', toneStyles[tone])} style={{ width: `${clamped}%` }} />
    </div>
  )
}
