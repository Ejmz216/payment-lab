import pacs008 from '../pacs008-v10.xml?raw'
import pain001 from './pain001.xml?raw'
import pain002 from './pain002.xml?raw'
import pacs002 from './pacs002.xml?raw'
import pacs004 from './pacs004.xml?raw'
import pacs003 from './pacs003.xml?raw'
import pacs028 from './pacs028.xml?raw'
import camt053 from './camt053.xml?raw'
import camt054 from './camt054.xml?raw'
import camt056 from './camt056.xml?raw'
import camt029 from './camt029.xml?raw'
import camt003 from './camt003.xml?raw'
import camt004 from './camt004.xml?raw'
import { getFieldNote, type FieldNote } from '../xmlGuide'
import { fillValue, findSampleNote } from './notes'
import { sampleVersions } from './ids'
import type { NoteResolver } from '@/lib/xmlStudy'

type Bi = [es: string, en: string]
export interface XmlGroup { id: string; label: Bi; help: Bi; layer?: 'transport' | 'header'; match?: RegExp }
export interface XmlSample {
  id: string
  version: string
  xml: string
  /** Tag selected when the sample opens. */
  defaultTag: string
  /** What this synthetic instance shows. */
  story: Bi
  groups: XmlGroup[]
  resolve: NoteResolver
}

const all: XmlGroup = { id: 'all', label: ['Todo', 'All'], help: ['El ejemplo completo.', 'The whole sample.'] }
const transport: XmlGroup = { id: 'transport', label: ['Transporte', 'Transport'], help: ['DataPDU y Body: el sobre técnico de este ejemplo. No pertenece a ISO 20022.', 'DataPDU and Body: this example’s technical envelope. Not part of ISO 20022.'], layer: 'transport' }
const header: XmlGroup = { id: 'header', label: ['Cabecera AppHdr', 'AppHdr header'], help: ['head.001: quién envía, a quién, qué mensaje es y su referencia.', 'head.001: who sends, to whom, which message it is and its reference.'], layer: 'header' }
const grpHdr: XmlGroup = { id: 'group', label: ['GrpHdr', 'GrpHdr'], help: ['La portada del mensaje: identificador, fecha y totales.', 'The message cover page: identifier, date and totals.'], match: /\/GrpHdr(?:\/|$)/ }
const originals: XmlGroup = { id: 'originals', label: ['Referencias originales', 'Original references'], help: ['Los campos Orgnl…: a qué mensaje y operación anteriores se refiere este.', 'The Orgnl… fields: which earlier message and operation this one refers to.'], match: /\/Orgnl\w*(?:\/|$)/ }
const agents: XmlGroup = { id: 'agents', label: ['Agentes', 'Agents'], help: ['InstgAgt e InstdAgt: quién envía y quién recibe en este tramo.', 'InstgAgt and InstdAgt: who sends and who receives on this leg.'], match: /\/(?:InstgAgt|InstdAgt)(?:\/|$)/ }
const parties: XmlGroup = { id: 'actors', label: ['Partes y cuentas', 'Parties and accounts'], help: ['Quién paga y quién cobra, sus bancos y sus cuentas.', 'Who pays and who gets paid, their banks and accounts.'], match: /\/(?:Dbtr|Cdtr|InitgPty)/ }
const interbank = [all, transport, header]

// The pacs.008 keeps its original groups and notes (src/content/reference/xmlGuide.ts).
const pacs008Groups: XmlGroup[] = [...interbank, { ...grpHdr, help: ['La portada del pacs.008: identificador del mensaje, fecha, número de transacciones y método de liquidación.', 'The pacs.008 cover page: message identifier, date, number of transactions and settlement method.'] },
  { id: 'ids', label: ['Identificadores', 'Identifiers'], help: ['PmtId: EndToEndId, TxId y UETR, las referencias para seguir el pago.', 'PmtId: EndToEndId, TxId and UETR, the references used to track the payment.'], match: /\/PmtId(?:\/|$)/ },
  { id: 'actors', label: ['Partes y cuentas', 'Parties and accounts'], help: ['Quién paga y quién cobra (Dbtr, Cdtr), sus bancos (agentes) y sus cuentas.', 'Who pays and who gets paid (Dbtr, Cdtr), their banks (agents) and their accounts.'], match: /\/(?:Dbtr|Cdtr|InstgAgt|InstdAgt)/ },
  { id: 'amount', label: ['Importe y liquidación', 'Amount and settlement'], help: ['Cuánto se liquida entre bancos, en qué moneda, en qué fecha y quién asume las comisiones.', 'How much is settled between banks, in which currency, on which date and who bears the charges.'], match: /\/(?:IntrBkSttlmAmt|IntrBkSttlmDt|SttlmInf|ChrgBr)(?:\/|$)/ },
  { id: 'purpose', label: ['Tipo y propósito', 'Type and purpose'], help: ['Qué tipo de pago es, para qué es y el concepto para el beneficiario.', 'What kind of payment it is, what it is for and the remittance for the payee.'], match: /\/(?:PmtTpInf|Purp|RmtInf)(?:\/|$)/ },
]

