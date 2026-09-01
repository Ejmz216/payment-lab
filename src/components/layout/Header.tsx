import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Dumbbell, FileQuestion, FlaskConical, Languages, LayoutDashboard, LineChart, Menu, Moon, Route, Search, ShieldCheck, Sun, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useProgressStore } from '@/store/progressStore'
import { useT } from '@/i18n/strings'
import { getFastPaymentsPath, getLessons } from '@/lib/i18nContent'
import { buildStudyPathState } from '@/lib/studyPath'
import clsx from 'clsx'

export function Header() {
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const lang = useUIStore((s) => s.lang)
  const setLang = useUIStore((s) => s.setLang)
  const privateSession = useProgressStore((s) => s.privateSession)
  const setPrivateSession = useProgressStore((s) => s.setPrivateSession)
  const completedLessons = useProgressStore((s) => s.completedLessons)
  const completedModules = useProgressStore((s) => s.completedModules ?? [])
  const t = useT()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lessons = getLessons(lang)
  const path = getFastPaymentsPath(lang)
  const continueRoute = buildStudyPathState(path, lessons, completedLessons, completedModules).nextItem?.route ?? '/learn/fast-payments'

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const mobileNav = [
    { to: '/', label: t('nav.dashboard'), icon: LayoutDashboard, color: 'text-primary' },
    { to: continueRoute, label: t('nav.continueLearning'), icon: Route, color: 'text-primary' },
    { to: '/learn/info-extra', label: t('nav.infoExtra'), icon: FileQuestion, color: 'text-warning' },
    { to: '/lab/simulator', label: t('lab.simulatorTitle'), icon: FlaskConical, color: 'text-camt' },
    { to: '/practice/session', label: t('practice.session'), icon: Dumbbell, color: 'text-success' },
    { to: '/progress', label: t('nav.progress'), icon: LineChart, color: 'text-warning' },
    { to: '/atlas', label: t('nav.atlas'), icon: BookOpen, color: 'text-iso' },
  ]

  return (
    <header className="relative z-40 flex min-w-0 items-center justify-between gap-2 border-b border-border bg-surface px-3 py-3 sm:px-6">
      <button
        type="button"
        onClick={() => setMobileMenuOpen((open) => !open)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted hover:text-text md:hidden"
        aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
      </button>
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface2 text-sm text-muted hover:text-text sm:w-full sm:max-w-sm sm:justify-start sm:gap-2 sm:px-3"
        aria-label={t('header.search')}
      >
        <Search size={15} />
        <span className="hidden truncate sm:block">{t('header.search')}</span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] md:block">Ctrl K</kbd>
      </button>
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 sm:pl-3">
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5 text-xs" title={t('header.language')}>
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
        </div>
        <button
          onClick={() => setPrivateSession(!privateSession)}
          title={t('header.privateSessionTitle')}
          className={clsx(
            'flex h-9 w-9 items-center justify-center rounded-md border text-xs font-medium sm:w-auto sm:gap-1.5 sm:px-2.5',
            privateSession ? 'border-warning text-warning bg-warning/10' : 'border-border text-muted hover:text-text',
          )}
          >
          <ShieldCheck size={14} />
          <span className="hidden sm:inline">{privateSession ? t('header.privateSession') : t('header.private')}</span>
        </button>
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:text-text"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="absolute inset-x-0 top-full border-b border-border bg-surface p-3 shadow-lg shadow-bg/40 md:hidden" aria-label="Mobile navigation">
          <div className="grid grid-cols-2 gap-2">
            {mobileNav.map((item) => (
              <Link key={`${item.to}:${item.label}`} to={item.to} className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-bg/50 px-3 py-2 text-sm hover:bg-surface2">
                <item.icon size={15} className={item.color} />
                <span className="min-w-0 truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
