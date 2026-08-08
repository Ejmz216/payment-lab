import type { Lang } from '@/store/uiStore'
import { fastPaymentsLessons } from '@/content/lessons/fastPaymentsPath'
import { messages as messagesEn, familyInfo } from '@/content/messages'
import { glossary as glossaryEn } from '@/content/glossary'
import { confusions as confusionsEn } from '@/content/confusions'
import { scenarios as scenariosEn, quizQuestions as quizEn } from '@/content/scenarios'
import { lessonsEs } from '@/i18n/lessonsEs'
import { glossaryEs } from '@/i18n/glossaryEs'
import { confusionsEs } from '@/i18n/confusionsEs'
import { scenariosEs, quizEs } from '@/i18n/scenariosEs'
import { messagesEs } from '@/i18n/messagesEs'
import { domains as domainsEn } from '@/content/domains'
import { domainsEs } from '@/i18n/domainsEs'
import { simulatorScenarios as simScenariosEn, simActors as simActorsEn } from '@/content/simulatorScenarios'
import { simulatorEs, simActorsEs } from '@/i18n/simulatorEs'
import type { Lesson, MessageDefinition, GlossaryEntry, Scenario, QuizQuestion } from '@/types/content'

export function getLessons(lang: Lang): Lesson[] {
  if (lang === 'en') return fastPaymentsLessons
  return fastPaymentsLessons.map((l) => {
    const t = lessonsEs[l.id]
    if (!t) return l
    return {
      ...l,
      title: t.title ?? l.title,
      subtitle: t.subtitle ?? l.subtitle,
      whyItMatters: t.whyItMatters ?? l.whyItMatters,
      objectives: t.objectives ?? l.objectives,
      mentalModel: t.mentalModel ?? l.mentalModel,
      sections: t.sections ?? l.sections,
      commonConfusion: t.commonConfusion ?? l.commonConfusion,
      blocks: t.blocks ?? l.blocks,
    }
  })
}

export function getLesson(id: string, lang: Lang): Lesson | undefined {
  return getLessons(lang).find((l) => l.id === id)
}

export function getMessages(lang: Lang): MessageDefinition[] {
  if (lang === 'en') return messagesEn
  return messagesEn.map((m) => {
    const t = messagesEs[m.id]
    if (!t) return m
    return {
      ...m,
      shortDescription: t.shortDescription,
      purpose: t.purpose,
      whatComesBefore: t.whatComesBefore,
      whatComesAfter: t.whatComesAfter,
      commonMistakes: t.commonMistakes ?? m.commonMistakes,
      versions: t.cardinalityNotes ? m.versions.map((v) => ({ ...v, cardinalityNotes: t.cardinalityNotes })) : m.versions,
    }
  })
}

export function getMessage(id: string, lang: Lang): MessageDefinition | undefined {
  return getMessages(lang).find((m) => m.id === id)
}

export function getGlossary(lang: Lang): GlossaryEntry[] {
  if (lang === 'en') return glossaryEn
  return glossaryEn.map((g) => {
    const t = glossaryEs[g.id]
    if (!t) return g
    return { ...g, oneLine: t.oneLine, fullExplanation: t.fullExplanation, commonConfusion: t.commonConfusion ?? g.commonConfusion }
  })
}

export function getConfusions(lang: Lang) {
  if (lang === 'en') return confusionsEn
  return confusionsEn.map((c) => {
    const t = confusionsEs[c.id]
    if (!t) return c
    return { ...c, title: t.title, explanation: t.explanation }
  })
}

export function getScenarios(lang: Lang): Scenario[] {
  if (lang === 'en') return scenariosEn
  return scenariosEn.map((s) => {
    const t = scenariosEs[s.id]
    if (!t) return s
    return {
      ...s,
      title: t.title,
      prompt: t.prompt,
      choices: s.choices.map((c) => ({ ...c, label: t.choices[c.id] ?? c.label })),
      explanation: {
        ...s.explanation,
        reasoning: t.reasoning,
        lifecycleImpact: t.lifecycleImpact ?? s.explanation.lifecycleImpact,
        businessPerspective: t.businessPerspective ?? s.explanation.businessPerspective,
        technicalPerspective: t.technicalPerspective ?? s.explanation.technicalPerspective,
      },
    }
  })
}

export function getDomains(lang: Lang) {
  if (lang === 'en') return domainsEn
  return domainsEn.map((d) => {
    const t = domainsEs[d.id]
    if (!t) return d
    return {
      ...d,
      description: t.description,
      families: d.families.map((f) => ({ ...f, description: t.families?.[f.code] ?? f.description })),
    }
  })
}

export function getDomain(id: string, lang: Lang) {
  return getDomains(lang).find((d) => d.id === id)
}

export function getSimActors(lang: Lang) {
  if (lang === 'en') return simActorsEn
  return simActorsEn.map((a) => ({ ...a, label: simActorsEs[a.id] ?? a.label }))
}

export function getSimulatorScenarios(lang: Lang) {
  if (lang === 'en') return simScenariosEn
  return simScenariosEn.map((s) => {
    const t = simulatorEs[s.id]
    if (!t) return s
    return {
      ...s,
      title: t.title,
      description: t.description,
      events: s.events.map((ev, i) => {
        const et = t.events[i]
        if (!et) return ev
        return {
          ...ev,
          label: et.label ?? ev.label,
          decisionQuestion: et.decisionQuestion ?? ev.decisionQuestion,
          decisionExplanation: et.decisionExplanation ?? ev.decisionExplanation,
          decisionOptions: ev.decisionOptions
            ? ev.decisionOptions.map((o) => ({ ...o, label: et.decisionOptions?.[o.id] ?? o.label }))
            : ev.decisionOptions,
        }
      }),
    }
  })
}

const familyDescriptionsEs: Record<string, string> = {
  pain: 'Cliente a institución financiera. Mensajes relacionados con la iniciación de pagos.',
  pacs: 'Institución financiera a institución financiera. Mensajes relacionados con clearing y settlement de pagos.',
  camt: 'Mensajes relacionados con gestión de efectivo: reportes, estados de cuenta, notificaciones, investigaciones.',
  admi: 'Mensajes administrativos intercambiados entre sistemas y participantes.',
  head: 'Información de encabezado que acompaña a un mensaje de negocio.',
  remt: 'Información detallada de remesa relacionada con un pago.',
}

export function getFamilyInfo(lang: Lang) {
  if (lang === 'en') return familyInfo
  const out: typeof familyInfo = { ...familyInfo }
  for (const key of Object.keys(out)) {
    out[key] = { ...out[key], description: familyDescriptionsEs[key] ?? out[key].description }
  }
  return out
}

export function getQuizQuestions(lang: Lang): QuizQuestion[] {
  if (lang === 'en') return quizEn
  return quizEn.map((q) => {
    const t = quizEs[q.id]
    if (!t) return q
    return {
      ...q,
      prompt: t.prompt,
      choices: q.choices.map((c) => ({ ...c, label: t.choices[c.id] ?? c.label })),
      explanation: t.explanation,
    }
  })
}
