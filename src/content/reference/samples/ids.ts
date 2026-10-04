// Which messages have an annotated XML sample, and its version. Kept free of
// XML imports so the main bundle can know about samples without loading them.
export const sampleVersions: Record<string, string> = {
  'pacs.008': 'pacs.008.001.10',
  'pain.001': 'pain.001.001.10',
  'pain.002': 'pain.002.001.11',
  'pacs.002': 'pacs.002.001.10',
  'pacs.004': 'pacs.004.001.10',
  'pacs.003': 'pacs.003.001.08',
  'pacs.028': 'pacs.028.001.03',
  'camt.053': 'camt.053.001.08',
  'camt.054': 'camt.054.001.08',
  'camt.056': 'camt.056.001.08',
  'camt.029': 'camt.029.001.09',
  'camt.003': 'camt.003.001.07',
  'camt.004': 'camt.004.001.08',
}
export const hasSample = (messageId: string) => messageId in sampleVersions
