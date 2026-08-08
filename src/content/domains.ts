// ISO 20022 Atlas domain map. Payments has deep educational coverage
// (full lessons + message deep dives). Other business areas are
// intentionally kept at catalog/discovery level — family codes are real
// ISO 20022 business areas, but we do not fabricate specific message
// numbers or structures we can't verify. See CONTENT_GUIDE.md.

export interface DomainFamily {
  code: string
  label: string
  description: string
}

export interface Domain {
  id: string
  name: string
  description: string
  coverage: 'deep' | 'catalog'
  families: DomainFamily[]
}

export const domains: Domain[] = [
  {
    id: 'payments',
    name: 'Payments',
    description:
      'Messages supporting the initiation, clearing, settlement, status reporting, returns and cash management aspects of moving money between parties. This is the domain covered in depth by the Fast Payments Path and Lab.',
    coverage: 'deep',
    families: [
      { code: 'pain', label: 'pain — Payments Initiation', description: 'Customer to financial institution. Payment initiation related messages.' },
      { code: 'pacs', label: 'pacs — Payments Clearing & Settlement', description: 'Financial institution to financial institution. Clearing and settlement related messages.' },
      { code: 'camt', label: 'camt — Cash Management', description: 'Cash management related messages: reporting, statements, notifications, investigations.' },
      { code: 'admi', label: 'admi — Administration', description: 'Administrative messages exchanged between systems and participants.' },
      { code: 'head', label: 'head — Business Application Header', description: 'Header information carried alongside a business message.' },
      { code: 'remt', label: 'remt — Remittance Advice', description: 'Detailed remittance information related to a payment.' },
    ],
  },
  {
    id: 'securities',
    name: 'Securities',
    description:
      'Messages supporting the trading, settlement, custody, corporate actions and reference data aspects of securities — a much larger and more mature part of ISO 20022 than payments, historically.',
    coverage: 'catalog',
    families: [
      { code: 'setr', label: 'setr — Securities Trade', description: 'Messages related to the trade/order side of securities transactions.' },
      { code: 'sese', label: 'sese — Securities Settlement', description: 'Messages related to settling securities transactions.' },
      { code: 'semt', label: 'semt — Securities Management', description: 'Messages related to holdings, statements and securities reference data.' },
      { code: 'seev', label: 'seev — Securities Events', description: 'Messages related to corporate actions and other securities events.' },
    ],
  },
  {
    id: 'trade-finance',
    name: 'Trade Finance',
    description:
      'Messages supporting trade services such as documentary credits, guarantees and open account trade finance between banks and corporates.',
    coverage: 'catalog',
    families: [
      { code: 'tsmt', label: 'tsmt — Trade Services Management', description: 'Messages related to managing trade services transactions (e.g. documentary trade, open account).' },
    ],
  },
  {
    id: 'cards',
    name: 'Cards',
    description:
      'Messages supporting card payment transactions, acceptance and related processing between the parties in a card scheme.',
    coverage: 'catalog',
    families: [
      { code: 'caaa', label: 'caaa — Card domain messages', description: 'Business area covering card transaction and acceptance related messages.' },
    ],
  },
  {
    id: 'fx',
    name: 'FX',
    description:
      'Messages supporting foreign exchange trade confirmation and related processing between counterparties.',
    coverage: 'catalog',
    families: [
      { code: 'fxtr', label: 'fxtr — Foreign Exchange Trade', description: 'Messages related to foreign exchange trade confirmation and processing.' },
    ],
  },
  {
    id: 'authorities',
    name: 'Authorities',
    description:
      'Messages supporting regulatory and authority reporting, and reference data distributed by or to regulatory/market authorities.',
    coverage: 'catalog',
    families: [
      { code: 'auth', label: 'auth — Authorities', description: 'Messages related to reporting to, or receiving information from, regulatory/market authorities.' },
      { code: 'reda', label: 'reda — Reference Data', description: 'Messages related to distributing and maintaining reference data.' },
    ],
  },
]

export function getDomain(id: string): Domain | undefined {
  return domains.find((d) => d.id === id)
}
