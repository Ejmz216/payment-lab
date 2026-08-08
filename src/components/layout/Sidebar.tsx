import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Rocket, Map, FlaskConical, Dumbbell, BookOpen, LineChart, Search, Bookmark } from 'lucide-react'
import clsx from 'clsx'
import { useT, type StringKey } from '@/i18n/strings'

const navGroups: { groupKey: StringKey; items: { to: string; labelKey: StringKey; icon: typeof Rocket }[] }[] = [
  {
    groupKey: 'nav.overview',
    items: [{ to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard }],
  },
  {
    groupKey: 'nav.modes',
    items: [
      { to: '/learn/fast-payments', labelKey: 'nav.fastPayments', icon: Rocket },
      { to: '/atlas', labelKey: 'nav.atlas', icon: Map },
      { to: '/lab', labelKey: 'nav.lab', icon: FlaskConical },
    ],
  },
  {
    groupKey: 'nav.study',
    items: [
      { to: '/practice', labelKey: 'nav.practice', icon: Dumbbell },
      { to: '/glossary', labelKey: 'nav.glossary', icon: BookOpen },
      { to: '/confusions', labelKey: 'nav.confusions', icon: Search },
      { to: '/progress', labelKey: 'nav.progress', icon: LineChart },
      { to: '/saved', labelKey: 'nav.saved', icon: Bookmark },
    ],
  },
]

export function Sidebar() {
  const t = useT()
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-sm font-bold text-white">PL</div>
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
                  <item.icon size={16} />
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
