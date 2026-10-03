import { getGlossary, getMessages } from '@/lib/i18nContent'

export type EntryCategory = 'concepts' | 'messages' | 'architecture' | 'schemes'
export interface ReferenceSource { title: string; url: string }
export interface SequenceStep { from: number; to: number; label: string; detail: string; entry?: string }
export interface ReferenceEntry {
  id: string
  title: string
  subtitle: string
  category: EntryCategory
  summary: string
  aliases: string[]
  facts: { label: string; value: string }[]
  analogy?: { text: string; limit: string }
  example?: { title: string; text: string; outcome: string }
  caution?: string
  related: string[]
  sources: ReferenceSource[]
  reviewed?: string
  diagram?: { title: string; actors: string[]; steps: SequenceStep[] }
  architecture?: { title: string; nodes: { label: string; role: string }[] }
  messageId?: string
  xml?: boolean
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
    summary: 'Organización de reglas, procedimientos e infraestructura con la que se liquidan obligaciones financieras.', aliases: ['settlement system'],
    facts: [{ label: 'Función', value: 'Efectuar la liquidación de las obligaciones conforme a sus reglas; no es solamente intercambiar mensajes.' }, { label: 'Cuentas', value: 'El modelo determina las cuentas y el activo utilizados para liquidar.' }],
    analogy: { text: 'Después de acordar las cuentas pendientes, hace falta un mecanismo para pagarlas.', limit: 'La comparación no determina la finalidad, el activo de liquidación ni las reglas de un sistema real.' },
    example: { title: 'De obligación a liquidación', text: 'BANK_A tiene una obligación de 250 XXX con BANK_B. El sistema la liquida conforme a su modelo.', outcome: 'El abono a CUSTOMER_B es otro evento: no debe darse por hecho solo por liquidar entre instituciones.' },
    related: ['settlement', 'clearing-system', 'rtgs'], sources: [fastSource],
  },
  {
    id: 'fast-payments', title: 'Fast Payments', subtitle: 'Pagos inmediatos', category: 'concepts',
    summary: 'Pagos minoristas en los que el beneficiario dispone de los fondos en tiempo real o casi real, con disponibilidad del servicio lo más cercana posible a 24/7.',
    aliases: ['instant payments', 'pagos instantáneos', 'fast payment', 'tiempo real'],
    facts: [{ label: 'La experiencia', value: 'El receptor puede utilizar los fondos en segundos, según las reglas del sistema.' }, { label: 'El mecanismo', value: 'La velocidad del abono al cliente y el modelo de liquidación interbancaria son preguntas diferentes.' }, { label: 'Las reglas', value: 'Disponibilidad, límites, tiempos y excepciones dependen del esquema.' }],
    analogy: { text: 'Es como una entrega disponible a cualquier hora: importa cuándo puede usarla el destinatario, además de cuándo sale el pedido.', limit: 'La analogía no describe cómo se liquidan las obligaciones entre instituciones.' },
    example: { title: 'Un pago entre dos participantes', text: 'CUSTOMER_A ordena pagar a CUSTOMER_B. BANK_A procesa la orden; PAYMENT_SYSTEM la intercambia con BANK_B.', outcome: 'El abono disponible para CUSTOMER_B es un evento que hay que distinguir de la recepción del mensaje.' },
    caution: 'Una respuesta técnica o un mensaje recibido no demuestran, por sí solos, que el beneficiario ya pueda usar el dinero.',
    related: ['settlement', 'clearing', 'pacs.008', 'bimpay'], sources: [fastSource], reviewed: '2026-10-02',
    diagram: { title: 'Intercambio conceptual de un pago', actors: ['CUSTOMER_A', 'BANK_A', 'PAYMENT_SYSTEM', 'BANK_B'], steps: [
      { from: 0, to: 1, label: 'Orden de pago', detail: 'El canal del cliente recoge la intención de pagar. No se presupone un formato ISO.' },
      { from: 1, to: 2, label: 'Instrucción', detail: 'La institución envía la instrucción conforme a las reglas del esquema.' },
      { from: 2, to: 3, label: 'Procesamiento', detail: 'El participante receptor interviene según el flujo del sistema.' },
      { from: 3, to: 2, label: 'Resultado', detail: 'La información de estado debe leerse en su contexto. El momento de liquidación y abono depende del esquema.' },
      { from: 2, to: 1, label: 'Estado al origen', detail: 'El origen recibe evidencia del resultado. Un timeout dejaría un estado incierto, no un rechazo demostrado.', entry: 'timeouts' },
    ] },
  },
  {
    id: 'settlement', title: 'Settlement', subtitle: 'Liquidación', category: 'concepts',
    summary: 'Cumplimiento de una obligación financiera mediante la transferencia de fondos entre las partes correspondientes.', aliases: ['liquidación', 'liquidacion interbancaria', 'settle'],
    facts: [{ label: 'Qué responde', value: '¿Se ha cumplido la obligación entre participantes?' }, { label: 'Qué no prueba', value: 'No demuestra automáticamente que el banco receptor haya abonado la cuenta de su cliente.' }, { label: 'Modelos', value: 'Puede liquidarse cada obligación en bruto o una posición neta. El esquema fija el mecanismo y la finalidad.' }],
    analogy: { text: 'Dos comercios anotan sus deudas durante el día. Calcular cuánto se deben prepara el cierre; pagar la deuda lo completa.', limit: 'Los sistemas de pagos añaden reglas legales, cuentas y mecanismos que esta comparación no representa.' },
    example: { title: 'Dos obligaciones opuestas', text: 'BANK_A debe 250 XXX a BANK_B y BANK_B debe 80 XXX a BANK_A.', outcome: 'En un modelo neto simplificado se calcula una posición de 170 XXX de A hacia B. Calcularla todavía no equivale a liquidarla.' },
    caution: 'Un SttlmMtd o IntrBkSttlmDt en XML describe una instrucción; no es evidencia de que la liquidación ocurrió.',
    related: ['clearing', 'gross-settlement', 'net-settlement', 'pacs.008'], sources: [fastSource],
  },
  {
    id: 'clearing', title: 'Clearing', subtitle: 'Compensación', category: 'concepts',
    summary: 'Procesos previos a la liquidación que pueden incluir transmitir, conciliar y confirmar instrucciones, y calcular posiciones de los participantes.', aliases: ['compensación', 'compensacion', 'netting'],
    facts: [{ label: 'Pregunta central', value: '¿Qué obligaciones quedan preparadas para liquidar?' }, { label: 'Separación', value: 'Compensar y liquidar son funciones distintas aunque un sistema las coordine.' }],
    analogy: { text: 'Revisar las cuentas compartidas y calcular cuánto debe cada persona antes de hacer las transferencias.', limit: 'No toda compensación implica neteo ni esperar al final del día.' },
    example: { title: 'Preparar una posición', text: 'Se identifican instrucciones aceptadas de BANK_A y BANK_B y se calculan sus obligaciones.', outcome: 'Hace falta la evidencia de liquidación posterior para afirmar que la obligación se cumplió.' },
    related: ['settlement', 'fast-payments'], sources: [fastSource],
  },
  {
    id: 'iso20022', title: 'ISO 20022', subtitle: 'Modelo y mensajes financieros', category: 'concepts',
    summary: 'Un estándar para modelar y definir información y mensajes del negocio financiero. El XML es una representación de esos mensajes.', aliases: ['ISO 222', 'ISO 200', 'estándar', 'standard'],
    facts: [{ label: 'Definición', value: 'Cada mensaje tiene un propósito y una estructura versionada.' }, { label: 'Uso', value: 'Un esquema de pagos selecciona versiones y puede restringir opciones mediante reglas de uso.' }, { label: 'Lectura', value: 'Primero el propósito de negocio; después los bloques, campos, tipos y valores.' }],
    analogy: { text: 'Un vocabulario compartido permite que dos instituciones describan una transferencia de forma compatible.', limit: 'Compartir vocabulario no establece la red, los plazos ni la aceptación de una operación.' },
    related: ['pacs.008', 'pain.001', 'bah', 'xml-basics'], sources: [isoSource, archiveSource],
  },
  {
    id: 'actors', title: 'Partes y agentes', subtitle: 'Quién paga y quién procesa', category: 'concepts',
    summary: 'Las partes participan en la obligación del pago; los agentes son instituciones que prestan servicios o se transmiten instrucciones.', aliases: ['debtor', 'creditor', 'Dbtr', 'Cdtr', 'DbtrAgt', 'CdtrAgt', 'InstgAgt', 'InstdAgt', 'banco emisor'],
    facts: [{ label: 'Partes', value: 'Dbtr: quien debe pagar. Cdtr: a quien se debe pagar.' }, { label: 'Servicio de cuenta', value: 'DbtrAgt y CdtrAgt: instituciones de las cuentas de esas partes.' }, { label: 'Tramo', value: 'InstgAgt e InstdAgt: quién instruye y quién recibe la instrucción en ese tramo.' }],
    example: { title: 'Roles que pueden coincidir', text: 'BANK_A puede ser a la vez DbtrAgt e InstgAgt. CUSTOMER_A sigue siendo el Dbtr.', outcome: 'Una misma institución puede ocupar varios roles; los campos mantienen significados distintos.' },
    caution: 'AppHdr/Fr y AppHdr/To pertenecen a la cabecera del mensaje. No deben confundirse con las partes de la transferencia.',
    related: ['pacs.008', 'bah', 'identifiers'], sources: [isoSource], xml: true,
  },
  {
    id: 'identifiers', title: 'Identificadores de pago', subtitle: 'Mensaje, instrucción y transacción', category: 'concepts',
    summary: 'Referencias con distintos alcances que permiten correlacionar un mensaje, una instrucción y una transacción a través de sus intercambios.', aliases: ['MsgId', 'BizMsgIdr', 'TxId', 'EndToEndId', 'UETR', 'referencia', 'tracking'],
    facts: [{ label: 'Cabecera', value: 'BizMsgIdr identifica el mensaje de negocio en AppHdr.' }, { label: 'Mensaje de pago', value: 'GrpHdr/MsgId identifica el mensaje pacs.008.' }, { label: 'Transacción', value: 'PmtId reúne referencias como EndToEndId, TxId y UETR, con semánticas distintas.' }],
    analogy: { text: 'Un envío puede contener varios paquetes: la referencia del envío y la de cada paquete identifican objetos distintos.', limit: 'No explica quién asigna cada identificador ni sus reglas de conservación; eso requiere la definición y la guía de uso.' },
    example: { title: 'Mismo valor, distinto campo', text: 'BizMsgIdr y MsgId valen MSG-001 en la muestra. TxId vale TX-001.', outcome: 'La coincidencia de valores no convierte dos campos en el mismo concepto.' },
    related: ['pacs.008', 'reconciliation', 'bah'], sources: [isoSource], xml: true,
  },
  {
    id: 'bah', title: 'Business Application Header', subtitle: 'AppHdr · cabecera de negocio', category: 'concepts',
    summary: 'Cabecera ISO independiente del mensaje de pago que aporta identificación, emisor, destinatario y contexto del mensaje de negocio.', aliases: ['BAH', 'head.001', 'AppHdr', 'cabecera'],
    facts: [{ label: 'Sobre el mensaje', value: 'Fr, To, BizMsgIdr, MsgDefIdr, BizSvc y CreDt aparecen en la muestra.' }, { label: 'Separación XML', value: 'AppHdr usa head.001.001.02; Document usa pacs.008.001.10.' }],
    analogy: { text: 'La cabecera se parece a la etiqueta de un envío: identifica el envío y a quién va dirigido; el documento contiene la instrucción.', limit: 'El envelope técnico, el BAH y el documento siguen siendo tres capas diferentes.' },
    related: ['xml-basics', 'identifiers', 'pacs.008'], sources: [isoSource, archiveSource], xml: true,
  },
  {
    id: 'xml-basics', title: 'Leer un XML de pagos', subtitle: 'Elementos, atributos y namespaces', category: 'concepts',
    summary: 'Leer XML consiste en seguir una jerarquía de elementos, sus atributos y el vocabulario al que pertenecen, sin perder el contexto de cada ruta.', aliases: ['XML', 'XPath', 'namespace', 'xmlns', 'atributo', 'XSD', 'Prtry'],
    facts: [{ label: 'Elemento', value: 'IntrBkSttlmAmt contiene un importe; sus etiquetas delimitan el valor.' }, { label: 'Atributo', value: 'Ccy se escribe dentro de la etiqueta de apertura e indica la moneda.' }, { label: 'Namespace', value: 'xmlns determina el vocabulario: el mismo nombre local puede pertenecer a definiciones diferentes.' }, { label: 'Ruta', value: 'LclInstrm/Prtry y Purp/Prtry comparten etiqueta, pero describen conceptos distintos.' }],
    caution: 'XML bien formado, XML válido contra un XSD y mensaje aceptado por un esquema son comprobaciones distintas.',
    related: ['pacs.008', 'bah', 'iso20022'], sources: [xmlSource, isoSource], xml: true,
  },
  {
    id: 'host-to-host', title: 'Host-to-host', subtitle: 'Conexión entre sistemas', category: 'architecture',
    summary: 'Integración en la que un sistema empresarial intercambia instrucciones y resultados con otro sistema, por ejemplo el servicio de pagos de una institución.', aliases: ['H2H', 'host to host', 'ERP', 'SFTP', 'archivos', 'integración'],
    facts: [{ label: 'Canal', value: 'El contrato de integración define archivos, API, seguridad y confirmaciones.' }, { label: 'Contenido', value: 'El formato del archivo o mensaje es una decisión separada del transporte.' }, { label: 'Resultado', value: 'Recibir un archivo no significa que todos sus pagos se hayan aceptado o liquidado.' }],
    analogy: { text: 'Es una ventanilla automatizada entre dos oficinas: una entrega instrucciones y la otra devuelve resultados.', limit: 'No define un protocolo único ni garantiza procesamiento inmediato.' },
    example: { title: 'Lote empresarial', text: 'Un ERP envía un lote sintético a BANK_A. El banco acusa recepción y procesa cada instrucción.', outcome: 'La empresa correlaciona resultados y movimientos contables para conciliar; el acuse técnico no basta.' },
    related: ['pain.001', 'pain.002', 'reconciliation', 'payment-web-app'], sources: [],
    architecture: { title: 'Integración conceptual por responsabilidades', nodes: [{ label: 'ERP', role: 'Prepara instrucciones' }, { label: 'Canal H2H', role: 'Transporta y autentica' }, { label: 'BANK_A', role: 'Valida y procesa' }, { label: 'Resultados', role: 'Permiten conciliar' }] },
  },
  {
    id: 'payment-web-app', title: 'Aplicación web de pagos', subtitle: 'Del canal del cliente al sistema de pagos', category: 'architecture',
    summary: 'Una interfaz web recoge la intención del usuario. Los servicios de la aplicación y los participantes procesan la operación y comunican su resultado.', aliases: ['web application', 'web app', 'backend', 'frontend', 'API', 'arquitectura', 'HTTP'],
    facts: [{ label: 'Interfaz', value: 'Presenta datos, solicita una operación y muestra evidencia del estado.' }, { label: 'Servicio', value: 'Autentica, autoriza y coordina el procesamiento en esta arquitectura ilustrativa.' }, { label: 'Integración', value: 'Conecta con el participante mediante el contrato elegido. Una API HTTP no determina el mensaje interbancario.' }],
    example: { title: 'Una respuesta pendiente', text: 'La aplicación confirma que recibió la solicitud y muestra un estado pendiente mientras procesa la operación.', outcome: 'La interfaz necesita un resultado de negocio posterior; una respuesta HTTP satisfactoria no demuestra liquidación.' },
    caution: 'Modelo genérico de responsabilidades, sin describir la arquitectura interna de ningún banco ni de BiMPay.',
    related: ['host-to-host', 'timeouts', 'fast-payments', 'pacs.008'], sources: [httpSource],
    architecture: { title: 'Arquitectura ilustrativa', nodes: [{ label: 'Web / móvil', role: 'Canal del usuario' }, { label: 'Servicio de pagos', role: 'Coordina la orden' }, { label: 'BANK_A', role: 'Participante originador' }, { label: 'PAYMENT_SYSTEM', role: 'Intercambia con BANK_B' }] },
    diagram: { title: 'Solicitud y resultado asíncrono · modelo simplificado', actors: ['Cliente web', 'Servicio', 'Participante'], steps: [
      { from: 0, to: 1, label: 'Solicitar pago', detail: 'La solicitud expresa intención, no un resultado financiero.' },
      { from: 1, to: 0, label: 'Recibido / pendiente', detail: 'El servicio devuelve una referencia de seguimiento, no una prueba de liquidación.' },
      { from: 1, to: 2, label: 'Procesar instrucción', detail: 'La integración con el participante utiliza su contrato específico.' },
      { from: 2, to: 1, label: 'Resultado de negocio', detail: 'El estado se interpreta según la operación y las reglas del sistema.' },
      { from: 1, to: 0, label: 'Actualizar estado', detail: 'La aplicación presenta el resultado confirmado. Una consulta o notificación son opciones de diseño.' },
    ] },
  },
  {
    id: 'timeouts', title: 'Timeout y estado incierto', subtitle: 'Ausencia de respuesta', category: 'concepts',
    summary: 'Vencer el tiempo de espera informa de que no se recibió una respuesta a tiempo. No revela por sí solo el resultado financiero del pago.', aliases: ['timeout', 'sin respuesta', 'pendiente', 'idempotencia', 'retry', 'reintento'],
    facts: [{ label: 'Última evidencia', value: 'Identificar el último evento confirmado y las referencias disponibles.' }, { label: 'Consulta', value: 'Utilizar la consulta de estado o investigación que admita el esquema.' }, { label: 'Reintento', value: 'Aplicar la política de idempotencia y reenvío acordada; no generar un segundo pago a ciegas.' }],
    analogy: { text: 'Una llamada se corta después de hacer un pedido: no sabes si se registró o no.', limit: 'La solución depende de evidencias y reglas del sistema, no de asumir el resultado.' },
    related: ['pacs.002', 'pacs.028', 'identifiers', 'reconciliation'], sources: [isoSource],
  },
  {
    id: 'bimpay', title: 'BiMPay', subtitle: 'Barbados · sistema público', category: 'schemes', publicScheme: true,
    summary: 'Sistema nacional de pagos inmediatos del Banco Central de Barbados. Su infraestructura conecta participantes; la e-wallet es una forma de acceso a los pagos.', aliases: ['BimPay', 'Barbados', 'wallet', 'billetera'],
    facts: [{ label: 'Infraestructura', value: 'La red de pagos conecta instituciones participantes.' }, { label: 'Acceso', value: 'La e-wallet y los canales de los participantes deben distinguirse del sistema central.' }, { label: 'Alcance de esta ficha', value: 'Relaciones públicas entre roles. No se atribuyen APIs, middleware ni mensajes ISO concretos a sus conexiones.' }],
    example: { title: 'Participantes diferentes', text: 'Un pagador y un beneficiario usan instituciones distintas que participan en BiMPay.', outcome: 'La interoperabilidad permite conectarlos; el canal utilizado por cada usuario es una capa separada.' },
    related: ['fast-payments', 'payment-system', 'payment-web-app'], reviewed: '2026-10-02',
    sources: [{ title: 'Banco Central de Barbados · preguntas sobre BiMPay', url: 'https://www.centralbank.org.bb/faqs/bimpay-faqs' }, { title: 'Banco Central de Barbados · BiMPay', url: 'https://www.centralbank.org.bb/bimpay' }],
    architecture: { title: 'Mapa conceptual de roles públicos', nodes: [{ label: 'Pagador', role: 'Canal habilitado' }, { label: 'Participante A', role: 'Institución de origen' }, { label: 'BiMPay', role: 'Infraestructura compartida' }, { label: 'Participante B', role: 'Institución del beneficiario' }] },
  },
]

