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
