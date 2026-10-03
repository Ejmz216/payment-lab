import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, FlaskConical, ListTree, CheckCheck, Bookmark, FileQuestion } from 'lucide-react'

const sections = [
  { title: 'Estudio guiado', icon: BookOpen, text: 'El recorrido original por fundamentos, ISO 20022 y SGPI.', links: [['Continuar y progreso', '/classic/dashboard'], ['Mapa de aprendizaje', '/learn/fast-payments'], ['Caso público SGPI', '/learn/spi-dominicana']] },
  { title: 'Atlas clásico', icon: ListTree, text: 'Catálogo, árboles de mensajes y glosario de la versión anterior.', links: [['Atlas ISO 20022', '/atlas'], ['Catálogo de mensajes', '/atlas/messages'], ['Glosario', '/glossary']] },
  { title: 'Laboratorios', icon: FlaskConical, text: 'Simulación, investigación y ejercicios técnicos.', links: [['Simulador', '/lab/simulator'], ['Investigation Workbench', '/lab/debugger'], ['XML Lab', '/lab/xml'], ['Identificadores', '/lab/identifiers'], ['Reject vs. Return', '/lab/reject-return'], ['Detectar errores XML', '/lab/break-message']] },
  { title: 'Práctica', icon: CheckCheck, text: 'Escenarios y revisión de lo aprendido.', links: [['Sesión de práctica', '/practice/session'], ['Escenarios', '/practice/scenarios'], ['Quiz', '/practice/quiz'], ['Confusiones frecuentes', '/confusions']] },
  { title: 'Mi biblioteca', icon: Bookmark, text: 'Favoritos y progreso guardados en este navegador.', links: [['Guardados', '/saved'], ['Progreso', '/progress']] },
  { title: 'Info extra', icon: FileQuestion, text: 'Preguntas de validación y lienzo compartido.', links: [['Abrir Info extra', '/learn/info-extra']] },
]
export function LegacyHub() {
  return <div className="ref-page"><header className="border-b border-border pb-6"><div className="ref-eyebrow text-party">PAYMENT LAB / COLECCIÓN ORIGINAL</div><h1 className="mt-2 text-3xl font-semibold">Estudio clásico</h1><p className="mt-2 text-sm text-muted">Lecciones, laboratorios y práctica.</p></header><div className="grid gap-x-10 sm:grid-cols-2">{sections.map((section) => <section key={section.title} className="ref-section"><h2 className="flex items-center gap-2 text-base font-semibold"><section.icon size={18} className="text-party" />{section.title}</h2><p className="mt-2 text-sm text-muted">{section.text}</p><div className="mt-4 space-y-3">{section.links.map(([label, to]) => <Link key={to} to={to} className="flex items-center justify-between text-sm text-primary hover:underline">{label}<ArrowRight size={13} /></Link>)}</div></section>)}</div></div>
}