const messageEntries: ReferenceEntry[] = getMessages('es').map((message) => ({
  id: message.id, messageId: message.id, category: 'messages', title: message.id, subtitle: message.name,
  summary: message.shortDescription, aliases: [message.name, ...message.tags, ...message.versions.map((v) => v.fullIdentifier)],
  facts: [{ label: 'Para qué sirve', value: message.purpose }, { label: 'Antes', value: message.whatComesBefore }, { label: 'Después', value: message.whatComesAfter }],
  caution: message.commonMistakes?.map((item) => item.explanation).join(' ') || 'El uso, la versión y las restricciones dependen del esquema. Las estructuras educativas no sustituyen al XSD oficial.',
  related: message.relatedMessages.map((item) => item.messageId), sources: [isoSource, archiveSource],
  xml: message.id === 'pacs.008',
}))
const pacs = messageEntries.find((entry) => entry.id === 'pacs.008')!
pacs.analogy = { text: 'Una ficha compartida permite que las instituciones describan quién paga, a quién y qué importe se instruye.', limit: 'La ficha comunica la instrucción; no demuestra que los fondos se hayan liquidado ni abonado.' }
pacs.example = { title: 'La transferencia de la guía', text: 'CUSTOMER_A instruye un pago de 250 XXX a CUSTOMER_B. BANK_A y BANK_B aparecen en roles de agente. La muestra separa AppHdr y Document.', outcome: 'El XML permite identificar roles y referencias. No permite afirmar el resultado financiero de la operación.' }
pacs.related.push('actors', 'identifiers', 'bah', 'settlement')
pacs.diagram = { title: 'Intercambio FI-to-FI · modelo simplificado', actors: ['BANK_A', 'BANK_B'], steps: [
  { from: 0, to: 1, label: 'pacs.008 · instrucción', detail: 'Transferencia de crédito de cliente entre instituciones. La ruta real puede incluir intermediarios o una infraestructura.', entry: 'pacs.008' },
  { from: 1, to: 0, label: 'pacs.002 · estado, si aplica', detail: 'Ejemplo conceptual de reporte de estado. Su uso, dirección, códigos y momento los fija el esquema.', entry: 'pacs.002' },
] }

