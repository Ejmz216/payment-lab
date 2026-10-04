import type { ReferenceEntry } from './entries'
import { p2p, seq } from './concepts'

// Encyclopedia texts for each ISO 20022 message. They replace the classic
// Atlas descriptions in the new reference. Diagrams place the message in
// time; the exact usage, direction and timing depend on each scheme.
type MessageTeaching = Pick<ReferenceEntry, 'summary' | 'plain' | 'facts' | 'analogy' | 'example' | 'caution' | 'diagram'>

const banks = { actors: ['BANK_A', 'PAYMENT_SYSTEM', 'BANK_B'], roles: ['agent', 'infrastructure', 'agent'] } as const
const bankCast = { actors: [...banks.actors], roles: [...banks.roles] }

export const messageTeaching: Record<string, MessageTeaching> = {
  'pain.001': {
    summary: 'Customer Credit Transfer Initiation: mensaje con el que un cliente (normalmente una empresa) ordena a su banco una o varias transferencias.',
    plain: 'Es la "orden de pago del cliente al banco". Una empresa puede mandar en un solo pain.001 toda su nómina o sus pagos a proveedores.',
    facts: [{ label: 'De quién a quién', value: 'Del cliente (o su sistema, como un ERP) a su banco.' }, { label: 'Qué lleva', value: 'Datos del ordenante, uno o varios lotes de pagos, beneficiarios, importes y referencias (EndToEndId).' }, { label: 'Antes', value: 'La decisión del cliente de pagar.' }, { label: 'Después', value: 'Un estado al cliente (pain.002) y, por cada pago, una instrucción interbancaria (por ejemplo pacs.008).' }],
    analogy: { text: 'Una lista de órdenes que una empresa entrega a su banco: a quién pagar y cuánto.', limit: 'Entregar la lista no confirma que se haya aceptado ni pagado.' },
    example: { title: 'Pago a proveedor', text: 'CUSTOMER_A envía a BANK_A un pain.001 para pagar 250 XXX a CUSTOMER_B con referencia E2E-001.', outcome: 'BANK_A lo valida, responde con un pain.002 y genera el pago interbancario.' },
    caution: 'pain.001 no viaja entre bancos: es solo el tramo cliente → banco.',
    diagram: seq('Dónde está pain.001', p2p, [[0, 1, 'pain.001 · orden', 'El cliente ordena el pago a su banco.', 'pain.001'], [1, 0, 'pain.002 · estado', 'El banco informa si aceptó la orden.', 'pain.002'], [1, 2, 'pacs.008 · interbancario', 'El banco crea la instrucción hacia el otro banco.', 'pacs.008']]),
  },
  'pain.002': {
    summary: 'Customer Payment Status Report: mensaje con el que el banco informa al cliente el estado de las órdenes que envió.',
    plain: 'Es la respuesta del banco a "¿qué pasó con mi orden?": aceptada, rechazada o pendiente, para todo el archivo o pago por pago.',
    facts: [{ label: 'De quién a quién', value: 'Del banco al cliente que envió el pain.001.' }, { label: 'Niveles', value: 'Puede informar el estado del grupo, de cada lote o de cada transacción.' }, { label: 'Antes', value: 'Un pain.001.' }, { label: 'Después', value: 'El cliente corrige y reenvía lo rechazado, o espera el resultado final.' }],
    analogy: { text: 'El acuse con observaciones que te dan al entregar un formulario.', limit: 'Aceptar la orden no significa que el beneficiario ya cobró.' },
    example: { title: 'Un pago con error', text: 'En un pain.001 de 3 pagos, uno tiene una cuenta mal escrita.', outcome: 'El pain.002 marca ese pago como rechazado y los otros como aceptados.' },
    diagram: seq('Estado al cliente', { actors: ['CUSTOMER_A', 'BANK_A'], roles: ['party', 'agent'] }, [[0, 1, 'pain.001', 'El cliente envía sus órdenes.', 'pain.001'], [1, 0, 'pain.002 · validado', 'El banco informa el resultado de la validación.'], [1, 0, 'pain.002 · resultado', 'Según el servicio, puede informar más tarde el resultado final.']]),
  },
  'pacs.008': {
    summary: 'FI To FI Customer Credit Transfer: el mensaje con el que un banco instruye a otro una transferencia de crédito en nombre de un cliente.',
    plain: 'Es "el pago" entre bancos: BANK_A le dice a BANK_B que transfiera un importe de CUSTOMER_A a CUSTOMER_B, con todas sus referencias.',
    facts: [{ label: 'De quién a quién', value: 'De una institución a otra (directamente o a través del sistema de pagos).' }, { label: 'Qué lleva', value: 'Cabecera del grupo (GrpHdr) y por cada transacción: referencias, importe, partes, agentes, cuentas y concepto.' }, { label: 'Antes', value: 'Una orden del cliente (por ejemplo pain.001, o la app del banco).' }, { label: 'Después', value: 'Un estado (pacs.002), la liquidación y el abono; si algo falla después, una devolución (pacs.004).' }],
    analogy: { text: 'Una ficha compartida que dice quién paga, a quién, cuánto y con qué referencias.', limit: 'La ficha comunica la instrucción; no demuestra que los fondos se liquidaron ni abonaron.' },
    example: { title: 'La transferencia de la guía', text: 'BANK_A instruye a BANK_B pagar 250 XXX de CUSTOMER_A a CUSTOMER_B, TxId TX-001.', outcome: 'El XML anotado muestra cada campo de este mensaje.' },
    diagram: seq('pacs.008 en un pago inmediato', p2p, [[0, 1, 'Orden del cliente', 'Puede ser un pain.001 o la app.', 'pain.001'], [1, 2, 'pacs.008 · instrucción', 'BANK_A envía la transferencia.', 'pacs.008'], [2, 3, 'pacs.008 · entrega', 'El sistema la entrega a BANK_B.'], [3, 2, 'pacs.002 · estado', 'BANK_B acepta o rechaza.', 'pacs.002'], [3, 4, 'Abono', 'Si aceptó, acredita al beneficiario.']]),
  },
  'pacs.002': {
    summary: 'FI To FI Payment Status Report: mensaje que informa el estado de una o varias instrucciones enviadas entre instituciones.',
    plain: 'Es la respuesta del otro banco (o del sistema): "recibido", "aceptado", "rechazado" o "pendiente", con un código que explica el motivo.',
    facts: [{ label: 'De quién a quién', value: 'De quien recibió la instrucción hacia quien la envió (o del sistema a ambos, según el esquema).' }, { label: 'Qué lleva', value: 'Referencias originales (OrgnlMsgId, OrgnlTxId…) y el estado con su motivo.' }, { label: 'Antes', value: 'Un pacs.008 (u otra instrucción).' }, { label: 'Después', value: 'Si es aceptación, sigue la liquidación y el abono; si es rechazo, el origen libera los fondos.' }],
    analogy: { text: 'El parte de seguimiento de un envío: comunica una situación, no mueve el paquete.', limit: 'Recibido, aceptado y liquidado son estados distintos: hay que leer el código exacto.' },
    example: { title: 'Rechazo con motivo', text: 'BANK_B responde a TX-001 con estado RJCT y un código de cuenta inexistente.', outcome: 'BANK_A sabe exactamente qué pago falló y por qué.' },
    diagram: seq('El estado vuelve al origen', bankCast, [[0, 1, 'pacs.008', 'Instrucción original.', 'pacs.008'], [1, 2, 'Entrega', 'Llega a BANK_B.'], [2, 1, 'pacs.002 · ACSC / RJCT', 'BANK_B informa aceptación o rechazo.'], [1, 0, 'pacs.002', 'El estado llega a BANK_A.']]),
  },
  'pacs.004': {
    summary: 'Payment Return: mensaje que devuelve los fondos de un pago ya liquidado que no pudo completarse.',
    plain: 'Es "mandar de vuelta" un pago que ya había llegado: un nuevo movimiento de dinero, en sentido contrario, que cita el pago original.',
    facts: [{ label: 'De quién a quién', value: 'Del banco que recibió el pago hacia el que lo envió.' }, { label: 'Qué lleva', value: 'Referencias del pago original, importe devuelto y motivo.' }, { label: 'Antes', value: 'Un pacs.008 ya liquidado; a veces un recall aceptado (camt.056 + camt.029).' }, { label: 'Después', value: 'El banco de origen abona a su cliente.' }],
    analogy: { text: 'Un reembolso: no deshace la compra, te devuelve el dinero con otra operación.', limit: 'Qué casos permiten devolución y en qué plazo lo define el esquema.' },
    example: { title: 'Cuenta cerrada', text: 'TX-001 se liquidó, pero la cuenta de CUSTOMER_B está cerrada.', outcome: 'BANK_B envía un pacs.004 de 250 XXX que referencia TX-001.' },
    caution: 'No es un rechazo: el rechazo ocurre antes de liquidar y no mueve dinero de vuelta.',
    diagram: seq('Devolver un pago liquidado', p2p, [[1, 2, 'pacs.008', 'El pago original se liquida.', 'pacs.008'], [2, 3, 'Entrega', 'BANK_B ya tiene los fondos.'], [3, 2, 'pacs.004 · devolución', 'No puede abonar: devuelve.', 'pacs.004'], [2, 1, 'pacs.004', 'Los fondos vuelven a BANK_A.'], [1, 0, 'Abono', 'CUSTOMER_A recupera su dinero.']]),
  },
  'pacs.003': {
    summary: 'FI To FI Customer Direct Debit: mensaje con el que el banco del cobrador pide al banco del pagador cobrar un importe, con base en un mandato.',
    plain: 'Es el "débito directo" entre bancos: en vez de que el pagador envíe el dinero, el cobrador lo pide (con autorización previa).',
    facts: [{ label: 'Dirección', value: 'Al revés que pacs.008: la instrucción va del banco del acreedor al banco del deudor.' }, { label: 'Requisito', value: 'Un mandato: la autorización del deudor para que le cobren.' }, { label: 'Después', value: 'Un estado (pacs.002); si el cobro no procede, rechazo o devolución.' }],
    analogy: { text: 'La domiciliación de un recibo: la compañía de luz cobra porque tú la autorizaste.', limit: 'Plazos de devolución y derechos del pagador los fija el esquema.' },
    example: { title: 'Una cuota', text: 'BANK_B, banco de CUSTOMER_B, cobra 50 XXX a CUSTOMER_A según su mandato.', outcome: 'BANK_A debita a CUSTOMER_A si todo es correcto.' },
    diagram: seq('Un débito directo', p2p, [[4, 3, 'Cobro con mandato', 'El acreedor pide cobrar.'], [3, 2, 'pacs.003', 'El banco del acreedor envía el débito.', 'pacs.003'], [2, 1, 'Entrega', 'Llega al banco del deudor.'], [1, 0, 'Débito', 'Si procede, se debita al pagador.'], [1, 2, 'pacs.002 · estado', 'Informa el resultado.', 'pacs.002']]),
  },
  'pacs.028': {
    summary: 'FI To FI Payment Status Request: mensaje para preguntar el estado de una instrucción cuando no llegó respuesta o hay dudas.',
    plain: 'Es preguntar "¿qué pasó con mi pago?" cuando el estado no llega a tiempo, en lugar de reenviar el pago a ciegas.',
    facts: [{ label: 'De quién a quién', value: 'De quien envió la instrucción hacia quien debía responder (o al sistema).' }, { label: 'Respuesta', value: 'Normalmente un pacs.002 con el estado.' }, { label: 'Clave', value: 'Evita duplicar pagos ante un timeout.' }],
    analogy: { text: 'Llamar a la tienda para preguntar si tu pedido se registró antes de volver a pedir.', limit: 'Si el esquema lo usa, y cuándo, lo define su guía.' },
    example: { title: 'Timeout', text: 'BANK_A no recibe estado de TX-001 en el tiempo esperado.', outcome: 'Envía un pacs.028 citando TX-001 y recibe un pacs.002.' },
    diagram: seq('Preguntar por un estado', bankCast, [[0, 1, 'pacs.008', 'Instrucción enviada.', 'pacs.008'], [0, 1, 'pacs.028 · ¿estado?', 'No llegó respuesta a tiempo: se pregunta.', 'pacs.028'], [1, 0, 'pacs.002 · estado', 'Se responde con el estado actual.', 'pacs.002']]),
  },
  'camt.053': {
    summary: 'Bank To Customer Statement: extracto que el banco envía a su cliente con los saldos y movimientos de una cuenta en un periodo.',
    plain: 'Es el extracto bancario en formato ISO: todo lo que entró y salió de la cuenta, con saldos inicial y final.',
    facts: [{ label: 'De quién a quién', value: 'Del banco al titular de la cuenta.' }, { label: 'Periodo', value: 'Normalmente diario.' }, { label: 'Uso', value: 'Conciliar: comparar los movimientos con lo esperado.' }],
    analogy: { text: 'El extracto mensual de tu tarjeta.', limit: 'Informa movimientos; no los inicia.' },
    example: { title: 'Fin del día', text: 'CUSTOMER_B recibe su camt.053 y ve el abono de 250 XXX con E2E-001.', outcome: 'Marca la factura como cobrada.' },
    diagram: seq('El extracto del periodo', { actors: ['CUSTOMER_B', 'BANK_B'], roles: ['party', 'agent'] }, [[1, 0, 'Movimientos del día', 'Se acumulan en la cuenta.'], [1, 0, 'camt.053 · extracto', 'Al cierre se envía el extracto.', 'camt.053'], [0, 1, 'Conciliación', 'El cliente compara y, si algo no cuadra, consulta.', 'reconciliation']]),
  },
  'camt.054': {
    summary: 'Bank To Customer Debit Credit Notification: aviso del banco al cliente sobre movimientos individuales en su cuenta.',
    plain: 'Es el "aviso al instante": te notifica cada abono o cargo sin esperar al extracto.',
    facts: [{ label: 'De quién a quién', value: 'Del banco al titular de la cuenta.' }, { label: 'Diferencia con camt.053', value: 'Movimiento a movimiento, no un resumen del periodo.' }],
    analogy: { text: 'La notificación del móvil cuando te llega una transferencia.', limit: 'No sustituye necesariamente al extracto oficial.' },
    example: { title: 'Abono recibido', text: 'BANK_B avisa a CUSTOMER_B del abono de 250 XXX.', outcome: 'CUSTOMER_B puede conciliar sin esperar al cierre.' },
    diagram: seq('Aviso de abono', p2p, [[2, 3, 'Pago recibido', 'El pago llega a BANK_B.'], [3, 4, 'Abono', 'Se acredita la cuenta.'], [3, 4, 'camt.054 · aviso', 'Se notifica el movimiento.', 'camt.054']]),
  },
  'camt.056': {
    summary: 'FI To FI Payment Cancellation Request: petición de un banco a otro para cancelar (o devolver) un pago ya enviado.',
    plain: 'Es pedir "por favor, cancela o devuélveme este pago", por error, duplicado o fraude. Es una petición, no una orden.',
    facts: [{ label: 'De quién a quién', value: 'Del banco que envió el pago al que lo recibió.' }, { label: 'Respuesta', value: 'Un camt.029 que acepta o rechaza la petición.' }, { label: 'Si se acepta', value: 'Los fondos vuelven con un pacs.004.' }],
    analogy: { text: 'Pedir que te devuelvan un envío equivocado: el otro puede decir que no.', limit: 'Enviar la petición no garantiza recuperar el dinero.' },
    example: { title: 'Pago duplicado', text: 'BANK_A envía un camt.056 citando el pago duplicado.', outcome: 'Espera el camt.029; si es positivo, recibirá un pacs.004.' },
    diagram: seq('Pedir una cancelación', bankCast, [[0, 1, 'camt.056 · petición', 'BANK_A pide cancelar.', 'camt.056'], [1, 2, 'Entrega', 'BANK_B evalúa.'], [2, 0, 'camt.029 · respuesta', 'Acepta o rechaza.', 'camt.029'], [2, 0, 'pacs.004 · si acepta', 'Devuelve los fondos.', 'pacs.004']]),
  },
  'camt.029': {
    summary: 'Resolution Of Investigation: respuesta que informa el resultado de una investigación o de una petición de cancelación.',
    plain: 'Es "la respuesta al reclamo": dice si se aceptó, se rechazó o qué se encontró sobre el caso.',
    facts: [{ label: 'Responde a', value: 'Peticiones como camt.056 u otras investigaciones.' }, { label: 'Qué lleva', value: 'El caso, el estado de la resolución y referencias al pago original.' }],
    analogy: { text: 'La carta de respuesta a un reclamo con número de caso.', limit: 'Informar no mueve dinero: si hay devolución, va en otro mensaje.' },
    example: { title: 'Cancelación aceptada', text: 'BANK_B acepta la cancelación del duplicado.', outcome: 'Envía un camt.029 positivo y luego un pacs.004.' },
    diagram: seq('Cerrar el caso', bankCast, [[0, 1, 'camt.056', 'Se abre la petición.', 'camt.056'], [1, 2, 'Entrega', 'BANK_B investiga.'], [2, 0, 'camt.029 · resolución', 'Informa el resultado.', 'camt.029']]),
  },
  'camt.003': {
    summary: 'Get Account: mensaje para solicitar información de una cuenta (por ejemplo, saldo o datos) a quien la administra.',
    plain: 'Es "dime cómo está esta cuenta". Lo usa, por ejemplo, un participante para consultar su cuenta en una infraestructura.',
    facts: [{ label: 'Respuesta', value: 'Un camt.004 (Return Account).' }, { label: 'No mueve dinero', value: 'Es solo una consulta.' }],
    analogy: { text: 'Consultar el saldo en un cajero.', limit: 'Qué datos se pueden pedir depende del servicio.' },
    example: { title: 'Saldo de liquidación', text: 'BANK_A consulta su cuenta de liquidación antes de un pago grande.', outcome: 'Recibe la información en un camt.004.' },
    diagram: seq('Consultar una cuenta', { actors: ['BANK_A', 'ADMINISTRADOR DE CUENTA'], roles: ['agent', 'infrastructure'] }, [[0, 1, 'camt.003 · consulta', 'Se pide información de la cuenta.', 'camt.003'], [1, 0, 'camt.004 · respuesta', 'Se devuelve la información.', 'camt.004']]),
  },
  'camt.004': {
    summary: 'Return Account: respuesta con la información de cuenta pedida en un camt.003.',
    plain: 'Es la respuesta a la consulta: los datos de la cuenta. "Return" significa devolver información, no devolver un pago.',
    facts: [{ label: 'Responde a', value: 'Un camt.003.' }, { label: 'Cuidado con el nombre', value: 'No tiene relación con la devolución de pagos (pacs.004).' }],
    analogy: { text: 'El ticket que imprime el cajero con tu saldo.', limit: 'Los datos incluidos dependen del servicio.' },
    example: { title: 'Saldo disponible', text: 'El administrador responde a BANK_A con el saldo de su cuenta.', outcome: 'BANK_A decide si tiene liquidez para el pago.' },
    diagram: seq('La respuesta a la consulta', { actors: ['BANK_A', 'ADMINISTRADOR DE CUENTA'], roles: ['agent', 'infrastructure'] }, [[0, 1, 'camt.003', 'Consulta.', 'camt.003'], [1, 0, 'camt.004 · datos', 'Información de la cuenta.', 'camt.004']]),
  },
}
