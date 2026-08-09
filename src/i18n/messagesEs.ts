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
  'camt.003': {
    shortDescription: 'Solicita informacion de cuenta o balance; es una consulta de gestion de efectivo, no una instruccion de pago.',
    purpose: 'Se usa para pedir informacion sobre una o mas cuentas, incluyendo detalles de cuenta y saldos. En un contexto operativo de pagos instantaneos sirve para visibilidad de liquidez/estado de cuenta, no para mover fondos de clientes.',
    whatComesBefore: 'Una necesidad operativa de conocer detalles de cuenta, balance, liquidez o estado de cuenta. Para el caso SPI/SGPI de Republica Dominicana, si camt.003 forma parte del flujo publico del esquema queda como TO VERIFY.',
    whatComesAfter: 'Una respuesta ReturnAccount, comunmente camt.004, puede devolver los detalles o saldos solicitados. Este camt.004 no es pacs.004 PaymentReturn.',
    commonMistakes: [
      { title: 'Confundir consulta de cuenta con movimiento de pago', explanation: 'camt.003 pide informacion de cuenta. No instruye a BANK_B a acreditar a CUSTOMER_B; ese concepto interbancario corresponde a pacs.008-style.' },
      { title: 'Confundir camt.004 con pacs.004', explanation: 'camt.004 es ReturnAccount, respuesta de una consulta de cuenta. pacs.004 es PaymentReturn, usado para devolver un pago que ya progreso.' },
    ],
    cardinalityNotes: 'Esqueleto educativo ilustrativo basado en referencias publicas ISO/ECB. Confirma la version exacta de camt.003 y el XSD completo contra el catalogo oficial ISO o la guia tecnica del esquema antes de usarlo tecnicamente. Ninguna fuente publica BCRD revisada aqui confirma uso de camt.003 dentro de SPI/SGPI.',
  },
  'camt.004': {
    shortDescription: 'Devuelve informacion de cuenta o balance, comunmente como respuesta a camt.003 GetAccount.',
    purpose: 'Proporciona informacion sobre una o mas cuentas mantenidas por un administrador de transacciones o servicer de cuenta, incluyendo detalles y saldos. Puede responder a camt.003 o enviarse como notificacion de cuenta en algunos esquemas.',
    whatComesBefore: 'Una solicitud GetAccount, comunmente camt.003, o un disparador de notificacion de cuenta definido por el esquema.',
    whatComesAfter: 'El receptor usa la informacion de cuenta o balance para monitoreo, investigacion, gestion de liquidez o reconciliacion.',
    commonMistakes: [
      { title: 'Mismo numero, familia distinta', explanation: 'camt.004 ReturnAccount y pacs.004 PaymentReturn son mensajes de negocio distintos. Siempre lee el prefijo de familia antes de interpretar el numero.' },
    ],
    cardinalityNotes: 'Esqueleto educativo ilustrativo basado en referencias publicas ISO/ECB. Confirma version exacta y estructura contra el catalogo oficial ISO o la guia tecnica del esquema.',
  },
  'pain.001': {
    shortDescription: 'Un cliente instruye a su institución financiera a iniciar una o más transferencias de crédito.',
    purpose: 'Lleva la instrucción de un cliente a su institución financiera para mover fondos a uno o más acreedores. Este es el paso de iniciación de cara al cliente, distinto de la transferencia interbancaria que le sigue.',
    whatComesBefore: 'Una decisión del cliente de realizar un pago (por ejemplo, a través de un canal bancario, ERP, o archivo de pagos).',
    whatComesAfter: 'La institución financiera típicamente genera un mensaje interbancario (comúnmente tipo pacs.008) para mover el pago — esto depende del esquema/implementación.',
    cardinalityNotes: 'Estructura ilustrativa con fines educativos.',
  },
  'pacs.003': {
    shortDescription: 'Un mensaje de institución financiera a institución financiera usado para mover fondos mediante débito directo en lugar de transferencia de crédito.',
    purpose: 'Lleva la información necesaria para que una institución financiera recolecte (jale) fondos de la cuenta de un deudor en nombre de un acreedor, con base en un mandato preexistente — la contraparte de débito directo del flujo de crédito-empuje que lleva pacs.008.',
    whatComesBefore: 'Un mandato de débito directo previamente acordado entre deudor y acreedor, y típicamente una iniciación de débito directo de cara al cliente por parte del acreedor.',
    whatComesAfter: 'Un reporte de estado (comúnmente pacs.002), o — si el débito no puede honrarse — un flujo de devolución o rechazo.',
    cardinalityNotes: 'Entrada solo de catálogo: el nombre y la versión se verificaron contra listados públicos del catálogo ISO 20022, pero el árbol de campos es un esqueleto ilustrativo mínimo, no una estructura verificada. No confiar en esto para implementación.',
  },
  'pain.002': {
    shortDescription: 'Una institución financiera reporta de vuelta al cliente el estado de una iniciación de pago previamente enviada.',
    purpose: 'Le indica al cliente qué sucedió con un pain.001 que envió — aceptado, rechazado o pendiente — incluyendo información de motivo cuando sea relevante. Esta es la contraparte de cara al cliente de pacs.002, que reporta estado entre instituciones financieras.',
    whatComesBefore: 'Un pain.001 (Iniciación de Transferencia de Crédito de Cliente) previamente enviado por el cliente a su institución financiera.',
    whatComesAfter: 'El cliente actúa según el estado reportado — sin acción si fue aceptado, o corrigiendo y reenviando si fue rechazado.',
    cardinalityNotes: 'Entrada solo de catálogo: el nombre y la versión se verificaron contra listados públicos del catálogo ISO 20022, pero el árbol de campos es un esqueleto ilustrativo mínimo, no una estructura verificada. No confiar en esto para implementación.',
  },
  'pacs.028': {
    shortDescription: 'Una institución financiera pregunta a otra institución financiera por el estado actual de un pago previamente enviado.',
    purpose: 'Se usa cuando el remitente de una instrucción de pago (comúnmente pacs.008) no ha recibido un reporte de estado dentro del tiempo esperado, y solicita explícitamente el estado actual en lugar de esperar — común en esquemas de pagos rápidos donde los tiempos de espera deben resolverse rápidamente.',
    whatComesBefore: 'Una instrucción de pago previamente enviada (comúnmente pacs.008) para la cual no se ha recibido estado dentro de la ventana esperada.',
    whatComesAfter: 'Un reporte de estado (comúnmente pacs.002) que responde la solicitud.',
    cardinalityNotes: 'Entrada solo de catálogo: el nombre y la versión se verificaron contra listados públicos del catálogo ISO 20022, pero el árbol de campos es un esqueleto ilustrativo mínimo, no una estructura verificada. No confiar en esto para implementación.',
  },
  'camt.054': {
    shortDescription: 'Notifica a un titular de cuenta sobre movimientos individuales de débito y/o crédito conforme ocurren, en lugar de un estado de cuenta periódico completo.',
    purpose: 'Reporta movimientos individuales registrados (débitos y/o créditos) en una cuenta casi en tiempo real, para que el titular pueda reconciliar transacción por transacción en lugar de esperar un estado de cuenta periódico como camt.053.',
    whatComesBefore: 'Una transacción (que puede incluir transferencias de crédito tipo pacs.008) liquidada en la cuenta reportada.',
    whatComesAfter: 'El titular de la cuenta reconcilia el movimiento individual contra sus propios registros, posiblemente agregado más tarde en un estado de cuenta periódico.',
    cardinalityNotes: 'Entrada solo de catálogo: el número de versión exacto del catálogo actual no pudo confirmarse independientemente al momento de escribir esto, por lo que debe tratarse como aproximado/ilustrativo — verifícalo contra el catálogo oficial ISO 20022 antes de confiar en él. El árbol de campos es un esqueleto ilustrativo mínimo.',
  },
  'camt.056': {
    shortDescription: 'Una institución financiera solicita a otra institución financiera la cancelación de una instrucción de pago previamente enviada.',
    purpose: 'Solicita la cancelación de una instrucción de pago previamente enviada (comúnmente pacs.008), típicamente porque se envió por error, es un fraude sospechado o es un duplicado — la contraparte interbancaria de una solicitud de recall iniciada por el cliente.',
    whatComesBefore: 'Una instrucción de pago previamente enviada (comúnmente pacs.008) que la institución remitente ahora quiere cancelar.',
    whatComesAfter: 'Un mensaje de resolución (comúnmente camt.029) que reporta si la cancelación fue aceptada, rechazada, o si los fondos fueron recuperados.',
    cardinalityNotes: 'Entrada solo de catálogo: el número de versión exacto del catálogo actual no pudo confirmarse independientemente al momento de escribir esto, por lo que debe tratarse como aproximado/ilustrativo — verifícalo contra el catálogo oficial ISO 20022 antes de confiar en él. El árbol de campos es un esqueleto ilustrativo mínimo.',
  },
}
