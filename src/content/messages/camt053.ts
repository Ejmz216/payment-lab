import type { MessageDefinition } from '@/types/content'

export const camt053: MessageDefinition = {
  id: 'camt.053',
  family: 'camt',
  number: '053',
  name: 'BankToCustomerStatement',
  shortDescription: 'A statement of transactions and balances on an account over a period, sent from a financial institution to an account owner.',
  businessArea: 'Cash Management',
  domain: 'Payments',
  purpose:
    'Reports the entries (debits and credits) and resulting balances on an account, typically covering a defined period (such as a business day), so the account owner can reconcile their own records against the institution\'s.',
  actors: ['Account Servicer', 'Account Owner'],
  lifecycleStage: ['settled', 'credited'],
  whatComesBefore: 'One or more settled transactions (which may include pacs.008-style credit transfers, among other entry types) that occurred on the account during the reported period.',
  whatComesAfter: 'The account owner reconciles the statement against their own transaction records, potentially opening an investigation for any discrepancy found.',
  relatedMessages: [
    { messageId: 'pacs.008', relation: 'related' },
    { messageId: 'camt.029', relation: 'related' },
  ],
  tags: ['reporting', 'reconciliation'],
  fastPaymentsRelevance: 'medium',
  coverage: 'basic-reference',
  versions: [
    {
      version: '001.13',
      fullIdentifier: 'camt.053.001.13',
      lastReviewed: '2026-01-01',
      status: 'illustrative',
      cardinalityNotes: 'Illustrative structure for educational purposes; this is a catalog/basic-reference entry, not a full deep dive. Version number not independently verified against the current ISO 20022 catalogue.',
      tree: {
        id: 'Document',
        name: 'Document',
        xmlTag: 'Document',
        businessMeaning: 'Root element of the message instance.',
        cardinality: '1..1',
        children: [
          {
            id: 'BkToCstmrStmt',
            name: 'BankToCustomerStatement',
            xmlTag: 'BkToCstmrStmt',
            businessMeaning: 'The statement business message.',
            cardinality: '1..1',
            children: [
              { id: 'GrpHdr', name: 'Group Header', xmlTag: 'GrpHdr', businessMeaning: 'Common information for the whole message.', cardinality: '1..1' },
              {
                id: 'Stmt',
                name: 'Statement',
                xmlTag: 'Stmt',
                businessMeaning: 'One occurrence per account being reported on, containing its balances and entries for the period.',
                cardinality: '1..n',
                children: [
                  { id: 'Acct', name: 'Account', xmlTag: 'Acct', businessMeaning: 'The account this statement reports on.', cardinality: '1..1' },
                  { id: 'Bal', name: 'Balance', xmlTag: 'Bal', businessMeaning: 'A balance on the account (e.g. opening, closing) as of a point in time.', cardinality: '0..n' },
                  { id: 'Ntry', name: 'Entry', xmlTag: 'Ntry', businessMeaning: 'One individual debit or credit entry on the account during the reported period.', cardinality: '0..n' },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
  sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-01-01', notes: 'Catalog-level entry; structure summarized for educational purposes.' }],
}
