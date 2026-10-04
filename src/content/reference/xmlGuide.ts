export interface FieldNote {
  /** Expanded name of the tag (what the abbreviation stands for). */
  name: string
  /** One-line meaning, used in the table and search results. */
  meaning: string
  /** "Ojo": the distinction a reader most often gets wrong. */
  note: string
  concept?: string
  /** "Qué es": a fuller explanation in plain words. */
  explain?: string
  /** "Cómo leerlo": the value or the name broken into its parts. */
  parts?: { label: string; text: string }[]
  /** "Dicho de otra forma": what the line says, in one plain sentence. */
  equivalent?: string
}

// Explanations are scoped to the synthetic pacs.008.001.10 study instance,
// not to an XSD catalogue. Codes and formats cite ISO 20022 / ISO 4217 /
// ISO 9362 meanings; usage rules always depend on the scheme.
export const fieldNotes: Record<string, FieldNote> = {
  DataPDU: {
    name: 'Protocol Data Unit · contenedor de transporte',
    meaning: 'Sobre técnico que agrupa la cabecera y el mensaje de negocio en un solo envío.',
    explain: 'PDU significa "Protocol Data Unit": la unidad de datos que viaja por un canal de mensajería. DataPDU es la caja exterior de este ejemplo: dentro lleva la cabecera de negocio (AppHdr) y el pago (Document). Algunas plataformas de mensajería usan envolturas con nombres parecidos; esta es ficticia y existe solo para enseñar que hay una capa de transporte alrededor del mensaje ISO.',
    equivalent: 'Aquí empieza un paquete de transporte. Lo que viene dentro es lo que importa para el negocio.',
    note: 'No es parte de ISO 20022 ni de pacs.008. Si cambias de canal, esta envoltura cambia; el pacs.008 de adentro no.',
    concept: 'xml-basics',
  },
  Body: {
    name: 'Cuerpo del contenedor',
    meaning: 'Reúne AppHdr y Document dentro del envelope del ejemplo.',
    explain: 'Es el compartimento del sobre donde se colocan juntos la cabecera y el mensaje. Su existencia y su nombre los decide el formato de transporte, no ISO 20022.',
    equivalent: 'Dentro de este paquete van dos piezas: la etiqueta de envío (AppHdr) y la carta (Document).',
    note: 'No es un campo ISO obligatorio. Otro canal podría transportar AppHdr y Document de otra manera.',
  },
  AppHdr: {
    name: 'Business Application Header (BAH)',
    meaning: 'Identifica quién envía el mensaje, a quién se dirige y qué tipo de mensaje contiene.',
    explain: 'Es una cabecera ISO 20022 independiente (head.001) que viaja junto al mensaje de pago. Funciona como la etiqueta de un envío: dice de dónde sale, a dónde va, qué contiene y bajo qué servicio se intercambia, sin repetir el detalle del pago.',
    equivalent: 'Este mensaje lo envía AAAADODX a CCCCDODX, es un pacs.008.001.10 y se identifica como MSG-001.',
    note: 'Tiene su propio esquema (head.001.001.02) y su propio namespace. No forma parte del XSD de pacs.008.',
    concept: 'bah',
  },
  Fr: {
    name: 'From · emisor',
    meaning: 'Quién emite este mensaje de negocio.',
    explain: 'Indica el punto de mensajería que creó y envió el mensaje. Es información sobre el envío, no sobre quién paga.',
    equivalent: 'Este mensaje sale de la institución AAAADODX.',
    note: 'No es el cliente que paga (Dbtr). Puede coincidir con un agente del pago, pero son roles distintos.',
    concept: 'actors',
  },
  To: {
    name: 'To · destinatario',
    meaning: 'A quién se dirige este mensaje de negocio.',
    explain: 'Indica el punto de mensajería que debe recibir el mensaje. En muchos flujos puede ser una infraestructura o un participante; el esquema lo define.',
    equivalent: 'Este mensaje va dirigido a CCCCDODX.',
    note: 'Aquí To (CCCCDODX) es distinto de InstdAgt (BBBBDODX): la cabecera dice a quién se entrega el mensaje; InstdAgt dice a quién se instruye el pago.',
    concept: 'actors',
  },
  FIId: {
    name: 'Financial Institution Identification',
    meaning: 'Indica que la parte de la cabecera es una institución financiera.',
    explain: 'Es una elección dentro de Fr o To: el emisor o destinatario puede describirse de varias formas, y FIId dice "es una institución financiera".',
    note: 'Es un bloque contenedor; el código concreto está más abajo, en FinInstnId/BICFI.',
  },
  FinInstnId: {
    name: 'Financial Institution Identification',
    meaning: 'Agrupa los datos que identifican a una institución financiera.',
    explain: 'Este mismo bloque aparece en muchos sitios (cabecera, agentes del pago). Lo que cambia es el rol que lo contiene: InstgAgt, DbtrAgt, CdtrAgt, etc.',
    note: 'Para saber de qué institución se habla, mira el bloque padre en la ruta, no solo este nombre.',
    concept: 'actors',
  },
  BICFI: {
    name: 'BIC de institución financiera',
    meaning: 'Código BIC que identifica a una institución financiera en este rol.',
    explain: 'El BIC (Business Identifier Code, norma ISO 9362) es un código de 8 u 11 caracteres que identifica a una institución. Es como su "nombre corto" internacional.',
    parts: [
      { label: 'AAAA', text: 'Código de la institución (4 letras).' },
      { label: 'DO', text: 'País, con el código ISO 3166 (DO = República Dominicana).' },
      { label: 'DX', text: 'Código de localidad.' },
      { label: '(XXX)', text: 'Sucursal, opcional. Si no aparece, se entiende la oficina principal.' },
    ],
    note: 'Los BIC de esta muestra son ficticios: AAAADODX = BANK_A, BBBBDODX = BANK_B, CCCCDODX = destinatario de cabecera.',
    concept: 'actors',
  },
  BizMsgIdr: {
    name: 'Business Message Identifier',
    meaning: 'Referencia que identifica el mensaje de negocio desde la cabecera.',
    explain: 'El emisor asigna esta referencia para poder identificar el mensaje completo (cabecera + documento) en su intercambio.',
    equivalent: 'Este envío se llama MSG-001.',
    note: 'En la muestra vale lo mismo que GrpHdr/MsgId por decisión didáctica, pero son campos distintos con capas distintas.',
    concept: 'identifiers',
  },
  MsgDefIdr: {
    name: 'Message Definition Identifier',
    meaning: 'Dice qué tipo y versión de mensaje viene en Document.',
    explain: 'Antes de leer el documento, el receptor sabe por la cabecera qué definición ISO debe aplicar.',
    parts: [
      { label: 'pacs', text: 'Área de negocio: Payments Clearing and Settlement (entre instituciones).' },
      { label: '008', text: 'Número de mensaje: transferencia de crédito de cliente.' },
      { label: '001', text: 'Variante. 001 es la variante general de ISO.' },
      { label: '10', text: 'Versión del mensaje. Cada versión puede cambiar campos y reglas.' },
    ],
    equivalent: 'Lo que viene dentro es una transferencia de crédito pacs.008, versión 10.',
    note: 'Debe coincidir con el namespace de Document. Un esquema de pagos puede exigir una versión distinta a la más reciente.',
    concept: 'iso20022',
  },
  BizSvc: {
    name: 'Business Service',
    meaning: 'Servicio o acuerdo de negocio bajo el que se intercambia el mensaje.',
    explain: 'Indica las reglas de qué servicio aplican a este mensaje (por ejemplo, un servicio de pagos inmediatos concreto). El valor lo define la comunidad que usa el servicio.',
    equivalent: 'Este mensaje se rige por las reglas del servicio "example.ips.01".',
    note: 'example.ips.01 es ficticio. ISO define el campo, pero no el significado de cada valor.',
  },
  CreDt: {
    name: 'Creation Date',
    meaning: 'Fecha y hora en que se creó el mensaje de negocio.',
    parts: [
      { label: '2026-10-02', text: 'Fecha en formato año-mes-día.' },
      { label: 'T16:00:01', text: 'Hora (la T separa fecha y hora).' },
      { label: 'Z', text: 'Zona horaria UTC ("Zulu").' },
    ],
    note: 'Es cuándo se creó el mensaje, no cuándo se liquidó el dinero.',
  },
  Document: {
    name: 'Documento ISO 20022',
    meaning: 'Raíz del mensaje de pago pacs.008.',
    explain: 'Todo lo que está dentro de Document es el mensaje ISO 20022 propiamente dicho. Su namespace dice exactamente qué definición y versión se usa para leerlo.',
    equivalent: 'Aquí empieza el pacs.008.001.10: el contenido de negocio del pago.',
    note: 'AppHdr y Document son hermanos: la cabecera no está dentro del documento.',
    concept: 'iso20022',
  },
  FIToFICstmrCdtTrf: {
    name: 'FI To FI Customer Credit Transfer',
    meaning: 'El mensaje de transferencia de crédito de cliente entre instituciones.',
    explain: 'Es el bloque principal del pacs.008: una institución financiera le pasa a otra la orden de mover dinero de un cliente a otro. Contiene una cabecera común (GrpHdr) y una o más transacciones (CdtTrfTxInf).',
    equivalent: 'BANK_A le instruye a BANK_B una transferencia en nombre de un cliente.',
    note: 'El mensaje comunica una instrucción. Que exista no prueba que el dinero ya se haya liquidado ni abonado.',
    concept: 'pacs.008',
  },
  GrpHdr: {
    name: 'Group Header',
    meaning: 'Datos comunes a todas las transacciones del mensaje.',
    explain: 'Funciona como la portada del mensaje: su identificador, cuándo se creó, cuántas transacciones lleva y cómo se liquidan.',
    note: 'Separa la identidad del mensaje (MsgId) de la identidad de cada pago (PmtId).',
  },
  MsgId: {
    name: 'Message Identification',
    meaning: 'Identificador que el emisor asigna a este mensaje pacs.008.',
    explain: 'Sirve para referirse al mensaje completo, por ejemplo cuando llega un estado (pacs.002) sobre "el mensaje MSG-001".',
    equivalent: 'Este pacs.008 se llama MSG-001.',
    note: 'No identifica una transacción. Un mensaje puede llevar varias, cada una con su TxId.',
    concept: 'identifiers',
  },
  CreDtTm: {
    name: 'Creation Date Time',
    meaning: 'Fecha y hora de creación del mensaje pacs.008.',
    note: 'Es distinto de AppHdr/CreDt aunque en la muestra coincidan: uno fecha la cabecera y el otro el documento.',
  },
  NbOfTxs: {
    name: 'Number Of Transactions',
    meaning: 'Cuántas transacciones lleva el mensaje.',
    explain: 'Permite comprobar que el mensaje está completo: debe coincidir con el número de bloques CdtTrfTxInf.',
    equivalent: 'Este mensaje contiene una sola transferencia.',
    note: 'Muchos esquemas de pagos inmediatos exigen 1, pero no es un límite universal de ISO.',
  },
  SttlmInf: {
    name: 'Settlement Information',
    meaning: 'Cómo debe liquidarse la instrucción entre instituciones.',
    note: 'Describe lo previsto; no confirma que la liquidación haya ocurrido.',
    concept: 'settlement',
  },
  SttlmMtd: {
    name: 'Settlement Method',
    meaning: 'Método de liquidación previsto.',
    explain: 'Dice por qué vía se va a liquidar la obligación entre las instituciones.',
    parts: [
      { label: 'CLRG', text: 'A través de un sistema de compensación (el valor de esta muestra).' },
      { label: 'INDA / INGA', text: 'En cuentas del agente instruido o del agente instructor.' },
      { label: 'COVE', text: 'Mediante un pago de cobertura separado.' },
    ],
    equivalent: 'Este pago se liquidará a través de un sistema de compensación.',
    note: 'No nombra qué sistema es ni prueba que la liquidación terminó.',
    concept: 'settlement',
  },
  CdtTrfTxInf: {
    name: 'Credit Transfer Transaction Information',
    meaning: 'Todos los datos de una transferencia: referencias, importe, partes, agentes y concepto.',
    explain: 'Es "el pago" dentro del mensaje. Si GrpHdr es la portada, cada CdtTrfTxInf es una transferencia concreta: quién paga, a quién, cuánto y con qué referencias.',
    note: 'Este es el nivel de transacción. Los datos aquí aplican a esta transferencia, no a todo el mensaje.',
  },
  PmtId: {
    name: 'Payment Identification',
    meaning: 'Las referencias que permiten identificar y seguir esta transferencia.',
    explain: 'Agrupa varios identificadores con dueños y alcances distintos: el que pone el cliente (EndToEndId), el que pone el banco (TxId) y el de seguimiento único (UETR).',
    note: 'No se deben intercambiar por parecerse: cada uno responde a una pregunta diferente.',
    concept: 'identifiers',
  },
  EndToEndId: {
    name: 'End To End Identification',
    meaning: 'Referencia que pone quien inicia el pago y que debe viajar sin cambios hasta el final.',
    explain: 'Es la referencia "del cliente": la asigna la parte que ordena el pago y acompaña a la transferencia en toda la cadena, para que el beneficiario y el pagador puedan reconocerla.',
    equivalent: 'Quien ordenó el pago no dio referencia propia.',
    note: 'NOTPROVIDED es el valor convencional cuando no se dio una referencia: no sirve para rastrear. Si un esquema lo permite depende de sus reglas.',
    concept: 'identifiers',
  },
  TxId: {
    name: 'Transaction Identification',
    meaning: 'Referencia que el primer banco instructor asigna a la transacción en la cadena interbancaria.',
    explain: 'Es la referencia "de los bancos": identifica esta transacción entre instituciones y es la que se suele citar en estados, devoluciones e investigaciones.',
    equivalent: 'Entre bancos, este pago se conoce como TX-001.',
    note: 'No identifica el mensaje (eso es MsgId) ni la orden del cliente (eso es EndToEndId).',
    concept: 'identifiers',
  },
  UETR: {
    name: 'Unique End-to-end Transaction Reference',
    meaning: 'Referencia única universal para seguir la transacción de punta a punta.',
    explain: 'Es un identificador aleatorio que nunca debería repetirse en ningún banco del mundo, para que todos los que tocan el pago puedan seguirlo con el mismo número.',
    parts: [
      { label: 'Formato', text: 'UUID: 36 caracteres en grupos 8-4-4-4-12 separados por guiones.' },
      { label: 'v4', text: 'El primer carácter del tercer grupo (4…) indica un UUID versión 4, generado al azar.' },
    ],
    note: 'Es distinto de EndToEndId. Su obligatoriedad depende de la versión y de las reglas del esquema.',
    concept: 'identifiers',
  },
  PmtTpInf: {
    name: 'Payment Type Information',
    meaning: 'Características que describen qué tipo de pago es y cómo tratarlo.',
    note: 'Un código de este bloque no basta para deducir toda la operativa del sistema.',
  },
  ClrChanl: {
    name: 'Clearing Channel',
    meaning: 'Canal de compensación por el que debe procesarse la instrucción.',
    parts: [
      { label: 'RTNS', text: 'Real Time Net Settlement: sistema neto en tiempo real (el valor de esta muestra).' },
      { label: 'RTGS', text: 'Liquidación bruta en tiempo real.' },
      { label: 'MPNS', text: 'Sistema neto de pagos masivos.' },
      { label: 'BOOK', text: 'Traspaso en libros dentro de la misma institución.' },
    ],
    equivalent: 'Procésese por un canal de liquidación neta en tiempo real.',
    note: 'Es una indicación del mensaje; no prueba que un sistema real use ese modelo.',
    concept: 'clearing',
  },
  LclInstrm: {
    name: 'Local Instrument',
    meaning: 'Identifica un instrumento de pago propio de una comunidad o esquema.',
    explain: 'Permite decir "este pago es del producto X de mi esquema". Puede expresarse con un código de lista externa (Cd) o con un valor propietario (Prtry), como en la muestra.',
    note: 'El significado del valor lo fija el esquema, no ISO.',
  },
  Prtry: {
    name: 'Proprietary',
    meaning: 'Valor definido por una comunidad, esquema o implementación.',
    note: 'La etiqueta es estándar; el significado del valor se busca en las reglas del contexto.',
  },
  IntrBkSttlmAmt: {
    name: 'Interbank Settlement Amount',
    meaning: 'Importe que se liquida entre las instituciones.',
    explain: 'Es el dinero que se moverá entre el banco que instruye y el que recibe la instrucción. Lleva la moneda en un atributo (Ccy) y la cifra como contenido.',
    parts: [
      { label: 'Ccy="XXX"', text: 'Atributo: la moneda del importe.' },
      { label: '250.00', text: 'Contenido: la cifra, con punto decimal.' },
    ],
    equivalent: 'Entre bancos se deben liquidar 250,00 en la moneda indicada.',
    note: 'Es una instrucción, no una confirmación de que el dinero se movió.',
    concept: 'settlement',
  },
  '@Ccy': {
    name: 'Currency · atributo de moneda',
    meaning: 'Moneda del importe al que pertenece este atributo.',
    explain: 'Un atributo es un dato que va dentro de la etiqueta de apertura. Ccy usa códigos de tres letras de la norma ISO 4217 (por ejemplo USD, EUR, DOP).',
    parts: [{ label: 'XXX', text: 'Código ISO 4217 para "sin moneda". Aquí se usa a propósito para que el ejemplo no represente dinero real.' }],
    note: 'Un atributo no es un elemento hijo: no aparece como etiqueta propia, sino dentro de <IntrBkSttlmAmt ...>.',
    concept: 'currency-code',
  },
  IntrBkSttlmDt: {
    name: 'Interbank Settlement Date',
    meaning: 'Fecha en que debe liquidarse el pago entre instituciones.',
    note: 'Usa AAAA-MM-DD, sin hora. Es la fecha prevista, no evidencia de liquidación.',
    concept: 'settlement',
  },
  ChrgBr: {
    name: 'Charge Bearer',
    meaning: 'Quién asume las comisiones de la transacción.',
    parts: [
      { label: 'SLEV', text: 'Según las reglas del nivel de servicio (el valor de esta muestra).' },
      { label: 'DEBT / CRED', text: 'Las asume el deudor o el acreedor.' },
      { label: 'SHAR', text: 'Compartidas: cada lado paga las de su banco.' },
    ],
    note: 'SLEV no significa "sin comisiones": remite a lo que diga el esquema.',
  },
  InstgAgt: {
    name: 'Instructing Agent',
    meaning: 'Banco que da la instrucción en este tramo.',
    explain: 'En una cadena de pago, cada tramo tiene quien instruye y quien recibe la instrucción. InstgAgt es quien la da en este mensaje.',
    equivalent: 'En este tramo, BANK_A (AAAADODX) es quien instruye.',
    note: 'Es un rol del pago, no del envío. No tiene por qué coincidir con AppHdr/Fr.',
    concept: 'actors',
  },
  InstdAgt: {
    name: 'Instructed Agent',
    meaning: 'Banco que recibe la instrucción en este tramo.',
    equivalent: 'En este tramo, BANK_B (BBBBDODX) recibe la instrucción.',
    note: 'No debe sustituirse por AppHdr/To: uno es el destinatario del mensaje, el otro el del pago.',
    concept: 'actors',
  },
  Dbtr: {
    name: 'Debtor · deudor',
    meaning: 'Quien paga: la parte que debe el importe. Aquí CUSTOMER_A.',
    explain: 'Es la persona o empresa cuyo dinero sale. No es su banco: su banco es el DbtrAgt.',
    note: 'Parte ≠ agente: CUSTOMER_A paga; BANK_A le presta el servicio.',
    concept: 'actors',
  },
  Nm: {
    name: 'Name',
    meaning: 'Nombre de la parte del bloque que lo contiene.',
    note: 'La ruta decide de quién es: bajo Dbtr es el pagador, bajo Cdtr el beneficiario.',
  },
  DbtrAcct: {
    name: 'Debtor Account',
    meaning: 'Cuenta del pagador de la que sale el dinero.',
    note: 'No es la cuenta del banco del pagador (DbtrAgtAcct).',
    concept: 'actors',
  },
  Id: {
    name: 'Identification',
    meaning: 'Identificación dentro del objeto indicado por la ruta.',
    note: 'Como bloque agrupa una elección (IBAN u Othr); como hoja contiene el identificador concreto.',
  },
  Othr: {
    name: 'Other',
    meaning: 'Forma de identificar una cuenta que no es IBAN.',
    explain: 'ISO permite identificar una cuenta con IBAN o con otro identificador (Othr/Id). Muchos países sin IBAN usan esta opción.',
    note: 'El valor no revela el tipo de cuenta por su nombre.',
  },
  DbtrAgt: {
    name: 'Debtor Agent',
    meaning: 'Banco del pagador: la institución que lleva su cuenta.',
    equivalent: 'La cuenta de CUSTOMER_A está en BANK_A.',
    note: 'BANK_A es el agente; CUSTOMER_A es la parte.',
    concept: 'actors',
  },
  DbtrAgtAcct: {
    name: 'Debtor Agent Account',
    meaning: 'Cuenta del banco del pagador en su agente de servicio dentro de la cadena.',
    note: 'No debe asumirse que es la cuenta de liquidación del sistema solo por el nombre ficticio del valor.',
    concept: 'actors',
  },
  CdtrAgt: {
    name: 'Creditor Agent',
    meaning: 'Banco del beneficiario: la institución que lleva su cuenta.',
    equivalent: 'La cuenta de CUSTOMER_B está en BANK_B.',
    note: 'BANK_B es el agente; CUSTOMER_B es la parte.',
    concept: 'actors',
  },
  CdtrAgtAcct: {
    name: 'Creditor Agent Account',
    meaning: 'Cuenta del banco del beneficiario en su agente de servicio dentro de la cadena.',
    note: 'No es la cuenta del beneficiario. Su función concreta requiere contexto del esquema.',
    concept: 'actors',
  },
  Cdtr: {
    name: 'Creditor · acreedor',
    meaning: 'Quien cobra: la parte a la que se debe el importe. Aquí CUSTOMER_B.',
    note: 'Identificar al beneficiario no demuestra que su cuenta ya haya sido abonada.',
    concept: 'actors',
  },
  CdtrAcct: {
    name: 'Creditor Account',
    meaning: 'Cuenta del beneficiario a la que debe llegar el dinero.',
    note: 'Es distinta de la cuenta del banco del beneficiario (CdtrAgtAcct).',
  },
  Purp: {
    name: 'Purpose',
    meaning: 'Para qué es el pago: una clasificación de su motivo (nómina, impuestos, etc.).',
    explain: 'Puede expresarse con un código de lista externa ISO (Cd) o con un valor propietario (Prtry).',
    note: 'No es lo mismo que el concepto libre de remesa (RmtInf).',
  },
  RmtInf: {
    name: 'Remittance Information',
    meaning: 'Información para que el beneficiario sepa qué se le está pagando.',
    explain: 'Relaciona el pago con lo que liquida: una factura, un contrato, una cuota. Puede ir en texto libre (Ustrd) o estructurada (Strd).',
    note: 'Ayuda a conciliar, pero no representa un estado del pago.',
    concept: 'reconciliation',
  },
  Ustrd: {
    name: 'Unstructured',
    meaning: 'Texto libre del concepto del pago.',
    note: 'La frase es ficticia. Un texto libre no reemplaza a los identificadores de la transacción.',
  },
}

