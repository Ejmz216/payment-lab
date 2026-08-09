import { NavLink } from 'react-router-dom'
import {
  Bookmark,
  BookOpen,
  Dumbbell,
  FlaskConical,
  LayoutDashboard,
  LineChart,
  ListTree,
  Map,
  Route,
  Search,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { useT, type StringKey } from '@/i18n/strings'

const navGroups: { groupKey: StringKey; items: { to: string; labelKey: StringKey; icon: typeof Route; accent: string }[] }[] = [
  {
    groupKey: 'nav.study',
    items: [
      { to: '/learn/fast-payments', labelKey: 'nav.fastPayments', icon: Route, accent: 'text-primary' },
      { to: '/learn/spi-dominicana', labelKey: 'nav.spiDominicana', icon: Zap, accent: 'text-scheme' },
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
  {
    groupKey: 'nav.lab',
    items: [{ to: '/lab', labelKey: 'nav.lab', icon: FlaskConical, accent: 'text-camt' }],
  },
  {
    groupKey: 'nav.practiceGroup',
    items: [
      { to: '/practice', labelKey: 'nav.practice', icon: Dumbbell, accent: 'text-success' },
      { to: '/confusions', labelKey: 'nav.confusions', icon: Search, accent: 'text-warning' },
    ],
  },
  {
    groupKey: 'nav.progressGroup',
    items: [
      { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard, accent: 'text-primary' },
      { to: '/progress', labelKey: 'nav.progress', icon: LineChart, accent: 'text-success' },
      { to: '/saved', labelKey: 'nav.saved', icon: Bookmark, accent: 'text-warning' },
    ],
  },
]

export function Sidebar() {
  const t = useT()
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
        {navGroups.map((group) => (
          <div key={group.groupKey} className="mb-5">
            <div className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-muted">{t(group.groupKey)}</div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
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
