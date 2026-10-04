import type { IconName } from '@/components/reference/iconNames'
import type { ReferenceTone } from '@/components/reference/ReferenceIdentity'
import type { VisualRole } from './entries'

// End-to-end journeys of a payment between two customers of two banks
// connected by a fast payment system. SIMPLIFIED MODEL: the message types,
// status codes and timings shown are common ISO 20022 usages; each scheme
// defines its own flow. All data is synthetic.

export const journeyActors: { id: string; label: string; role: VisualRole; title: string; does: string; entry: string }[] = [
  { id: 'CUSTOMER_A', label: 'CUSTOMER_A', role: 'party', title: 'Parte · el que paga', does: 'Persona o empresa que ordena el pago y de cuya cuenta sale el dinero. En ISO 20022 es el deudor (Dbtr). En un débito directo, es a quien le cobran.', entry: 'debtor' },
  { id: 'BANK_A', label: 'BANK_A', role: 'agent', title: 'Agente · banco del que paga', does: 'Atiende a CUSTOMER_A: lo autentica, comprueba fondos, reserva o debita el dinero y envía la instrucción al sistema. Es el DbtrAgt y, en este tramo, el agente instructor.', entry: 'debtor-agent' },
  { id: 'PAYMENT_SYSTEM', label: 'PAYMENT_SYSTEM', role: 'infrastructure', title: 'Infraestructura · sistema de pagos inmediatos', does: 'Recibe las instrucciones de los participantes, las valida, las entrega al otro banco, organiza la liquidación entre ambos y comunica los estados.', entry: 'payment-system' },
  { id: 'BANK_B', label: 'BANK_B', role: 'agent', title: 'Agente · banco del que cobra', does: 'Recibe la instrucción, comprueba la cuenta del beneficiario, acepta o rechaza y abona a CUSTOMER_B. Es el CdtrAgt.', entry: 'creditor-agent' },
  { id: 'CUSTOMER_B', label: 'CUSTOMER_B', role: 'party', title: 'Parte · el que cobra', does: 'Persona o empresa que recibe el dinero. En ISO 20022 es el acreedor (Cdtr). En un débito directo, es quien inicia el cobro.', entry: 'creditor' },
]

export type Phase = 'Iniciación' | 'Compensación' | 'Liquidación' | 'Abono' | 'Reporte' | 'Excepción'
export type Outcome = 'ok' | 'warn' | 'fail'
export interface JourneyStep {
  from: number
  /** Same as `from` for an internal action of that actor. */
  to: number
  label: string
  message?: string
  phase: Phase
  detail: string
  money: string
  status: string
  outcome?: Outcome
  xml?: string
}
export interface Journey {
  id: string
  title: string
  kind: string
  icon: IconName
  tone: ReferenceTone
  summary: string
  takeaway: string
  steps: JourneyStep[]
}

const hdr = (from: string, to: string, def: string, id: string) => `<AppHdr>
  <Fr><FIId><FinInstnId><BICFI>${from}</BICFI></FinInstnId></FIId></Fr>
  <To><FIId><FinInstnId><BICFI>${to}</BICFI></FinInstnId></FIId></To>
  <BizMsgIdr>${id}</BizMsgIdr>
  <MsgDefIdr>${def}</MsgDefIdr>
</AppHdr>`

const pacs008 = `${hdr('AAAADODX', 'SYSTDODX', 'pacs.008.001.10', 'MSG-001')}
<FIToFICstmrCdtTrf>
  <GrpHdr><MsgId>MSG-001</MsgId><NbOfTxs>1</NbOfTxs>
    <SttlmInf><SttlmMtd>CLRG</SttlmMtd></SttlmInf></GrpHdr>
  <CdtTrfTxInf>
    <PmtId><EndToEndId>E2E-001</EndToEndId><TxId>TX-001</TxId></PmtId>
    <IntrBkSttlmAmt Ccy="XXX">250.00</IntrBkSttlmAmt>
    <Dbtr><Nm>CUSTOMER_A</Nm></Dbtr>
    <DbtrAgt><FinInstnId><BICFI>AAAADODX</BICFI></FinInstnId></DbtrAgt>
    <CdtrAgt><FinInstnId><BICFI>BBBBDODX</BICFI></FinInstnId></CdtrAgt>
    <Cdtr><Nm>CUSTOMER_B</Nm></Cdtr>
  </CdtTrfTxInf>
</FIToFICstmrCdtTrf>`

