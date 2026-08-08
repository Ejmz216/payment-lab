import type { MessageDefinition } from '@/types/content'

export const pain001: MessageDefinition = {
  id: 'pain.001',
  family: 'pain',
  number: '001',
  name: 'CustomerCreditTransferInitiation',
  shortDescription: 'A customer instructs its financial institution to initiate one or more credit transfers.',
  businessArea: 'Payments Initiation',
  domain: 'Payments',
  purpose:
    'Carries a customer\'s instruction to their financial institution to move funds to one or more creditors. This is the customer-facing initiation step, distinct from the interbank transfer that follows.',
  actors: ['Debtor', 'Debtor Agent', 'Ultimate Debtor'],
  lifecycleStage: ['initiated'],
  whatComesBefore: 'A customer decision to make a payment (e.g. through a banking channel, ERP, or payment file).',
  whatComesAfter: 'The financial institution typically generates an interbank message (commonly a pacs.008-style message) to move the payment onward — this is scheme/implementation dependent.',
  relatedMessages: [{ messageId: 'pacs.008', relation: 'commonly-precedes' }],
  tags: ['initiation', 'customer-facing'],
  fastPaymentsRelevance: 'high',
  coverage: 'basic-reference',
  versions: [
    {
      version: '001.12',
      fullIdentifier: 'pain.001.001.12',
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
            id: 'CstmrCdtTrfInitn',
            name: 'CustomerCreditTransferInitiation',
            xmlTag: 'CstmrCdtTrfInitn',
            businessMeaning: 'The customer initiation business message.',
            cardinality: '1..1',
            children: [
              { id: 'GrpHdr', name: 'Group Header', xmlTag: 'GrpHdr', businessMeaning: 'Common information for the whole message.', cardinality: '1..1' },
              {
                id: 'PmtInf',
                name: 'Payment Information',
                xmlTag: 'PmtInf',
                businessMeaning: 'A group of one or more transactions sharing common debit-side information (e.g. same Debtor and Debtor Agent).',
                cardinality: '1..n',
                children: [
                  { id: 'Dbtr', name: 'Debtor', xmlTag: 'Dbtr', businessMeaning: 'The customer instructing the payment.', cardinality: '1..1' },
                  { id: 'DbtrAcct', name: 'Debtor Account', xmlTag: 'DbtrAcct', businessMeaning: 'The account to be debited.', cardinality: '1..1' },
                  { id: 'CdtTrfTxInf', name: 'Credit Transfer Transaction Information', xmlTag: 'CdtTrfTxInf', businessMeaning: 'One occurrence per individual credit transfer requested by the customer.', cardinality: '1..n' },
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
