import { Link, useLocation } from 'react-router-dom'
import { Archive, Bookmark, BookOpen, Code2, FileQuestion, Library, Network, Waypoints } from 'lucide-react'

export const referenceNav = [
  { to: '/', label: 'Enciclopedia', icon: Library, color: 'text-primary' },
  { to: '/?category=concepts', label: 'Conceptos', icon: BookOpen, color: 'text-party' },
  { to: '/?category=messages', label: 'Mensajes ISO 20022', icon: Code2, color: 'text-pacs' },
  { to: '/?category=architecture', label: 'Arquitecturas', icon: Network, color: 'text-pain' },
  { to: '/?category=schemes', label: 'Sistemas públicos', icon: Waypoints, color: 'text-warning' },
  { to: '/xml', label: 'Explorador XML', icon: Code2, color: 'text-camt' },
]
export const secondaryNav = [
  { to: '/saved', label: 'Guardados', icon: Bookmark, color: 'text-warning' },
  { to: '/classic', label: 'Estudio clásico', icon: Archive, color: 'text-muted' },
  { to: '/learn/info-extra', label: 'Info extra', icon: FileQuestion, color: 'text-warning' },
]

export function Sidebar() {
  const { pathname, search } = useLocation()
  const category = new URLSearchParams(search).get('category')
  function active(to: string) {
    if (to === '/') return pathname === '/' && !category
    if (to.startsWith('/?')) return pathname === '/' && to.endsWith(`=${category}`)
    return pathname === to || (to === '/classic' && !['/', '/xml', '/saved', '/learn/info-extra'].includes(pathname) && !pathname.startsWith('/reference/'))
  }
  return <aside className="reference-nav hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
    <Link to="/" className="flex items-center gap-3 border-b border-border px-5 py-4">
      <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-xs font-bold text-white">PL</span>
      <span><span className="block text-sm font-semibold">Payment Lab</span><span className="block text-xs text-muted">Pagos · ISO 20022</span></span>
    </Link>
    <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3 py-5">
      {[referenceNav, secondaryNav].map((group, index) => <div key={index} className={index ? 'mt-6 border-t border-border pt-5' : ''}>
        <p className="mb-2 px-3 text-[11px] font-semibold text-muted">{index ? 'ESPACIOS' : 'CONSULTA'}</p>
        {group.map((item) => <Link key={item.to} to={item.to} aria-current={active(item.to) ? 'page' : undefined} className={`my-0.5 flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm ${active(item.to) ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-surface2'}`}><item.icon size={16} className={item.color} /><span>{item.label}</span></Link>)}
      </div>)}
    </nav>
    <p className="border-t border-border px-5 py-4 text-[11px] leading-5 text-muted">Material educativo<br />Ejemplos sintéticos y fuentes públicas</p>
  </aside>
}
