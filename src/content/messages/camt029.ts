import type { MessageDefinition } from '@/types/content'

export const camt029: MessageDefinition = {
  id: 'camt.029',
  family: 'camt',
  number: '029',
  name: 'ResolutionOfInvestigation',
  shortDescription: 'Reports the outcome of an investigation opened about a previous payment or case.',
  businessArea: 'Cash Management',
  domain: 'Payments',
  purpose:
    'Communicates the resolution (or current status) of an investigation — for example, confirming that a payment was located and processed, or that funds are being returned — typically referencing the original case and transaction.',
  actors: ['Assigning Party', 'Assignee'],
  lifecycleStage: ['settled', 'credited'],
  whatComesBefore: 'An investigation case being opened about a specific payment, often after a discrepancy is found during reconciliation or a customer inquiry.',
  whatComesAfter: 'The party that opened the investigation acts on the resolution — closing the case, informing the customer, or triggering further action such as a return.',
  relatedMessages: [
    { messageId: 'pacs.004', relation: 'related' },
    { messageId: 'camt.053', relation: 'related' },
  ],
  tags: ['investigation', 'exception'],
  fastPaymentsRelevance: 'medium',
  coverage: 'basic-reference',
  versions: [
    {
      version: '001.13',
      fullIdentifier: 'camt.029.001.13',
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
            id: 'RsltnOfInvstgtn',
            name: 'ResolutionOfInvestigation',
            xmlTag: 'RsltnOfInvstgtn',
            businessMeaning: 'The investigation resolution business message.',
            cardinality: '1..1',
            children: [
              { id: 'Assgnmt', name: 'Assignment', xmlTag: 'Assgnmt', businessMeaning: 'Identifies who assigned the case to whom (the parties handling the investigation).', cardinality: '1..1' },
              { id: 'Sts', name: 'Status', xmlTag: 'Sts', businessMeaning: 'The current status or outcome of the investigation.', cardinality: '0..1' },
              { id: 'CxlDtls', name: 'Cancellation Details', xmlTag: 'CxlDtls', businessMeaning: 'Details of the original transaction(s) the investigation concerns, when relevant.', cardinality: '0..n' },
            ],
          },
        ],
      },
    },
  ],
  sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-01-01', notes: 'Catalog-level entry; structure summarized for educational purposes.' }],
}
