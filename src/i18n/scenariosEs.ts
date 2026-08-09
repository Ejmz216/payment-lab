export interface ScenarioTranslation {
  title: string
  prompt: string
  choices: Record<string, string>
  reasoning: string
  lifecycleImpact?: string
  businessPerspective?: string
  technicalPerspective?: string
}

export const scenariosEs: Record<string, ScenarioTranslation> = {
  'reject-or-return-1': {
    title: 'Cuenta del beneficiario cerrada',
    prompt: 'Una institución receptora acepta un pago. Luego se determina que la cuenta del beneficiario está cerrada, y el crédito no puede completarse. ¿Qué deberías investigar primero?',
    choices: {
      a: 'Debe enviarse un nuevo pacs.008',
      b: 'El flujo de devolución (return) (el pago ya progresó y ahora debe enviarse de vuelta)',
      c: 'Iniciación del cliente (pain.001)',
      d: 'Nada — no se necesita ninguna acción',
    },
    reasoning: 'El pago ya fue aceptado — progresó más allá de la validación. Un fallo descubierto después, cuando los fondos no pueden acreditarse, es un escenario de devolución (return), no de rechazo.',
    lifecycleImpact: 'Accepted → fallo posterior en el paso de crédito.',
    businessPerspective: 'El lado originador necesita ser informado de que los fondos están regresando para poder avisarle a su cliente.',
    technicalPerspective: 'Busca un mensaje de tipo devolución que referencie el EndToEndId original.',
  },
  'reject-or-return-2': {
    title: 'Número de cuenta inválido en la validación',
    prompt: 'Se recibe una instrucción de pago. Durante la validación inicial, se encuentra que el formato del número de cuenta es inválido. El pago nunca continúa. ¿Qué es esto más probablemente?',
    choices: {
      a: 'Un rechazo (reject)',
      b: 'Una devolución (return)',
      c: 'Un recall',
      d: 'Un pago completado',
    },
    reasoning: 'El problema se encontró antes de la aceptación — el pago nunca progresó. Esta es la forma característica de un rechazo (reject), no de una devolución.',
    lifecycleImpact: 'Received → Validación fallida → no aceptado.',
  },
  'identifier-trace-1': {
    title: 'Rastreando a través de un reporte de estado',
    prompt: 'Recibes un reporte de estado pacs.002 y necesitas encontrar a qué pago original se refiere. ¿Qué campo es más confiable para esto?',
    choices: {
      a: 'MsgId del reporte de estado',
      b: 'OrgnlEndToEndId (Original End To End Identification)',
      c: 'CreDtTm del reporte de estado',
      d: 'NbOfTxs',
    },
    reasoning: 'OrgnlEndToEndId lleva explícitamente el EndToEndId de la transacción original sobre la que se reporta, el cual está diseñado para viajar sin cambios de extremo a extremo.',
  },
}

scenariosEs['pacs008-choose-message'] = {
  title: 'Eligiendo el mensaje interbancario correcto',
  prompt: 'Un cliente en BANK_A quiere enviar 250 XXX a un cliente en BANK_B mediante un pago instantáneo. BANK_A necesita instruir a BANK_B (a través de la red de pagos) para acreditar al beneficiario. ¿Qué mensaje generaría típicamente BANK_A para este tramo interbancario?',
  choices: {
    a: 'pain.001',
    b: 'pacs.008',
    c: 'pacs.002',
    d: 'camt.053',
  },
  reasoning: 'pain.001 (si se usa) es el mensaje de iniciación de cara al cliente. El tramo interbancario — instruir a BANK_B a acreditar al beneficiario — se lleva mediante pacs.008, una FIToFICustomerCreditTransfer. pacs.002 reporta el estado después, y camt.053 es un estado de cuenta, no una instrucción.',
}

scenariosEs['pain001-customer-request'] = {
  title: 'La solicitud del cliente llega a BANK_A',
  prompt: 'CUSTOMER_A envía a BANK_A una instrucción estructurada para iniciar tres transferencias de crédito. ¿Qué concepto de mensaje encaja mejor con este paso cliente-a-institución?',
  choices: { a: 'pain.001', b: 'pacs.008', c: 'pacs.002', d: 'pacs.004' },
  reasoning: 'pain.001 es CustomerCreditTransferInitiation. Lleva una solicitud del cliente hacia una institución financiera; no es la instrucción interbancaria posterior, el reporte de estado ni la devolución.',
}

