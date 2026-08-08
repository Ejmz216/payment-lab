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
    cardinalityNotes: 'Las cardinalidades mostradas son ilustrativas para esta construcción educativa y deben confirmarse contra la versión específica en la documentación oficial antes de usarlas técnicamente.',
  },
  'pacs.002': {
    shortDescription: 'Reporta el estado de una instrucción de pago previamente enviada entre instituciones financieras.',
    purpose: 'Comunica el estado (por ejemplo, aceptado, rechazado, pendiente) de una o más instrucciones de pago previamente recibidas, referenciando el mensaje original y/o identificadores de transacción, más información de motivo cuando sea relevante.',
    whatComesBefore: 'Típicamente sigue a un pacs.008 (u otro mensaje de instrucción) sobre el cual este reporte está proporcionando el estado.',
    whatComesAfter: 'La institución receptora actúa según el estado reportado: continúa el procesamiento, investiga un rechazo, o no toma más acción si fue aceptado.',
    cardinalityNotes: 'Estructura ilustrativa con fines educativos.',
  },
  'pacs.004': {
    shortDescription: 'Envía de vuelta un pago previamente liquidado/acreditado hacia el lado deudor original.',
    purpose: 'Se usa cuando un pago que ya progresó (fue aceptado/liquidado) no puede finalmente completarse, así que se devuelve — llevando referencias de vuelta a la transacción original, el monto devuelto y el motivo.',
    whatComesBefore: 'Una transferencia de crédito previamente enviada y aceptada/liquidada (comúnmente representada como un mensaje tipo pacs.008) que no pudo finalmente completarse del lado receptor.',
    whatComesAfter: 'El lado deudor original recibe los fondos/el pago devuelto y lo reconcilia contra la transacción original.',
    cardinalityNotes: 'Estructura ilustrativa con fines educativos.',
  },
  'pain.001': {
    shortDescription: 'Un cliente instruye a su institución financiera a iniciar una o más transferencias de crédito.',
    purpose: 'Lleva la instrucción de un cliente a su institución financiera para mover fondos a uno o más acreedores. Este es el paso de iniciación de cara al cliente, distinto de la transferencia interbancaria que le sigue.',
    whatComesBefore: 'Una decisión del cliente de realizar un pago (por ejemplo, a través de un canal bancario, ERP, o archivo de pagos).',
    whatComesAfter: 'La institución financiera típicamente genera un mensaje interbancario (comúnmente tipo pacs.008) para mover el pago — esto depende del esquema/implementación.',
    cardinalityNotes: 'Estructura ilustrativa con fines educativos.',
  },
}
