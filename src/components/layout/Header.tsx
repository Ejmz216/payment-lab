import { Search, Moon, Sun, ShieldCheck, Languages } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useProgressStore } from '@/store/progressStore'
import { useT } from '@/i18n/strings'
import clsx from 'clsx'

export function Header() {
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const lang = useUIStore((s) => s.lang)
  const setLang = useUIStore((s) => s.setLang)
  const privateSession = useProgressStore((s) => s.privateSession)
  const setPrivateSession = useProgressStore((s) => s.setPrivateSession)
  const t = useT()

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 sm:px-6">
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex w-full max-w-sm items-center gap-2 rounded-md border border-border bg-surface2 px-3 py-1.5 text-sm text-muted hover:text-text"
      >
        <Search size={15} />
        <span>{t('header.search')}</span>
        <kbd className="ml-auto rounded border border-border bg-bg px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
      </button>
      <div className="flex items-center gap-2 pl-3">
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5 text-xs" title={t('header.language')}>
          <Languages size={13} className="ml-1 text-muted" />
          <button
            onClick={() => setLang('en')}
            className={clsx('rounded px-1.5 py-1 font-medium', lang === 'en' ? 'bg-primary text-white' : 'text-muted hover:text-text')}
          >
            EN
          </button>
          <button
            onClick={() => setLang('es')}
            className={clsx('rounded px-1.5 py-1 font-medium', lang === 'es' ? 'bg-primary text-white' : 'text-muted hover:text-text')}
          >
            ES
          </button>
        </div>
        <button
          onClick={() => setPrivateSession(!privateSession)}
          title={t('header.privateSessionTitle')}
          className={clsx(
            'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium',
            privateSession ? 'border-warning text-warning bg-warning/10' : 'border-border text-muted hover:text-text',
          )}
        >
          <ShieldCheck size={14} />
          {privateSession ? t('header.privateSession') : t('header.private')}
        </button>
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:text-text"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  )
}