const pacs002 = (from: string, to: string, id: string, status: string, reason?: string) => `${hdr(from, to, 'pacs.002.001.12', id)}
<FIToFIPmtStsRpt>
  <GrpHdr><MsgId>${id}</MsgId></GrpHdr>
  <TxInfAndSts>
    <OrgnlGrpInf><OrgnlMsgId>MSG-001</OrgnlMsgId>
      <OrgnlMsgNmId>pacs.008.001.10</OrgnlMsgNmId></OrgnlGrpInf>
    <OrgnlEndToEndId>E2E-001</OrgnlEndToEndId>
    <OrgnlTxId>TX-001</OrgnlTxId>
    <TxSts>${status}</TxSts>${reason ? `
    <StsRsnInf><Rsn><Cd>${reason}</Cd></Rsn></StsRsnInf>` : ''}
  </TxInfAndSts>
</FIToFIPmtStsRpt>`

const camt054 = `<BkToCstmrDbtCdtNtfctn>
  <GrpHdr><MsgId>NTF-001</MsgId></GrpHdr>
  <Ntfctn>
    <Acct><Id><Othr><Id>DEMO-BENEFICIARY-ACCOUNT-2001</Id></Othr></Id></Acct>
    <Ntry>
      <Amt Ccy="XXX">250.00</Amt>
      <CdtDbtInd>CRDT</CdtDbtInd>
      <NtryDtls><TxDtls><Refs><EndToEndId>E2E-001</EndToEndId></Refs></TxDtls></NtryDtls>
    </Ntry>
  </Ntfctn>
</BkToCstmrDbtCdtNtfctn>`

const ok = 'ok' as const
const warn = 'warn' as const
const fail = 'fail' as const

// The shared opening of a credit transfer: order, reservation, instruction.
const opening: JourneyStep[] = [
  { from: 0, to: 1, label: 'Ordena pagar 250 XXX', phase: 'Iniciación', detail: 'CUSTOMER_A se autentica en la app de BANK_A y ordena pagar 250 XXX a CUSTOMER_B con la referencia E2E-001. Es una intención: todavía no se ha movido dinero.', money: 'En la cuenta de CUSTOMER_A', status: 'Ordenado' },
  { from: 1, to: 1, label: 'Valida y reserva fondos', phase: 'Iniciación', detail: 'BANK_A comprueba identidad, límites y saldo, y reserva (bloquea) 250 XXX. Reservar no es debitar definitivamente: si el pago falla, se libera.', money: 'Reservado en BANK_A', status: 'Aceptado por BANK_A' },
  { from: 1, to: 2, label: 'Instrucción de pago', message: 'pacs.008', phase: 'Compensación', detail: 'BANK_A envía la transferencia al sistema con MsgId MSG-001, TxId TX-001 y EndToEndId E2E-001. Enviar no es lo mismo que ser aceptado.', money: 'Reservado en BANK_A', status: 'Enviado', xml: pacs008 },
  { from: 2, to: 2, label: 'Valida la instrucción', phase: 'Compensación', detail: 'El sistema comprueba formato, versión, participantes y reglas del esquema. Si algo no cumple, rechaza aquí mismo.', money: 'Reservado en BANK_A', status: 'Recibido por el sistema' },
  { from: 2, to: 3, label: 'Entrega la instrucción', message: 'pacs.008', phase: 'Compensación', detail: 'El sistema entrega el pacs.008 a BANK_B. Que BANK_B lo reciba no significa que lo acepte.', money: 'Reservado en BANK_A', status: 'Entregado a BANK_B', xml: pacs008.replace('<Fr><FIId><FinInstnId><BICFI>AAAADODX', '<Fr><FIId><FinInstnId><BICFI>SYSTDODX').replace('<To><FIId><FinInstnId><BICFI>SYSTDODX', '<To><FIId><FinInstnId><BICFI>BBBBDODX') },
]

