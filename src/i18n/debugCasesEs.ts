export interface DebugCaseTranslation {
  title: string
  brief: string
  timeline: string[]
  messages: string[]
  participants: string[]
  questions: { prompt: string; options: string[]; explanation: string }[]
  finalDiagnosis: string
}

export const debugCasesEs: Record<string, DebugCaseTranslation> = {
  'syn-1034': {
    title: 'El pago no se completó como se esperaba',
    brief: 'Un cliente pregunta por qué su pago aparece como enviado pero el beneficiario nunca recibió los fondos. Investiga qué ocurrió.',
    timeline: [
      'RX pacs.008 (MSG-3301)',
      'VALIDACIÓN OK',
      'ESTADO: ACEPTADO',
      'SETTLEMENT CONFIRMADO',
      'ERROR DE CRÉDITO (CUENTA CERRADA)',
      'DEVOLUCIÓN DE PAGO CREADA',
    ],
    messages: [
      'Instrucción de transferencia de crédito original.',
      'Enviado después de la entrada de cronología "DEVOLUCIÓN DE PAGO CREADA".',
    ],
    participants: [
      'Institución originadora.',
      'Procesó la instrucción y confirmó el settlement.',
      'Intentó acreditar al beneficiario.',
    ],
    questions: [
      {
        prompt: 'Mirando la cronología, ¿dónde salió algo mal?',
        options: ['Antes de la validación', 'Después del settlement, durante el paso de crédito', 'Durante el transporte del mensaje a la infraestructura', 'Nada salió mal — el pago se completó'],
        explanation: 'SETTLEMENT CONFIRMADO aparece antes que ERROR DE CRÉDITO — el pago se liquidó exitosamente, y el fallo ocurrió después, en el paso de crédito.',
      },
      {
        prompt: '¿Se completó el settlement antes de que ocurriera el fallo?',
        options: ['Sí', 'No'],
        explanation: 'La cronología muestra explícitamente SETTLEMENT CONFIRMADO una entrada antes de ERROR DE CRÉDITO.',
      },
      {
        prompt: '¿Qué mensaje revisarías en la pestaña Mensajes como evidencia de qué pasó después?',
        options: ['Un segundo pacs.008', 'pacs.004', 'pain.001', 'camt.053'],
        explanation: 'MSG-3305 en la pestaña Mensajes es un pacs.004 — una devolución — enviado de BANK_B de vuelta a BANK_A.',
      },
      {
        prompt: 'En la pestaña Identificadores, ¿qué campo confirmaría que MSG-3305 es una devolución específicamente de MSG-3301?',
        options: ['Su propio MsgId (MSG-3305)', 'Su OrgnlEndToEndId coincidiendo con el EndToEndId de MSG-3301 (E2E-7742)', 'Solo la marca de tiempo de la cronología'],
        explanation: 'OrgnlEndToEndId en MSG-3305 es E2E-7742 — el mismo EndToEndId que lleva el pacs.008 original (MSG-3301). Esa coincidencia es lo que conecta la devolución con el pago original.',
      },
    ],
    finalDiagnosis:
      'Esto es una devolución, no un rechazo. El pago fue validado, aceptado y liquidado exitosamente — pero BANK_B no pudo acreditar al beneficiario porque la cuenta estaba cerrada, así que devolvió los fondos mediante pacs.004 (MSG-3305), referenciando la transacción original a través de OrgnlEndToEndId.',
  },
  'syn-2210': {
    title: 'Segunda instrucción rechazada — mismo cliente, mismo monto',
    brief: 'Se recibieron dos instrucciones casi idénticas con minutos de diferencia para el mismo cliente. Una fue rechazada. Descubre por qué, y si el reporte de estado retrasado de la primera instrucción importa.',
    timeline: [
      'RX pacs.008 (MSG-8801)',
      'ESTADO: ACEPTADO (MSG-8801)',
      'RX pacs.008 (MSG-8809)',
      'ALERTA: POSIBLE DUPLICADO (MSG-8809)',
      'REPORTE DE ESTADO RETRASADO — ACEPTADO (MSG-8801)',
      'REPORTE DE ESTADO — RECHAZADO, DUPLICADO (MSG-8809)',
    ],
    messages: [
      'Primera instrucción recibida.',
      'Segunda instrucción, recibida ~100 segundos después.',
      'Su reporte de estado se retrasó respecto a cuando MSG-8801 fue aceptado.',
      'Reporta rechazo, motivo: duplicado.',
    ],
    participants: [
      'Envió ambas instrucciones.',
      'Detectó el duplicado y emitió ambos reportes de estado.',
    ],
    questions: [
      {
        prompt: 'En la pestaña Identificadores, ¿cuántos EndToEndId distintos se usaron entre MSG-8801 y MSG-8809?',
        options: ['Dos EndToEndId diferentes', 'Un EndToEndId, reutilizado en ambos mensajes', 'No se puede saber con la tabla de identificadores'],
        explanation: 'Tanto MSG-8801 como MSG-8809 llevan el EndToEndId E2E-A1 — el mismo valor, aunque tienen MsgId y TxId diferentes.',
      },
      {
        prompt: '¿Cuál es la señal más fuerte de que MSG-8809 es un duplicado de MSG-8801?',
        options: ['Llegó unos 100 segundos después', 'Reutiliza el mismo EndToEndId que MSG-8801', 'Su MsgId es numéricamente mayor'],
        explanation: 'El tiempo y el orden del MsgId son circunstanciales. Reutilizar el mismo EndToEndId es la señal de duplicado más fuerte aquí — está pensado para identificar un pago de extremo a extremo.',
      },
      {
        prompt: '¿El reporte de estado retrasado de MSG-8801 cambia si MSG-8809 es un duplicado?',
        options: ['Sí — significa que MSG-8801 podría no haber sido realmente aceptado', 'No — el retraso no está relacionado con la determinación de duplicado de MSG-8809'],
        explanation: 'El reporte de estado retrasado es un evento separado y no relacionado (una particularidad de tiempos en el reporte). No cambia el hecho de que MSG-8809 reutilizó el EndToEndId de MSG-8801.',
      },
      {
        prompt: '¿Qué mensaje en la pestaña Mensajes confirma que MSG-8809 fue rechazado específicamente por ser un duplicado (no por otra razón)?',
        options: ['El propio MSG-8801', 'El pacs.002 de MSG-8809', 'El pacs.002 de MSG-8801'],
        explanation: 'El pacs.002 emitido para MSG-8809 reporta explícitamente el motivo de rechazo como duplicado.',
      },
    ],
    finalDiagnosis:
      'MSG-8809 es un duplicado de MSG-8801 — ambos llevan el mismo EndToEndId (E2E-A1). La infraestructura rechazó correctamente la segunda instrucción. El reporte de estado retrasado de MSG-8801 es una pista falsa: no afecta la determinación de duplicado, que se basa completamente en el EndToEndId reutilizado.',
  },
  'syn-3387': {
    title: 'Timeout marcado, luego llega una aceptación tardía',
    brief: 'Un pago fue reenviado a través de un intermediario y marcado como timeout del lado receptor — pero un reporte de estado llegó dos minutos después. Descubre qué significó realmente el timeout y qué hacer a continuación.',
    timeline: [
      'RX pacs.008 (MSG-4410) en BANK_A',
      'REENVIADO pacs.008 (MSG-4410) a INTERMEDIARY_BANK',
      'REENVIADO pacs.008 (MSG-4410) a BANK_B',
      'SIN RESPUESTA DE BANK_B (30s)',
      'ALERTA DE TIMEOUT (MSG-4410)',
      'REPORTE DE ESTADO TARDÍO DE BANK_B — ACEPTADO (MSG-4410)',
    ],
    messages: [
      'Reenviado a través de un intermediario antes de llegar a BANK_B.',
      'Llegó 1 minuto 34 segundos después de que se marcara la alerta de timeout, reportando ACEPTADO.',
    ],
    participants: [
      'Institución originadora.',
      'Reenvió la instrucción en 4 segundos — no es la fuente del retraso.',
      'Tardó más de un minuto en responder después de recibir la instrucción.',
    ],
    questions: [
      {
        prompt: 'En el momento en que se marcó la alerta de timeout (08:00:36), ¿BANK_B había realmente rechazado el pago?',
        options: ['Sí, ya lo había rechazado', 'Desconocido en ese momento — un timeout significa que no se recibió respuesta, no que falló', 'Ya lo había aceptado'],
        explanation: 'Un timeout solo indica que no llegó respuesta dentro de la ventana esperada. Por sí mismo, no te dice qué hizo realmente BANK_B con el pago.',
      },
      {
        prompt: 'El reporte de estado tardío dice ACEPTADO. ¿Qué te dice esto sobre el timeout?',
        options: ['El timeout fue efectivamente una falsa alarma — el pago estaba progresando en BANK_B todo el tiempo', 'El pago debió fallar y luego reintentarse', 'BANK_B nunca recibió realmente el pago'],
        explanation: 'El pacs.002 tardío muestra que el pago de hecho fue aceptado — solo tomó más tiempo del esperado en reportarse. La alerta de timeout no significó fallo.',
      },
      {
        prompt: 'Mirando la cronología y la pestaña Participantes, ¿qué participante introdujo la mayor parte del retraso?',
        options: ['BANK_A', 'INTERMEDIARY_BANK', 'BANK_B'],
        explanation: 'INTERMEDIARY_BANK reenvió el mensaje en 4 segundos (de 08:00:01 a 08:00:05). La brecha está completamente del lado de BANK_B, que tardó más de un minuto en responder, y más de 2 minutos en enviar el estado.',
      },
      {
        prompt: 'Dada la aceptación tardía, ¿qué investigarías o harías a continuación?',
        options: ['Reenviar inmediatamente un nuevo pacs.008 para el mismo pago', 'Reconciliar usando el EndToEndId para confirmar que el pago no se procesó dos veces, ya que un timeout puede desencadenar envíos duplicados más adelante', 'Presentar una devolución inmediatamente, ya que ocurrió un timeout'],
        explanation: 'Como el timeout fue ambiguo y se resolvió después como una aceptación, el riesgo real es que algún otro proceso (manual o automático) ya haya reenviado el pago durante la ventana de timeout. Reconciliar por EndToEndId (E2E-C9) confirma si eso ocurrió antes de tomar cualquier otra acción.',
      },
    ],
    finalDiagnosis:
      'El timeout a las 08:00:36 fue una falsa alarma causada porque BANK_B tardó en responder, no un fallo. El pacs.002 tardío (recibido a las 08:02:10) confirma que el pago fue aceptado. Esto es un recordatorio de que un timeout señala "todavía no hay respuesta", no "rechazado" — la respuesta correcta es reconciliar antes de asumir un fallo y tomar acción correctiva.',
  },
}
