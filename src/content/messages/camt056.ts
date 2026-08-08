import type { MessageDefinition } from '@/types/content'

export const camt056: MessageDefinition = {
  id: 'camt.056',
  family: 'camt',
  number: '056',
  name: 'FIToFIPaymentCancellationRequest',
  shortDescription: 'A financial institution asks another financial institution to cancel a previously sent payment instruction.',
  businessArea: 'Cash Management',
  domain: 'Payments',
  purpose:
    'Requests cancellation of a previously sent payment instruction (commonly pacs.008), typically because it was sent in error, is a suspected fraud, or is a duplicate — the interbank counterpart to a customer-initiated recall request.',
  actors: ['Instructing Agent', 'Instructed Agent'],
  lifecycleStage: ['accepted', 'settled'],
  whatComesBefore: 'A previously sent payment instruction (commonly pacs.008) that the sending institution now wants cancelled.',
  whatComesAfter: 'A resolution message (commonly camt.029) reporting whether the cancellation was accepted, rejected, or the funds were recovered.',
  relatedMessages: [
    { messageId: 'pacs.008', relation: 'related' },
    { messageId: 'camt.029', relation: 'commonly-follows' },
  ],
  tags: ['cancellation', 'exception'],
  fastPaymentsRelevance: 'medium',
  coverage: 'catalog-only',
  versions: [
    {
      version: '001.11',
      fullIdentifier: 'camt.056.001.11',
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
            id: 'FIToFIPmtCxlReq',
            name: 'FIToFIPaymentCancellationRequest',
            xmlTag: 'FIToFIPmtCxlReq',
            businessMeaning: 'The payment cancellation request business message.',
            cardinality: '1..1',
            children: [
              { id: 'Assgnmt', name: 'Assignment', xmlTag: 'Assgnmt', businessMeaning: 'Identifies who is requesting the cancellation and from whom.', cardinality: '1..1' },
              { id: 'Undrlyg', name: 'Underlying Transaction Information', xmlTag: 'Undrlyg', businessMeaning: 'References the original payment instruction and the reason for requesting cancellation.', cardinality: '1..n' },
            ],
          },
        ],
      },
    },
  ],
  sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08', notes: 'Catalog-level entry only; message name verified via web search, exact current version number not independently confirmed (marked illustrative), field structure is an illustrative skeleton.' }],
}
