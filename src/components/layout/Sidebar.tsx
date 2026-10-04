import { Link, useLocation } from 'react-router-dom'
import { ColorIcon, Icon3D, type IconName, type ReferenceTone } from '@/components/reference/ReferenceIdentity'
import { useL } from '@/i18n/reference/useLang'

interface NavItem { to: string; label: string; en: string; icon: IconName; tone: ReferenceTone }
export const referenceNav: NavItem[] = [
  { to: '/', label: 'Enciclopedia', en: 'Encyclopedia', icon: 'books', tone: 'blue' },
  { to: '/visual', label: 'Guía visual', en: 'Visual guide', icon: 'compass', tone: 'mint' },
  { to: '/recorridos', label: 'Recorridos', en: 'Journeys', icon: 'world-map', tone: 'orange' },
]
// The encyclopedia's scales, from the whole ecosystem down to a single XML field.
export const scaleNav: NavItem[] = [
  { to: '/?category=architecture', label: 'Arquitecturas', en: 'Architectures', icon: 'building-construction', tone: 'violet' },
  { to: '/?category=schemes', label: 'Sistemas públicos', en: 'Public systems', icon: 'globe-showing-americas', tone: 'gold' },
  { to: '/?category=concepts', label: 'Conceptos', en: 'Concepts', icon: 'light-bulb', tone: 'coral' },
  { to: '/?category=messages', label: 'Mensajes ISO 20022', en: 'ISO 20022 messages', icon: 'incoming-envelope', tone: 'cyan' },
  { to: '/reference/pacs.008?tab=xml', label: 'XML anotado', en: 'Annotated XML', icon: 'page-facing-up', tone: 'mint' },
]
export const secondaryNav: NavItem[] = [
  { to: '/saved', label: 'Guardados', en: 'Saved', icon: 'bookmark', tone: 'gold' },
  { to: '/classic', label: 'Estudio clásico', en: 'Classic study', icon: 'open-book', tone: 'violet' },
  { to: '/learn/info-extra', label: 'Info extra', en: 'Extra info', icon: 'spiral-notepad', tone: 'coral' },
]
export const navGroups = [{ title: 'CONSULTA', en: 'BROWSE', items: referenceNav }, { title: 'DE LO GRANDE A LO PEQUEÑO', en: 'FROM BIG TO SMALL', items: scaleNav }, { title: 'ESPACIOS', en: 'SPACES', items: secondaryNav }]

export const BRAND = 'Aula Libre de Pagos'

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const L = useL()
  return <Link to="/" className="brand-link" aria-label={`${BRAND}, ${L('inicio', 'home')}`}>
    <span className="payment-mark" aria-hidden="true"><Icon3D name="money-with-wings" /></span>
    {!compact && <span className="min-w-0"><span className="block text-sm font-semibold leading-5">{BRAND}</span><span className="block text-xs text-muted">{L('Estudio libre', 'Free study')} · ISO 20022</span></span>}
  </Link>
}

export function PrivacyNote() {
  const L = useL()
  return <p className="border-t border-border px-5 py-4 text-[11px] leading-5 text-muted">{L('Material de estudio libre.', 'Free study material.')}<br />{L('No guardamos tus datos: no hay cuentas ni rastreo y todo queda en tu navegador.', 'We keep none of your data: no accounts, no tracking, everything stays in your browser.')}</p>
}

/** The grouped menu, shared by the desktop sidebar and the mobile drawer. */
export function NavGroups() {
  const L = useL()
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
    <p className="mb-2 px-3 text-[11px] font-semibold text-muted">{L(group.title, group.en)}</p>
    {group.items.map((item) => <Link key={item.to} to={item.to} aria-current={active(item.to) ? 'page' : undefined} className={`sidebar-item tone-${item.tone} ${active(item.to) ? 'sidebar-item-active' : ''}`}><ColorIcon icon={item.icon} tone={item.tone} small /><span>{L(item.label, item.en)}</span></Link>)}
  </div>)}</>
}

export function Sidebar() {
  const L = useL()
  return <aside className="reference-nav nav-ink hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
    <div className="border-b border-border px-5 py-4"><BrandMark /></div>
    <nav aria-label={L('Navegación principal', 'Main navigation')} className="flex-1 overflow-y-auto px-3 py-5"><NavGroups /></nav>
    <PrivacyNote />
  </aside>
}