scenariosEs['pacs002-status-correlation'] = {
  title: '¿Qué pago describe este estado?',
  prompt: 'BANK_A recibe un pacs.002 con MsgId MSG-STATUS-002 y OrgnlEndToEndId E2E-001. ¿Qué valor debe usar primero para correlacionar el reporte con la transacción original?',
  choices: { a: 'MSG-STATUS-002', b: 'E2E-001', c: 'Solo la fecha de creación', d: 'El nombre de la familia del mensaje' },
  reasoning: 'El MsgId del reporte identifica el sobre pacs.002. OrgnlEndToEndId lleva el EndToEndId de la transacción original y es el valor de correlación relevante en este ejemplo sintético.',
}

scenariosEs['status-not-money'] = {
  title: 'Mensaje recibido, dinero desconocido',
  prompt: 'Operaciones puede probar que BANK_B recibió un mensaje de pago, pero no tiene confirmación de settlement ni evidencia de posting al beneficiario. ¿Qué puede concluir con seguridad?',
  choices: {
    a: 'El beneficiario fue acreditado',
    b: 'El pago fue settled',
    c: 'Solamente que el mensaje fue recibido; el estado del dinero no está probado',
    d: 'Ya debe existir un pacs.004',
  },
  reasoning: 'La recepción del mensaje es evidencia de comunicación. Sin evidencia de settlement o posting, operaciones debe mantener incierto el estado del dinero e investigar en vez de inferir que terminó.',
}

scenariosEs['clearing-not-settlement'] = {
  title: 'Obligación neta calculada, valor no movido',
  prompt: 'Un sistema de clearing calcula que BANK_A debe 40 XXX netos a BANK_B. Operaciones no encuentra ningún posting en las posiciones de settlement de los participantes. ¿Cuál es la conclusión más sólida?',
  choices: {
    a: 'Las obligaciones fueron compensadas, pero el settlement todavía no está probado',
    b: 'BANK_B y su cliente fueron acreditados',
    c: 'El settlement debió ocurrir porque ya se conoce el monto neto',
    d: 'Las instrucciones de pago originales nunca existieron',
  },
  reasoning: 'El monto neto prueba que clearing determinó la obligación resultante. Sin evidencia de cambios en las posiciones de settlement, la liquidación de esa obligación sigue sin probarse.',
  lifecycleImpact: 'Cleared → todavía se requiere evidencia de settlement.',
  businessPerspective: 'No reportes movimiento de valor ni crédito al beneficiario usando solamente un resultado de clearing.',
  technicalPerspective: 'Correlaciona el resultado de clearing con un evento o posting autoritativo de settlement antes de avanzar el estado del dinero.',
}

scenariosEs['spi-rd-message-triage'] = {
  title: 'SPI RD: clasificar el mensaje correcto',
  prompt: 'En una sesion de estudio sobre SPI/SGPI dominicano, BANK_A necesita consultar informacion de cuenta/balance con el administrador de transacciones antes de investigar un pago. Que concepto de mensaje ISO 20022 encaja mejor con esa consulta?',
  choices: {
    a: 'pacs.008',
    b: 'pacs.004',
    c: 'camt.003',
    d: 'pain.001',
  },
  reasoning: 'camt.003 GetAccount es la consulta de informacion de cuenta. pacs.008 es para una transferencia de credito interbancaria de cliente, mientras pacs.004 es una devolucion de pago. Para el caso publico SPI/SGPI dominicano, el uso exacto de camt.003 queda como TO VERIFY salvo que una guia autorizada lo indique.',
}

scenariosEs['sgpi-001-happy-path'] = {
  title: 'SGPI-001: Evidencia del happy path',
  prompt: 'BANK_A tiene un estado exitoso del esquema y evidencia de settlement final. BANK_B también registró 500 XXX en la cuenta de CUSTOMER_B. ¿Qué afirmación está completamente respaldada?',
  choices: {
    a: 'La instrucción solamente fue recibida',
    b: 'El pago fue liquidado y el beneficiario fue acreditado',
    c: 'Hay una devolución pendiente',
    d: 'Ya conocemos el perfil ISO exacto del SGPI',
  },
  reasoning: 'La evidencia de settlement prueba el evento monetario entre participantes, y la evidencia de posting de BANK_B prueba por separado el crédito al beneficiario. Ninguno de esos hechos revela el perfil ISO exacto usado por el SGPI.',
  lifecycleImpact: 'Settled → Acreditado.',
  businessPerspective: 'El resultado puede comunicarse como completado porque existen evidencias de settlement y de crédito al beneficiario.',
  technicalPerspective: 'Correlaciona el evento de settlement y el posting del beneficiario con identificadores sintéticos como E2E-001 y TX-001.',
}

