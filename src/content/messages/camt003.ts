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
          id: 'MsgHdr',
          name: 'Message Header',
          xmlTag: 'MsgHdr',
          businessMeaning: 'Identifies the query and can state the request type selected by the applicable usage profile.',
          cardinality: '1..1',
          children: [
            {
              id: 'MsgId',
              name: 'Message Identification',
              xmlTag: 'MsgId',
              businessMeaning: 'Identifier assigned to this GetAccount query message.',
              cardinality: '1..1',
              dataType: 'Max35Text',
              whyItMatters: 'Use it to distinguish and trace the query itself; it is not a payment EndToEndId or TxId.',
              commonMistakes: 'Treating it as a payment transaction identifier. It identifies the account query, not a pacs.008 credit transfer.',
              exampleValue: 'MSG-ACCT-QUERY-001',
            },
            {
              id: 'ReqTp',
              name: 'Request Type',
              xmlTag: 'ReqTp',
              businessMeaning: 'Specifies the kind of account query using a code or a proprietary value defined by the applicable profile.',
              cardinality: '0..1',
              whyItMatters: 'A scheme or service profile can use this value to distinguish balance, liquidity or other supported query purposes.',
              commonMistakes: 'Assuming one proprietary request code is universal. The allowed values belong to the selected usage profile.',
              exampleValue: 'BALANCE_QUERY',
            },
          ],
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
              cardinality: '0..1',
              children: [
                {
                  id: 'NewCrit',
                  name: 'New Criteria',
                  xmlTag: 'NewCrit',
                  businessMeaning: 'Introduces the search criteria used for this account query.',
                  cardinality: '1..1',
                  children: [
                    {
                      id: 'SchCrit',
                      name: 'Search Criteria',
                      xmlTag: 'SchCrit',
                      businessMeaning: 'Groups the account attributes used to restrict the query.',
                      cardinality: '1..1',
                      children: [
                        {
                          id: 'AcctId',
                          name: 'Account Identification Criterion',
                          xmlTag: 'AcctId',
                          businessMeaning: 'Matches the account identifier being queried, according to the account-identification choices allowed by the profile.',
                          cardinality: '0..1',
                          whyItMatters: 'This is part of the search criteria. It identifies the account to look up; it does not identify a payment transaction.',
                          commonMistakes: 'Looking for EndToEndId here. GetAccount searches account data, not a customer credit-transfer transaction.',
                          exampleValue: 'ACCOUNT-001',
                        },
                        {
                          id: 'Ccy',
                          name: 'Currency',
                          xmlTag: 'Ccy',
                          businessMeaning: 'Optionally restricts the account query to a currency supported by the applicable profile.',
                          cardinality: '0..1',
                          dataType: 'ActiveOrHistoricCurrencyCode',
                          exampleValue: 'XXX',
                        },
                        {
                          id: 'AcctOwnr',
                          name: 'Account Owner Criterion',
                          xmlTag: 'AcctOwnr',
                          businessMeaning: 'Optionally restricts the search using the account owner identity.',
                          cardinality: '0..1',
                        },
                        {
                          id: 'AcctSvcr',
                          name: 'Account Servicer Criterion',
                          xmlTag: 'AcctSvcr',
                          businessMeaning: 'Optionally restricts the search using the institution that services the account.',
                          cardinality: '0..1',
                        },
                      ],
                    },
                  ],
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
    'Used to ask an account servicer or transaction administrator for account information selected by query criteria. Public Eurosystem profiles demonstrate balance and liquidity-oriented uses. It asks a question about an account; it does not move customer funds or report the status of a pacs.008 payment.',
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
  coverage: 'full-lesson',
  versions: [
    {
      version: '001.08',
      fullIdentifier: 'camt.003.001.08',
      lastReviewed: '2026-08-09',
      status: 'current-iso',
      reviewedAgainstCatalogue: '2026-08-09',
      cardinalityNotes:
        'The ISO catalogue lists camt.003.001.08 as the current GetAccount version. The tree shown here is a selected educational path through MsgHdr and account search criteria, not the complete XSD. A scheme profile determines allowed request types, supported criteria and mandatory usage. No public BCRD source reviewed here confirms camt.003 usage inside SPI/SGPI.',
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
      sourceReference: 'https://www.iso20022.org/iso-20022-message-definitions?search=cash+management',
      lastReviewed: '2026-08-09',
      notes: 'The official catalogue lists camt.003.001.08 as GetAccountV08 and camt.004.001.10 as ReturnAccountV10.',
    },
    {
      sourceName: 'Eurosystem ESMIG User Detailed Functional Specifications R2026.JUN',
      sourceType: 'official-documentation',
      sourceReference: 'https://www.bundesbank.de/resource/blob/914244/2316c2e2d1502875253c77b851f8b0f0/472B63F073F071307366337C94F8C870/udfs-esmig-r2026jun-data.pdf',
      lastReviewed: '2026-08-09',
      notes: 'Public example confirms the GetAcct, MsgHdr, ReqTp, AcctQryDef and account search-criteria path used in this teaching subset.',
    },
    {
      sourceName: 'Banco Central de la Republica Dominicana - SGPI public information',
      sourceType: 'central-bank',
      sourceReference: 'https://www.bancentral.gov.do/a/d/6142-sistema-de-gestion-de-pagos-instantaneos-sgpi',
      lastReviewed: '2026-08-09',
      notes: 'Used only for public scheme context; no exact ISO message assignment is inferred for SPI/SGPI steps.',
    },
  ],
}
