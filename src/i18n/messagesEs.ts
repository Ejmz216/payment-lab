export interface MessageTranslation {
  shortDescription: string
  purpose: string
  whatComesBefore: string
  whatComesAfter: string
  commonMistakes?: { title: string; explanation: string }[]
  cardinalityNotes?: string
}

export const relationLabelsEs: Record<string, string> = {
  'commonly-precedes': 'comúnmente precede',
  'commonly-follows': 'comúnmente sigue',
  'status-of': 'estado de',
  returns: 'devuelve',
  cancels: 'cancela',
  references: 'referencia',
  related: 'relacionado',
}

export const messagesEs: Record<string, MessageTranslation> = {
  'pacs.008': {
    shortDescription: 'Un mensaje de institución financiera a institución financiera que lleva una transferencia de crédito de cliente.',
    purpose: 'Transporta la información necesaria para procesar una transferencia de crédito de cliente entre instituciones financieras — quién paga, a quién se le paga, cuánto, y los identificadores necesarios para rastrear la transacción de extremo a extremo.',
    whatComesBefore: 'Depende del contexto. En muchos flujos un pain.001 (Customer Credit Transfer Initiation) lo precede, pero pacs.008 también puede ser generado directamente por una institución originadora sin un mensaje de iniciación de cliente separado.',
    whatComesAfter: 'Un reporte de estado (comúnmente tipo pacs.002), procesamiento/liquidación adicional, o — si algo falla después — una devolución (comúnmente tipo pacs.004) o un flujo de excepción.',
    commonMistakes: [
      { title: 'Asumir que la validez del esquema implica aceptación', explanation: 'Un pacs.008 sintáctica y esquemáticamente válido aún puede ser rechazado por razones de negocio o del esquema.' },
    ],
    cardinalityNotes: 'Las cardinalidades mostradas son ilustrativas para esta construcción educativa. La estructura de campos es representativa del mensaje; confirma las cardinalidades exactas contra el XSD oficial antes de usarlas técnicamente. Un esquema de pago o implementación puede exigir una versión ISO distinta (más antigua) a la versión actual del catálogo mostrada aquí.',
  },
  'pacs.002': {
    shortDescription: 'Reporta el estado de una instrucción de pago previamente enviada entre instituciones financieras.',
    purpose: 'Comunica el estado (por ejemplo, aceptado, rechazado, pendiente) de una o más instrucciones de pago previamente recibidas, referenciando el mensaje original y/o identificadores de transacción, más información de motivo cuando sea relevante.',
    whatComesBefore: 'Típicamente sigue a un pacs.008 (u otro mensaje de instrucción) sobre el cual este reporte está proporcionando el estado.',
    whatComesAfter: 'La institución receptora actúa según el estado reportado: continúa el procesamiento, investiga un rechazo, o no toma más acción si fue aceptado.',
    cardinalityNotes: 'Estructura ilustrativa con fines educativos.',
  },
  'pacs.004': {
    shortDescription: 'Envía de vuelta un pago que ya progresó hacia el settlement, hacia el lado deudor original, cuando no puede completarse finalmente.',
    purpose: 'Se usa cuando un pago que ya progresó más allá de la aceptación no puede finalmente completarse, así que se devuelve — llevando referencias de vuelta a la transacción original, el monto devuelto y el motivo. Exactamente qué punto del ciclo de vida dispara una devolución (por ejemplo, después del settlement, o después de un intento fallido de acreditar al beneficiario) depende del esquema de pago; ISO 20022 en sí no exige un único disparador universal.',
    whatComesBefore: 'Una transferencia de crédito previamente enviada (comúnmente representada como un mensaje tipo pacs.008) que ya había progresado más allá de la aceptación, pero no pudo completarse finalmente — el punto exacto del disparo depende del esquema, no es una regla ISO fija.',
    whatComesAfter: 'El lado deudor original recibe los fondos/el pago devuelto y lo reconcilia contra la transacción original.',
    cardinalityNotes: 'Estructura ilustrativa con fines educativos; confirma las cardinalidades exactas contra el XSD oficial antes de usarlas técnicamente.',
  },
  'camt.053': {
    shortDescription: 'Un estado de cuenta con las transacciones y saldos de una cuenta durante un período, enviado de una institución financiera al titular de la cuenta.',
    purpose: 'Reporta los movimientos (débitos y créditos) y los saldos resultantes en una cuenta, típicamente cubriendo un período definido (como un día hábil), para que el titular pueda reconciliar sus propios registros contra los de la institución.',
    whatComesBefore: 'Una o más transacciones liquidadas (que pueden incluir transferencias de crédito tipo pacs.008, entre otros tipos de movimientos) ocurridas en la cuenta durante el período reportado.',
    whatComesAfter: 'El titular de la cuenta reconcilia el estado de cuenta contra sus propios registros, posiblemente abriendo una investigación por cualquier discrepancia encontrada.',
    cardinalityNotes: 'Estructura ilustrativa con fines educativos; esta es una entrada de catálogo/referencia básica, no un análisis profundo completo.',
  },
  'camt.029': {
    shortDescription: 'Reporta el resultado de una investigación abierta sobre un pago o caso previo.',
    purpose: 'Comunica la resolución (o el estado actual) de una investigación — por ejemplo, confirmando que un pago fue localizado y procesado, o que los fondos están siendo devueltos — típicamente referenciando el caso y la transacción original.',
    whatComesBefore: 'Un caso de investigación abierto sobre un pago específico, a menudo después de encontrar una discrepancia durante la reconciliación o una consulta del cliente.',
    whatComesAfter: 'La parte que abrió la investigación actúa según la resolución — cerrando el caso, informando al cliente, o desencadenando una acción adicional como una devolución.',
    cardinalityNotes: 'Estructura ilustrativa con fines educativos; esta es una entrada de catálogo/referencia básica, no un análisis profundo completo.',
  },
  'pain.001': {
    shortDescription: 'Un cliente instruye a su institución financiera a iniciar una o más transferencias de crédito.',
    purpose: 'Lleva la instrucción de un cliente a su institución financiera para mover fondos a uno o más acreedores. Este es el paso de iniciación de cara al cliente, distinto de la transferencia interbancaria que le sigue.',
    whatComesBefore: 'Una decisión del cliente de realizar un pago (por ejemplo, a través de un canal bancario, ERP, o archivo de pagos).',
    whatComesAfter: 'La institución financiera típicamente genera un mensaje interbancario (comúnmente tipo pacs.008) para mover el pago — esto depende del esquema/implementación.',
    cardinalityNotes: 'Estructura ilustrativa con fines educativos.',
  },
}