const messageExamples: Record<string, { analogy: string; limit: string; example: string }> = {
  'pain.001': { analogy: 'Una lista de órdenes que una empresa entrega a su banco: quién debe cobrar y cuánto.', limit: 'Entregar la lista no confirma ni la aceptación ni el pago.', example: 'CUSTOMER_A envía a BANK_A una orden de transferencia para CUSTOMER_B por 250 XXX. El procesamiento interbancario es un paso posterior.' },
  'pain.002': { analogy: 'El resultado de revisar las órdenes de una lista, no el dinero de esas órdenes.', limit: 'Un estado puede referirse al grupo o a una operación; su significado depende del código.', example: 'BANK_A informa a CUSTOMER_A del estado de una instrucción enviada en pain.001. La referencia original permite relacionar ambas comunicaciones.' },
  'pacs.002': { analogy: 'Un parte de seguimiento de una instrucción: comunica una situación, no mueve por sí mismo los fondos.', limit: 'Recibido, aceptado y liquidado no son estados intercambiables.', example: 'BANK_B comunica a BANK_A un estado de la instrucción original. Las referencias originales y el código permiten interpretar a qué pago y etapa corresponde.' },
  'pacs.004': { analogy: 'Una devolución que remite a una operación anterior, como devolver un importe ya pagado.', limit: 'No es simplemente rechazar una instrucción ni pedir que se cancele.', example: 'Se instruye devolver 250 XXX correspondientes a una transferencia anterior. El mensaje conserva referencias de la operación original para relacionar ambos movimientos.' },
  'pacs.003': { analogy: 'Una solicitud de cobro apoyada en una autorización, en lugar de una orden de pago iniciada por el deudor.', limit: 'La autorización, los plazos y los derechos de devolución dependen del esquema.', example: 'La institución de CUSTOMER_B transmite un cobro directo a la institución de CUSTOMER_A conforme al mandato y las reglas aplicables.' },
  'pacs.028': { analogy: 'Preguntar por el estado de un envío cuando falta la respuesta.', limit: 'La consulta no demuestra un rechazo y no es una orden de pago nueva.', example: 'BANK_A no tiene un resultado confirmado para TX-001 y solicita su estado, si el esquema admite este mensaje.' },
  'camt.056': { analogy: 'Pedir que se detenga o recupere una operación: es una solicitud, no una garantía.', limit: 'Enviar la petición no confirma su aceptación ni produce automáticamente una devolución.', example: 'BANK_A solicita cancelar una instrucción identificada por sus referencias originales. Debe esperar e investigar el resultado aplicable.' },
  'camt.029': { analogy: 'La resolución de un expediente de investigación.', limit: 'Informar del resultado de la investigación no equivale a transferir fondos.', example: 'Una institución comunica la resolución de una solicitud de cancelación. El resultado debe leerse junto con el caso original.' },
  'camt.053': { analogy: 'El extracto que permite revisar los movimientos de una cuenta durante un período.', limit: 'Un extracto informa; no inicia los pagos que aparecen en él.', example: 'CUSTOMER_A compara su registro de pagos con el extracto sintético recibido de BANK_A e investiga referencias que no coinciden.' },
  'camt.054': { analogy: 'Un aviso de que hay entradas de débito o crédito relacionadas con una cuenta.', limit: 'Un aviso no sustituye necesariamente al extracto ni al estado interbancario.', example: 'BANK_B envía a su cliente una notificación de crédito con referencias para relacionar la entrada con el pago esperado.' },
  'camt.003': { analogy: 'Solicitar información sobre una cuenta, como consultar una ficha.', limit: 'No es una instrucción para mover dinero; los datos disponibles dependen del servicio.', example: 'Un usuario autorizado solicita información de una cuenta mediante GetAccount dentro de un servicio que admite ese intercambio.' },
  'camt.004': { analogy: 'La respuesta con la información de una cuenta que se pidió consultar.', limit: 'ReturnAccount significa devolver información de cuenta, no devolver un pago.', example: 'El servicio responde a una consulta GetAccount con los datos de cuenta disponibles. No hay una devolución de fondos por el nombre ReturnAccount.' },
}
for (const entry of messageEntries) {
  const teaching = messageExamples[entry.id]
  if (!teaching) continue
  entry.analogy = { text: teaching.analogy, limit: teaching.limit }
  entry.example = { title: 'Situación de ejemplo', text: teaching.example, outcome: 'Modelo simplificado; versión, campos y reglas se verifican en la guía de uso aplicable.' }
}

