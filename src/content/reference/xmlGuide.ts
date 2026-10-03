export interface FieldNote {
  name: string
  meaning: string
  note: string
  concept?: string
}

// Explanations are scoped to the supplied synthetic V10 study instance, not an XSD catalogue.
export const fieldNotes: Record<string, FieldNote> = {
  DataPDU: { name: 'Contenedor de transporte', meaning: 'Agrupa la cabecera y el mensaje de negocio en un solo envío.', note: 'Este envelope es ficticio. No pertenece a pacs.008 ni a head.001.', concept: 'xml-basics' },
  Body: { name: 'Cuerpo del contenedor', meaning: 'Reúne AppHdr y Document dentro del envelope del ejemplo.', note: 'Su forma depende del transporte. No es un campo obligatorio universal de ISO 20022.' },
  AppHdr: { name: 'Business Application Header', meaning: 'Identifica quién envía el mensaje, a quién se dirige y qué definición contiene.', note: 'Tiene su propio esquema: head.001.001.02. No forma parte del XSD pacs.008.', concept: 'bah' },
  Fr: { name: 'From', meaning: 'Emisor lógico del mensaje de negocio.', note: 'Es un rol de mensajería, no el cliente que paga. Puede coincidir con un agente del pago.', concept: 'actors' },
  To: { name: 'To', meaning: 'Destinatario lógico del mensaje de negocio.', note: 'En este ejemplo su BIC difiere de InstdAgt. No permite deducir la ruta real ni identificar una infraestructura.', concept: 'actors' },
  FIId: { name: 'Identificación de institución financiera', meaning: 'Selecciona una institución financiera como parte del BAH.', note: 'Es un bloque contenedor; el identificador concreto está más abajo, dentro de FinInstnId.' },
  FinInstnId: { name: 'Financial Institution Identification', meaning: 'Agrupa los datos que identifican a la institución del rol padre.', note: 'El mismo bloque se reutiliza en varios roles. Su ruta determina a qué institución se refiere.', concept: 'actors' },
  BICFI: { name: 'BIC Financial Institution', meaning: 'Código BIC que identifica una institución financiera en este rol.', note: 'Los BIC de esta muestra son ficticios: AAAADODX = BANK_A; BBBBDODX = BANK_B; CCCCDODX = destinatario de cabecera de ejemplo.', concept: 'actors' },
  BizMsgIdr: { name: 'Business Message Identifier', meaning: 'Referencia del mensaje de negocio en la cabecera AppHdr.', note: 'Coincide con MsgId en la muestra por decisión didáctica; son campos distintos.', concept: 'identifiers' },
  MsgDefIdr: { name: 'Message Definition Identifier', meaning: 'Identifica la definición contenida en Document: pacs.008.001.10.', note: 'pacs = área; 008 = mensaje; 001 = variante; 10 = versión. Debe interpretarse junto al namespace del documento.', concept: 'iso20022' },
  BizSvc: { name: 'Business Service', meaning: 'Contexto o servicio de negocio bajo el que se intercambia el mensaje.', note: 'example.ips.01 es ficticio. La semántica del valor la establece la comunidad o el servicio, no el campo ISO por sí solo.' },
  CreDt: { name: 'Creation Date', meaning: 'Fecha y hora de creación del mensaje de negocio en el BAH.', note: 'Z indica UTC. No demuestra cuándo ocurrió la liquidación.' },
  Document: { name: 'Documento ISO 20022', meaning: 'Raíz del documento que contiene la transferencia pacs.008.', note: 'El namespace fija la versión de esta muestra: pacs.008.001.10.', concept: 'iso20022' },
  FIToFICstmrCdtTrf: { name: 'FI To FI Customer Credit Transfer', meaning: 'Contiene la cabecera común y las instrucciones de transferencia entre instituciones.', note: 'El mensaje comunica instrucciones. Su existencia no prueba que se haya liquidado el dinero.', concept: 'pacs.008' },
  GrpHdr: { name: 'Group Header', meaning: 'Datos compartidos por las transacciones incluidas en el mensaje.', note: 'Separa la identificación del mensaje de la identificación de cada pago.' },
  MsgId: { name: 'Message Identification', meaning: 'Identificador asignado por el emisor a este mensaje de pago.', note: 'No equivale a TxId: un mensaje puede contener varias transacciones según el uso permitido.', concept: 'identifiers' },
  CreDtTm: { name: 'Creation Date Time', meaning: 'Fecha y hora de creación de la instrucción de mensaje pacs.008.', note: 'Es distinto de AppHdr/CreDt aunque aquí los valores coincidan.' },
  NbOfTxs: { name: 'Number Of Transactions', meaning: 'Cantidad de transacciones incluidas en el mensaje.', note: 'El valor 1 corresponde a un bloque CdtTrfTxInf en esta instancia, no a un límite universal.' },
  SttlmInf: { name: 'Settlement Information', meaning: 'Agrupa información sobre cómo debe liquidarse la instrucción.', note: 'Describe el mecanismo previsto; no confirma que la liquidación haya ocurrido.', concept: 'settlement' },
  SttlmMtd: { name: 'Settlement Method', meaning: 'Método de liquidación indicado para el mensaje.', note: 'CLRG indica liquidación mediante un sistema de compensación. No identifica por sí solo el sistema ni prueba finalización.', concept: 'settlement' },
  CdtTrfTxInf: { name: 'Credit Transfer Transaction Information', meaning: 'Datos de una transferencia: referencias, importe, partes, agentes y remesa.', note: 'Este es el nivel de transacción; GrpHdr es el nivel común del mensaje.' },
  PmtId: { name: 'Payment Identification', meaning: 'Reúne las referencias que permiten identificar y seguir esta transferencia.', note: 'Cada referencia tiene un alcance diferente; no se deben intercambiar por similitud.', concept: 'identifiers' },
  EndToEndId: { name: 'End To End Identification', meaning: 'Referencia asignada por la parte iniciadora para identificar la transacción de extremo a extremo.', note: 'NOTPROVIDED no aporta una referencia útil de seguimiento. Su admisibilidad depende de las reglas de uso.', concept: 'identifiers' },
  TxId: { name: 'Transaction Identification', meaning: 'Referencia de la transacción asignada por el primer agente instructor para la cadena interbancaria.', note: 'TX-001 identifica la transacción del ejemplo, no el envelope.', concept: 'identifiers' },
  UETR: { name: 'Unique End-to-end Transaction Reference', meaning: 'Referencia única de seguimiento de la transacción, con formato UUID v4.', note: 'Es un campo distinto de EndToEndId. Su uso se verifica en la versión y reglas aplicables.', concept: 'identifiers' },
  PmtTpInf: { name: 'Payment Type Information', meaning: 'Características que describen el tipo y tratamiento del pago.', note: 'Un código de este bloque no basta para deducir toda la operativa del sistema.' },
  ClrChanl: { name: 'Clearing Channel', meaning: 'Canal de compensación indicado para procesar la instrucción.', note: 'RTNS significa Real Time Net Settlement System. No es RTGS ni prueba que un sistema real use este modelo.', concept: 'clearing' },
  LclInstrm: { name: 'Local Instrument', meaning: 'Identifica un instrumento local de pago.', note: 'La alternativa Prtry del ejemplo contiene un código definido fuera de la semántica base ISO.' },
  Prtry: { name: 'Proprietary', meaning: 'Valor definido por una comunidad, esquema o implementación.', note: 'La etiqueta es estándar; el significado del valor se busca en las reglas del contexto.' },
  IntrBkSttlmAmt: { name: 'Interbank Settlement Amount', meaning: 'Importe que se debe liquidar entre instituciones financieras.', note: '250.00 es el valor; Ccy es el atributo de moneda. No es una confirmación de movimiento de fondos.', concept: 'settlement' },
  '@Ccy': { name: 'Currency', meaning: 'Moneda del importe al que pertenece este atributo.', note: 'XXX se utiliza aquí como moneda de prueba, no como instrucción ejecutable. Un atributo no es un elemento hijo.' },
  IntrBkSttlmDt: { name: 'Interbank Settlement Date', meaning: 'Fecha prevista para la liquidación interbancaria.', note: 'Usa YYYY-MM-DD; no incluye hora y no demuestra liquidación efectiva.', concept: 'settlement' },
  ChrgBr: { name: 'Charge Bearer', meaning: 'Indica cómo se asumen los cargos de la transacción.', note: 'SLEV remite a las reglas del nivel de servicio. No significa automáticamente que no haya comisiones.' },
  InstgAgt: { name: 'Instructing Agent', meaning: 'Institución que instruye al siguiente agente en este tramo.', note: 'Describe un rol en la cadena de la instrucción; no necesariamente coincide con AppHdr/Fr.', concept: 'actors' },
  InstdAgt: { name: 'Instructed Agent', meaning: 'Institución a la que se dirige la instrucción de este tramo.', note: 'No debe sustituirse por AppHdr/To al interpretar el mensaje.', concept: 'actors' },
  Dbtr: { name: 'Debtor', meaning: 'Parte que debe el importe de la transferencia; aquí CUSTOMER_A.', note: 'Es el cliente que paga en este ejemplo, no su banco.', concept: 'actors' },
  Nm: { name: 'Name', meaning: 'Nombre de la parte identificada por el bloque padre.', note: 'La ruta bajo Dbtr o Cdtr distingue al pagador del beneficiario.' },
  DbtrAcct: { name: 'Debtor Account', meaning: 'Cuenta del deudor asociada al pago.', note: 'No es la cuenta del agente deudor (DbtrAgtAcct).', concept: 'actors' },
  Id: { name: 'Identification', meaning: 'Identificación dentro del objeto indicado por la ruta.', note: 'Como bloque agrupa una elección de identificación; como hoja contiene el identificador concreto.' },
  Othr: { name: 'Other', meaning: 'Alternativa de identificación de cuenta distinta de IBAN.', note: 'Othr/Id contiene el identificador. No permite deducir el tipo de cuenta por el nombre del valor.' },
  DbtrAgt: { name: 'Debtor Agent', meaning: 'Institución que presta servicio a la cuenta del deudor.', note: 'BANK_A es el agente; CUSTOMER_A es la parte.', concept: 'actors' },
  DbtrAgtAcct: { name: 'Debtor Agent Account', meaning: 'Cuenta del agente deudor en su agente de servicio dentro de la cadena.', note: 'No debe etiquetarse automáticamente como cuenta de liquidación del sistema por el nombre ficticio de su valor.', concept: 'actors' },
  CdtrAgt: { name: 'Creditor Agent', meaning: 'Institución que presta servicio a la cuenta del acreedor.', note: 'BANK_B es el agente; CUSTOMER_B es la parte.', concept: 'actors' },
  CdtrAgtAcct: { name: 'Creditor Agent Account', meaning: 'Cuenta del agente acreedor en su agente de servicio dentro de la cadena.', note: 'Su función concreta requiere contexto. No es la cuenta del beneficiario.', concept: 'actors' },
  Cdtr: { name: 'Creditor', meaning: 'Parte a la que se debe el importe de la transferencia; aquí CUSTOMER_B.', note: 'Identificar al beneficiario no demuestra que su cuenta ya haya sido abonada.', concept: 'actors' },
  CdtrAcct: { name: 'Creditor Account', meaning: 'Cuenta del beneficiario a la que se dirige el abono.', note: 'Es distinta de la cuenta del agente acreedor.' },
  Purp: { name: 'Purpose', meaning: 'Razón subyacente o clasificación del pago.', note: 'No es lo mismo que una referencia libre de remesa.' },
  RmtInf: { name: 'Remittance Information', meaning: 'Información que permite relacionar el pago con el concepto que se está pagando.', note: 'Puede ayudar a conciliar una factura u obligación; no representa un estado del pago.', concept: 'reconciliation' },
  Ustrd: { name: 'Unstructured', meaning: 'Texto libre de la información de remesa.', note: 'La frase de la muestra es ficticia. Un texto libre no reemplaza a los identificadores de transacción.' },
  '@xmlns': { name: 'XML namespace', meaning: 'Declara el vocabulario al que pertenecen los elementos sin prefijo de este contexto.', note: 'El namespace se hereda hasta que otro lo redefine. AppHdr, Document y DataPDU pertenecen a vocabularios distintos.', concept: 'xml-basics' },
}

export function getFieldNote(tag: string, path: string): FieldNote {
  if (tag === 'Prtry' && path.includes('/LclInstrm/')) return { name: 'Instrumento local propietario', meaning: 'TEST es el código ficticio del instrumento local.', note: 'ISO define LclInstrm/Prtry, pero no asigna un significado universal a TEST.' }
  if (tag === 'Prtry' && path.includes('/Purp/')) return { name: 'Propósito propietario', meaning: '999 es la clasificación ficticia del propósito del pago.', note: 'El mismo nombre Prtry aparece en otros bloques con otro significado. La ruta completa es imprescindible.' }
  return fieldNotes[tag] ?? { name: tag, meaning: 'Elemento de esta instancia XML.', note: 'No hay una explicación editorial revisada para este campo.' }
}
