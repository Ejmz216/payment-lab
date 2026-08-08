import type { MessageDefinition } from '@/types/content'

export const camt054: MessageDefinition = {
  id: 'camt.054',
  family: 'camt',
  number: '054',
  name: 'BankToCustomerDebitCreditNotification',
  shortDescription: 'Notifies an account holder of individual debit and/or credit entries as they occur, rather than a full periodic statement.',
  businessArea: 'Cash Management',
  domain: 'Payments',
  purpose:
    'Reports individual booked entries (debits and/or credits) on an account close to real time, so the account holder can reconcile transaction-by-transaction rather than waiting for a periodic statement such as camt.053.',
  actors: ['Account Servicer', 'Account Owner'],
  lifecycleStage: ['settled', 'credited'],
  whatComesBefore: 'A transaction (which can include credit transfers such as pacs.008) settling on the reported account.',
  whatComesAfter: 'The account holder reconciles the individual entry against its own records, potentially aggregated later into a periodic statement.',
  relatedMessages: [
    { messageId: 'camt.053', relation: 'related' },
    { messageId: 'pacs.008', relation: 'related' },
  ],
  tags: ['reporting'],
  fastPaymentsRelevance: 'medium',
  coverage: 'catalog-only',
  versions: [
    {
      version: '001.13',
      fullIdentifier: 'camt.054.001.13',
      lastReviewed: '2026-08-08',
      status: 'illustrative',
      cardinalityNotes: 'Catalog-only entry: the exact current catalogue version number could not be independently confirmed at time of writing, so it should be treated as approximate/illustrative — verify against the official ISO 20022 catalogue before relying on it. The field tree below is a minimal illustrative skeleton, not a verified structure.',
      tree: {
        id: 'Document',
        name: 'Document',
        xmlTag: 'Document',
        businessMeaning: 'Root element of the message instance.',
        cardinality: '1..1',
        children: [
          {
            id: 'BkToCstmrDbtCdtNtfctn',
            name: 'BankToCustomerDebitCreditNotification',
            xmlTag: 'BkToCstmrDbtCdtNtfctn',
            businessMeaning: 'The debit/credit notification business message.',
            cardinality: '1..1',
            children: [
              { id: 'GrpHdr', name: 'Group Header', xmlTag: 'GrpHdr', businessMeaning: 'Common information for the notification.', cardinality: '1..1' },
              { id: 'Ntfctn', name: 'Notification', xmlTag: 'Ntfctn', businessMeaning: 'One notification per account, containing the individual entries being reported.', cardinality: '1..n' },
            ],
          },
        ],
      },
    },
  ],
  sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08', notes: 'Catalog-level entry only; message name verified via web search, exact current version number not independently confirmed (marked illustrative), field structure is an illustrative skeleton.' }],
}
