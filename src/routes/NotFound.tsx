import { Link } from 'react-router-dom'
import { useT } from '@/i18n/strings'

export function NotFound() {
  const t = useT()
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="text-4xl font-bold text-muted">404</div>
      <p className="text-sm text-muted">{t('notfound.text')}</p>
      <Link to="/" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">{t('notfound.back')}</Link>
    </div>
  )
}
