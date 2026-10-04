import { getMessages } from '@/lib/i18nContent'
import { conceptEntries, p2p, seq } from './concepts'
import { messageTeaching } from './messageReference'

export type EntryCategory = 'concepts' | 'messages' | 'architecture' | 'schemes'
export interface ReferenceSource { title: string; url: string }
export interface SequenceStep { from: number; to: number; label: string; detail: string; entry?: string }
export type VisualRole = 'party' | 'agent' | 'infrastructure' | 'channel' | 'service' | 'report'
export interface ReferenceEntry {
  id: string
  title: string
  subtitle: string
  category: EntryCategory
  summary: string
  /** "En palabras simples": the same idea in everyday vocabulary. */
  plain?: string
  aliases: string[]
  facts: { label: string; value: string }[]
  analogy?: { text: string; limit: string }
  example?: { title: string; text: string; outcome: string }
  caution?: string
  related: string[]
  sources: ReferenceSource[]
  reviewed?: string
  diagram?: { title: string; actors: string[]; actorRoles?: VisualRole[]; steps: SequenceStep[] }
  architecture?: { title: string; nodes: { label: string; role: string; kind?: VisualRole }[] }
  messageId?: string
  xml?: boolean
  /** Block of the annotated XML sample to open first in the entry's XML tab. */
  xmlFocus?: string
  publicScheme?: boolean
}

export const categoryLabels: Record<EntryCategory, string> = { concepts: 'Conceptos', messages: 'Mensajes ISO', architecture: 'Arquitecturas e integración', schemes: 'Sistemas públicos' }
export const isoSource = { title: 'ISO 20022 · catálogo oficial', url: 'https://www.iso20022.org/iso-20022-message-definitions' }
export const archiveSource = { title: 'ISO 20022 · archivo de versiones', url: 'https://www.iso20022.org/catalogue-messages/iso-20022-messages-archive' }
const fastSource = { title: 'BIS / CPMI · Fast payments', url: 'https://www.bis.org/cpmi/publ/d154.htm' }
const xmlSource = { title: 'MDN · Introducción a XML', url: 'https://developer.mozilla.org/en-US/docs/Web/XML/Guides/XML_introduction' }
const httpSource = { title: 'MDN · Visión general de HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' }

