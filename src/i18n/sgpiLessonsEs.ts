import type { LessonBlock } from '@/types/blocks'

interface SgpiLessonTranslation {
  title: string
  subtitle: string
  whyItMatters: string
  objectives: string[]
  mentalModel: string
  blocks: LessonBlock[]
  commonConfusion?: { title: string; explanation: string }[]
}

const publicFlowEs: Extract<LessonBlock, { type: 'four-layer-explorer' }>['steps'] = [
  {
    id: 'customer-initiates',
    title: 'El cliente inicia',
    actor: { label: 'CUSTOMER_A', detail: 'El pagador inicia una transferencia desde un canal de un participante autorizado.', badge: 'public-scheme' },
    message: { label: 'Solicitud del cliente', detail: 'El payload del canal y cualquier mensaje ISO cliente-a-banco son decisiones institucionales.', badge: 'implementation-question' },
    money: { label: 'Disponible en origen', detail: 'Todavía no se ha probado movimiento de valor entre participantes.', badge: 'simplified-model' },
    payment: { label: 'Iniciado', detail: 'El cliente solicitó el pago; el esquema aún no lo ha aceptado.', badge: 'simplified-model' },
  },
  {
    id: 'originator-sends',
    title: 'El originador envía',
    actor: { label: 'BANK_A', detail: 'El participante originador envía una instrucción de pago hacia SGPI.', badge: 'public-scheme' },
    message: { label: 'Instrucción de pago', detail: 'pacs.008 es conceptualmente relevante; el mensaje, versión y tramo exactos del SGPI siguen como TO VERIFY.', badge: 'to-verify' },
    money: { label: 'No liquidado', detail: 'Enviar una instrucción no es settlement ni prueba crédito al beneficiario.', badge: 'simplified-model' },
    payment: { label: 'Enviado', detail: 'La instrucción salió del participante originador en este modelo público.', badge: 'simplified-model' },
  },
  {
    id: 'funds-reserved',
    title: 'Fondos reservados',
    actor: { label: 'BANK_A', detail: 'El lado originador controla los fondos del pagador antes de que el pago continúe.', badge: 'public-scheme' },
    message: { label: 'Evidencia de reserva', detail: 'El comando, evento o asiento interno es un detalle de implementación institucional.', badge: 'implementation-question' },
    money: { label: 'Bloqueados / reservados', detail: 'Los fondos no están disponibles para otro uso, pero esto aún no es settlement definitivo entre participantes.', badge: 'simplified-model' },
    payment: { label: 'Pendiente de routing', detail: 'El pago progresa, pero aprobación y settlement todavía no ocurren.', badge: 'simplified-model' },
  },
  {
    id: 'sgpi-routes',
    title: 'SGPI enruta',
    actor: { label: 'SGPI / BCRD', detail: 'La plataforma administrada por el BCRD enruta la operación entre entidades participantes.', badge: 'public-scheme' },
    message: { label: 'Intercambio del esquema', detail: 'El material público respalda un flujo de mensajes, pero el mensaje ISO exacto de esta flecha sigue como TO VERIFY.', badge: 'to-verify' },
    money: { label: 'Reservado en origen', detail: 'La evidencia de routing por sí sola no prueba settlement.', badge: 'simplified-model' },
    payment: { label: 'Enrutado', detail: 'La operación es presentada al lado receptor.', badge: 'simplified-model' },
  },
  {
    id: 'receiver-decides',
    title: 'El receptor decide',
    actor: { label: 'BANK_B', detail: 'El participante receptor aprueba o rechaza la operación.', badge: 'public-scheme' },
    message: { label: 'Aprobación / rechazo', detail: 'Los conceptos de estado son relevantes, pero el mensaje y códigos exactos del SGPI siguen como TO VERIFY.', badge: 'to-verify' },
    money: { label: 'Condicional', detail: 'En este modelo, rechazo implica liberar; aprobación permite continuar a settlement.', badge: 'simplified-model' },
    payment: { label: 'Aprobado o rechazado', detail: 'Aprobación por BANK_B no equivale a evidencia de settlement ni de crédito al beneficiario.', badge: 'simplified-model' },
  },
  {
    id: 'settlement',
    title: 'Settlement',
    actor: { label: 'Infraestructura de settlement', detail: 'La obligación entre participantes se extingue en la etapa de settlement.', badge: 'public-scheme' },
    message: { label: 'Evento de settlement', detail: 'Un intercambio de mensajes puede respaldar el evento, pero el evento y el mensaje no son lo mismo.', badge: 'to-verify' },
    money: { label: 'Liquidado entre participantes', detail: 'El valor se movió en la capa interparticipante de este modelo público.', badge: 'public-scheme' },
    payment: { label: 'Settled', detail: 'Settlement es evidencia fuerte del dinero, pero todavía no prueba posting a CUSTOMER_B.', badge: 'simplified-model' },
  },
  {
    id: 'status-originator',
    title: 'Estado al originador',
    actor: { label: 'SGPI → BANK_A', detail: 'El participante originador recibe estado del pago.', badge: 'public-scheme' },
    message: { label: 'Estado del pago', detail: 'pacs.002 es conceptualmente relevante; su uso y códigos exactos en SGPI siguen como TO VERIFY.', badge: 'to-verify' },
    money: { label: 'Settled', detail: 'Un estado puede reportar el evento, pero no crea settlement por sí mismo.', badge: 'simplified-model' },
    payment: { label: 'Estado reportado', detail: 'BANK_A puede actualizar su vista según la evidencia de estado recibida.', badge: 'simplified-model' },
  },
  {
    id: 'status-receiver',
    title: 'Estado al receptor',
    actor: { label: 'SGPI → BANK_B', detail: 'El participante receptor recibe estado del pago.', badge: 'public-scheme' },
    message: { label: 'Estado del pago', detail: 'El mensaje, dirección y campos de correlación exactos siguen como TO VERIFY.', badge: 'to-verify' },
    money: { label: 'Settled', detail: 'El posting al beneficiario sigue siendo un evento institucional separado.', badge: 'simplified-model' },
    payment: { label: 'Listo para crédito final', detail: 'El participante receptor tiene evidencia del esquema para seguir su procesamiento del lado cliente.', badge: 'simplified-model' },
  },
  {
    id: 'beneficiary-credited',
    title: 'Beneficiario acreditado',
    actor: { label: 'BANK_B → CUSTOMER_B', detail: 'El participante receptor acredita la cuenta del beneficiario.', badge: 'public-scheme' },
    message: { label: 'Confirmación de crédito', detail: 'El material público describe confirmar el crédito; el evento institucional y mensaje exacto siguen como TO VERIFY.', badge: 'to-verify' },
    money: { label: 'Disponible para CUSTOMER_B', detail: 'El beneficiario puede usar los fondos acreditados.', badge: 'public-scheme' },
    payment: { label: 'Acreditado / completado', detail: 'Solo ahora este modelo tiene evidencia del crédito al beneficiario.', badge: 'simplified-model' },
  },
]

