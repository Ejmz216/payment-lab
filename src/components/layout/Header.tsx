import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Languages, Menu, Moon, Search, ShieldCheck, Sun, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useProgressStore } from '@/store/progressStore'
import { useT } from '@/i18n/strings'
import { referenceNav, scaleNav, secondaryNav } from './Sidebar'
import { ColorIcon } from '@/components/reference/ReferenceIdentity'
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
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const legacy = !['/', '/visual', '/recorridos', '/xml', '/classic'].includes(location.pathname) && !location.pathname.startsWith('/reference/')

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.search])

  const mobileNav = [...referenceNav, ...scaleNav, ...secondaryNav]

  return (
    <header className="relative z-40 flex min-w-0 items-center justify-between gap-2 border-b border-border bg-surface px-3 py-3 sm:px-6">
      <button
        type="button"
        onClick={() => setMobileMenuOpen((open) => !open)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted hover:text-text md:hidden"
        aria-label={mobileMenuOpen ? 'Cerrar navegación' : 'Abrir navegación'}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
      </button>
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface2 text-sm text-muted hover:text-text sm:w-full sm:min-w-0 sm:max-w-sm sm:shrink sm:flex-1 sm:justify-start sm:gap-2 sm:px-3"
        aria-label="Buscar en Payment Lab"
        title="Buscar en Payment Lab"
      >
        <Search size={15} />
        <span className="hidden truncate sm:block">Buscar en Payment Lab</span>
      </button>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 sm:pl-3">
        {legacy && <div className="flex items-center gap-1 rounded-md border border-border p-0.5 text-xs" title={t('header.language')}>
          <Languages size={13} className="ml-1 hidden text-muted sm:block" />
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
        </div>}
        <span className="tip-anchor">
          <button
            onClick={() => setPrivateSession(!privateSession)}
            aria-pressed={privateSession}
            aria-describedby="private-session-tip"
            className={clsx(
              'flex h-9 w-9 items-center justify-center rounded-md border text-xs font-medium sm:w-auto sm:gap-1.5 sm:px-2.5',
              privateSession ? 'border-warning text-warning bg-warning/10' : 'border-border text-muted hover:text-text',
            )}
          >
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">{privateSession ? t('header.privateSession') : t('header.private')}</span>
            <span className="sr-only sm:hidden">{t('header.privateSession')}</span>
          </button>
          <span role="tooltip" id="private-session-tip" className="tip">
            <strong className="tip-title">{t('header.privateSession')} · {privateSession ? t('header.privateOn') : t('header.privateOff')}</strong>
            {t('header.privateSessionTip')}
          </span>
        </span>
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:text-text"
          aria-label="Cambiar tema"
          title="Cambiar tema"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="reference-nav nav-ink absolute inset-x-0 top-full max-h-[75vh] overflow-y-auto border-b border-border bg-surface p-3 shadow-lg shadow-bg/40 md:hidden" aria-label="Navegación móvil">
          <div className="grid grid-cols-2 gap-2">
            {mobileNav.map((item) => (
              <Link key={`${item.to}:${item.label}`} to={item.to} className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-bg/50 px-3 py-2 text-sm hover:bg-surface2">
                <ColorIcon icon={item.icon} tone={item.tone} small />
                <span className="min-w-0">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