const curated: ReferenceEntry[] = [
  {
    id: 'settlement-system', title: 'Sistema de liquidación', subtitle: 'Cumplir obligaciones entre participantes', category: 'concepts',
    summary: 'Organización de reglas, procedimientos e infraestructura con la que se liquidan obligaciones financieras.',
    plain: 'Es el mecanismo que hace que las deudas entre bancos se paguen de verdad: mueve el dinero entre sus cuentas según unas reglas acordadas.', aliases: ['settlement system'],
    facts: [{ label: 'Función', value: 'Efectuar la liquidación de las obligaciones conforme a sus reglas; no es solamente intercambiar mensajes.' }, { label: 'Cuentas', value: 'El modelo determina las cuentas y el activo utilizados para liquidar.' }],
    analogy: { text: 'Después de acordar las cuentas pendientes, hace falta un mecanismo para pagarlas.', limit: 'La comparación no determina la finalidad, el activo de liquidación ni las reglas de un sistema real.' },
    example: { title: 'De obligación a liquidación', text: 'BANK_A tiene una obligación de 250 XXX con BANK_B. El sistema la liquida conforme a su modelo.', outcome: 'El abono a CUSTOMER_B es otro evento: no debe darse por hecho solo por liquidar entre instituciones.' },
    related: ['settlement', 'clearing-system', 'rtgs'], sources: [fastSource],
    diagram: seq('De la obligación al pago', { actors: ['BANK_A', 'SISTEMA DE LIQUIDACIÓN', 'BANK_B'], roles: ['agent', 'infrastructure', 'agent'] }, [[0, 1, 'Obligación a liquidar', 'BANK_A debe 250 XXX a BANK_B por pagos ya aceptados.'], [1, 0, 'Débito', 'El sistema descuenta de la cuenta de liquidación de BANK_A.', 'settlement-account'], [1, 2, 'Crédito', 'Y acredita la de BANK_B. La obligación queda cumplida.', 'finality']]),
  },
  {
    id: 'fast-payments', title: 'Fast Payments', subtitle: 'Pagos inmediatos', category: 'concepts',
    summary: 'Pagos minoristas en los que el beneficiario dispone de los fondos en tiempo real o casi real, con disponibilidad del servicio lo más cercana posible a 24/7.',
    plain: 'Son pagos en los que el dinero llega al beneficiario en segundos, a cualquier hora y cualquier día. Lo rápido es lo que ve el cliente; por detrás, los bancos siguen teniendo que liquidar entre ellos.',
    aliases: ['instant payments', 'pagos instantáneos', 'fast payment', 'tiempo real'],
    facts: [{ label: 'La experiencia', value: 'El receptor puede utilizar los fondos en segundos, según las reglas del sistema.' }, { label: 'El mecanismo', value: 'La velocidad del abono al cliente y el modelo de liquidación interbancaria son preguntas diferentes.' }, { label: 'Las reglas', value: 'Disponibilidad, límites, tiempos y excepciones dependen del esquema.' }],
    analogy: { text: 'Es como una entrega disponible a cualquier hora: importa cuándo puede usarla el destinatario, además de cuándo sale el pedido.', limit: 'La analogía no describe cómo se liquidan las obligaciones entre instituciones.' },
    example: { title: 'Un pago entre dos participantes', text: 'CUSTOMER_A ordena pagar a CUSTOMER_B. BANK_A procesa la orden; PAYMENT_SYSTEM la intercambia con BANK_B.', outcome: 'El abono disponible para CUSTOMER_B es un evento que hay que distinguir de la recepción del mensaje.' },
    caution: 'Una respuesta técnica o un mensaje recibido no demuestran, por sí solos, que el beneficiario ya pueda usar el dinero.',
    related: ['settlement', 'clearing', 'pacs.008', 'bimpay'], sources: [fastSource], reviewed: '2026-10-02',
    diagram: { title: 'Intercambio conceptual de un pago', actors: ['CUSTOMER_A', 'BANK_A', 'PAYMENT_SYSTEM', 'BANK_B'], actorRoles: ['party', 'agent', 'infrastructure', 'agent'], steps: [
      { from: 0, to: 1, label: 'Orden de pago', detail: 'El canal del cliente recoge la intención de pagar. No se presupone un formato ISO.' },
      { from: 1, to: 2, label: 'Instrucción', detail: 'La institución envía la instrucción conforme a las reglas del esquema.' },
      { from: 2, to: 3, label: 'Procesamiento', detail: 'El participante receptor interviene según el flujo del sistema.' },
      { from: 3, to: 2, label: 'Resultado', detail: 'La información de estado debe leerse en su contexto. El momento de liquidación y abono depende del esquema.' },
      { from: 2, to: 1, label: 'Estado al origen', detail: 'El origen recibe evidencia del resultado. Un timeout dejaría un estado incierto, no un rechazo demostrado.', entry: 'timeouts' },
    ] },
  },
  {
    id: 'settlement', title: 'Settlement', subtitle: 'Liquidación', category: 'concepts',
    summary: 'Cumplimiento de una obligación financiera mediante la transferencia de fondos entre las partes correspondientes.',
    plain: 'Liquidar es pagar de verdad la deuda entre bancos. Hasta ese momento hay una instrucción y una obligación; después, el dinero ya cambió de cuenta.', aliases: ['liquidación', 'liquidacion interbancaria', 'settle'],
    facts: [{ label: 'Qué responde', value: '¿Se ha cumplido la obligación entre participantes?' }, { label: 'Qué no prueba', value: 'No demuestra automáticamente que el banco receptor haya abonado la cuenta de su cliente.' }, { label: 'Modelos', value: 'Puede liquidarse cada obligación en bruto o una posición neta. El esquema fija el mecanismo y la finalidad.' }],
    analogy: { text: 'Dos comercios anotan sus deudas durante el día. Calcular cuánto se deben prepara el cierre; pagar la deuda lo completa.', limit: 'Los sistemas de pagos añaden reglas legales, cuentas y mecanismos que esta comparación no representa.' },
    example: { title: 'Dos obligaciones opuestas', text: 'BANK_A debe 250 XXX a BANK_B y BANK_B debe 80 XXX a BANK_A.', outcome: 'En un modelo neto simplificado se calcula una posición de 170 XXX de A hacia B. Calcularla todavía no equivale a liquidarla.' },
    caution: 'Un SttlmMtd o IntrBkSttlmDt en XML describe una instrucción; no es evidencia de que la liquidación ocurrió.',
    related: ['clearing', 'gross-settlement', 'net-settlement', 'pacs.008'], sources: [fastSource],
    diagram: seq('Instrucción, obligación y liquidación', p2p, [[0, 1, 'Orden', 'CUSTOMER_A pide pagar 250 XXX.'], [1, 2, 'Instrucción', 'BANK_A envía el pago. Nace una obligación de BANK_A con BANK_B.', 'pacs.008'], [2, 3, 'Liquidación', 'El dinero pasa de la cuenta de liquidación de BANK_A a la de BANK_B.', 'settlement-account'], [3, 4, 'Abono', 'Es otro paso: BANK_B acredita a su cliente.']]),
  },
  {
    id: 'clearing', title: 'Clearing', subtitle: 'Compensación', category: 'concepts',
    summary: 'Procesos previos a la liquidación que pueden incluir transmitir, conciliar y confirmar instrucciones, y calcular posiciones de los participantes.',
    plain: 'Compensar es preparar las cuentas antes de pagar: revisar los pagos, confirmar que son válidos y calcular cuánto se deben los bancos.', aliases: ['compensación', 'compensacion', 'netting'],
    facts: [{ label: 'Pregunta central', value: '¿Qué obligaciones quedan preparadas para liquidar?' }, { label: 'Separación', value: 'Compensar y liquidar son funciones distintas aunque un sistema las coordine.' }],
    analogy: { text: 'Revisar las cuentas compartidas y calcular cuánto debe cada persona antes de hacer las transferencias.', limit: 'No toda compensación implica neteo ni esperar al final del día.' },
    example: { title: 'Preparar una posición', text: 'Se identifican instrucciones aceptadas de BANK_A y BANK_B y se calculan sus obligaciones.', outcome: 'Hace falta la evidencia de liquidación posterior para afirmar que la obligación se cumplió.' },
    related: ['settlement', 'fast-payments'], sources: [fastSource],
    diagram: seq('Compensar y luego liquidar', { actors: ['BANK_A', 'COMPENSACIÓN', 'LIQUIDACIÓN', 'BANK_B'], roles: ['agent', 'infrastructure', 'infrastructure', 'agent'] }, [[0, 1, 'Instrucciones', 'Llegan los pagos de BANK_A.'], [1, 3, 'Entrega', 'Se validan y se entregan a BANK_B.'], [1, 2, 'Obligaciones calculadas', 'Se envía a liquidar el resultado (bruto o neto).', 'net-settlement'], [2, 3, 'Liquidación', 'Se mueve el dinero entre bancos.', 'settlement']]),
  },
  {
    id: 'iso20022', title: 'ISO 20022', subtitle: 'Modelo y mensajes financieros', category: 'concepts',
    summary: 'Un estándar para modelar y definir información y mensajes del negocio financiero. El XML es una representación de esos mensajes.',
    plain: 'Es un idioma común para los mensajes financieros: define qué mensajes existen (pacs.008, pacs.002…), qué datos lleva cada uno y cómo se escriben.', aliases: ['ISO 222', 'ISO 200', 'estándar', 'standard'],
    facts: [{ label: 'Definición', value: 'Cada mensaje tiene un propósito y una estructura versionada.' }, { label: 'Uso', value: 'Un esquema de pagos selecciona versiones y puede restringir opciones mediante reglas de uso.' }, { label: 'Lectura', value: 'Primero el propósito de negocio; después los bloques, campos, tipos y valores.' }],
    analogy: { text: 'Un vocabulario compartido permite que dos instituciones describan una transferencia de forma compatible.', limit: 'Compartir vocabulario no establece la red, los plazos ni la aceptación de una operación.' },
    related: ['pacs.008', 'pain.001', 'bah', 'xml-basics'], sources: [isoSource, archiveSource],
    diagram: seq('Un mismo idioma en toda la cadena', p2p, [[0, 1, 'pain · iniciación', 'Cliente → banco (por ejemplo pain.001).', 'pain.001'], [1, 2, 'pacs · interbancario', 'Banco → banco (por ejemplo pacs.008).', 'pacs.008'], [3, 2, 'pacs · estado', 'Respuesta (por ejemplo pacs.002).', 'pacs.002'], [3, 4, 'camt · reportes', 'Banco → cliente (por ejemplo camt.054).', 'camt.054']]),
  },
  {
    id: 'actors', title: 'Partes y agentes', subtitle: 'Quién paga y quién procesa', category: 'concepts',
    summary: 'Las partes participan en la obligación del pago; los agentes son instituciones que prestan servicios o se transmiten instrucciones.',
    plain: 'Las partes son las personas o empresas (quién paga y quién cobra). Los agentes son sus bancos. Una misma institución puede tener varios roles en el mensaje.', aliases: ['debtor', 'creditor', 'Dbtr', 'Cdtr', 'DbtrAgt', 'CdtrAgt', 'InstgAgt', 'InstdAgt', 'banco emisor'],
    facts: [{ label: 'Partes', value: 'Dbtr: quien debe pagar. Cdtr: a quien se debe pagar.' }, { label: 'Servicio de cuenta', value: 'DbtrAgt y CdtrAgt: instituciones de las cuentas de esas partes.' }, { label: 'Tramo', value: 'InstgAgt e InstdAgt: quién instruye y quién recibe la instrucción en ese tramo.' }],
    example: { title: 'Roles que pueden coincidir', text: 'BANK_A puede ser a la vez DbtrAgt e InstgAgt. CUSTOMER_A sigue siendo el Dbtr.', outcome: 'Una misma institución puede ocupar varios roles; los campos mantienen significados distintos.' },
    caution: 'AppHdr/Fr y AppHdr/To pertenecen a la cabecera del mensaje. No deben confundirse con las partes de la transferencia.',
    related: ['pacs.008', 'bah', 'identifiers'], sources: [isoSource], xml: true, xmlFocus: 'actors',
    diagram: seq('Cada rol en su lugar', p2p, [[0, 1, 'Dbtr → DbtrAgt', 'Quien paga ordena a su banco.', 'debtor'], [1, 2, 'InstgAgt → InstdAgt', 'En este tramo, BANK_A instruye y el sistema recibe.', 'agent'], [2, 3, 'Hacia el CdtrAgt', 'El pago llega al banco de quien cobra.', 'creditor-agent'], [3, 4, 'CdtrAgt → Cdtr', 'El banco abona al acreedor.', 'creditor']]),
  },
  {
    id: 'identifiers', title: 'Identificadores de pago', subtitle: 'Mensaje, instrucción y transacción', category: 'concepts',
    summary: 'Referencias con distintos alcances que permiten correlacionar un mensaje, una instrucción y una transacción a través de sus intercambios.',
    plain: 'Cada referencia responde a una pregunta distinta: ¿qué mensaje es? (MsgId), ¿qué pago es entre bancos? (TxId), ¿qué pago es para el cliente? (EndToEndId), ¿cómo lo sigo en todo el mundo? (UETR).', aliases: ['MsgId', 'BizMsgIdr', 'TxId', 'EndToEndId', 'UETR', 'referencia', 'tracking'],
    facts: [{ label: 'Cabecera', value: 'BizMsgIdr identifica el mensaje de negocio en AppHdr.' }, { label: 'Mensaje de pago', value: 'GrpHdr/MsgId identifica el mensaje pacs.008.' }, { label: 'Transacción', value: 'PmtId reúne referencias como EndToEndId, TxId y UETR, con semánticas distintas.' }],
    analogy: { text: 'Un envío puede contener varios paquetes: la referencia del envío y la de cada paquete identifican objetos distintos.', limit: 'No explica quién asigna cada identificador ni sus reglas de conservación; eso requiere la definición y la guía de uso.' },
    example: { title: 'Mismo valor, distinto campo', text: 'BizMsgIdr y MsgId valen MSG-001 en la muestra. TxId vale TX-001.', outcome: 'La coincidencia de valores no convierte dos campos en el mismo concepto.' },
    related: ['pacs.008', 'reconciliation', 'bah'], sources: [isoSource], xml: true, xmlFocus: 'ids',
    diagram: seq('Quién pone cada referencia', p2p, [[0, 1, 'EndToEndId', 'El cliente pone su referencia (por ejemplo, la factura).', 'endtoendid'], [1, 2, 'MsgId + TxId + UETR', 'BANK_A identifica el mensaje, la transacción y añade el UETR.', 'txid'], [2, 3, 'Todo viaja junto', 'Los bancos se hablan con TxId/UETR; EndToEndId no cambia.', 'uetr'], [3, 4, 'EndToEndId', 'El beneficiario concilia con la referencia del cliente.', 'reconciliation']]),
  },
  {
    id: 'bah', title: 'Business Application Header', subtitle: 'AppHdr · cabecera de negocio', category: 'concepts',
    summary: 'Cabecera ISO independiente del mensaje de pago que aporta identificación, emisor, destinatario y contexto del mensaje de negocio.',
    plain: 'Es la etiqueta del sobre: dice quién envía, a quién, qué tipo de mensaje va dentro y su referencia, sin repetir el contenido del pago.', aliases: ['BAH', 'head.001', 'AppHdr', 'cabecera'],
    facts: [{ label: 'Sobre el mensaje', value: 'Fr, To, BizMsgIdr, MsgDefIdr, BizSvc y CreDt aparecen en la muestra.' }, { label: 'Separación XML', value: 'AppHdr usa head.001.001.02; Document usa pacs.008.001.10.' }],
    analogy: { text: 'La cabecera se parece a la etiqueta de un envío: identifica el envío y a quién va dirigido; el documento contiene la instrucción.', limit: 'El envelope técnico, el BAH y el documento siguen siendo tres capas diferentes.' },
    related: ['xml-basics', 'identifiers', 'pacs.008'], sources: [isoSource, archiveSource], xml: true, xmlFocus: 'header',
    diagram: seq('La cabecera viaja con el mensaje', { actors: ['BANK_A', 'DESTINATARIO (To)'], roles: ['agent', 'infrastructure'] }, [[0, 1, 'AppHdr + Document', 'La cabecera (head.001) y el pago (pacs.008) viajan juntos.', 'pacs.008'], [1, 0, 'Respuesta con su AppHdr', 'La respuesta también lleva su propia cabecera.']]),
  },
  {
    id: 'xml-basics', title: 'Leer un XML de pagos', subtitle: 'Elementos, atributos y namespaces', category: 'concepts',
    summary: 'Leer XML consiste en seguir una jerarquía de elementos, sus atributos y el vocabulario al que pertenecen, sin perder el contexto de cada ruta.',
    plain: 'Un XML es un texto con etiquetas que se abren y se cierran, unas dentro de otras. Leerlo es seguir esa jerarquía: el nombre de una etiqueta solo tiene sentido según dónde está.', aliases: ['XML', 'XPath', 'namespace', 'xmlns', 'atributo', 'XSD', 'Prtry'],
    facts: [{ label: 'Elemento', value: 'IntrBkSttlmAmt contiene un importe; sus etiquetas delimitan el valor.' }, { label: 'Atributo', value: 'Ccy se escribe dentro de la etiqueta de apertura e indica la moneda.' }, { label: 'Namespace', value: 'xmlns determina el vocabulario: el mismo nombre local puede pertenecer a definiciones diferentes.' }, { label: 'Ruta', value: 'LclInstrm/Prtry y Purp/Prtry comparten etiqueta, pero describen conceptos distintos.' }],
    caution: 'XML bien formado, XML válido contra un XSD y mensaje aceptado por un esquema son comprobaciones distintas.',
    related: ['pacs.008', 'bah', 'iso20022'], sources: [xmlSource, isoSource], xml: true,
    diagram: seq('Del sobre al dato', { actors: ['Transporte', 'AppHdr', 'Document', 'Campo'], roles: ['channel', 'service', 'report', 'report'] }, [[0, 1, 'Abrir el sobre', 'DataPDU contiene la cabecera y el documento.'], [1, 2, 'Leer qué mensaje es', 'MsgDefIdr y el namespace dicen pacs.008.001.10.', 'iso20022'], [2, 3, 'Bajar al dato', 'Siguiendo la ruta: CdtTrfTxInf/IntrBkSttlmAmt.']]),
  },
  {
    id: 'host-to-host', title: 'Host-to-host', subtitle: 'Conexión entre sistemas', category: 'architecture',
    summary: 'Integración en la que un sistema empresarial intercambia instrucciones y resultados con otro sistema, por ejemplo el servicio de pagos de una institución.',
    plain: 'Es conectar directamente el sistema de una empresa (por ejemplo su ERP) con el banco, para enviar pagos y recibir resultados sin que nadie los cargue a mano.', aliases: ['H2H', 'host to host', 'ERP', 'SFTP', 'archivos', 'integración'],
    facts: [{ label: 'Canal', value: 'El contrato de integración define archivos, API, seguridad y confirmaciones.' }, { label: 'Contenido', value: 'El formato del archivo o mensaje es una decisión separada del transporte.' }, { label: 'Resultado', value: 'Recibir un archivo no significa que todos sus pagos se hayan aceptado o liquidado.' }],
    analogy: { text: 'Es una ventanilla automatizada entre dos oficinas: una entrega instrucciones y la otra devuelve resultados.', limit: 'No define un protocolo único ni garantiza procesamiento inmediato.' },
    example: { title: 'Lote empresarial', text: 'Un ERP envía un lote sintético a BANK_A. El banco acusa recepción y procesa cada instrucción.', outcome: 'La empresa correlaciona resultados y movimientos contables para conciliar; el acuse técnico no basta.' },
    related: ['pain.001', 'pain.002', 'reconciliation', 'payment-web-app'], sources: [],
    architecture: { title: 'Integración conceptual por responsabilidades', nodes: [{ label: 'ERP', role: 'Prepara instrucciones', kind: 'service' }, { label: 'Canal H2H', role: 'Transporta y autentica', kind: 'channel' }, { label: 'BANK_A', role: 'Valida y procesa', kind: 'agent' }, { label: 'Resultados', role: 'Permiten conciliar', kind: 'report' }] },
    diagram: seq('Un lote empresarial en el tiempo', { actors: ['ERP', 'Canal H2H', 'BANK_A', 'PAYMENT_SYSTEM'], roles: ['service', 'channel', 'agent', 'infrastructure'] }, [[0, 1, 'Archivo de pagos', 'El ERP genera el lote (por ejemplo un pain.001).', 'pain.001'], [1, 2, 'Entrega autenticada', 'El canal transporta y autentica el archivo.'], [2, 0, 'Acuse técnico', 'El banco confirma la recepción: aún no es un resultado de pago.'], [2, 3, 'Pagos interbancarios', 'El banco procesa cada pago.', 'pacs.008'], [2, 0, 'Estados y extracto', 'Resultados (pain.002) y movimientos (camt.053) para conciliar.', 'pain.002']]),
  },
  {
    id: 'payment-web-app', title: 'Aplicación web de pagos', subtitle: 'Del canal del cliente al sistema de pagos', category: 'architecture',
    summary: 'Una interfaz web recoge la intención del usuario. Los servicios de la aplicación y los participantes procesan la operación y comunican su resultado.',
    plain: 'Es la app o página donde el usuario ordena el pago. La app solo recoge la intención y muestra el resultado; el pago real lo procesan el banco y el sistema de pagos.', aliases: ['web application', 'web app', 'backend', 'frontend', 'API', 'arquitectura', 'HTTP'],
    facts: [{ label: 'Interfaz', value: 'Presenta datos, solicita una operación y muestra evidencia del estado.' }, { label: 'Servicio', value: 'Autentica, autoriza y coordina el procesamiento en esta arquitectura ilustrativa.' }, { label: 'Integración', value: 'Conecta con el participante mediante el contrato elegido. Una API HTTP no determina el mensaje interbancario.' }],
    example: { title: 'Una respuesta pendiente', text: 'La aplicación confirma que recibió la solicitud y muestra un estado pendiente mientras procesa la operación.', outcome: 'La interfaz necesita un resultado de negocio posterior; una respuesta HTTP satisfactoria no demuestra liquidación.' },
    caution: 'Modelo genérico de responsabilidades, sin describir la arquitectura interna de ningún banco ni de BiMPay.',
    related: ['host-to-host', 'timeouts', 'fast-payments', 'pacs.008'], sources: [httpSource],
    architecture: { title: 'Arquitectura ilustrativa', nodes: [{ label: 'Web / móvil', role: 'Canal del usuario', kind: 'channel' }, { label: 'Servicio de pagos', role: 'Coordina la orden', kind: 'service' }, { label: 'BANK_A', role: 'Participante originador', kind: 'agent' }, { label: 'PAYMENT_SYSTEM', role: 'Intercambia con BANK_B', kind: 'infrastructure' }] },
    diagram: { title: 'Solicitud y resultado asíncrono · modelo simplificado', actors: ['Cliente web', 'Servicio', 'Participante'], actorRoles: ['channel', 'service', 'agent'], steps: [
      { from: 0, to: 1, label: 'Solicitar pago', detail: 'La solicitud expresa intención, no un resultado financiero.' },
      { from: 1, to: 0, label: 'Recibido / pendiente', detail: 'El servicio devuelve una referencia de seguimiento, no una prueba de liquidación.' },
      { from: 1, to: 2, label: 'Procesar instrucción', detail: 'La integración con el participante utiliza su contrato específico.' },
      { from: 2, to: 1, label: 'Resultado de negocio', detail: 'El estado se interpreta según la operación y las reglas del sistema.' },
      { from: 1, to: 0, label: 'Actualizar estado', detail: 'La aplicación presenta el resultado confirmado. Una consulta o notificación son opciones de diseño.' },
    ] },
  },
  {
    id: 'timeouts', title: 'Timeout y estado incierto', subtitle: 'Ausencia de respuesta', category: 'concepts',
    summary: 'Vencer el tiempo de espera informa de que no se recibió una respuesta a tiempo. No revela por sí solo el resultado financiero del pago.',
    plain: 'Si no llega respuesta a tiempo, no sabes si el pago se hizo o no. Lo correcto es preguntar, no repetir el pago.', aliases: ['timeout', 'sin respuesta', 'pendiente', 'idempotencia', 'retry', 'reintento'],
    facts: [{ label: 'Última evidencia', value: 'Identificar el último evento confirmado y las referencias disponibles.' }, { label: 'Consulta', value: 'Utilizar la consulta de estado o investigación que admita el esquema.' }, { label: 'Reintento', value: 'Aplicar la política de idempotencia y reenvío acordada; no generar un segundo pago a ciegas.' }],
    analogy: { text: 'Una llamada se corta después de hacer un pedido: no sabes si se registró o no.', limit: 'La solución depende de evidencias y reglas del sistema, no de asumir el resultado.' },
    related: ['pacs.002', 'pacs.028', 'identifiers', 'reconciliation'], sources: [isoSource],
    diagram: seq('Qué hacer ante un silencio', p2p, [[1, 2, 'Instrucción', 'BANK_A envía el pago.', 'pacs.008'], [2, 1, '… sin respuesta', 'Vence el tiempo de espera: el estado es incierto.'], [1, 2, 'Consulta de estado', 'Se pregunta por el pago original (por ejemplo pacs.028).', 'pacs.028'], [2, 1, 'Estado', 'Con el estado real se decide: continuar, liberar fondos o investigar.', 'pacs.002']]),
  },
  {
    id: 'bimpay', title: 'BiMPay', subtitle: 'Barbados · sistema público', category: 'schemes', publicScheme: true,
    summary: 'Sistema nacional de pagos inmediatos del Banco Central de Barbados. Su infraestructura conecta participantes; la e-wallet es una forma de acceso a los pagos.',
    plain: 'Es el sistema de pagos inmediatos de Barbados: conecta a las instituciones participantes para que sus clientes se paguen entre sí en tiempo real.', aliases: ['BimPay', 'Barbados', 'wallet', 'billetera'],
    facts: [{ label: 'Infraestructura', value: 'La red de pagos conecta instituciones participantes.' }, { label: 'Acceso', value: 'La e-wallet y los canales de los participantes deben distinguirse del sistema central.' }, { label: 'Alcance de esta ficha', value: 'Relaciones públicas entre roles. No se atribuyen APIs, middleware ni mensajes ISO concretos a sus conexiones.' }],
    example: { title: 'Participantes diferentes', text: 'Un pagador y un beneficiario usan instituciones distintas que participan en BiMPay.', outcome: 'La interoperabilidad permite conectarlos; el canal utilizado por cada usuario es una capa separada.' },
    related: ['fast-payments', 'payment-system', 'payment-web-app'], reviewed: '2026-10-02',
    sources: [{ title: 'Banco Central de Barbados · preguntas sobre BiMPay', url: 'https://www.centralbank.org.bb/faqs/bimpay-faqs' }, { title: 'Banco Central de Barbados · BiMPay', url: 'https://www.centralbank.org.bb/bimpay' }],
    architecture: { title: 'Mapa conceptual de roles públicos', nodes: [{ label: 'Pagador', role: 'Canal habilitado', kind: 'party' }, { label: 'Participante A', role: 'Institución de origen', kind: 'agent' }, { label: 'BiMPay', role: 'Infraestructura compartida', kind: 'infrastructure' }, { label: 'Participante B', role: 'Institución del beneficiario', kind: 'agent' }] },
    diagram: seq('Roles públicos en un pago · sin asignar mensajes', { actors: ['Pagador', 'Participante A', 'BiMPay', 'Participante B', 'Beneficiario'], roles: ['party', 'agent', 'infrastructure', 'agent', 'party'] }, [[0, 1, 'Ordena el pago', 'Desde un canal habilitado (app o e-wallet).'], [1, 2, 'Envía la operación', 'El participante la envía a la infraestructura. No se atribuye aquí un mensaje ISO concreto.'], [2, 3, 'Entrega', 'BiMPay la hace llegar al participante del beneficiario.'], [3, 4, 'Fondos disponibles', 'El beneficiario recibe el pago según las reglas del sistema.']]),
  },
]