const settledCredit: JourneyStep[] = [
  { from: 3, to: 3, label: 'Comprueba la cuenta', phase: 'Compensación', detail: 'BANK_B verifica que la cuenta de CUSTOMER_B exista, esté activa y pase sus controles.', money: 'Reservado en BANK_A', status: 'En revisión por BANK_B' },
  { from: 3, to: 2, label: 'Acepta el pago', message: 'pacs.002', phase: 'Compensación', detail: 'BANK_B responde positivamente (por ejemplo ACSP: aceptado, liquidación en curso). Aceptar no es liquidar: el dinero aún no ha cambiado de banco.', money: 'Reservado en BANK_A', status: 'Aceptado por BANK_B', outcome: ok, xml: pacs002('BBBBDODX', 'SYSTDODX', 'STS-B-001', 'ACSP') },
  { from: 2, to: 2, label: 'Liquida entre bancos', phase: 'Liquidación', detail: 'El sistema mueve 250 XXX de la cuenta de liquidación de BANK_A a la de BANK_B. A partir de aquí la liquidación es firme según las reglas del sistema.', money: 'Liquidado: en la cuenta de liquidación de BANK_B', status: 'Liquidado', outcome: ok },
  { from: 2, to: 1, label: 'Confirma liquidación', message: 'pacs.002', phase: 'Liquidación', detail: 'El sistema informa a BANK_A que el pago se liquidó (por ejemplo ACSC). BANK_A convierte la reserva en un débito definitivo a CUSTOMER_A.', money: 'Debitado a CUSTOMER_A · liquidado', status: 'Liquidado', outcome: ok, xml: pacs002('SYSTDODX', 'AAAADODX', 'STS-S-001', 'ACSC') },
  { from: 2, to: 3, label: 'Confirma liquidación', message: 'pacs.002', phase: 'Liquidación', detail: 'BANK_B también recibe la confirmación: ya puede abonar sabiendo que el dinero está en su cuenta de liquidación.', money: 'Liquidado: en la cuenta de liquidación de BANK_B', status: 'Liquidado', outcome: ok, xml: pacs002('SYSTDODX', 'BBBBDODX', 'STS-S-002', 'ACSC') },
  { from: 3, to: 4, label: 'Abona 250 XXX', phase: 'Abono', detail: 'BANK_B acredita la cuenta de CUSTOMER_B. Liquidado no es lo mismo que acreditado: este es el momento en que el beneficiario puede usar el dinero.', money: 'Abonado a CUSTOMER_B', status: 'Acreditado', outcome: ok },
  { from: 3, to: 4, label: 'Aviso de abono', message: 'camt.054', phase: 'Reporte', detail: 'BANK_B notifica el movimiento a CUSTOMER_B, con la referencia E2E-001 para que pueda conciliar.', money: 'Abonado a CUSTOMER_B', status: 'Completado', outcome: ok, xml: camt054 },
]