const reserved = new Set([...curated, ...messageEntries].map((entry) => entry.id))
const glossaryEntries: ReferenceEntry[] = getGlossary('es').filter((term) => !reserved.has(term.id) && term.id !== 'fast-payment').map((term) => ({
  id: term.id, title: term.term, subtitle: 'Referencia conceptual', category: 'concepts', summary: term.oneLine,
  aliases: [term.id], facts: [{ label: 'En contexto', value: term.fullExplanation }],
  caution: term.commonConfusion, related: [...term.relatedConcepts ?? [], ...term.relatedMessages ?? []].map((id) => id === 'fast-payment' ? 'fast-payments' : id), sources: [],
  ...(term.example ? { example: { title: 'Ejemplo', text: term.example, outcome: '' } } : {}),
}))
export const referenceEntries: ReferenceEntry[] = [...curated, ...messageEntries, ...glossaryEntries]
const msgid = referenceEntries.find((entry) => entry.id === 'msgid')!
msgid.summary = 'Referencia que identifica el mensaje de pago, no una transacción individual ni el contenedor de transporte.'
msgid.facts = [{ label: 'En contexto', value: 'GrpHdr/MsgId identifica el mensaje pacs.008. AppHdr/BizMsgIdr pertenece a la cabecera de negocio; DataPDU es un contenedor independiente en la muestra.' }]
msgid.caution = 'No confundir el uso informal de "sobre" con el envelope técnico del XML.'
msgid.related = ['identifiers', 'bah', 'pacs.008']
export const getReferenceEntry = (id: string) => referenceEntries.find((entry) => entry.id === id)