scenariosEs['sgpi-002-reject-before-settlement'] = {
  title: 'SGPI-002: Rechazo antes de settlement',
  prompt: 'BANK_B rechaza una operación antes de settlement. BANK_A había reservado los fondos del pagador. ¿Cuál es el diagnóstico más seguro?',
  choices: {
    a: 'Debe crearse una devolución posterior a settlement',
    b: 'Es un rechazo temprano; no hubo settlement y debe verificarse qué ocurre con la reserva',
    c: 'El beneficiario fue acreditado y luego se hizo reversal',
    d: 'Un camt.003 devolvió los fondos',
  },
  reasoning: 'La decisión receptora detuvo el pago antes de settlement, por lo que tiene forma de rechazo, no de devolución. El evento exacto que libera los fondos reservados pertenece a las reglas autorizadas del esquema y a la implementación institucional.',
  lifecycleImpact: 'Reservado → Rechazado antes de settlement → liberación TO VERIFY.',
  businessPerspective: 'No informes a CUSTOMER_A que el dinero regresó desde BANK_B; no se probó settlement entre participantes.',
  technicalPerspective: 'Correlaciona el rechazo con la instrucción original y verifica el evento autoritativo de liberación de la reserva.',
}

scenariosEs['sgpi-003-timeout-before-approval'] = {
  title: 'SGPI-003: Timeout antes de aprobación',
  prompt: 'BANK_A puede probar el envío y la reserva de fondos, pero no recibe aprobación ni rechazo antes de que venza su temporizador local. ¿Qué estado del pago está justificado?',
  choices: {
    a: 'Rechazado',
    b: 'Settled',
    c: 'Incierto; debe obtenerse el estado autoritativo del esquema antes de decidir el resultado',
    d: 'Reintentar automáticamente con un EndToEndId nuevo',
  },
  reasoning: 'Un timeout local solo prueba que falta evidencia oportuna. No revela si el lado receptor aprobó, rechazó o siguió procesando la operación.',
  lifecycleImpact: 'Enviado / reservado → resultado incierto.',
  businessPerspective: 'La comunicación al cliente debe reconocer la investigación pendiente, sin afirmar fallo o éxito.',
  technicalPerspective: 'Consulta o reconcilia usando los identificadores originales. El comportamiento de retry e idempotencia debe venir de reglas autorizadas.',
}

scenariosEs['sgpi-004-problem-after-settlement'] = {
  title: 'SGPI-004: Problema después de settlement',
  prompt: 'El settlement final está probado, pero BANK_B informa que no pudo acreditar a CUSTOMER_B. ¿Qué debe investigar primero operaciones?',
  choices: {
    a: 'Un rechazo temprano antes de aceptación',
    b: 'Una excepción posterior a settlement y un posible flujo de devolución según reglas SGPI',
    c: 'Solamente una nueva iniciación de cliente',
    d: 'Si la instrucción original fue enviada alguna vez',
  },
  reasoning: 'El settlement ya ocurrió, por lo que la investigación empieza después del límite de rechazo temprano. pacs.004 es conceptualmente relevante para devolver un pago que progresó, pero su uso exacto, plazo y códigos SGPI siguen como TO VERIFY.',
  lifecycleImpact: 'Settled → falló el crédito al beneficiario → excepción posterior a settlement.',
  businessPerspective: 'El lado originador necesita evidencia de cómo se manejará el valor liquidado antes de actualizar a CUSTOMER_A.',
  technicalPerspective: 'Rastrea el EndToEndId original y la evidencia de settlement; luego busca un registro autorizado de devolución o excepción.',
}

scenariosEs['sgpi-005-message-vs-money'] = {
  title: 'SGPI-005: Mensaje versus dinero',
  prompt: 'El componente que se conecta con SGPI registra que una instrucción fue entregada al actor siguiente. No hay evento de settlement ni posting al beneficiario. ¿Qué está probado?',
  choices: {
    a: 'Solo la entrega del mensaje; el dinero y el estado final siguen sin probarse',
    b: 'La obligación entre participantes fue liquidada',
    c: 'CUSTOMER_B puede usar los fondos',
    d: 'Se requiere un pacs.004',
  },
  reasoning: 'La evidencia de comunicación no sustituye evidencia de settlement o posting. Mantén explícitamente desconocidos el estado del dinero y el estado final hasta probar los eventos correspondientes.',
  lifecycleImpact: 'Mensaje entregado; eventos monetarios posteriores sin probar.',
  businessPerspective: 'Evita decirle a cualquiera de los clientes que la transferencia terminó.',
  technicalPerspective: 'Continúa el rastreo con identificadores estables y evidencia específica de cada evento.',
}

