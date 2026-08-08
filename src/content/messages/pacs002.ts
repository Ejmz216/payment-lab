import type { MessageDefinition } from '@/types/content'

export const pacs002: MessageDefinition = {
  id: 'pacs.002',
  family: 'pacs',
  number: '002',
  name: 'FIToFIPaymentStatusReport',
  shortDescription: 'Reports the status of a previously sent payment instruction between financial institutions.',
  businessArea: 'Payments Clearing and Settlement',
  domain: 'Payments',
  purpose:
    'Communicates the status (e.g. accepted, rejected, pending) of one or more previously received payment instructions, referencing the original message and/or transaction identifiers, plus reason information when relevant.',
  actors: ['Instructing Agent', 'Instructed Agent', 'Debtor Agent', 'Creditor Agent'],
  lifecycleStage: ['validated', 'accepted', 'cleared', 'settled'],
  whatComesBefore: 'Typically follows a pacs.008 (or another instruction message) that this report is providing status for.',
  whatComesAfter: 'The receiving institution acts on the reported status: continues processing, investigates a rejection, or takes no further action if accepted.',
  relatedMessages: [
    { messageId: 'pacs.008', relation: 'status-of' },
    { messageId: 'pacs.004', relation: 'related' },
  ],
  tags: ['status', 'core', 'fast-payments'],
  fastPaymentsRelevance: 'critical',
  coverage: 'detailed-reference',
  versions: [
    {
      version: '001.14',
      fullIdentifier: 'pacs.002.001.14',
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
            id: 'FIToFIPmtStsRpt',
            name: 'FIToFIPaymentStatusReport',
            xmlTag: 'FIToFIPmtStsRpt',
            businessMeaning: 'The status report business message.',
            cardinality: '1..1',
            children: [
              {
                id: 'GrpHdr',
                name: 'Group Header',
                xmlTag: 'GrpHdr',
                businessMeaning: 'Common information for the whole report (message id, creation time).',
                cardinality: '1..1',
              },
              {
                id: 'TxInfAndSts',
                name: 'Transaction Information And Status',
                xmlTag: 'TxInfAndSts',
                businessMeaning: 'One occurrence per transaction being reported on.',
                cardinality: '0..n',
                children: [
                  {
                    id: 'OrgnlEndToEndId',
                    name: 'Original End To End Identification',
                    xmlTag: 'OrgnlEndToEndId',
                    businessMeaning: 'The EndToEndId of the original transaction this status refers to — the key to correlating status back to the original pacs.008.',
                    cardinality: '0..1',
                    whyItMatters: 'This is usually the most reliable field for tracing a status report back to the original payment.',
                  },
                  {
                    id: 'TxSts',
                    name: 'Transaction Status',
                    xmlTag: 'TxSts',
                    businessMeaning: 'The reported status of the transaction (e.g. accepted, rejected, pending), expressed using a code from an external code set.',
                    cardinality: '0..1',
                  },
                  {
                    id: 'StsRsnInf',
                    name: 'Status Reason Information',
                    xmlTag: 'StsRsnInf',
                    businessMeaning: 'Reason(s) explaining the reported status, typically including a reason code.',
                    cardinality: '0..n',
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