export const journeys: Journey[] = [
  {
    id: 'credit-ok', title: 'Transferencia inmediata exitosa', kind: 'Transferencia de crédito', icon: 'high-voltage', tone: 'gold',
    summary: 'CUSTOMER_A paga 250 XXX a CUSTOMER_B. Todo sale bien: el pago se envía, se acepta, se liquida entre bancos y se abona en segundos.',
    takeaway: 'Reservado ≠ debitado · recibido ≠ aceptado · aceptado ≠ liquidado · liquidado ≠ abonado.',
    steps: [...opening, ...settledCredit, { from: 1, to: 0, label: 'Confirma el pago', phase: 'Reporte', detail: 'BANK_A muestra a CUSTOMER_A que el pago se completó. Esta confirmación llega después de la liquidación, no al enviar.', money: 'Abonado a CUSTOMER_B', status: 'Completado', outcome: ok }],
  },
  {
    id: 'credit-reject', title: 'Rechazo: cuenta inexistente', kind: 'Excepción antes de liquidar', icon: 'no-entry', tone: 'red',
    summary: 'BANK_B no encuentra la cuenta de CUSTOMER_B y rechaza el pago. Como no se liquidó, no hay nada que devolver: solo se libera la reserva.',
    takeaway: 'Un rechazo ocurre antes de liquidar: el dinero nunca cambió de banco.',
    steps: [...opening,
      { from: 3, to: 3, label: 'Cuenta no encontrada', phase: 'Compensación', detail: 'La cuenta indicada no existe en BANK_B.', money: 'Reservado en BANK_A', status: 'En revisión por BANK_B', outcome: warn },
      { from: 3, to: 2, label: 'Rechaza · AC01', message: 'pacs.002', phase: 'Excepción', detail: 'BANK_B responde RJCT con el motivo AC01 (número de cuenta incorrecto).', money: 'Reservado en BANK_A', status: 'Rechazado', outcome: fail, xml: pacs002('BBBBDODX', 'SYSTDODX', 'STS-B-001', 'RJCT', 'AC01') },
      { from: 2, to: 1, label: 'Informa el rechazo', message: 'pacs.002', phase: 'Excepción', detail: 'El sistema reenvía el rechazo a BANK_A. No hubo liquidación.', money: 'Reservado en BANK_A', status: 'Rechazado', outcome: fail, xml: pacs002('SYSTDODX', 'AAAADODX', 'STS-S-001', 'RJCT', 'AC01') },
      { from: 1, to: 1, label: 'Libera la reserva', phase: 'Excepción', detail: 'BANK_A libera los 250 XXX. Como solo estaban reservados, el saldo de CUSTOMER_A vuelve a estar disponible sin ningún pago de vuelta.', money: 'Liberado: de nuevo disponible para CUSTOMER_A', status: 'Rechazado', outcome: warn },
      { from: 1, to: 0, label: 'Avisa del rechazo', phase: 'Reporte', detail: 'BANK_A informa a CUSTOMER_A que el pago no se hizo y por qué, para que revise los datos.', money: 'En la cuenta de CUSTOMER_A', status: 'Rechazado', outcome: fail },
    ],
  },
  {
    id: 'credit-return', title: 'Devolución después de liquidar', kind: 'Excepción después de liquidar', icon: 'right-arrow-curving-left', tone: 'orange',
    summary: 'El pago se acepta y se liquida, pero luego BANK_B no puede abonarlo (la cuenta se cerró). Como el dinero ya cambió de banco, hay que devolverlo con un nuevo pago: pacs.004.',
    takeaway: 'Después de liquidar no se "deshace": se devuelve con otro movimiento que cita el original.',
    steps: [...opening, ...settledCredit.slice(0, 5),
      { from: 3, to: 3, label: 'No puede abonar', phase: 'Excepción', detail: 'Al intentar abonar, BANK_B descubre que la cuenta de CUSTOMER_B está cerrada.', money: 'Liquidado: en la cuenta de liquidación de BANK_B', status: 'Liquidado, sin abonar', outcome: warn },
      { from: 3, to: 2, label: 'Devuelve · AC04', message: 'pacs.004', phase: 'Excepción', detail: 'BANK_B envía una devolución de 250 XXX con el motivo AC04 (cuenta cerrada), citando TX-001.', money: 'En devolución hacia BANK_A', status: 'Devolución enviada', outcome: warn, xml: `${hdr('BBBBDODX', 'SYSTDODX', 'pacs.004.001.11', 'RTR-001')}
<PmtRtr>
  <GrpHdr><MsgId>RTR-001</MsgId><NbOfTxs>1</NbOfTxs></GrpHdr>
  <TxInf>
    <RtrId>RTR-TX-001</RtrId>
    <OrgnlEndToEndId>E2E-001</OrgnlEndToEndId>
    <OrgnlTxId>TX-001</OrgnlTxId>
    <RtrdIntrBkSttlmAmt Ccy="XXX">250.00</RtrdIntrBkSttlmAmt>
    <RtrRsnInf><Rsn><Cd>AC04</Cd></Rsn></RtrRsnInf>
  </TxInf>
</PmtRtr>` },
      { from: 2, to: 2, label: 'Liquida la devolución', phase: 'Liquidación', detail: 'El sistema liquida el nuevo movimiento: 250 XXX vuelven de BANK_B a BANK_A.', money: 'Liquidado de vuelta en BANK_A', status: 'Devuelto', outcome: warn },
      { from: 2, to: 1, label: 'Entrega la devolución', message: 'pacs.004', phase: 'Excepción', detail: 'BANK_A recibe la devolución con la referencia del pago original.', money: 'Liquidado de vuelta en BANK_A', status: 'Devuelto', outcome: warn },
      { from: 1, to: 0, label: 'Abona la devolución', phase: 'Abono', detail: 'BANK_A acredita 250 XXX a CUSTOMER_A e informa el motivo.', money: 'Devuelto a CUSTOMER_A', status: 'Devuelto', outcome: warn },
    ],
  },
  {
    id: 'timeout', title: 'Sin respuesta: consulta de estado', kind: 'Estado incierto', icon: 'hourglass-not-done', tone: 'gold',
    summary: 'BANK_A envía el pago y no recibe respuesta a tiempo. En vez de repetir el pago (y arriesgarse a pagar dos veces), pregunta por su estado.',
    takeaway: 'Un timeout no es un rechazo: es un estado incierto que se resuelve preguntando, no reenviando.',
    steps: [...opening.slice(0, 3),
      { from: 2, to: 2, label: '… sin respuesta', phase: 'Excepción', detail: 'Pasa el tiempo máximo del esquema y BANK_A no ha recibido ningún estado. No sabe si el pago se liquidó.', money: 'Reservado en BANK_A', status: 'Incierto', outcome: warn },
      { from: 1, to: 2, label: '¿Qué pasó con TX-001?', message: 'pacs.028', phase: 'Excepción', detail: 'BANK_A pregunta por el estado citando la transacción original. No crea un pago nuevo.', money: 'Reservado en BANK_A', status: 'Consulta enviada', outcome: warn, xml: `${hdr('AAAADODX', 'SYSTDODX', 'pacs.028.001.05', 'REQ-001')}
<FIToFIPmtStsReq>
  <GrpHdr><MsgId>REQ-001</MsgId></GrpHdr>
  <TxInf>
    <OrgnlGrpInf><OrgnlMsgId>MSG-001</OrgnlMsgId>
      <OrgnlMsgNmId>pacs.008.001.10</OrgnlMsgNmId></OrgnlGrpInf>
    <OrgnlTxId>TX-001</OrgnlTxId>
  </TxInf>
</FIToFIPmtStsReq>` },
      { from: 2, to: 1, label: 'Estado: liquidado', message: 'pacs.002', phase: 'Liquidación', detail: 'El sistema responde que TX-001 sí se liquidó (ACSC). Si BANK_A hubiese reenviado el pago, CUSTOMER_A habría pagado dos veces.', money: 'Debitado a CUSTOMER_A · liquidado', status: 'Liquidado', outcome: ok, xml: pacs002('SYSTDODX', 'AAAADODX', 'STS-S-001', 'ACSC') },
      { from: 1, to: 0, label: 'Confirma el pago', phase: 'Reporte', detail: 'Con el estado real, BANK_A confirma el pago a su cliente.', money: 'Debitado a CUSTOMER_A · liquidado', status: 'Completado', outcome: ok },
    ],
  },
  {
    id: 'recall', title: 'Pago duplicado: solicitud de cancelación', kind: 'Recuperar un pago enviado', icon: 'counterclockwise-arrows-button', tone: 'violet',
    summary: 'Por un error, el pago se envió dos veces y ambos se completaron. BANK_A pide cancelar el duplicado (camt.056); BANK_B acepta (camt.029) y devuelve los fondos (pacs.004).',
    takeaway: 'Pedir la cancelación es una solicitud: el dinero vuelve solo si el otro banco acepta y hace la devolución.',
    steps: [
      { from: 1, to: 1, label: 'Detecta el duplicado', phase: 'Excepción', detail: 'BANK_A detecta que TX-002 es una copia de TX-001 y que ambos ya se liquidaron y abonaron.', money: 'Abonado dos veces a CUSTOMER_B', status: 'Duplicado completado', outcome: warn },
      { from: 1, to: 2, label: 'Pide cancelar · DUPL', message: 'camt.056', phase: 'Excepción', detail: 'BANK_A envía una petición de cancelación del pago TX-002 con el motivo DUPL (duplicado).', money: 'Abonado dos veces a CUSTOMER_B', status: 'Cancelación solicitada', outcome: warn, xml: `${hdr('AAAADODX', 'SYSTDODX', 'camt.056.001.10', 'CXL-001')}
<FIToFIPmtCxlReq>
  <Assgnmt><Id>CASE-001</Id></Assgnmt>
  <Undrlyg>
    <TxInf>
      <OrgnlTxId>TX-002</OrgnlTxId>
      <OrgnlIntrBkSttlmAmt Ccy="XXX">250.00</OrgnlIntrBkSttlmAmt>
      <CxlRsnInf><Rsn><Cd>DUPL</Cd></Rsn></CxlRsnInf>
    </TxInf>
  </Undrlyg>
</FIToFIPmtCxlReq>` },
      { from: 2, to: 3, label: 'Entrega la petición', message: 'camt.056', phase: 'Excepción', detail: 'BANK_B recibe la petición. Según las reglas, puede necesitar el acuerdo de CUSTOMER_B.', money: 'Abonado dos veces a CUSTOMER_B', status: 'Cancelación solicitada', outcome: warn },
      { from: 3, to: 3, label: 'Revisa y acepta', phase: 'Excepción', detail: 'BANK_B confirma el duplicado y recupera los 250 XXX de la cuenta de CUSTOMER_B.', money: 'Recuperado por BANK_B', status: 'Cancelación aceptada', outcome: ok },
      { from: 3, to: 2, label: 'Respuesta · CNCL', message: 'camt.029', phase: 'Excepción', detail: 'BANK_B responde que acepta la cancelación (CNCL).', money: 'Recuperado por BANK_B', status: 'Cancelación aceptada', outcome: ok, xml: `${hdr('BBBBDODX', 'SYSTDODX', 'camt.029.001.11', 'RES-001')}
<RsltnOfInvstgtn>
  <Assgnmt><Id>RES-001</Id></Assgnmt>
  <Sts><Conf>CNCL</Conf></Sts>
  <CxlDtls><TxInfAndSts>
    <OrgnlTxId>TX-002</OrgnlTxId>
  </TxInfAndSts></CxlDtls>
</RsltnOfInvstgtn>` },
      { from: 3, to: 2, label: 'Devuelve los fondos', message: 'pacs.004', phase: 'Liquidación', detail: 'La cancelación aceptada se ejecuta con una devolución que cita TX-002.', money: 'En devolución hacia BANK_A', status: 'Devuelto', outcome: ok },
      { from: 2, to: 1, label: 'Entrega la devolución', message: 'pacs.004', phase: 'Liquidación', detail: 'El sistema liquida y entrega la devolución a BANK_A.', money: 'Liquidado de vuelta en BANK_A', status: 'Devuelto', outcome: ok },
      { from: 1, to: 0, label: 'Reintegra a CUSTOMER_A', phase: 'Abono', detail: 'BANK_A abona el importe del duplicado a su cliente.', money: 'Devuelto a CUSTOMER_A', status: 'Cerrado', outcome: ok },
    ],
  },
  {
    id: 'direct-debit', title: 'Débito directo', kind: 'Cobro con mandato', icon: 'inbox-tray', tone: 'cyan',
    summary: 'El flujo va al revés: CUSTOMER_B (el que cobra) inicia el cobro con un mandato que CUSTOMER_A firmó antes. El dinero sigue yendo de A a B.',
    takeaway: 'En un débito directo la instrucción viaja del cobrador al pagador, pero el dinero va del pagador al cobrador.',
    steps: [
      { from: 4, to: 3, label: 'Presenta el cobro', phase: 'Iniciación', detail: 'CUSTOMER_B pide a su banco cobrar 50 XXX a CUSTOMER_A, según el mandato firmado. Muchos esquemas de débito directo trabajan por lotes y con plazos; aquí se muestra en una línea para compararlo con la transferencia.', money: 'En la cuenta de CUSTOMER_A', status: 'Presentado' },
      { from: 3, to: 2, label: 'Instrucción de cobro', message: 'pacs.003', phase: 'Compensación', detail: 'BANK_B envía el débito directo con la referencia del mandato.', money: 'En la cuenta de CUSTOMER_A', status: 'Enviado', xml: `${hdr('BBBBDODX', 'SYSTDODX', 'pacs.003.001.09', 'DD-001')}
<FIToFICstmrDrctDbt>
  <GrpHdr><MsgId>DD-001</MsgId><NbOfTxs>1</NbOfTxs></GrpHdr>
  <DrctDbtTxInf>
    <PmtId><EndToEndId>E2E-DD-001</EndToEndId><TxId>TX-DD-001</TxId></PmtId>
    <IntrBkSttlmAmt Ccy="XXX">50.00</IntrBkSttlmAmt>
    <DrctDbtTx><MndtRltdInf><MndtId>MANDATE-001</MndtId></MndtRltdInf></DrctDbtTx>
    <Cdtr><Nm>CUSTOMER_B</Nm></Cdtr>
    <Dbtr><Nm>CUSTOMER_A</Nm></Dbtr>
  </DrctDbtTxInf>
</FIToFICstmrDrctDbt>` },
      { from: 2, to: 1, label: 'Entrega el cobro', message: 'pacs.003', phase: 'Compensación', detail: 'BANK_A, banco del pagador, recibe el cobro.', money: 'En la cuenta de CUSTOMER_A', status: 'Entregado a BANK_A' },
      { from: 1, to: 0, label: 'Debita según el mandato', phase: 'Compensación', detail: 'BANK_A comprueba que el mandato existe y hay fondos, y debita a CUSTOMER_A.', money: 'Debitado a CUSTOMER_A', status: 'Aceptado por BANK_A', outcome: ok },
      { from: 1, to: 2, label: 'Acepta el cobro', message: 'pacs.002', phase: 'Compensación', detail: 'BANK_A informa que acepta el débito.', money: 'Debitado a CUSTOMER_A', status: 'Aceptado', outcome: ok },
      { from: 2, to: 2, label: 'Liquida entre bancos', phase: 'Liquidación', detail: 'Los 50 XXX pasan de BANK_A a BANK_B en la liquidación.', money: 'Liquidado: en la cuenta de liquidación de BANK_B', status: 'Liquidado', outcome: ok },
      { from: 3, to: 4, label: 'Abona el cobro', phase: 'Abono', detail: 'BANK_B acredita a CUSTOMER_B. El pagador aún puede tener derecho a reclamar según el esquema.', money: 'Abonado a CUSTOMER_B', status: 'Acreditado', outcome: ok },
    ],
  },
  {
    id: 'corporate', title: 'Empresa: lote pain.001', kind: 'Iniciación por archivo', icon: 'memo', tone: 'purple',
    summary: 'CUSTOMER_A es una empresa que envía sus pagos en un archivo pain.001 desde su ERP. El banco valida el archivo, informa con pain.002 y convierte cada pago en un pacs.008.',
    takeaway: 'pain es cliente ↔ banco; pacs es banco ↔ banco. Un archivo aceptado no es un pago abonado.',
    steps: [
      { from: 0, to: 1, label: 'Archivo de pagos', message: 'pain.001', phase: 'Iniciación', detail: 'El ERP de CUSTOMER_A envía un pain.001 con varios pagos, uno de ellos de 250 XXX a CUSTOMER_B.', money: 'En la cuenta de CUSTOMER_A', status: 'Ordenado', xml: `<CstmrCdtTrfInitn>
  <GrpHdr><MsgId>FILE-001</MsgId><NbOfTxs>3</NbOfTxs>
    <InitgPty><Nm>CUSTOMER_A</Nm></InitgPty></GrpHdr>
  <PmtInf>
    <PmtInfId>BATCH-001</PmtInfId>
    <Dbtr><Nm>CUSTOMER_A</Nm></Dbtr>
    <CdtTrfTxInf>
      <PmtId><EndToEndId>E2E-001</EndToEndId></PmtId>
      <Amt><InstdAmt Ccy="XXX">250.00</InstdAmt></Amt>
      <Cdtr><Nm>CUSTOMER_B</Nm></Cdtr>
    </CdtTrfTxInf>
  </PmtInf>
</CstmrCdtTrfInitn>` },
      { from: 1, to: 0, label: 'Archivo validado', message: 'pain.002', phase: 'Iniciación', detail: 'BANK_A informa que el archivo pasó la validación técnica (por ejemplo ACTC). Validar el archivo no es pagar.', money: 'Reservado en BANK_A', status: 'Aceptado por BANK_A', outcome: ok, xml: `<CstmrPmtStsRpt>
  <GrpHdr><MsgId>PSR-001</MsgId></GrpHdr>
  <OrgnlGrpInfAndSts>
    <OrgnlMsgId>FILE-001</OrgnlMsgId>
    <OrgnlMsgNmId>pain.001.001.09</OrgnlMsgNmId>
    <GrpSts>ACTC</GrpSts>
  </OrgnlGrpInfAndSts>
</CstmrPmtStsRpt>` },
      { ...opening[2], detail: 'Por cada pago del archivo, BANK_A genera una instrucción interbancaria. El EndToEndId de la empresa (E2E-001) viaja sin cambios.' },
      { from: 2, to: 3, label: 'Entrega la instrucción', message: 'pacs.008', phase: 'Compensación', detail: 'El sistema entrega el pago a BANK_B.', money: 'Reservado en BANK_A', status: 'Entregado a BANK_B' },
      { ...settledCredit[1] },
      { ...settledCredit[2] },
      { ...settledCredit[5] },
      { from: 1, to: 0, label: 'Extracto del día', message: 'camt.053', phase: 'Reporte', detail: 'Al cierre, BANK_A envía el extracto con los cargos del lote. La empresa concilia cada pago con su EndToEndId.', money: 'Debitado a CUSTOMER_A · liquidado', status: 'Completado', outcome: ok },
    ],
  },
]

export const phaseTone: Record<Phase, string> = { Iniciación: 'purple', Compensación: 'cyan', Liquidación: 'gold', Abono: 'mint', Reporte: 'teal', Excepción: 'red' }
