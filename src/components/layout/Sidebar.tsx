import { NavLink } from 'react-router-dom'
import {
  Bookmark,
  BookOpen,
  Bug,
  Code2,
  Dumbbell,
  Fingerprint,
  FileQuestion,
  LayoutDashboard,
  LineChart,
  ListTree,
  Map,
  Route,
  Search,
} from 'lucide-react'
import clsx from 'clsx'
import { useT, type StringKey } from '@/i18n/strings'
import { useUIStore } from '@/store/uiStore'
import { useProgressStore } from '@/store/progressStore'
import { getFastPaymentsPath, getLessons } from '@/lib/i18nContent'
import { buildStudyPathState } from '@/lib/studyPath'

type NavItem = { to: string; labelKey: StringKey; icon: typeof Route; accent: string; dynamic?: 'continue'; exact?: boolean }

const navGroups: { groupKey: StringKey; items: NavItem[] }[] = [
  {
    groupKey: 'nav.study',
    items: [
      { to: '/learn/fast-payments', labelKey: 'nav.continueLearning', icon: Route, accent: 'text-primary', dynamic: 'continue' },
      { to: '/learn/fast-payments', labelKey: 'nav.learningMap', icon: Map, accent: 'text-primary', exact: true },
      { to: '/learn/info-extra', labelKey: 'nav.infoExtra', icon: FileQuestion, accent: 'text-warning' },
    ],
  },
  {
    groupKey: 'nav.lab',
    items: [
      { to: '/lab/simulator', labelKey: 'lab.simulatorTitle', icon: Route, accent: 'text-camt' },
      { to: '/lab/debugger', labelKey: 'lab.debuggerTitle', icon: Bug, accent: 'text-warning' },
      { to: '/lab/xml', labelKey: 'lab.xmlTitle', icon: Code2, accent: 'text-pacs' },
      { to: '/lab/identifiers', labelKey: 'lab.identifierTitle', icon: Fingerprint, accent: 'text-party' },
    ],
  },
  {
    groupKey: 'nav.practiceGroup',
    items: [
      { to: '/practice/session', labelKey: 'practice.session', icon: Dumbbell, accent: 'text-success' },
      { to: '/practice/scenarios', labelKey: 'practice.scenarioTrainer', icon: Search, accent: 'text-camt' },
      { to: '/confusions', labelKey: 'nav.confusions', icon: Search, accent: 'text-warning' },
    ],
  },
  {
    groupKey: 'nav.progressGroup',
    items: [
      { to: '/progress', labelKey: 'nav.progress', icon: LineChart, accent: 'text-success' },
      { to: '/saved', labelKey: 'nav.saved', icon: Bookmark, accent: 'text-warning' },
    ],
  },
  {
    groupKey: 'nav.reference',
    items: [
      { to: '/atlas', labelKey: 'nav.atlas', icon: Map, accent: 'text-iso' },
      { to: '/atlas/messages', labelKey: 'nav.messageCatalog', icon: ListTree, accent: 'text-camt' },
      { to: '/glossary', labelKey: 'nav.glossary', icon: BookOpen, accent: 'text-party' },
    ],
  },
]

export function Sidebar() {
  const t = useT()
  const lang = useUIStore((state) => state.lang)
  const completedLessons = useProgressStore((state) => state.completedLessons)
  const completedModules = useProgressStore((state) => state.completedModules ?? [])
  const lessons = getLessons(lang)
  const path = getFastPaymentsPath(lang)
  const nextStudyRoute = buildStudyPathState(path, lessons, completedLessons, completedModules).nextItem?.route ?? '/learn/fast-payments'
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface/95 md:flex md:flex-col">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-sm font-bold text-white shadow-sm shadow-primary/25">PL</div>
        <div>
          <div className="text-sm font-semibold leading-none">Payment Lab</div>
          <div className="text-xs text-muted">{t('sidebar.tagline')}</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) => clsx(
            'mb-4 flex items-center gap-2.5 rounded-md border px-2.5 py-2.5 text-sm font-medium transition-colors',
            isActive ? 'border-primary/40 bg-primary/15 text-primary' : 'border-border bg-bg/35 text-text hover:bg-surface2',
          )}
        >
          <LayoutDashboard size={16} className="text-primary" />
          {t('nav.dashboard')}
        </NavLink>
        {navGroups.map((group) => (
          <div key={group.groupKey} className="mb-5">
            <div className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-muted">{t(group.groupKey)}</div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={`${group.groupKey}:${item.labelKey}`}
                  to={item.dynamic === 'continue' ? nextStudyRoute : item.to}
                  end={item.exact ?? item.to === '/'}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                      isActive ? 'bg-primary/15 text-primary font-medium' : 'text-text hover:bg-surface2',
                    )
                  }
                >
                  <item.icon size={16} className={item.accent} />
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-border px-4 py-3 text-xs text-muted">
        {t('sidebar.footer')}
      </div>
    </aside>
  )
}