scenariosEs['sgpi-006-accepted-by-whom'] = {
  title: 'SGPI-006: ¿Aceptado por quién?',
  prompt: 'Un dashboard muestra ACCEPTED, pero no identifica actor, evento ni timestamp. ¿Cuál es la mejor pregunta siguiente?',
  choices: {
    a: '¿Qué actor aceptó qué evento y existe evidencia separada de settlement?',
    b: '¿Qué color debe tener el badge de estado?',
    c: '¿Podemos asumir que CUSTOMER_B fue acreditado?',
    d: '¿Debemos reemplazar el EndToEndId?',
  },
  reasoning: 'Accepted solo tiene significado con sujeto y límite: recibido por SGPI, validado por el esquema, aprobado por BANK_B o aceptado para otro evento. Settlement y crédito siguen siendo eventos separados.',
  lifecycleImpact: 'Aceptación ambigua → identificar actor y evento → evaluar evidencia posterior.',
  businessPerspective: 'Un estado accepted genérico no basta para determinar el resultado final del cliente.',
  technicalPerspective: 'Captura actor, fuente del estado, identificador correlacionado y timestamp como campos de evidencia separados.',
}

scenariosEs['actor-role-investigation'] = {
  title: '¿Qué actor atiende al pagador?',
  prompt: 'Un rastreo sintético nombra a CUSTOMER_A como Debtor, BANK_A como Debtor Agent, BANK_B como Creditor Agent y CUSTOMER_B como Creditor. Operaciones necesita la institución que atiende la cuenta del pagador. ¿Qué actor debe investigar?',
  choices: {
    a: 'CUSTOMER_A — el Debtor',
    b: 'BANK_A — el Debtor Agent',
    c: 'BANK_B — el Creditor Agent',
    d: 'CUSTOMER_B — el Creditor',
  },
  reasoning: 'El Debtor es la parte que debe o envía los fondos. El Debtor Agent es la institución financiera que atiende a esa parte y su cuenta en este ejemplo sintético.',
  lifecycleImpact: 'Identifica el límite entre actores antes de investigar evidencia del lado de la cuenta.',
  businessPerspective: 'Contactar el rol correcto evita confundir al cliente con la institución que actúa para ese cliente.',
  technicalPerspective: 'Inspecciona el rol Debtor Agent y correlaciónalo con el participante que atiende la cuenta según el contexto autorizado del esquema.',
}

export interface QuizTranslation {
  prompt: string
  choices: Record<string, string>
  explanation: string
}

export const quizEs: Record<string, QuizTranslation> = {
  'q-clearing-settlement-1': {
    prompt: '¿Qué afirmación describe mejor el settlement?',
    choices: {
      a: 'Determinar quién le debe qué a quién',
      b: 'La liquidación real de una obligación financiera',
      c: 'Validar la sintaxis de un mensaje',
      d: 'Enviar un mensaje de iniciación de cliente',
    },
    explanation: 'Settlement es el movimiento/liquidación real del valor. Clearing es lo que determina la obligación de antemano.',
  },
  'q-actors-1': {
    prompt: 'Verdadero o falso: Debtor y Debtor Agent se refieren al mismo rol.',
    choices: { a: 'Verdadero', b: 'Falso' },
    explanation: 'Debtor = la parte que debe/envía los fondos. Debtor Agent = la institución que da servicio a esa parte. Son roles diferentes.',
  },
  'q-identifiers-1': {
    prompt: '¿Qué identificador está diseñado para viajar sin cambios con un pago de extremo a extremo?',
    choices: { a: 'MsgId', b: 'TxId', c: 'EndToEndId', d: 'InstrId' },
    explanation: 'EndToEndId está pensado para permanecer sin cambios desde el deudor original hasta el acreedor final, lo que lo hace valioso para el rastreo.',
  },
  'q-iso-1': {
    prompt: 'Verdadero o falso: ISO 20022 es fundamentalmente un formato XML.',
    choices: { a: 'Verdadero', b: 'Falso' },
    explanation: 'ISO 20022 es una metodología de modelado que cubre procesos de negocio y definiciones de mensajes. XML es una sintaxis posible usada para representar mensajes.',
  },
  'q-rejectreturn-1': {
    prompt: 'Un pago ya fue liquidado (settled), pero la cuenta del beneficiario resultó estar cerrada. ¿Qué es esto?',
    choices: { a: 'Un rechazo (reject)', b: 'Una devolución (return)', c: 'Un duplicado', d: 'Una iniciación' },
    explanation: 'Como el pago ya progresó más allá de la aceptación/liquidación, un fallo posterior se maneja como una devolución (return), no como un rechazo.',
  },
}
