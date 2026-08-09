import type { MessageDefinition, MessageFieldNode } from '@/types/content'

const camt003Tree: MessageFieldNode = {
  id: 'Document',
  name: 'Document',
  xmlTag: 'Document',
  businessMeaning: 'Root element wrapping the account query message instance.',
  cardinality: '1..1',
  children: [
    {
      id: 'GetAcct',
      name: 'GetAccount',
      xmlTag: 'GetAcct',
      businessMeaning: 'The business message requesting information about one or more accounts held at a transaction administrator/account servicer.',
      cardinality: '1..1',
      children: [
        {
          id: 'MsgId',
          name: 'Message Identification',
          xmlTag: 'MsgId',
          businessMeaning: 'Identifier for this account query message itself.',
          cardinality: '1..1',
          dataType: 'Max35Text',
          commonMistakes: 'Treating it as a payment transaction identifier. It identifies the query envelope, not a pacs.008 credit transfer.',
          exampleValue: 'MSG-ACCT-QUERY-001',
        },
        {
          id: 'AcctQryDef',
          name: 'Account Query Definition',
          xmlTag: 'AcctQryDef',
          businessMeaning: 'Defines what account information is being requested and which criteria should be used to find the account.',
          cardinality: '1..1',
          children: [
            {
              id: 'AcctCrit',
              name: 'Account Criteria',
              xmlTag: 'AcctCrit',
              businessMeaning: 'Search criteria used to identify the account(s) whose details or balances are requested.',
              cardinality: '1..1',
              children: [
                {
                  id: 'AcctId',
                  name: 'Account Identification',
                  xmlTag: 'AcctId',
                  businessMeaning: 'The account identifier being queried, such as an account number or IBAN-like account reference where the scheme supports it.',
                  cardinality: '0..1',
                  exampleValue: 'ACCOUNT-001',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const camt003: MessageDefinition = {
  id: 'camt.003',
  family: 'camt',
  number: '003',
  name: 'GetAccount',
  shortDescription: 'Requests information about account details and balances; it is a cash-management query, not a payment instruction.',
  businessArea: 'Cash Management',
  domain: 'Payments',
  purpose:
    'Used to ask an account servicer or transaction administrator for information about one or more accounts, including account details and balances. In an instant-payment operations context, this is useful for liquidity/account-state visibility, not for moving customer funds.',
  actors: ['Member / Account Owner', 'Transaction Administrator / Account Servicer'],
  lifecycleStage: ['investigation', 'liquidity-check', 'account-query'],
  whatComesBefore:
    'An operational need to know account details, balance, liquidity, or account state before or after payment processing. For the Dominican Republic SPI/SGPI case study, whether camt.003 is part of the public scheme flow is TO VERIFY.',
  whatComesAfter:
    'A ReturnAccount response, commonly camt.004, may provide the requested account details or balances. This camt.004 is not pacs.004 PaymentReturn.',
  relatedMessages: [
    { messageId: 'camt.004', relation: 'related' },
    { messageId: 'pacs.008', relation: 'related' },
    { messageId: 'pacs.004', relation: 'related' },
  ],
  tags: ['cash-management', 'account-query', 'spi-rd-study'],
  fastPaymentsRelevance: 'high',
  coverage: 'detailed-reference',
  versions: [
    {
      version: '001.08',
      fullIdentifier: 'camt.003.001.08',
      lastReviewed: '2026-08-09',
      status: 'illustrative',
      reviewedAgainstCatalogue: '2026-08-09',
      cardinalityNotes:
        'Illustrative educational skeleton based on public ISO 20022 references and public TARGET/ECMS examples. Confirm the exact camt.003 version and full XSD against the official ISO catalogue or the relevant scheme implementation guide before relying on it technically. No public BCRD source reviewed here confirms camt.003 usage inside SPI/SGPI.',
      tree: camt003Tree,
    },
  ],
  commonMistakes: [
    {
      title: 'Confusing account queries with payment movement',
      explanation:
        'camt.003 asks for account information. It does not instruct BANK_B to credit CUSTOMER_B; that interbank credit-transfer concept is pacs.008-style.',
    },
    {
      title: 'Confusing camt.004 with pacs.004',
      explanation:
        'camt.004 is ReturnAccount, the response side of an account query. pacs.004 is PaymentReturn, used to return a payment that already progressed.',
    },
  ],
  sources: [
    {
      sourceName: 'ISO 20022 public message references',
      sourceType: 'ISO',
      lastReviewed: '2026-08-09',
      notes: 'Public ISO/ECB references identify camt.003 as GetAccount and camt.004 as ReturnAccount. Field tree is a minimal teaching skeleton.',
    },
    {
      sourceName: 'Banco Central de la Republica Dominicana - SGPI public information',
      sourceType: 'central-bank',
      lastReviewed: '2026-08-09',
      notes: 'Used only for public scheme context; no exact ISO message assignment is inferred for SPI/SGPI steps.',
    },
  ],
}
