import type { MessageDefinition } from '@/types/content'

export const pacs028: MessageDefinition = {
  id: 'pacs.028',
  family: 'pacs',
  number: '028',
  name: 'FIToFIPaymentStatusRequest',
  shortDescription: 'A financial institution asks another financial institution for the current status of a previously sent payment.',
  businessArea: 'Payments Clearing & Settlement',
  domain: 'Payments',
  purpose:
    'Used when the sender of a payment instruction (commonly pacs.008) has not received a status report within an expected time, and explicitly requests the current status rather than waiting — common in fast payment schemes where timeouts must be resolved quickly.',
  actors: ['Instructing Agent', 'Instructed Agent'],
  lifecycleStage: ['accepted', 'settled'],
  whatComesBefore: 'A previously sent payment instruction (commonly pacs.008) for which no status has been received within the expected window.',
  whatComesAfter: 'A status report (commonly pacs.002) answering the request.',
  relatedMessages: [
    { messageId: 'pacs.008', relation: 'related' },
    { messageId: 'pacs.002', relation: 'commonly-follows' },
  ],
  tags: ['status-reporting', 'exception'],
  fastPaymentsRelevance: 'medium',
  coverage: 'catalog-only',
  versions: [
    {
      version: '001.07',
      fullIdentifier: 'pacs.028.001.07',
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
            id: 'FIToFIPmtStsReq',
            name: 'FIToFIPaymentStatusRequest',
            xmlTag: 'FIToFIPmtStsReq',
            businessMeaning: 'The payment status request business message.',
            cardinality: '1..1',
            children: [
              { id: 'GrpHdr', name: 'Group Header', xmlTag: 'GrpHdr', businessMeaning: 'Common information for the status request.', cardinality: '1..1' },
              { id: 'TxInf', name: 'Transaction Information', xmlTag: 'TxInf', businessMeaning: 'References the original transaction whose status is being requested.', cardinality: '1..n' },
            ],
          },
        ],
      },
    },
  ],
  sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08', notes: 'Catalog-level entry only; message name and version verified via web search, field structure is an illustrative skeleton and not independently verified against the XSD.' }],
}