const messageEntries: ReferenceEntry[] = getMessages('es').map((message) => {
  const teaching = messageTeaching[message.id]
  return {
    id: message.id, messageId: message.id, category: 'messages', title: message.id, subtitle: message.name,
    summary: teaching?.summary ?? message.shortDescription, plain: teaching?.plain, aliases: [message.name, ...message.tags, ...message.versions.map((v) => v.fullIdentifier)],
    facts: teaching?.facts ?? [{ label: 'Para qué sirve', value: message.purpose }, { label: 'Antes', value: message.whatComesBefore }, { label: 'Después', value: message.whatComesAfter }],
    analogy: teaching?.analogy, example: teaching?.example, diagram: teaching?.diagram,
    caution: teaching?.caution ?? 'El uso, la versión y las restricciones dependen del esquema. Las estructuras educativas no sustituyen al XSD oficial.',
    related: message.relatedMessages.map((item) => item.messageId), sources: [isoSource, archiveSource],
    xml: message.id === 'pacs.008',
  }
})
messageEntries.find((entry) => entry.id === 'pacs.008')!.related.push('actors', 'identifiers', 'bah', 'settlement')

const encyclopediaConcepts: ReferenceEntry[] = conceptEntries.map((entry) => ({ ...entry, category: 'concepts', sources: entry.sources ?? [] }))
export const referenceEntries: ReferenceEntry[] = [...curated, ...messageEntries, ...encyclopediaConcepts]
export const getReferenceEntry = (id: string) => referenceEntries.find((entry) => entry.id === id)
