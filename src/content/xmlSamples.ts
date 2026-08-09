// Synthetic ISO 20022 XML samples for the XML Lab. All values are
// fictional (BANK_A/BANK_B, Alice/Bob Example, XXX currency).

export interface XmlSample {
  id: string
  messageId: string
  title: string
  xml: string
}

export const xmlSamples: XmlSample[] = [
  {
    id: 'pacs008-sample',
    messageId: 'pacs.008',
    title: 'pacs.008 — single credit transfer',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.10">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>MSG-2026-000123</MsgId>
      <CreDtTm>2026-01-15T10:00:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>INS-000123</InstrId>
        <EndToEndId>E2E-ALICE-BOB-0001</EndToEndId>
        <TxId>TX-000123-01</TxId>
      </PmtId>
      <IntrBkSttlmAmt Ccy="XXX">100.00</IntrBkSttlmAmt>
      <Dbtr>
        <Nm>Alice Example</Nm>
      </Dbtr>
      <DbtrAgt>
        <FinInstnId>
          <BICFI>BANKAXXX</BICFI>
        </FinInstnId>
      </DbtrAgt>
      <CdtrAgt>
        <FinInstnId>
          <BICFI>BANKBXXX</BICFI>
        </FinInstnId>
      </CdtrAgt>
      <Cdtr>
        <Nm>Bob Example</Nm>
      </Cdtr>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>
`,
  },
  {
    id: 'camt003-account-query',
    messageId: 'camt.003',
    title: 'camt.003 - synthetic account query',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.003.001.08">
  <GetAcct>
    <MsgHdr>
      <MsgId>MSG-ACCT-QUERY-001</MsgId>
      <ReqTp>
        <Prtry>
          <Id>BALANCE_QUERY</Id>
        </Prtry>
      </ReqTp>
    </MsgHdr>
    <AcctQryDef>
      <AcctCrit>
        <NewCrit>
          <SchCrit>
            <AcctId>
              <EQ>
                <Othr>
                  <Id>ACCOUNT-001</Id>
                </Othr>
              </EQ>
            </AcctId>
            <Ccy>XXX</Ccy>
          </SchCrit>
        </NewCrit>
      </AcctCrit>
    </AcctQryDef>
  </GetAcct>
</Document>
`,
  },
]

export interface BrokenSample {
  id: string
  title: string
  xml: string
  question: string
  options: { id: string; label: string; correct: boolean }[]
  explanation: string
  layer: 'Syntax' | 'Schema' | 'Business' | 'Scheme' | 'Implementation'
  layerNote: string
}

export const brokenSamples: BrokenSample[] = [
  {
    id: 'break-1',
    title: 'Unclosed element',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.10">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>MSG-2026-000124
      <CreDtTm>2026-01-15T10:05:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
    </GrpHdr>
  </FIToFICstmrCdtTrf>
</Document>
`,
    question: 'What is wrong with this message?',
    options: [
      { id: 'a', label: 'The <MsgId> element is never closed', correct: true },
      { id: 'b', label: 'The amount is negative', correct: false },
      { id: 'c', label: 'The currency code is invalid', correct: false },
      { id: 'd', label: 'The Debtor Agent is missing', correct: false },
    ],
    explanation: 'The </MsgId> closing tag is missing, so the document is not well-formed XML at all — this would fail before any schema or business validation could even run.',
    layer: 'Syntax',
    layerNote: 'A well-formedness problem (unclosed/mismatched tags) is a syntax-layer error — it happens before schema or business validation is even possible.',
  },
  {
    id: 'break-2',
    title: 'Missing required element',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.10">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>MSG-2026-000125</MsgId>
      <CreDtTm>2026-01-15T10:10:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>INS-000125</InstrId>
        <TxId>TX-000125-01</TxId>
      </PmtId>
      <IntrBkSttlmAmt Ccy="XXX">75.00</IntrBkSttlmAmt>
      <Dbtr><Nm>Alice Example</Nm></Dbtr>
      <DbtrAgt><FinInstnId><BICFI>BANKAXXX</BICFI></FinInstnId></DbtrAgt>
      <CdtrAgt><FinInstnId><BICFI>BANKBXXX</BICFI></FinInstnId></CdtrAgt>
      <Cdtr><Nm>Bob Example</Nm></Cdtr>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>
`,
    question: 'What is wrong with this message?',
    options: [
      { id: 'a', label: 'EndToEndId is missing from PmtId', correct: true },
      { id: 'b', label: 'The Creditor is missing', correct: false },
      { id: 'c', label: 'The settlement amount uses the wrong currency', correct: false },
      { id: 'd', label: 'GrpHdr has too many elements', correct: false },
    ],
    explanation: 'EndToEndId is a required field within PmtId in this message. Its absence means the message is well-formed XML but does not satisfy the message definition\'s required structure.',
    layer: 'Schema',
    layerNote: 'A missing element that the message definition requires is typically caught at the schema-validation layer (XML is well-formed, but does not conform to the required structure).',
  },
  {
    id: 'break-3',
    title: 'Inconsistent currency and negative amount',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.10">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>MSG-2026-000126</MsgId>
      <CreDtTm>2026-01-15T10:15:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>INS-000126</InstrId>
        <EndToEndId>E2E-ALICE-BOB-0002</EndToEndId>
        <TxId>TX-000126-01</TxId>
      </PmtId>
      <IntrBkSttlmAmt Ccy="XXX">-50.00</IntrBkSttlmAmt>
      <Dbtr><Nm>Alice Example</Nm></Dbtr>
      <DbtrAgt><FinInstnId><BICFI>BANKAXXX</BICFI></FinInstnId></DbtrAgt>
      <CdtrAgt><FinInstnId><BICFI>BANKBXXX</BICFI></FinInstnId></CdtrAgt>
      <Cdtr><Nm>Bob Example</Nm></Cdtr>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>
`,
    question: 'What is wrong with this message?',
    options: [
      { id: 'a', label: 'The settlement amount is negative', correct: true },
      { id: 'b', label: 'BICFI values are too short', correct: false },
      { id: 'c', label: 'MsgId is duplicated', correct: false },
      { id: 'd', label: 'NbOfTxs should be 0', correct: false },
    ],
    explanation: 'A negative settlement amount is well-formed XML and may even pass basic schema validation (depending on the data type constraints), but it violates a business rule — a credit transfer amount cannot be negative.',
    layer: 'Business',
    layerNote: 'This can pass syntax and even schema validation, yet still be economically meaningless — a classic example of why "schema-valid" does not mean "business-valid."',
  },
]
