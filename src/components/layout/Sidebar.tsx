import { Link, useLocation } from 'react-router-dom'
import { ColorIcon, Icon3D, type IconName, type ReferenceTone } from '@/components/reference/ReferenceIdentity'

interface NavItem { to: string; label: string; icon: IconName; tone: ReferenceTone }
export const referenceNav: NavItem[] = [
  { to: '/', label: 'Enciclopedia', icon: 'books', tone: 'blue' },
  { to: '/visual', label: 'Guía visual', icon: 'compass', tone: 'mint' },
]
// The encyclopedia's scales, from the whole ecosystem down to a single XML field.
export const scaleNav: NavItem[] = [
  { to: '/?category=architecture', label: 'Arquitecturas', icon: 'building-construction', tone: 'violet' },
  { to: '/?category=schemes', label: 'Sistemas públicos', icon: 'globe-showing-americas', tone: 'gold' },
  { to: '/?category=concepts', label: 'Conceptos', icon: 'light-bulb', tone: 'coral' },
  { to: '/?category=messages', label: 'Mensajes ISO 20022', icon: 'incoming-envelope', tone: 'cyan' },
  { to: '/reference/pacs.008?tab=xml', label: 'XML anotado', icon: 'page-facing-up', tone: 'mint' },
]
export const secondaryNav: NavItem[] = [
  { to: '/saved', label: 'Guardados', icon: 'bookmark', tone: 'gold' },
  { to: '/classic', label: 'Estudio clásico', icon: 'open-book', tone: 'violet' },
  { to: '/learn/info-extra', label: 'Info extra', icon: 'spiral-notepad', tone: 'coral' },
]
const groups = [{ title: 'CONSULTA', items: referenceNav }, { title: 'DE LO GRANDE A LO PEQUEÑO', items: scaleNav }, { title: 'ESPACIOS', items: secondaryNav }]

export function Sidebar() {
  const { pathname, search } = useLocation()
  const category = new URLSearchParams(search).get('category')
  const tab = new URLSearchParams(search).get('tab')
  function active(to: string) {
    if (to === '/') return pathname === '/' && !category
    if (to.includes('?tab=')) return `${pathname}?tab=${tab}` === to
    if (to.startsWith('/?')) return pathname === '/' && to.endsWith(`=${category}`)
    return pathname === to || (to === '/classic' && !['/', '/visual', '/xml', '/saved', '/learn/info-extra'].includes(pathname) && !pathname.startsWith('/reference/'))
  }
  return <aside className="reference-nav nav-ink hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
    <Link to="/" className="flex items-center gap-3 border-b border-border px-5 py-4">
      <span className="payment-mark" aria-hidden="true"><Icon3D name="money-with-wings" /></span>
      <span><span className="block text-sm font-semibold">Payment Lab</span><span className="block text-xs text-muted">Pagos · ISO 20022</span></span>
    </Link>
    <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3 py-5">
      {groups.map((group, index) => <div key={group.title} className={index ? 'mt-5 border-t border-border pt-4' : ''}>
        <p className="mb-2 px-3 text-[11px] font-semibold text-muted">{group.title}</p>
        {group.items.map((item) => <Link key={item.to} to={item.to} aria-current={active(item.to) ? 'page' : undefined} className={`sidebar-item tone-${item.tone} ${active(item.to) ? 'sidebar-item-active' : ''}`}><ColorIcon icon={item.icon} tone={item.tone} small /><span>{item.label}</span></Link>)}
      </div>)}
    </nav>
    <p className="border-t border-border px-5 py-4 text-[11px] leading-5 text-muted">Material educativo<br />Ejemplos sintéticos y fuentes públicas</p>
  </aside>
}
