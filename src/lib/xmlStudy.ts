import { getFieldNote, type FieldNote } from '@/content/reference/xmlGuide'
import xml from '@/content/reference/pacs008-v10.xml?raw'

export { xml as studyXml }
export type XmlLayer = 'transport' | 'header' | 'payment'
export interface StudyField {
  id: string
  path: string
  tag: string
  value: string
  namespace: string
  layer: XmlLayer
  depth: number
  parentId?: string
  attribute: boolean
  container: boolean
  note: FieldNote
}
export interface XmlLine { fieldId: string; depth: number; text: string; closing?: boolean }
export type NoteResolver = (tag: string, path: string, value: string, lang: 'es' | 'en') => FieldNote

export function parseStudyXml(source: string = xml, lang: 'es' | 'en' = 'es', resolve: NoteResolver = getFieldNote) {
  const doc = new DOMParser().parseFromString(source, 'application/xml')
  if (doc.querySelector('parsererror')) throw new Error(lang === 'en' ? 'The XML sample is not well-formed.' : 'El ejemplo XML no está bien formado.')
  const fields: StudyField[] = []
  const lines: XmlLine[] = []
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  function walk(element: Element, path: string, depth: number, parentId?: string) {
    const namespace = element.namespaceURI ?? ''
    // head.001 is the business header; any other ISO 20022 namespace is the message itself.
    const layer: XmlLayer = namespace.includes('head.001') ? 'header' : namespace.startsWith('urn:iso:std:iso:20022:tech:xsd:') ? 'payment' : 'transport'
    const container = element.children.length > 0
    const value = container ? '' : element.textContent ?? ''
    const field: StudyField = { id: path, path, tag: element.localName, value, namespace, layer, depth, parentId, attribute: false, container, note: resolve(element.localName, path, value, lang) }
    fields.push(field)
    const attributes = Array.from(element.attributes)
    attributes.forEach((attr) => fields.push({ ...field, id: `${path}/@${attr.name}`, path: `${path}/@${attr.name}`, tag: `@${attr.name}`, value: attr.value, namespace: attr.namespaceURI ?? '', parentId: path, depth: depth + 1, attribute: true, container: false, note: resolve(`@${attr.name}`, path, attr.value, lang) }))
    const opening = `<${element.tagName}${attributes.map((a) => ` ${a.name}="${escape(a.value)}"`).join('')}>`
    lines.push({ fieldId: path, depth, text: container ? opening : `${opening}${escape(value)}</${element.tagName}>` })
    const children = Array.from(element.children)
    children.forEach((child) => {
      const siblings = children.filter((sibling) => sibling.localName === child.localName && sibling.namespaceURI === child.namespaceURI)
      const suffix = siblings.length > 1 ? `[${siblings.indexOf(child) + 1}]` : ''
      walk(child, `${path}/${child.localName}${suffix}`, depth + 1, path)
    })
    if (container) lines.push({ fieldId: path, depth, text: `</${element.tagName}>`, closing: true })
  }
  walk(doc.documentElement, `/${doc.documentElement.localName}`, 0)
  return { fields, lines }
}

export function normalizeQuery(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
}