// Notes for the new samples: annotations from notes.ts; generic transport and
// header pieces (envelope, BIC, account ids, namespaces) reuse xmlGuide.ts.
const sharedTags = new Set(['@xmlns', 'DataPDU', 'Body', 'FIId', 'FinInstnId', 'BICFI', 'Id', 'Othr', 'Prtry'])
export const sampleResolver: NoteResolver = (tag, path, value, lang) => {
  const note = tag === '@xmlns' ? undefined : findSampleNote(tag, path)
  if (note) {
    const i = lang === 'en' ? 1 : 0
    return {
      name: note.name[i],
      meaning: fillValue(note.meaning[i], value),
      note: fillValue(note.note[i], value),
      explain: note.explain && fillValue(note.explain[i], value),
      equivalent: note.equivalent && fillValue(note.equivalent[i], value),
      parts: note.parts?.map(([label, es, en]) => ({ label, text: i ? en : es })),
      concept: note.concept,
    } satisfies FieldNote
  }
  if (sharedTags.has(tag)) return getFieldNote(tag, path, value, lang)
  return { name: tag, meaning: lang === 'en' ? 'Element of this XML instance.' : 'Elemento de esta instancia XML.', note: lang === 'en' ? 'No reviewed explanation for this field yet.' : 'No hay una explicación editorial revisada para este campo.' }
}

const sample = (id: string, xml: string, defaultTag: string, story: Bi, groups: XmlGroup[], resolve: NoteResolver = sampleResolver): XmlSample => ({ id, version: sampleVersions[id], xml, defaultTag, story, groups, resolve })