export const sgpiLessonsEs: Record<string, SgpiLessonTranslation> = {
  'sgpi-public-happy-path': {
    title: 'Happy Path Público del SGPI',
    subtitle: 'Una operación, cuatro capas sincronizadas y nueve pasos públicos',
    whyItMatters: 'Una vista centrada solo en mensajes oculta la distinción más importante: comunicación, dinero y estado del pago pueden avanzar en momentos distintos.',
    objectives: [
      'Recorrer el modelo público SGPI de nueve pasos desde la iniciación hasta el crédito al beneficiario.',
      'Describir actor, evidencia de mensaje, estado del dinero y estado del pago en cada paso.',
      'Identificar cada punto donde el mapeo ISO exacto requiere material autorizado del esquema.',
    ],
    mentalModel: 'Mantén visibles cuatro relojes: quién actúa, qué se comunica, dónde está el dinero y qué estado puedes probar.',
    blocks: [
      {
        type: 'explanation',
        heading: 'Flujo público, límites explícitos',
        body: 'El BCRD describe públicamente al SGPI como una plataforma administrada por el BCRD para transferencias y pagos en tiempo real, disponible 24/7. La secuencia siguiente es un modelo educativo público simplificado. No afirma APIs internas, colas, retries, SLA ni arquitectura institucional.',
        badge: 'public-scheme',
      },
      {
        type: 'four-layer-explorer',
        heading: 'Explorador SGPI de cuatro capas',
        intro: 'Selecciona un paso y compara las cuatro capas. TO VERIFY significa que la fuente pública revisada no establece el mensaje exacto ni el comportamiento de implementación.',
        steps: publicFlowEs,
        badge: 'simplified-model',
      },
      {
        type: 'quick-check',
        question: 'SGPI enrutó la operación hacia BANK_B. ¿Qué se ha probado en este punto?',
        options: [
          { id: 'a', label: 'CUSTOMER_B fue acreditado', correct: false },
          { id: 'b', label: 'Terminó el settlement entre participantes', correct: false },
          { id: 'c', label: 'La operación llegó al lado receptor en este modelo', correct: true },
        ],
        explanation: 'El routing prueba avance de comunicación. Aprobación, settlement y crédito al beneficiario siguen siendo eventos separados con evidencia propia.',
      },
    ],
    commonConfusion: [{ title: 'Enrutado ≠ settled', explanation: 'La infraestructura puede enrutar una operación antes de que ocurra el evento de settlement.' }],
  },
  'sgpi-funds-state': {
    title: 'Estado de Fondos en SGPI',
    subtitle: 'Bloqueado no es debitado; settled no es acreditado',
    whyItMatters: 'Muchos errores operativos nacen de comprimir cuatro estados monetarios distintos dentro de la palabra “pagado”.',
    objectives: [
      'Distinguir fondos disponibles, bloqueados/reservados, settled y acreditados.',
      'Explicar por qué una reserva no es settlement definitivo entre participantes.',
      'Elegir la evidencia necesaria antes de decirle al cliente que llegaron los fondos.',
    ],
    mentalModel: 'Pregunta dónde está el valor y qué evidencia lo prueba. Nunca deduzcas el estado del dinero solamente por el nombre de un mensaje.',
    blocks: [
      {
        type: 'lifecycle',
        badge: 'simplified-model',
        stages: [
          { id: 'available', label: 'Disponible', description: 'Los fondos están disponibles para CUSTOMER_A antes de la operación.', canFail: 'Disponibilidad no prueba que el participante aceptó la solicitud.' },
          { id: 'blocked', label: 'Bloqueado / reservado', description: 'Los fondos quedan retenidos para esta operación en el lado originador.', canFail: 'Bloqueado no significa débito final ni settlement entre participantes.' },
          { id: 'settled', label: 'Settled', description: 'La obligación entre participantes fue liquidada.', canFail: 'La cuenta del beneficiario todavía podría no estar acreditada.' },
          { id: 'credited', label: 'Acreditado', description: 'BANK_B registra los fondos para que estén disponibles a CUSTOMER_B.', canFail: 'La evidencia de posting pertenece a la capa institucional receptora.' },
        ],
      },
      {
        type: 'callout',
        title: 'La frase operativa que debes evitar',
        body: '“Enviamos el mensaje, por tanto llegó el dinero” combina evidencia de comunicación con conclusiones monetarias. Sustitúyela por: “Tenemos evidencia de X; settlement y/o crédito todavía requieren evidencia Y”.',
        tone: 'warning',
      },
      { type: 'scenario', scenarioId: 'sgpi-005-message-vs-money' },
    ],
    commonConfusion: [
      { title: 'Bloqueado ≠ débito definitivo', explanation: 'Una reserva restringe los fondos del originador, pero no prueba movimiento final de valor entre participantes.' },
      { title: 'Settled ≠ acreditado', explanation: 'Settlement concierne a los participantes; crédito concierne a la cuenta del beneficiario.' },
    ],
  },
  'sgpi-approval-rejection': {
    title: 'Aprobación y Rechazo en SGPI',
    subtitle: '¿Aceptado por quién y en cuál capa?',
    whyItMatters: '“Aceptado” está incompleto si no nombra al actor ni el evento que ese actor aceptó.',
    objectives: [
      'Separar recepción, validación del esquema, aprobación del participante receptor y settlement.',
      'Explicar cómo un rechazo temprano difiere de una devolución posterior a settlement.',
      'Pedir evidencia de estado específica por actor en lugar de confiar en un accepted genérico.',
    ],
    mentalModel: 'Todo estado necesita sujeto: ¿aceptado por quién, para qué y antes o después de cuál evento monetario?',
    blocks: [
      {
        type: 'evidence-matrix',
        heading: 'La aceptación tiene capas',
        intro: 'Cada fila muestra lo que un evento puede probar y qué todavía necesita evidencia autorizada de implementación.',
        rows: [
          { id: 'received', topic: 'Recibido', publicEvidence: 'El siguiente actor tiene la operación.', isoRelevance: 'Puede ser relevante un acuse técnico o de recepción.', implementationQuestion: '¿Qué acuse, identificador y timestamp prueban recepción?', badge: 'simplified-model' },
          { id: 'scheme', topic: 'Aceptado por el esquema', publicEvidence: 'SGPI permite que la operación continúe en el modelo público.', isoRelevance: 'Un concepto de estado es relevante; aquí no se establece un código exacto.', implementationQuestion: '¿Cuál estado público/autorizado significa aceptación del esquema?', badge: 'to-verify' },
          { id: 'receiver', topic: 'Aprobado por BANK_B', publicEvidence: 'El participante receptor aprueba o rechaza.', isoRelevance: 'La semántica de pacs.002 puede ser relevante para reportar estado.', implementationQuestion: '¿Quién crea el estado y cuáles códigos de motivo aplican?', badge: 'public-scheme' },
          { id: 'settled', topic: 'Settled', publicEvidence: 'La obligación entre participantes fue liquidada.', isoRelevance: 'Settlement es un evento de negocio, no una simple etiqueta de mensaje.', implementationQuestion: '¿Qué evidencia establece settlement final para esta operación?', badge: 'public-scheme' },
        ],
      },
      {
        type: 'prediction',
        context: 'BANK_B aprobó la operación; todavía no existe evidencia de settlement.',
        question: '¿Puede operaciones reportar el pago como settled?',
        options: [
          { id: 'a', label: 'Sí, aprobación siempre equivale a settlement', correct: false },
          { id: 'b', label: 'No, aprobación y settlement requieren evidencia separada', correct: true },
        ],
        explanation: 'La aprobación permite que la operación continúe. No prueba que se movió valor entre participantes.',
      },
      { type: 'scenario', scenarioId: 'sgpi-006-accepted-by-whom' },
    ],
    commonConfusion: [
      { title: 'Recibido ≠ aceptado', explanation: 'Recepción prueba entrega a un actor. Aceptación es una decisión separada.' },
      { title: 'Rechazo ≠ devolución', explanation: 'Un rechazo detiene el progreso antes de settlement; una devolución trata un pago que ya progresó.' },
    ],
  },
  'sgpi-settlement-status-credit': {
    title: 'Settlement, Estado y Crédito en SGPI',
    subtitle: 'Tres eventos que no deben colapsar en un solo check verde',
    whyItMatters: 'La comunicación al cliente y la investigación operativa dependen de saber cuál evento terminó realmente.',
    objectives: [
      'Distinguir settlement, reporte de estado y crédito al beneficiario.',
      'Explicar por qué un mensaje de estado reporta un evento en lugar de causarlo por sí mismo.',
      'Identificar la brecha de evidencia en un caso “settled pero no acreditado”.',
    ],
    mentalModel: 'Settlement cambia valor entre participantes. El estado comunica evidencia. El crédito cambia la cuenta del beneficiario.',
    blocks: [
      {
        type: 'message-sequence',
        heading: 'Modelo público de la etapa final',
        badge: 'simplified-model',
        steps: [
          { id: 'settlement-event', from: 'SETTLEMENT', to: 'PARTICIPANTES', label: 'Evento de settlement', description: 'Se liquida el valor entre participantes; la evidencia técnica exacta es TO VERIFY.', tone: 'scheme' },
          { id: 'origin-status', from: 'SGPI', to: 'BANK_A', label: 'Estado del pago', description: 'El originador recibe estado; el mensaje ISO exacto es TO VERIFY.', tone: 'scheme' },
          { id: 'receiver-status', from: 'SGPI', to: 'BANK_B', label: 'Estado del pago', description: 'El receptor recibe estado; el mensaje ISO exacto es TO VERIFY.', tone: 'scheme' },
          { id: 'credit', from: 'BANK_B', to: 'CUSTOMER_B', label: 'Crédito al beneficiario', description: 'La institución receptora registra los fondos en la cuenta del beneficiario.', tone: 'neutral' },
        ],
      },
      {
        type: 'quick-check',
        question: 'Tienes evidencia de settlement final, pero no de posting al beneficiario. ¿Cuál es el mejor estado?',
        options: [
          { id: 'a', label: 'Completado y acreditado', correct: false },
          { id: 'b', label: 'Settled; crédito al beneficiario todavía no probado', correct: true },
          { id: 'c', label: 'Rechazado', correct: false },
        ],
        explanation: 'El evento monetario entre participantes está probado. El posting al cliente por la institución receptora sigue siendo un evento separado por investigar.',
      },
      { type: 'scenario', scenarioId: 'sgpi-001-happy-path' },
    ],
    commonConfusion: [{ title: 'Intercambio de mensajes ≠ settlement', explanation: 'Los mensajes pueden instruir o reportar un evento. Settlement es la liquidación real de la obligación.' }],
  },
  'sgpi-iso-mapping': {
    title: 'Mapeo ISO del SGPI: Conocido vs TO VERIFY',
    subtitle: 'Usa la semántica ISO sin inventar adopción del esquema',
    whyItMatters: 'Saber pacs.008, pacs.004 y camt.003 es valioso, pero no demuestra dónde o si el SGPI los utiliza.',
    objectives: [
      'Separar la semántica de mensajes ISO del comportamiento público del SGPI.',
      'Describir relevancia conceptual sin afirmar adopción exacta de mensajes.',
      'Listar las preguntas de versión, tramo, estado y reason codes que debe responder una guía autorizada.',
    ],
    mentalModel: 'ISO te dice qué significa un mensaje. El esquema te dice si, dónde y cómo se usa.',
    blocks: [
      {
        type: 'evidence-matrix',
        heading: 'Conocido, relevante y todavía desconocido',
        intro: 'No se asigna un mensaje ISO exacto a una flecha SGPI salvo que el material público revisado lo establezca.',
        rows: [
          { id: 'instruction', topic: 'Instrucción de pago', publicEvidence: 'SGPI permite transferencias y pagos en tiempo real entre participantes.', isoRelevance: 'pacs.008 lleva una transferencia de crédito de cliente entre instituciones.', implementationQuestion: '¿Se usa pacs.008? ¿Qué versión, tramo, perfil y campos obligatorios?', badge: 'to-verify' },
          { id: 'status', topic: 'Aprobación / estado', publicEvidence: 'El modelo público incluye aprobación/rechazo del receptor y estados a participantes.', isoRelevance: 'pacs.002 reporta estado sobre una instrucción de pago.', implementationQuestion: '¿Se usa pacs.002? ¿Qué actor lo envía y qué estados/motivos son válidos?', badge: 'to-verify' },
          { id: 'return', topic: 'Devolución posterior', publicEvidence: 'Se requiere manejar excepciones, pero el material revisado no define un perfil ISO de devolución.', isoRelevance: 'pacs.004 devuelve un pago y referencia la transacción original.', implementationQuestion: '¿Se usa pacs.004? ¿Qué ventana, reason codes y tratamiento de settlement aplican?', badge: 'to-verify' },
          { id: 'account-query', topic: 'Consulta de cuenta', publicEvidence: 'El material público SGPI revisado no establece uso de camt.003.', isoRelevance: 'camt.003 GetAccount solicita información de cuenta.', implementationQuestion: '¿camt.003 está dentro del SGPI o de otro servicio operativo BCRD? ¿Qué cuenta y versión?', badge: 'to-verify' },
          { id: 'account-response', topic: 'Respuesta de cuenta', publicEvidence: 'El material público revisado no establece un mapeo SGPI exacto.', isoRelevance: 'camt.004 ReturnAccount responde a GetAccount; no es pacs.004 PaymentReturn.', implementationQuestion: 'Si se usa camt.003, ¿camt.004 es su respuesta y cuál perfil aplica?', badge: 'to-verify' },
        ],
      },
      {
        type: 'callout',
        title: 'La forma segura de decirlo',
        body: '“pacs.008 es conceptualmente relevante para la instrucción de transferencia interbancaria; la adopción y el mapeo exacto en SGPI son TO VERIFY”. Así preservas el razonamiento ISO sin convertir una suposición en documentación del esquema.',
      },
      { type: 'scenario', scenarioId: 'spi-rd-message-triage' },
    ],
    commonConfusion: [
      { title: 'ISO 20022 ≠ SGPI', explanation: 'ISO define semántica. SGPI es un esquema público dominicano con reglas y material de implementación autorizados propios.' },
      { title: 'pacs.004 ≠ camt.004', explanation: 'pacs.004 es PaymentReturn. camt.004 es ReturnAccount, la respuesta conceptual a camt.003.' },
    ],
  },
  'sgpi-exception-scenarios': {
    title: 'Escenarios de Excepción SGPI',
    subtitle: 'Diagnostica la etapa antes de elegir el mensaje',
    whyItMatters: 'Las excepciones se vuelven manejables cuando localizas primero el último evento probado y luego identificas la evidencia faltante.',
    objectives: [
      'Diagnosticar un rechazo antes de settlement, un timeout antes de aprobación y un problema posterior a settlement.',
      'Mantener explícito el estado incierto cuando la evidencia se interrumpe a mitad del flujo.',
      'Elegir una dirección de investigación sin inventar reglas de retry o devolución.',
    ],
    mentalModel: 'Empieza por el último evento probado. Todo lo posterior es desconocido hasta que la evidencia cierre la brecha.',
    blocks: [
      { type: 'scenario', scenarioId: 'sgpi-002-reject-before-settlement' },
      { type: 'scenario', scenarioId: 'sgpi-003-timeout-before-approval' },
      { type: 'scenario', scenarioId: 'sgpi-004-problem-after-settlement' },
      {
        type: 'callout',
        title: 'Timeout significa incierto, no fallido',
        body: 'Sin un estado autoritativo, el timeout deja incierto el resultado de negocio. No infieras retry automático, reversal ni fallo; son preguntas del esquema y de la institución.',
        tone: 'warning',
      },
    ],
    commonConfusion: [{ title: 'Timeout ≠ rechazo', explanation: 'Un timeout describe falta de evidencia oportuna, no el resultado de negocio.' }],
  },
  'sgpi-questions-to-verify': {
    title: 'Preguntas SGPI por Verificar',
    subtitle: 'Convierte incertidumbre en un checklist disciplinado',
    whyItMatters: 'Un analista sólido no oculta incógnitas: convierte cada una en una pregunta precisa e identifica la fuente autorizada o evidencia necesaria.',
    objectives: [
      'Preparar un checklist enfocado para descubrir la implementación SGPI.',
      'Separar preguntas del esquema de preguntas sobre arquitectura institucional.',
      'Evitar recopilar datos de clientes, producción o información confidencial durante el aprendizaje.',
    ],
    mentalModel: 'TO VERIFY no es un callejón sin salida. Te obliga a nombrar la autoridad, artefacto o evidencia de evento que falta.',
    blocks: [
      {
        type: 'investigation-checklist',
        heading: 'Checklist autorizado de descubrimiento SGPI',
        intro: 'Úsalo con material público del BCRD o documentación institucional autorizada. Mantén todos los ejemplos sintéticos.',
        groups: [
          {
            title: 'Esquema y perfil ISO',
            items: [
              '¿Qué mensajes y versiones ISO 20022 selecciona el SGPI?',
              '¿Qué actor envía cada mensaje en cada tramo del esquema?',
              '¿Qué estados y reason codes se permiten en aprobación, rechazo y devolución?',
              '¿Qué identificadores deben permanecer estables entre instrucción, estado y devolución?',
            ],
          },
          {
            title: 'Eventos de dinero y pago',
            items: [
              '¿Qué evento prueba que los fondos están bloqueados o liberados en el originador?',
              '¿Qué evidencia prueba settlement final entre participantes?',
              '¿Qué evento prueba crédito al beneficiario y no solamente settlement?',
              '¿Cómo se resuelve el estado incierto después de faltar una aprobación o estado?',
            ],
          },
          {
            title: 'Implementación institucional',
            items: [
              '¿Dónde se correlacionan identificadores del esquema con identificadores institucionales?',
              '¿Qué logs o registros autorizados prueban recepción, aprobación, settlement y crédito?',
              '¿Cómo se detectan duplicados y cuál idempotency key es autoritativa?',
              '¿Qué equipo operativo es dueño de cada brecha del explorador de cuatro capas?',
            ],
          },
          {
            title: 'Límite de seguridad',
            items: [
              'Usa únicamente identificadores sintéticos como MSG-001, E2E-001 y TX-001.',
              'No pegues datos de clientes, producción, propiedad institucional o implementación interna en Payment Lab.',
              'Registra una incógnita como TO VERIFY en vez de adivinar.',
            ],
          },
        ],
      },
      {
        type: 'quick-check',
        question: 'No tienes una guía SGPI autorizada. ¿Qué debes escribir junto a la versión exacta de pacs.008?',
        options: [
          { id: 'a', label: 'La versión ISO más nueva, asumida', correct: false },
          { id: 'b', label: 'TO VERIFY, más la fuente necesaria para confirmarla', correct: true },
          { id: 'c', label: 'La versión usada por otro esquema no relacionado', correct: false },
        ],
        explanation: 'Un esquema selecciona y perfila versiones de mensajes. Sin evidencia autorizada, la selección exacta sigue como TO VERIFY.',
      },
    ],
    commonConfusion: [{ title: 'Desconocido ≠ arbitrario', explanation: 'Una incógnita debe producir una pregunta de verificación, no una suposición conveniente.' }],
  },
}
