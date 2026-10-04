import { Link, useLocation } from 'react-router-dom'
import { Bookmark, Blocks, Compass, FileCode2, Globe2, Lightbulb, Mails, MessagesSquare, NotebookTabs, PanelsTopLeft } from 'lucide-react'
import { ColorIcon, type ReferenceTone } from '@/components/reference/ReferenceIdentity'

export const referenceNav = [
  { to: '/', label: 'Enciclopedia', icon: Compass, color: 'text-primary', tone: 'blue' },
  { to: '/visual', label: 'Guía visual', icon: PanelsTopLeft, color: 'text-camt', tone: 'mint' },
  { to: '/?category=concepts', label: 'Conceptos', icon: Lightbulb, color: 'text-party', tone: 'coral' },
  { to: '/?category=messages', label: 'Mensajes ISO 20022', icon: Mails, color: 'text-pacs', tone: 'blue' },
  { to: '/?category=architecture', label: 'Arquitecturas', icon: Blocks, color: 'text-pain', tone: 'violet' },
  { to: '/?category=schemes', label: 'Sistemas públicos', icon: Globe2, color: 'text-warning', tone: 'gold' },
  { to: '/xml', label: 'Explorador XML', icon: FileCode2, color: 'text-camt', tone: 'mint' },
]
export const secondaryNav = [
  { to: '/saved', label: 'Guardados', icon: Bookmark, color: 'text-warning', tone: 'gold' },
  { to: '/classic', label: 'Estudio clásico', icon: NotebookTabs, color: 'text-muted', tone: 'violet' },
  { to: '/learn/info-extra', label: 'Info extra', icon: MessagesSquare, color: 'text-warning', tone: 'coral' },
]

export function Sidebar() {
  const { pathname, search } = useLocation()
  const category = new URLSearchParams(search).get('category')
  function active(to: string) {
    if (to === '/') return pathname === '/' && !category
    if (to.startsWith('/?')) return pathname === '/' && to.endsWith(`=${category}`)
    return pathname === to || (to === '/classic' && !['/', '/visual', '/xml', '/saved', '/learn/info-extra'].includes(pathname) && !pathname.startsWith('/reference/'))
  }
  return <aside className="reference-nav hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
    <Link to="/" className="flex items-center gap-3 border-b border-border px-5 py-4">
      <span className="payment-mark" aria-hidden="true"><Mails size={22} strokeWidth={1.6} /></span>
      <span><span className="block text-sm font-semibold">Payment Lab</span><span className="block text-xs text-muted">Pagos · ISO 20022</span></span>
    </Link>
    <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3 py-5">
      {[referenceNav, secondaryNav].map((group, index) => <div key={index} className={index ? 'mt-6 border-t border-border pt-5' : ''}>
        <p className="mb-2 px-3 text-[11px] font-semibold text-muted">{index ? 'ESPACIOS' : 'CONSULTA'}</p>
        {group.map((item) => <Link key={item.to} to={item.to} aria-current={active(item.to) ? 'page' : undefined} className={`sidebar-item ${active(item.to) ? 'sidebar-item-active' : ''}`}><ColorIcon icon={item.icon} tone={item.tone as ReferenceTone} small /><span>{item.label}</span></Link>)}
      </div>)}
    </nav>
    <p className="border-t border-border px-5 py-4 text-[11px] leading-5 text-muted">Material educativo<br />Ejemplos sintéticos y fuentes públicas</p>
  </aside>
}
