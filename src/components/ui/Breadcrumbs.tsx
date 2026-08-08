import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs text-muted" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} className="shrink-0" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-text">{item.label}</Link>
          ) : (
            <span aria-current="page" className="text-text">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
