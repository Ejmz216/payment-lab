import type { MessageDefinition, MessageFieldNode } from '@/types/content'

const pacs004Tree: MessageFieldNode = {
  id: 'Document',
  name: 'Document',
  xmlTag: 'Document',
  businessMeaning: 'Root element of the message instance.',
  cardinality: '1..1',
  children: [
    {
      id: 'PmtRtr',
      name: 'PaymentReturn',
      xmlTag: 'PmtRtr',
      businessMeaning: 'The payment return business message.',
      cardinality: '1..1',
      children: [
        {
          id: 'GrpHdr',
          name: 'Group Header',
          xmlTag: 'GrpHdr',
          businessMeaning: 'Common information for the whole message.',
          cardinality: '1..1',
          children: [
            {
              id: 'MsgId',
              name: 'Message Identification',
              xmlTag: 'MsgId',
              businessMeaning: 'Unique identifier assigned by the sender to this return message itself — distinct from the identifiers of the original payment being returned.',
              cardinality: '1..1',
              dataType: 'Max35Text',
              commonMistakes: 'Assuming this MsgId relates to the original payment — it identifies this return envelope, not the original pacs.008.',
              exampleValue: 'MSG-2026-000789',
            },
          ],
        },
        {
          id: 'TxInf',
          name: 'Transaction Information',
          xmlTag: 'TxInf',
          businessMeaning: 'One occurrence per returned transaction.',
          cardinality: '1..n',
          children: [
            {
              id: 'OrgnlEndToEndId',
              name: 'Original End To End Identification',
              xmlTag: 'OrgnlEndToEndId',
              businessMeaning: 'The EndToEndId of the original payment being returned.',
              cardinality: '0..1',
              whyItMatters: 'Typically the field a "Trace original payment" action would match on first — but the full original transaction reference block below often carries additional context useful for tracing too.',
              exampleValue: 'E2E-ALICE-BOB-0001',
            },
            {
              id: 'RtrdIntrBkSttlmAmt',
              name: 'Returned Interbank Settlement Amount',
              xmlTag: 'RtrdIntrBkSttlmAmt',
              businessMeaning: 'The amount being returned, which may differ from the original amount (e.g. if charges were deducted).',
              cardinality: '1..1',
            },
            {
              id: 'RtrRsnInf',
              name: 'Return Reason Information',
              xmlTag: 'RtrRsnInf',
              businessMeaning: 'Reason(s) for the return, typically including a reason code (e.g. account closed, invalid account).',
              cardinality: '0..n',
            },
            {
              id: 'OrgnlTxRef',
              name: 'Original Transaction Reference',
              xmlTag: 'OrgnlTxRef',
              businessMeaning: 'A set of key details copied from the original transaction (parties, agents, amount) to give context to the return without requiring a lookup.',
              cardinality: '0..1',
            },
          ],
        },
      ],
    },
  ],
}

export const pacs004: MessageDefinition = {
  id: 'pacs.004',
  family: 'pacs',
  number: '004',
  name: 'PaymentReturn',
  shortDescription: 'Sends a payment that already progressed toward settlement back to the original debtor side, when it cannot ultimately be completed.',
  businessArea: 'Payments Clearing and Settlement',
  domain: 'Payments',
  purpose:
    'Used when a payment that already progressed past acceptance cannot ultimately be completed, so it is returned — carrying references back to the original transaction, the returned amount, and the reason. Exactly which point in the lifecycle triggers a return (e.g. after settlement, or after a failed attempt to credit the beneficiary) depends on the payment scheme; ISO 20022 itself does not mandate a single universal trigger.',
  actors: ['Creditor Agent', 'Debtor Agent', 'Instructing Agent', 'Instructed Agent'],
  lifecycleStage: ['settled', 'credited'],
  whatComesBefore: 'A previously sent credit transfer (commonly represented as a pacs.008-style message) that had already progressed past acceptance, but could not ultimately be completed — the precise trigger point is scheme-dependent, not a fixed ISO rule.',
  whatComesAfter: 'The original debtor side receives the returned funds/payment and reconciles it against the original transaction.',
  relatedMessages: [
    { messageId: 'pacs.008', relation: 'returns' },
    { messageId: 'pacs.002', relation: 'related' },
  ],
  tags: ['return', 'exception', 'core', 'fast-payments'],
  fastPaymentsRelevance: 'critical',
  coverage: 'detailed-reference',
  versions: [
    {
      version: '001.15',
      fullIdentifier: 'pacs.004.001.15',
      lastReviewed: '2026-08-08',
      status: 'current-iso',
      reviewedAgainstCatalogue: '2026-08-08',
      cardinalityNotes: 'Illustrative structure for educational purposes; confirm exact cardinalities against the official XSD before relying on them technically.',
      tree: pacs004Tree,
    },
    {
      version: '001.13',
      fullIdentifier: 'pacs.004.001.13',
      lastReviewed: '2026-01-01',
      status: 'archived-iso',
      cardinalityNotes: 'Shown for illustration of version history. Still seen in some existing scheme/implementation deployments.',
      tree: pacs004Tree,
    },
  ],
  commonMistakes: [
    { title: 'Treating "settled" as automatically meaning "credited"', explanation: 'Settlement between institutions and crediting the beneficiary account are distinct steps. A return can be triggered by a failure at either point, or others — the exact trigger is defined by the scheme, not by ISO 20022 itself.' },
  ],
  sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08', notes: 'Version number (pacs.004.001.15) checked against the public ISO 20022 message definitions catalogue on 2026-08-08.' }],
}
