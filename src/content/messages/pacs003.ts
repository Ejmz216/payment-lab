import type { MessageDefinition } from '@/types/content'

export const pacs003: MessageDefinition = {
  id: 'pacs.003',
  family: 'pacs',
  number: '003',
  name: 'FinancialInstitutionDirectDebitTransfer',
  shortDescription: 'A financial institution to financial institution message used to move funds by direct debit rather than credit transfer.',
  businessArea: 'Payments Clearing & Settlement',
  domain: 'Payments',
  purpose:
    'Carries the information needed for a financial institution to collect (pull) funds from a debtor\'s account on behalf of a creditor, based on a pre-existing mandate — the direct-debit counterpart to the credit-push flow carried by pacs.008.',
  actors: ['Creditor Agent', 'Debtor Agent'],
  lifecycleStage: ['initiated', 'accepted'],
  whatComesBefore: 'A direct debit mandate previously agreed between debtor and creditor, and typically a customer-facing direct debit initiation from the creditor\'s side.',
  whatComesAfter: 'A status report (commonly pacs.002), or — if the debit cannot be honored — a return or reject flow.',
  relatedMessages: [
    { messageId: 'pacs.008', relation: 'related' },
    { messageId: 'pacs.002', relation: 'commonly-follows' },
    { messageId: 'pacs.004', relation: 'related' },
  ],
  tags: ['direct-debit'],
  fastPaymentsRelevance: 'low',
  coverage: 'catalog-only',
  versions: [
    {
      version: '001.12',
      fullIdentifier: 'pacs.003.001.12',
      lastReviewed: '2026-08-08',
      status: 'illustrative',
      cardinalityNotes: 'Catalog-only entry: name and version checked against public ISO 20022 message catalogue listings, but the field tree below is a minimal illustrative skeleton, not a verified structure. Do not rely on it for implementation.',
      tree: {
        id: 'Document',
        name: 'Document',
        xmlTag: 'Document',
        businessMeaning: 'Root element of the message instance.',
        cardinality: '1..1',
        children: [
          {
            id: 'FIToFICstmrDrctDbt',
            name: 'FIToFICustomerDirectDebit',
            xmlTag: 'FIToFICstmrDrctDbt',
            businessMeaning: 'The direct debit business message.',
            cardinality: '1..1',
            children: [
              { id: 'GrpHdr', name: 'Group Header', xmlTag: 'GrpHdr', businessMeaning: 'Common information for the batch of direct debit instructions.', cardinality: '1..1' },
              { id: 'DrctDbtTxInf', name: 'Direct Debit Transaction Information', xmlTag: 'DrctDbtTxInf', businessMeaning: 'One or more individual direct debit transactions, each with mandate reference, amount, debtor and creditor details.', cardinality: '1..n' },
            ],
          },
        ],
      },
    },
  ],
  sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08', notes: 'Catalog-level entry only; message name and version verified via web search, field structure is an illustrative skeleton and not independently verified against the XSD.' }],
}
