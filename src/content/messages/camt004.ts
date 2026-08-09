import type { MessageDefinition, MessageFieldNode } from '@/types/content'

const camt004Tree: MessageFieldNode = {
  id: 'Document',
  name: 'Document',
  xmlTag: 'Document',
  businessMeaning: 'Root element wrapping the account response message instance.',
  cardinality: '1..1',
  children: [
    {
      id: 'RtrAcct',
      name: 'ReturnAccount',
      xmlTag: 'RtrAcct',
      businessMeaning: 'The business message returning account details and balance information.',
      cardinality: '1..1',
      children: [
        {
          id: 'MsgId',
          name: 'Message Identification',
          xmlTag: 'MsgId',
          businessMeaning: 'Identifier for this account response message itself.',
          cardinality: '1..1',
          exampleValue: 'MSG-ACCT-RETURN-001',
        },
        {
          id: 'RptOrErr',
          name: 'Report Or Error',
          xmlTag: 'RptOrErr',
          businessMeaning: 'Carries either the requested account information or an error response if the query cannot be fulfilled.',
          cardinality: '1..1',
          children: [
            {
              id: 'AcctRpt',
              name: 'Account Report',
              xmlTag: 'AcctRpt',
              businessMeaning: 'Details about the account(s) returned by the transaction administrator/account servicer.',
              cardinality: '0..n',
            },
          ],
        },
      ],
    },
  ],
}

export const camt004: MessageDefinition = {
  id: 'camt.004',
  family: 'camt',
  number: '004',
  name: 'ReturnAccount',
  shortDescription: 'Returns account details or balance information, commonly in response to camt.003 GetAccount.',
  businessArea: 'Cash Management',
  domain: 'Payments',
  purpose:
    'Provides information about one or more accounts held at a transaction administrator/account servicer, including account details and balances. It can respond to camt.003 or be sent as an account-information notification in some schemes.',
  actors: ['Transaction Administrator / Account Servicer', 'Member / Account Owner'],
  lifecycleStage: ['investigation', 'liquidity-check', 'account-response'],
  whatComesBefore: 'A GetAccount request, commonly camt.003, or a scheme-defined account notification trigger.',
  whatComesAfter: 'The receiver uses the returned account or balance information for monitoring, investigation, liquidity management, or reconciliation.',
  relatedMessages: [
    { messageId: 'camt.003', relation: 'related' },
    { messageId: 'pacs.004', relation: 'related' },
  ],
  tags: ['cash-management', 'account-response', 'spi-rd-study'],
  fastPaymentsRelevance: 'medium',
  coverage: 'basic-reference',
  versions: [
    {
      version: '001.10',
      fullIdentifier: 'camt.004.001.10',
      lastReviewed: '2026-08-09',
      status: 'illustrative',
      cardinalityNotes:
        'Illustrative educational skeleton based on public ISO 20022 references and public TARGET/ECMS examples. Confirm exact version and structure against the official ISO catalogue or the relevant scheme implementation guide.',
      tree: camt004Tree,
    },
  ],
  commonMistakes: [
    {
      title: 'Same number, different family',
      explanation:
        'camt.004 ReturnAccount and pacs.004 PaymentReturn are unrelated business messages. Always read the family prefix before interpreting the number.',
    },
  ],
  sources: [
    {
      sourceName: 'ISO 20022 public message references',
      sourceType: 'ISO',
      lastReviewed: '2026-08-09',
      notes: 'Public ISO/ECB references identify camt.004 as ReturnAccount. Field tree is a minimal teaching skeleton.',
    },
  ],
}