// xmlns is explained from its actual value, so each namespace in the sample
// gets its own breakdown.
function namespaceNote(value: string): FieldNote {
  const base = {
    name: 'XML namespace · espacio de nombres',
    meaning: 'Declara el vocabulario al que pertenecen esta etiqueta y las que lleva dentro.',
    explain: 'xmlns no es un dato del pago. Es información técnica que le dice al lector del XML con qué diccionario interpretar los nombres de las etiquetas. Se hereda hacia adentro hasta que otra etiqueta declare uno nuevo.',
    concept: 'xml-basics',
  }
  if (value.startsWith('urn:iso:std:iso:20022:tech:xsd:')) {
    const message = value.split(':').pop() ?? ''
    return {
      ...base,
      parts: [
        { label: 'urn', text: 'Uniform Resource Name: un nombre único. No es una dirección web que se pueda abrir.' },
        { label: 'iso:std:iso:20022', text: 'La autoridad del nombre: la norma ISO 20022.' },
        { label: 'tech:xsd', text: 'Es una definición técnica en XML Schema (XSD).' },
        { label: message, text: message.startsWith('head') ? 'La cabecera de negocio (Business Application Header), versión 02.' : `El mensaje ${message.split('.').slice(0, 2).join('.')}, variante ${message.split('.')[2]}, versión ${message.split('.')[3]}.` },
      ],
      equivalent: `Lee todo lo que hay dentro con el diccionario oficial ISO 20022 de ${message}.`,
      note: 'Dos etiquetas pueden llamarse igual en vocabularios distintos: el namespace es lo que las distingue. AppHdr y Document declaran namespaces diferentes.',
    }
  }
  const parts = value.split(':')
  const last = parts[parts.length - 1]
  return {
    ...base,
    parts: [
      { label: 'urn', text: 'Uniform Resource Name: un nombre único, no una dirección web.' },
      ...(parts[1] === 'example' ? [{ label: 'example', text: 'Indica un namespace ilustrativo o ficticio, propio de documentación y ejemplos.' }] : []),
      ...(parts[2] ? [{ label: parts[2], text: 'Nombre del vocabulario o formato de transporte (aquí ficticio).' }] : []),
      ...(parts.includes('xsd') ? [{ label: 'xsd', text: 'Definido mediante un XML Schema.' }] : []),
      ...(last && last !== parts[2] ? [{ label: last, text: 'Nombre y versión del esquema (stp versión 1.0).' }] : []),
    ],
    equivalent: 'Crea un contenedor DataPDU y lee sus etiquetas con el vocabulario de transporte "stp 1.0" de ejemplo.',
    note: 'Un mensaje real usaría el namespace de su plataforma de transporte. Aquí "example" deja claro que no es un formato real.',
  }
}

export function getFieldNote(tag: string, path: string, value = ''): FieldNote {
  if (tag === '@xmlns') return namespaceNote(value)
  if (tag === 'Prtry' && path.includes('/LclInstrm/')) return { name: 'Instrumento local propietario', meaning: 'TEST es el código ficticio del instrumento local.', explain: 'Cuando un esquema no usa la lista de códigos ISO, pone su propio valor en Prtry.', equivalent: 'Este pago pertenece al instrumento "TEST" del esquema.', note: 'ISO define LclInstrm/Prtry, pero no asigna un significado universal a TEST.' }
  if (tag === 'Prtry' && path.includes('/Purp/')) return { name: 'Propósito propietario', meaning: '999 es la clasificación ficticia del propósito del pago.', equivalent: 'El motivo del pago es "999" según la lista propia del esquema.', note: 'El mismo nombre Prtry aparece en otros bloques con otro significado. La ruta completa es imprescindible.' }
  return fieldNotes[tag] ?? { name: tag, meaning: 'Elemento de esta instancia XML.', note: 'No hay una explicación editorial revisada para este campo.' }
}
