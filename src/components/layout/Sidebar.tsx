import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Rocket, Map, FlaskConical, Dumbbell, BookOpen, LineChart, Search } from 'lucide-react'
import clsx from 'clsx'

const navGroups: { label: string; items: { to: string; label: string; icon: typeof Rocket }[] }[] = [
  {
    label: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Modes',
    items: [
      { to: '/learn/fast-payments', label: 'Fast Payments', icon: Rocket },
      { to: '/atlas', label: 'ISO 20022 Atlas', icon: Map },
      { to: '/lab', label: 'Lab', icon: FlaskConical },
    ],
  },
  {
    label: 'Study',
    items: [
      { to: '/practice', label: 'Practice', icon: Dumbbell },
      { to: '/glossary', label: 'Glossary', icon: BookOpen },
      { to: '/confusions', label: 'Common Confusions', icon: Search },
      { to: '/progress', label: 'Progress', icon: LineChart },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-sm font-bold text-white">PL</div>
        <div>
          <div className="text-sm font-semibold leading-none">Payment Lab</div>
          <div className="text-xs text-muted">ISO 20022 & Payments</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <div className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-muted">{group.label}</div>
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
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-border px-4 py-3 text-xs text-muted">
        Static, client-side only. No backend, no tracking.
      </div>
    </aside>
  )
}