export const xmlSamples: Record<string, XmlSample> = {
  'pacs.008': sample('pacs.008', pacs008, 'IntrBkSttlmAmt', ['BANK_A instruye a BANK_B una transferencia de 250 XXX de CUSTOMER_A a CUSTOMER_B (MSG-001 / TX-001).', 'BANK_A instructs BANK_B a 250 XXX transfer from CUSTOMER_A to CUSTOMER_B (MSG-001 / TX-001).'], pacs008Groups, getFieldNote),
  'pain.001': sample('pain.001', pain001, 'InstdAmt', ['La empresa CUSTOMER_A envía a BANK_A un archivo con dos pagos. El segundo trae un IBAN mal escrito a propósito.', 'Company CUSTOMER_A sends BANK_A a file with two payments. The second carries a deliberately mistyped IBAN.'], [all, grpHdr,
    { id: 'batch', label: ['Lote (PmtInf)', 'Batch (PmtInf)'], help: ['Lo común a los pagos del lote: pagador, cuenta de cargo, banco y fecha.', 'What the batch’s payments share: payer, debit account, bank and date.'], match: /\/PmtInf(?:\/(?!CdtTrfTxInf)|$)/ },
    { id: 'payments', label: ['Pagos', 'Payments'], help: ['Cada CdtTrfTxInf: un pago a un beneficiario.', 'Each CdtTrfTxInf: one payment to one payee.'], match: /\/CdtTrfTxInf/ },
    { id: 'ids', label: ['Identificadores', 'Identifiers'], help: ['MsgId, PmtInfId, InstrId y EndToEndId: cada nivel tiene su referencia.', 'MsgId, PmtInfId, InstrId and EndToEndId: each level has its own reference.'], match: /\/(?:MsgId|PmtInfId|PmtId)(?:\/|$)/ }, parties]),
  'pain.002': sample('pain.002', pain002, 'TxSts', ['BANK_A responde al archivo FILE-001: aceptado en parte; el pago E2E-002 se rechaza con AC01.', 'BANK_A answers file FILE-001: partly accepted; payment E2E-002 is rejected with AC01.'], [all, grpHdr,
    { id: 'file', label: ['Archivo original', 'Original file'], help: ['El pain.001 al que se responde y su estado global.', 'The pain.001 being answered and its overall status.'], match: /\/OrgnlGrpInfAndSts/ },
    { id: 'tx', label: ['Lote y operaciones', 'Batch and operations'], help: ['El estado de cada orden que el banco necesita informar.', 'The status of each order the bank needs to report.'], match: /\/OrgnlPmtInfAndSts/ },
    { id: 'reason', label: ['Motivo', 'Reason'], help: ['Por qué se rechazó: código ISO y texto.', 'Why it was rejected: ISO code and text.'], match: /\/StsRsnInf/ }]),
  'pacs.002': sample('pacs.002', pacs002, 'TxSts', ['BANK_B responde al pacs.008 anotado: acepta TX-001 y la liquidación está en curso (ACSP).', 'BANK_B answers the annotated pacs.008: it accepts TX-001 and settlement is in process (ACSP).'], [...interbank, grpHdr, originals,
    { id: 'status', label: ['Estado', 'Status'], help: ['TxSts y cuándo se aceptó.', 'TxSts and when it was accepted.'], match: /\/(?:TxSts|AccptncDtTm|StsRsnInf)(?:\/|$)/ }, agents]),
  'pacs.004': sample('pacs.004', pacs004, 'RtrdIntrBkSttlmAmt', ['BANK_B devuelve TX-001 al día siguiente porque la cuenta del beneficiario estaba cerrada (AC04).', 'BANK_B returns TX-001 the next day because the payee’s account was closed (AC04).'], [...interbank, grpHdr, originals,
    { id: 'amounts', label: ['Importes y fechas', 'Amounts and dates'], help: ['Lo que se pagó, lo que se devuelve y cuándo.', 'What was paid, what is returned and when.'], match: /\/(?:OrgnlIntrBkSttlmAmt|OrgnlIntrBkSttlmDt|RtrdIntrBkSttlmAmt|IntrBkSttlmDt|ChrgBr)(?:\/|$)/ },
    { id: 'reason', label: ['Motivo', 'Reason'], help: ['Por qué se devuelve.', 'Why it is returned.'], match: /\/RtrRsnInf/ }, agents]),
  'pacs.003': sample('pacs.003', pacs003, 'MndtId', ['BANK_B cobra 50 XXX a CUSTOMER_A en nombre de CUSTOMER_B, con el mandato MANDATE-001.', 'BANK_B collects 50 XXX from CUSTOMER_A on behalf of CUSTOMER_B, under mandate MANDATE-001.'], [...interbank, grpHdr,
    { id: 'ids', label: ['Identificadores', 'Identifiers'], help: ['EndToEndId y TxId del cobro.', 'EndToEndId and TxId of the collection.'], match: /\/PmtId(?:\/|$)/ },
    { id: 'amount', label: ['Importe y fechas', 'Amount and dates'], help: ['Cuánto, cuándo se liquida y cuándo se pide cobrar.', 'How much, when it settles and when collection is requested.'], match: /\/(?:IntrBkSttlmAmt|IntrBkSttlmDt|ReqdColltnDt|ChrgBr|PmtTpInf)(?:\/|$)/ },
    { id: 'mandate', label: ['Mandato', 'Mandate'], help: ['La autorización del deudor que justifica el cobro.', 'The debtor’s authorisation that justifies the collection.'], match: /\/DrctDbtTx(?:\/|$)/ }, parties]),
  'pacs.028': sample('pacs.028', pacs028, 'StsReqId', ['BANK_A no recibió respuesta sobre TX-001 y pregunta por su estado, en vez de reenviar el pago.', 'BANK_A got no answer about TX-001 and asks for its status instead of resending the payment.'], [...interbank, grpHdr, originals, agents]),
  'camt.053': sample('camt.053', camt053, 'Ntry', ['Extracto del día de CUSTOMER_B en BANK_B: saldo inicial, el abono de TX-001 y saldo final.', 'CUSTOMER_B’s daily statement at BANK_B: opening balance, the TX-001 credit and closing balance.'], [all, grpHdr,
    { id: 'account', label: ['Cuenta y periodo', 'Account and period'], help: ['Qué cuenta y qué fechas cubre el extracto.', 'Which account and dates the statement covers.'], match: /\/(?:Acct|FrToDt|Stmt\/Id|ElctrncSeqNb)(?:\/|$)/ },
    { id: 'balances', label: ['Saldos', 'Balances'], help: ['Saldo inicial (OPBD) y final (CLBD).', 'Opening (OPBD) and closing (CLBD) balances.'], match: /\/Bal(?:\[\d\])?(?:\/|$)/ },
    { id: 'entry', label: ['Movimiento', 'Entry'], help: ['El abono: importe, signo, estado, fechas y clasificación.', 'The credit: amount, sign, status, dates and classification.'], match: /\/Ntry(?:\/(?!NtryDtls)|$)/ },
    { id: 'details', label: ['Detalle del pago', 'Payment detail'], help: ['Las referencias y partes del pago que causó el movimiento.', 'The references and parties of the payment that caused the entry.'], match: /\/NtryDtls/ }]),
  'camt.054': sample('camt.054', camt054, 'Ntry', ['BANK_B avisa a CUSTOMER_B del abono de TX-001 en cuanto ocurre.', 'BANK_B notifies CUSTOMER_B of the TX-001 credit as soon as it happens.'], [all, grpHdr,
    { id: 'account', label: ['Cuenta', 'Account'], help: ['A qué cuenta se refiere el aviso.', 'Which account the notice refers to.'], match: /\/(?:Acct|Ntfctn\/Id)(?:\/|$)/ },
    { id: 'entry', label: ['Movimiento', 'Entry'], help: ['El abono: importe, signo, estado, fechas y clasificación.', 'The credit: amount, sign, status, dates and classification.'], match: /\/Ntry(?:\/(?!NtryDtls)|$)/ },
    { id: 'details', label: ['Detalle del pago', 'Payment detail'], help: ['Las referencias y partes del pago.', 'The payment references and parties.'], match: /\/NtryDtls/ }]),
  'camt.056': sample('camt.056', camt056, 'CxlRsnInf', ['BANK_A pide a BANK_B cancelar TX-002, un duplicado de TX-001 (motivo DUPL), y abre el caso CASE-001.', 'BANK_A asks BANK_B to cancel TX-002, a duplicate of TX-001 (reason DUPL), and opens case CASE-001.'], [...interbank,
    { id: 'case', label: ['Asignación y caso', 'Assignment and case'], help: ['Quién pide a quién y el número de caso.', 'Who asks whom and the case number.'], match: /\/(?:Assgnmt|Case)(?:\/|$)/ },
    { id: 'payment', label: ['Pago a cancelar', 'Payment to cancel'], help: ['Las referencias del pago duplicado.', 'The references of the duplicate payment.'], match: /\/Undrlyg\/TxInf(?:\/(?!CxlRsnInf)|$)/ },
    { id: 'reason', label: ['Motivo', 'Reason'], help: ['Por qué se pide cancelar.', 'Why cancellation is requested.'], match: /\/CxlRsnInf/ }]),
  'camt.029': sample('camt.029', camt029, 'Conf', ['BANK_B resuelve el caso CASE-001: acepta cancelar TX-002 (CNCL / ACCR). Los fondos volverán en un pacs.004.', 'BANK_B resolves case CASE-001: it accepts cancelling TX-002 (CNCL / ACCR). The funds will come back in a pacs.004.'], [...interbank,
    { id: 'case', label: ['Asignación y caso', 'Assignment and case'], help: ['Quién responde a quién y qué caso se resuelve.', 'Who answers whom and which case is resolved.'], match: /\/(?:Assgnmt|RslvdCase)(?:\/|$)/ },
    { id: 'result', label: ['Resultado', 'Outcome'], help: ['El resultado global del caso.', 'The overall outcome of the case.'], match: /\/RsltnOfInvstgtn\/Sts(?:\/|$)/ },
    { id: 'details', label: ['Detalle', 'Detail'], help: ['El estado de la cancelación del pago concreto.', 'The cancellation status of the specific payment.'], match: /\/CxlDtls/ }]),
  'camt.003': sample('camt.003', camt003, 'SchCrit', ['BANK_A consulta al sistema el saldo de su cuenta de liquidación antes de un pago grande.', 'BANK_A asks the system for its settlement account balance before a large payment.'], [...interbank,
    { id: 'msghdr', label: ['MsgHdr', 'MsgHdr'], help: ['Identificador y fecha de la consulta.', 'Identifier and date of the query.'], match: /\/MsgHdr(?:\/|$)/ },
    { id: 'search', label: ['Qué cuenta buscar', 'Which account to find'], help: ['Los criterios de búsqueda.', 'The search criteria.'], match: /\/SchCrit(?:\/|$)/ },
    { id: 'return', label: ['Qué devolver', 'What to return'], help: ['Los indicadores de qué datos se quieren.', 'The indicators of which data is wanted.'], match: /\/RtrCrit(?:\/|$)/ }]),
  'camt.004': sample('camt.004', camt004, 'MulBal', ['El sistema responde a BANK_A: su cuenta de liquidación tiene un saldo actual de 5000.00.', 'The system answers BANK_A: its settlement account has a current balance of 5000.00.'], [...interbank,
    { id: 'msghdr', label: ['MsgHdr', 'MsgHdr'], help: ['Identificador y la consulta a la que responde.', 'Identifier and the query it answers.'], match: /\/MsgHdr(?:\/|$)/ },
    { id: 'account', label: ['Cuenta', 'Account'], help: ['La cuenta informada.', 'The reported account.'], match: /\/(?:AcctId|Acct\/(?:Nm|Ccy))(?:\/|$)/ },
    { id: 'balance', label: ['Saldo', 'Balance'], help: ['El saldo: importe, signo, tipo y fecha.', 'The balance: amount, sign, type and date.'], match: /\/MulBal(?:\/|$)/ }]),
}

export const getXmlSample = (id?: string) => xmlSamples[id ?? 'pacs.008'] ?? xmlSamples['pacs.008']
