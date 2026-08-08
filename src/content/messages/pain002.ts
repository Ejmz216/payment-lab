import type { MessageDefinition } from '@/types/content'

export const pain002: MessageDefinition = {
  id: 'pain.002',
  family: 'pain',
  number: '002',
  name: 'CustomerPaymentStatusReport',
  shortDescription: 'A financial institution reports back to a customer on the status of a previously submitted payment initiation.',
  businessArea: 'Payments Initiation',
  domain: 'Payments',
  purpose:
    'Tells the customer what happened to a pain.001 they submitted — accepted, rejected, or pending — including reason information when relevant. This is the customer-facing counterpart to pacs.002, which reports status between financial institutions.',
  actors: ['Debtor Agent', 'Debtor'],
  lifecycleStage: ['initiated', 'accepted'],
  whatComesBefore: 'A pain.001 (Customer Credit Transfer Initiation) previously submitted by the customer to their financial institution.',
  whatComesAfter: 'The customer acts on the reported status — no action if accepted, or correcting and resubmitting if rejected.',
  relatedMessages: [
    { messageId: 'pain.001', relation: 'status-of' },
    { messageId: 'pacs.002', relation: 'related' },
  ],
  tags: ['status-reporting'],
  fastPaymentsRelevance: 'medium',
  coverage: 'catalog-only',
  versions: [
    {
      version: '001.15',
      fullIdentifier: 'pain.002.001.15',
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
            id: 'CstmrPmtStsRpt',
            name: 'CustomerPaymentStatusReport',
            xmlTag: 'CstmrPmtStsRpt',
            businessMeaning: 'The customer payment status report business message.',
            cardinality: '1..1',
            children: [
              { id: 'GrpHdr', name: 'Group Header', xmlTag: 'GrpHdr', businessMeaning: 'Common information identifying this status report.', cardinality: '1..1' },
              { id: 'OrgnlGrpInfAndSts', name: 'Original Group Information And Status', xmlTag: 'OrgnlGrpInfAndSts', businessMeaning: 'References the original pain.001 submission and its overall status.', cardinality: '0..1' },
              { id: 'OrgnlPmtInfAndSts', name: 'Original Payment Information And Status', xmlTag: 'OrgnlPmtInfAndSts', businessMeaning: 'Status at the level of individual payment instructions within the original submission.', cardinality: '0..n' },
            ],
          },
        ],
      },
    },
  ],
  sources: [{ sourceName: 'ISO 20022 official catalogue', sourceType: 'ISO', lastReviewed: '2026-08-08', notes: 'Catalog-level entry only; message name and version verified via web search, field structure is an illustrative skeleton and not independently verified against the XSD.' }],
}
