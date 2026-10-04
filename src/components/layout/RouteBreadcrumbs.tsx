import { matchPath, useLocation } from 'react-router-dom'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/i18n/strings'
import { getDomain, getFastPaymentsPath, getLesson, getMessage } from '@/lib/i18nContent'
import { categoryLabels, getReferenceEntry } from '@/content/reference/entries'

export function RouteBreadcrumbs() {
  const { pathname, search } = useLocation()
  const lang = useUIStore((state) => state.lang)
  const t = useT()
  const panel: Crumb = { label: 'Estudio clásico', to: '/classic' }
  const library: Crumb = { label: 'Enciclopedia', to: '/' }
  const path = getFastPaymentsPath(lang)

  if (pathname === '/') return <Breadcrumbs items={[{ label: 'Enciclopedia' }]} />
  if (pathname === '/visual') return <Breadcrumbs items={[library, { label: 'Guía visual' }]} />
  if (pathname === '/recorridos') return <Breadcrumbs items={[library, { label: 'Recorridos' }]} />
  if (pathname === '/classic') return <Breadcrumbs items={[library, { label: 'Estudio clásico' }]} />
  if (pathname === '/classic/dashboard') return <Breadcrumbs items={[panel, { label: t('nav.dashboard') }]} />
  if (pathname === '/xml') return <Breadcrumbs items={[library, { label: 'pacs.008', to: '/reference/pacs.008' }, { label: 'Explorador XML' }]} />
  const entryMatch = matchPath('/reference/:entryId', pathname)
  if (entryMatch) {
    const entry = getReferenceEntry(entryMatch.params.entryId ?? '')
    if (!entry) return <Breadcrumbs items={[library, { label: 'Referencia' }]} />
    const xmlTab = new URLSearchParams(search).get('tab') === 'xml'
    return <Breadcrumbs items={[library, { label: categoryLabels[entry.category], to: `/?category=${entry.category}` }, xmlTab ? { label: entry.title, to: `/reference/${entry.id}` } : { label: entry.title }, ...(xmlTab ? [{ label: 'XML anotado' }] : [])]} />
  }

  const lessonMatch = matchPath('/learn/fast-payments/:lessonId', pathname)
  if (lessonMatch) {
    const lesson = getLesson(lessonMatch.params.lessonId ?? '', lang)
    const phase = path.phases.find((item) => item.lessonIds.includes(lesson?.id ?? ''))
    return (
      <Breadcrumbs
        items={[
          panel,
          { label: t('nav.study'), to: '/learn/fast-payments' },
          ...(phase ? [{ label: phase.shortTitle }] : []),
          { label: lesson?.title ?? lessonMatch.params.lessonId ?? t('study.lesson') },
        ]}
      />
    )
  }

  if (pathname === '/learn/fast-payments') {
    return <Breadcrumbs items={[panel, { label: t('nav.study') }, { label: t('nav.learningMap') }]} />
  }

  if (pathname === '/learn/spi-dominicana') {
    return <Breadcrumbs items={[panel, { label: t('nav.study'), to: '/learn/fast-payments' }, { label: 'SGPI' }, { label: lang === 'es' ? 'Actores y rol' : 'Actors and role' }]} />
  }

  if (pathname === '/learn/info-extra') {
    return <Breadcrumbs items={[library, { label: t('nav.infoExtra') }]} />
  }

  const domainMatch = matchPath('/atlas/domains/:domainId', pathname)
  if (domainMatch) {
    const domain = getDomain(domainMatch.params.domainId ?? '', lang)
    return <Breadcrumbs items={[panel, { label: t('nav.reference'), to: '/atlas' }, { label: t('atlas.title'), to: '/atlas' }, { label: domain?.name ?? domainMatch.params.domainId ?? '' }]} />
  }

  const messageMatch = matchPath('/atlas/messages/:messageId', pathname)
  if (messageMatch) {
    const message = getMessage(messageMatch.params.messageId ?? '', lang)
    return <Breadcrumbs items={[panel, { label: t('nav.reference'), to: '/atlas' }, { label: t('catalog.title'), to: '/atlas/messages' }, { label: message?.id ?? messageMatch.params.messageId ?? '' }]} />
  }

  const staticRoutes: Record<string, Crumb[]> = {
    '/atlas': [{ label: t('nav.reference') }, { label: t('atlas.title') }],
    '/atlas/messages': [{ label: t('nav.reference'), to: '/atlas' }, { label: t('catalog.title') }],
    '/glossary': [{ label: t('nav.reference'), to: '/atlas' }, { label: t('nav.glossary') }],
    '/lab': [{ label: t('nav.lab') }],
    '/lab/simulator': [{ label: t('nav.lab'), to: '/lab' }, { label: t('lab.simulatorTitle') }],
    '/lab/debugger': [{ label: t('nav.lab'), to: '/lab' }, { label: t('lab.debuggerTitle') }],
    '/lab/identifiers': [{ label: t('nav.lab'), to: '/lab' }, { label: t('lab.identifierTitle') }],
    '/lab/reject-return': [{ label: t('nav.lab'), to: '/lab' }, { label: t('lab.rejectReturnTitle') }],
    '/lab/xml': [{ label: t('nav.lab'), to: '/lab' }, { label: t('lab.xmlTitle') }],
    '/lab/break-message': [{ label: t('nav.lab'), to: '/lab' }, { label: t('lab.breakTitle') }],
    '/practice': [{ label: t('nav.practiceGroup') }],
    '/practice/session': [{ label: t('nav.practiceGroup'), to: '/practice' }, { label: t('practice.session') }],
    '/practice/scenarios': [{ label: t('nav.practiceGroup'), to: '/practice' }, { label: t('practice.scenarioTrainer') }],
    '/practice/quiz': [{ label: t('nav.practiceGroup'), to: '/practice' }, { label: t('practice.quiz') }],
    '/confusions': [{ label: t('nav.practiceGroup'), to: '/practice' }, { label: t('nav.confusions') }],
    '/progress': [{ label: t('nav.progressGroup') }],
    '/saved': [{ label: t('nav.progressGroup'), to: '/progress' }, { label: t('nav.saved') }],
  }

  return <Breadcrumbs items={[panel, ...(staticRoutes[pathname] ?? [{ label: t('notfound.title') }])]} />
}
