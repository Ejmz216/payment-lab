import type { MessageDefinition } from '@/types/content'

export const pacs004: MessageDefinition = {
  id: 'pacs.004',
  family: 'pacs',
  number: '004',
  name: 'PaymentReturn',
  shortDescription: 'Sends a previously settled/credited payment back to the original debtor side.',
  businessArea: 'Payments Clearing and Settlement',
  domain: 'Payments',
  purpose:
    'Used when a payment that already progressed (was accepted/settled) cannot ultimately be completed, so it is returned — carrying references back to the original transaction, the returned amount, and the reason.',
  actors: ['Creditor Agent', 'Debtor Agent', 'Instructing Agent', 'Instructed Agent'],
  lifecycleStage: ['settled', 'credited'],
  whatComesBefore: 'A previously sent and accepted/settled credit transfer (commonly represented as a pacs.008-style message) that could not ultimately be completed on the receiving side.',
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
      version: '001.13',
      fullIdentifier: 'pacs.004.001.13',
      lastReviewed: '2026-01-01',
      cardinalityNotes: 'Illustrative structure for educational purposes.',
      tree: {
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
                    businessMeaning: 'The EndToEndId of the original payment being returned — the primary key for tracing the return back to the original pacs.008.',
                    cardinality: '0..1',
                    whyItMatters: 'This is what a "Trace original payment" action would match on conceptually.',
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
      },
    },
  ],
  sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-01-01', notes: 'Structure summarized for educational purposes.' }],
}
