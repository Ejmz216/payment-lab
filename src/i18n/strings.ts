import { useUIStore } from '@/store/uiStore'

export const strings = {
  // Sidebar
  'nav.dashboard': { en: 'Dashboard', es: 'Panel' },
  'nav.overview': { en: 'Overview', es: 'Resumen' },
  'nav.modes': { en: 'Modes', es: 'Modos' },
  'nav.study': { en: 'Study', es: 'Estudio' },
  'nav.fastPayments': { en: 'Fast Payments', es: 'Pagos Instantáneos' },
  'nav.atlas': { en: 'ISO 20022 Atlas', es: 'Atlas ISO 20022' },
  'nav.lab': { en: 'Lab', es: 'Laboratorio' },
  'nav.practice': { en: 'Practice', es: 'Práctica' },
  'nav.glossary': { en: 'Glossary', es: 'Glosario' },
  'nav.confusions': { en: 'Common Confusions', es: 'Confusiones Comunes' },
  'nav.progress': { en: 'Progress', es: 'Progreso' },
  'sidebar.tagline': { en: 'ISO 20022 & Payments', es: 'ISO 20022 y Pagos' },
  'sidebar.footer': { en: 'Static, client-side only. No backend, no tracking.', es: 'Sitio estático, solo del lado del cliente. Sin backend, sin rastreo.' },

  // Header
  'header.search': { en: 'Search concepts, messages, lessons…', es: 'Buscar conceptos, mensajes, lecciones…' },
  'header.private': { en: 'Private', es: 'Privado' },
  'header.privateSession': { en: 'Private Session', es: 'Sesión Privada' },
  'header.privateSessionTitle': { en: 'Private Session: nothing from this session is added to your learning history', es: 'Sesión Privada: nada de esta sesión se agrega a tu historial de aprendizaje' },
  'header.language': { en: 'Language', es: 'Idioma' },

  // Command palette
  'palette.placeholder': { en: 'Search lessons, messages, glossary, lab tools…', es: 'Buscar lecciones, mensajes, glosario, herramientas del laboratorio…' },
  'palette.noResults': { en: 'No results.', es: 'Sin resultados.' },
  'palette.groupLessons': { en: 'Lessons', es: 'Lecciones' },
  'palette.groupMessages': { en: 'Messages', es: 'Mensajes' },
  'palette.groupGlossary': { en: 'Glossary', es: 'Glosario' },
  'palette.groupLab': { en: 'Lab', es: 'Laboratorio' },

  // Dashboard
  'dashboard.title': { en: 'Payment Lab', es: 'Payment Lab' },
  'dashboard.subtitle': { en: 'ISO 20022 & Payments Learning Environment', es: 'Entorno de aprendizaje de ISO 20022 y Pagos' },
  'dashboard.continueLearning': { en: 'Continue Learning', es: 'Continuar Aprendiendo' },
  'dashboard.continue': { en: 'Continue', es: 'Continuar' },
  'dashboard.overallMastery': { en: 'Overall Mastery', es: 'Dominio General' },
  'dashboard.lessonsComplete': { en: 'Tier 1 lessons complete', es: 'lecciones de Nivel 1 completadas' },
  'dashboard.recommendedNext': { en: 'Recommended Next', es: 'Recomendado a Continuación' },
  'dashboard.min': { en: 'min', es: 'min' },
  'dashboard.commonConfusion': { en: 'Common Confusion', es: 'Confusión Común' },
  'dashboard.seeAllConfusions': { en: 'See all confusions →', es: 'Ver todas las confusiones →' },
  'dashboard.practice': { en: 'Practice', es: 'Práctica' },
  'dashboard.practiceDesc': { en: 'Scenarios and quiz questions ready for you.', es: 'Escenarios y preguntas de práctica listos para ti.' },
  'dashboard.openPractice': { en: 'Open Practice Center', es: 'Abrir Centro de Práctica' },
  'dashboard.exploreAtlas': { en: 'Explore ISO 20022 Atlas', es: 'Explorar el Atlas ISO 20022' },
  'dashboard.exploreAtlasDesc': { en: 'Browse message families and deep dives at your own pace.', es: 'Explora familias de mensajes y análisis profundos a tu ritmo.' },
  'dashboard.openAtlas': { en: 'Open Atlas', es: 'Abrir Atlas' },

  // Fast payments home
  'fp.title': { en: 'Fast Payments Path', es: 'Ruta de Pagos Instantáneos' },
  'fp.description': {
    en: 'The recommended route through Payment Lab. Learn how a payment actually works before treating ISO 20022 messages as isolated XML files.',
    es: 'La ruta recomendada en Payment Lab. Aprende cómo funciona realmente un pago antes de tratar los mensajes ISO 20022 como archivos XML aislados.',
  },

  // Lesson page
  'lesson.whyMatters': { en: 'Why this matters', es: 'Por qué esto importa' },
  'lesson.objectives': { en: 'After this lesson you should be able to', es: 'Después de esta lección deberías poder' },
  'lesson.mentalModel': { en: 'Mental model', es: 'Modelo mental' },
  'lesson.keyTerms': { en: 'Key terms', es: 'Términos clave' },
  'lesson.commonMistake': { en: 'Common mistake', es: 'Error común' },
  'lesson.checkYourself': { en: 'Check yourself', es: 'Ponte a prueba' },
  'lesson.sources': { en: 'Sources & references', es: 'Fuentes y referencias' },
  'lesson.lastReviewed': { en: 'last reviewed', es: 'última revisión' },
  'lesson.markComplete': { en: 'Mark lesson complete', es: 'Marcar lección como completada' },

  // Atlas
  'atlas.title': { en: 'ISO 20022 Atlas', es: 'Atlas ISO 20022' },
  'atlas.description': {
    en: 'Explore ISO 20022 like a map, not a spreadsheet. Payment Lab currently offers deep educational coverage for Payments, and catalog-level discovery for other business domains.',
    es: 'Explora ISO 20022 como un mapa, no como una hoja de cálculo. Payment Lab ofrece actualmente cobertura educativa profunda para Pagos, y descubrimiento a nivel de catálogo para otros dominios de negocio.',
  },
  'atlas.domains': { en: 'Business domains', es: 'Dominios de negocio' },
  'atlas.families': { en: 'Message families', es: 'Familias de mensajes' },
  'atlas.browseCatalog': { en: 'Browse message catalog →', es: 'Explorar catálogo de mensajes →' },
  'atlas.comingSoon': { en: 'Catalog only (coming soon)', es: 'Solo catálogo (próximamente)' },
  'atlas.deepCoverage': { en: 'Deep coverage', es: 'Cobertura profunda' },
  'atlas.messages': { en: 'messages', es: 'mensajes' },
  'atlas.message': { en: 'message', es: 'mensaje' },

  // Message catalog
  'catalog.title': { en: 'Message Catalog', es: 'Catálogo de Mensajes' },
  'catalog.description': { en: 'Search across covered ISO 20022 messages.', es: 'Busca entre los mensajes ISO 20022 disponibles.' },
  'catalog.searchPlaceholder': { en: 'Search pacs.008, customer credit transfer, status report…', es: 'Buscar pacs.008, transferencia de crédito, reporte de estado…' },
  'catalog.allFamilies': { en: 'All families', es: 'Todas las familias' },
  'catalog.noResults': { en: 'No messages match your search.', es: 'Ningún mensaje coincide con tu búsqueda.' },

  // Message page
  'msg.what': { en: 'What?', es: '¿Qué?' },
  'msg.why': { en: 'Why?', es: '¿Por qué?' },
  'msg.who': { en: 'Who?', es: '¿Quién?' },
  'msg.when': { en: 'When?', es: '¿Cuándo?' },
  'msg.before': { en: 'What comes before?', es: '¿Qué viene antes?' },
  'msg.after': { en: 'What can come after?', es: '¿Qué puede venir después?' },
  'msg.explorer': { en: 'Message Explorer', es: 'Explorador de Mensaje' },
  'msg.relevance': { en: 'Fast Payments relevance', es: 'Relevancia para Pagos Instantáneos' },
  'msg.coverage': { en: 'Coverage', es: 'Cobertura' },
  'msg.commonMistake': { en: 'Common mistake', es: 'Error común' },
  'msg.related': { en: 'Related messages', es: 'Mensajes relacionados' },
  'msg.sources': { en: 'Sources & references', es: 'Fuentes y referencias' },
  'msg.selectField': { en: 'Select a field in the tree to see its details.', es: 'Selecciona un campo en el árbol para ver sus detalles.' },
  'msg.businessMeaning': { en: 'Business meaning', es: 'Significado de negocio' },
  'msg.cardinality': { en: 'Cardinality', es: 'Cardinalidad' },
  'msg.type': { en: 'Type', es: 'Tipo' },
  'msg.parent': { en: 'Parent', es: 'Padre' },
  'msg.example': { en: 'Example value', es: 'Valor de ejemplo' },
  'msg.whyMatters': { en: 'Why it matters', es: 'Por qué importa' },
  'msg.mistakes': { en: 'Common mistakes', es: 'Errores comunes' },
  'msg.relatedFields': { en: 'Related fields', es: 'Campos relacionados' },
  'msg.treeNote': { en: 'Field names (XML tags) are shown in their original English/ISO form, as used internationally in ISO 20022 documentation.', es: 'Los nombres de campo (etiquetas XML) se muestran en su forma original en inglés/ISO, tal como se usan internacionalmente en la documentación de ISO 20022.' },

  // Lab
  'lab.title': { en: 'Lab', es: 'Laboratorio' },
  'lab.description': { en: 'Hands-on tools: simulate payments, debug failures, and experiment with identifiers — all using synthetic data.', es: 'Herramientas prácticas: simula pagos, depura fallos y experimenta con identificadores — todo con datos sintéticos.' },
  'lab.simulatorTitle': { en: 'Payment Simulator', es: 'Simulador de Pagos' },
  'lab.simulatorDesc': { en: 'Configure and run a payment through a synthetic end-to-end flow.', es: 'Configura y ejecuta un pago a través de un flujo sintético de extremo a extremo.' },
  'lab.debuggerTitle': { en: 'Payment Debugger', es: 'Depurador de Pagos' },
  'lab.debuggerDesc': { en: 'Investigate a failed payment: find where it broke and what to check next.', es: 'Investiga un pago fallido: encuentra dónde se rompió y qué revisar a continuación.' },
  'lab.identifierTitle': { en: 'Identifier Lab', es: 'Laboratorio de Identificadores' },
  'lab.identifierDesc': { en: 'Understand MsgId, InstrId, EndToEndId and TxId across a multi-transaction message.', es: 'Comprende MsgId, InstrId, EndToEndId y TxId en un mensaje con múltiples transacciones.' },
  'lab.rejectReturnTitle': { en: 'Reject vs. Return Trainer', es: 'Entrenador de Rechazo vs. Devolución' },
  'lab.rejectReturnDesc': { en: 'Place a failure on the lifecycle and decide: reject, return, or something else?', es: 'Coloca un fallo en el ciclo de vida y decide: ¿rechazo, devolución u otra cosa?' },

  // Simulator
  'sim.syntheticNote': { en: 'All data below is synthetic. This does not represent a real payment or institution.', es: 'Todos los datos siguientes son sintéticos. No representan un pago o institución real.' },
  'sim.configuration': { en: 'Configuration', es: 'Configuración' },
  'sim.debtor': { en: 'Debtor', es: 'Deudor' },
  'sim.debtorAgent': { en: 'Debtor Agent', es: 'Agente del Deudor' },
  'sim.creditor': { en: 'Creditor', es: 'Acreedor' },
  'sim.creditorAgent': { en: 'Creditor Agent', es: 'Agente del Acreedor' },
  'sim.amount': { en: 'Amount', es: 'Monto' },
  'sim.scenario': { en: 'Scenario', es: 'Escenario' },
  'sim.run': { en: 'Run simulation', es: 'Ejecutar simulación' },
  'sim.flow': { en: 'Flow', es: 'Flujo' },
  'sim.timeline': { en: 'Timeline', es: 'Cronología' },
  'sim.timelineHint': { en: 'Run the simulation to see a synthetic timeline of events.', es: 'Ejecuta la simulación para ver una cronología sintética de eventos.' },
  'sim.viewMessage': { en: 'View message', es: 'Ver mensaje' },
  'sim.outcome': { en: 'Outcome', es: 'Resultado' },

  // Debugger
  'dbg.title': { en: 'Payment Debugger', es: 'Depurador de Pagos' },
  'dbg.subtitle': { en: 'PAYMENT FAILED. Find out what happened. All cases are synthetic.', es: 'EL PAGO FALLÓ. Descubre qué ocurrió. Todos los casos son sintéticos.' },
  'dbg.timeline': { en: 'Timeline', es: 'Cronología' },
  'dbg.whichMessage': { en: 'Which message would you investigate?', es: '¿Qué mensaje investigarías?' },

  // Identifier lab
  'idlab.title': { en: 'Identifier Lab', es: 'Laboratorio de Identificadores' },
  'idlab.description': {
    en: 'One message can carry several transactions, and each transaction can carry several identifiers. This lab makes the message-level vs. transaction-level distinction visible.',
    es: 'Un mensaje puede contener varias transacciones, y cada transacción puede tener varios identificadores. Este laboratorio hace visible la diferencia entre nivel de mensaje y nivel de transacción.',
  },
  'idlab.message': { en: 'MESSAGE', es: 'MENSAJE' },
  'idlab.messageNote': { en: 'Message-level — identifies the envelope containing all transactions below.', es: 'Nivel de mensaje — identifica el sobre que contiene todas las transacciones a continuación.' },
  'idlab.transaction': { en: 'Transaction', es: 'Transacción' },
  'idlab.exercise': { en: 'Exercise', es: 'Ejercicio' },
  'idlab.reveal': { en: 'Reveal reasoning', es: 'Ver razonamiento' },

  // Reject vs return
  'rvr.title': { en: 'Reject vs. Return Trainer', es: 'Entrenador de Rechazo vs. Devolución' },
  'rvr.description': {
    en: 'Click a stage on the lifecycle to place a failure there, then decide what you would investigate. The exact boundary and messages used depend on the payment scheme — use this to build intuition, not as a fixed rule.',
    es: 'Haz clic en una etapa del ciclo de vida para colocar un fallo ahí, luego decide qué investigarías. El límite exacto y los mensajes usados dependen del esquema de pago — usa esto para construir intuición, no como una regla fija.',
  },
  'rvr.lifecycle': { en: 'Lifecycle', es: 'Ciclo de Vida' },
  'rvr.wouldYouInvestigate': { en: 'Would you investigate:', es: '¿Investigarías:' },
  'rvr.mostLikely': { en: 'Most likely', es: 'Lo más probable' },

  // Practice
  'practice.title': { en: 'Practice Center', es: 'Centro de Práctica' },
  'practice.subtitle': { en: 'Application and troubleshooting practice, not just recall.', es: 'Práctica de aplicación y resolución de problemas, no solo memorización.' },
  'practice.scenarioTrainer': { en: 'Scenario Trainer', es: 'Entrenador de Escenarios' },
  'practice.scenariosReady': { en: 'realistic reasoning scenarios ready.', es: 'escenarios de razonamiento realista listos.' },
  'practice.quiz': { en: 'Quiz', es: 'Cuestionario' },
  'practice.quizQuestions': { en: 'questions covering Tier 1 concepts.', es: 'preguntas sobre los conceptos de Nivel 1.' },
  'practice.questionOf': { en: 'Question', es: 'Pregunta' },
  'practice.of': { en: 'of', es: 'de' },
  'practice.confidence': { en: 'How confident were you?', es: '¿Qué tan seguro estabas?' },
  'practice.nextQuestion': { en: 'Next question', es: 'Siguiente pregunta' },
  'practice.correct': { en: 'Correct', es: 'Correcto' },
  'practice.incorrect': { en: 'Incorrect', es: 'Incorrecto' },
  'practice.lifecycle': { en: 'Lifecycle', es: 'Ciclo de vida' },
  'practice.related': { en: 'Related', es: 'Relacionado' },
  'practice.dependsOnScheme': { en: 'DEPENDS ON SCHEME — the exact messages/rules can vary by payment scheme.', es: 'DEPENDE DEL ESQUEMA — los mensajes/reglas exactos pueden variar según el esquema de pago.' },
  'confidence.guess': { en: 'guess', es: 'adivinado' },
  'confidence.unsure': { en: 'unsure', es: 'inseguro' },
  'confidence.confident': { en: 'confident', es: 'seguro' },
  'confidence.veryConfident': { en: 'very confident', es: 'muy seguro' },

  // Glossary
  'glossary.title': { en: 'Glossary', es: 'Glosario' },
  'glossary.description': { en: 'Payments and ISO 20022 terminology, explained plainly.', es: 'Terminología de pagos e ISO 20022, explicada de forma sencilla.' },
  'glossary.search': { en: 'Search glossary…', es: 'Buscar en el glosario…' },
  'glossary.commonConfusion': { en: 'Common confusion:', es: 'Confusión común:' },

  // Confusions
  'confusions.title': { en: 'Things People Confuse', es: 'Cosas que la Gente Confunde' },
  'confusions.description': { en: 'The fastest way to sound fluent in payments is knowing exactly where these lines are drawn.', es: 'La forma más rápida de sonar fluido en pagos es saber exactamente dónde se trazan estas líneas.' },
  'confusions.relatedLesson': { en: 'Related lesson →', es: 'Lección relacionada →' },
  'confusions.vs': { en: 'vs.', es: 'vs.' },

  // Progress
  'progress.title': { en: 'Progress', es: 'Progreso' },
  'progress.description': { en: 'Stored locally in your browser only. No account, no cloud.', es: 'Guardado solo localmente en tu navegador. Sin cuenta, sin nube.' },
  'progress.lessons': { en: 'Lessons', es: 'Lecciones' },
  'progress.quizAccuracy': { en: 'Quiz accuracy', es: 'Precisión del cuestionario' },
  'progress.scenarioAccuracy': { en: 'Scenario accuracy', es: 'Precisión de escenarios' },
  'progress.messagesExplored': { en: 'Messages explored', es: 'Mensajes explorados' },
  'progress.complete': { en: 'complete', es: 'completo' },
  'progress.answered': { en: 'answered', es: 'respondidas' },
  'progress.viewed': { en: 'viewed', es: 'vistos' },
  'progress.resetTitle': { en: 'Reset progress', es: 'Reiniciar progreso' },
  'progress.resetDesc': { en: 'This clears completed lessons, quiz results, scenario history and viewed messages from this browser.', es: 'Esto borra las lecciones completadas, resultados de cuestionarios, historial de escenarios y mensajes vistos de este navegador.' },
  'progress.resetConfirm': { en: 'Click again to confirm reset', es: 'Haz clic de nuevo para confirmar el reinicio' },

  // Not found
  'notfound.text': { en: "This page doesn't exist yet in Payment Lab.", es: 'Esta página aún no existe en Payment Lab.' },
  'notfound.back': { en: 'Back to Dashboard', es: 'Volver al Panel' },
} as const

export type StringKey = keyof typeof strings

export function useT() {
  const lang = useUIStore((s) => s.lang)
  return (key: StringKey) => strings[key][lang]
}
