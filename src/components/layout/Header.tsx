import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Languages, Menu, Moon, Search, ShieldCheck, Sun, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useProgressStore } from '@/store/progressStore'
import { useT } from '@/i18n/strings'
import { BRAND, BrandMark, NavGroups, PrivacyNote } from './Sidebar'
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

  const closeButton = useRef<HTMLButtonElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.search])

  // Drawer: focus its close button on open, close on Escape, restore focus.
  useEffect(() => {
    if (!mobileMenuOpen) return
    closeButton.current?.focus()
    function onKey(event: KeyboardEvent) { if (event.key === 'Escape') { setMobileMenuOpen(false); menuButton.current?.focus() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  return (
    <header className="relative z-40 flex min-w-0 items-center justify-between gap-2 border-b border-border bg-surface px-3 py-3 sm:px-6">
      <div className="flex shrink-0 items-center gap-2 md:hidden">
        <button
          ref={menuButton}
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted hover:text-text"
          aria-label="Abrir navegación"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-drawer"
        >
          <Menu size={16} />
        </button>
        <span className="mobile-brand"><BrandMark compact /></span>
      </div>
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface2 text-sm text-muted hover:text-text sm:w-full sm:min-w-0 sm:max-w-sm sm:shrink sm:flex-1 sm:justify-start sm:gap-2 sm:px-3"
        aria-label={`Buscar en ${BRAND}`}
        title={`Buscar en ${BRAND}`}
      >
        <Search size={15} />
        <span className="hidden truncate sm:block">Buscar conceptos, mensajes y campos</span>
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

      {mobileMenuOpen && <>
        <div className="mobile-drawer-backdrop md:hidden" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
        <nav id="mobile-drawer" className="reference-nav nav-ink mobile-drawer md:hidden" aria-label="Navegación móvil">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <BrandMark />
            <button ref={closeButton} type="button" onClick={() => { setMobileMenuOpen(false); menuButton.current?.focus() }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted hover:text-text" aria-label="Cerrar navegación"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4"><NavGroups /></div>
          <PrivacyNote />
        </nav>
      </>}
    </header>
  )
}
