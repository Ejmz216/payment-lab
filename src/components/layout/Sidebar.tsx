import { Link, useLocation } from 'react-router-dom'
import { ColorIcon, Icon3D, type IconName, type ReferenceTone } from '@/components/reference/ReferenceIdentity'

interface NavItem { to: string; label: string; icon: IconName; tone: ReferenceTone }
export const referenceNav: NavItem[] = [
  { to: '/', label: 'Enciclopedia', icon: 'books', tone: 'blue' },
  { to: '/visual', label: 'Guía visual', icon: 'compass', tone: 'mint' },
  { to: '/recorridos', label: 'Recorridos', icon: 'world-map', tone: 'orange' },
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
export const navGroups = [{ title: 'CONSULTA', items: referenceNav }, { title: 'DE LO GRANDE A LO PEQUEÑO', items: scaleNav }, { title: 'ESPACIOS', items: secondaryNav }]

export const BRAND = 'Aula Libre de Pagos'
export const BRAND_TAGLINE = 'Estudio libre · ISO 20022'

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return <Link to="/" className="brand-link" aria-label={`${BRAND}, inicio`}>
    <span className="payment-mark" aria-hidden="true"><Icon3D name="money-with-wings" /></span>
    {!compact && <span className="min-w-0"><span className="block text-sm font-semibold leading-5">{BRAND}</span><span className="block text-xs text-muted">{BRAND_TAGLINE}</span></span>}
  </Link>
}

export function PrivacyNote() {
  return <p className="border-t border-border px-5 py-4 text-[11px] leading-5 text-muted">Material de estudio libre.<br />No guardamos tus datos: no hay cuentas ni rastreo y todo queda en tu navegador.</p>
}

/** The grouped menu, shared by the desktop sidebar and the mobile drawer. */
export function NavGroups() {
  const { pathname, search } = useLocation()
  const category = new URLSearchParams(search).get('category')
  const tab = new URLSearchParams(search).get('tab')
  function active(to: string) {
    if (to === '/') return pathname === '/' && !category
    if (to.includes('?tab=')) return `${pathname}?tab=${tab}` === to
    if (to.startsWith('/?')) return pathname === '/' && to.endsWith(`=${category}`)
    return pathname === to || (to === '/classic' && !['/', '/visual', '/recorridos', '/xml', '/saved', '/learn/info-extra'].includes(pathname) && !pathname.startsWith('/reference/'))
  }
  return <>{navGroups.map((group, index) => <div key={group.title} className={index ? 'mt-5 border-t border-border pt-4' : ''}>
    <p className="mb-2 px-3 text-[11px] font-semibold text-muted">{group.title}</p>
    {group.items.map((item) => <Link key={item.to} to={item.to} aria-current={active(item.to) ? 'page' : undefined} className={`sidebar-item tone-${item.tone} ${active(item.to) ? 'sidebar-item-active' : ''}`}><ColorIcon icon={item.icon} tone={item.tone} small /><span>{item.label}</span></Link>)}
  </div>)}</>
}

export function Sidebar() {
  return <aside className="reference-nav nav-ink hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
    <div className="border-b border-border px-5 py-4"><BrandMark /></div>
    <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3 py-5"><NavGroups /></nav>
    <PrivacyNote />
  </aside>
}
