import { test, expect } from '@playwright/test'

test('every annotated sample parses and every tag has a reviewed note in both languages', async ({ page }) => {
  await page.goto('#/')
  const result = await page.evaluate(async () => {
    const load = (url: string) => import(/* @vite-ignore */ url)
    const { xmlSamples } = await load('/payment-lab/src/content/reference/samples/index.ts')
    const { parseStudyXml } = await load('/payment-lab/src/lib/xmlStudy.ts')
    const { referenceEntries } = await load('/payment-lab/src/content/reference/entries.ts')
    const known = new Set((referenceEntries as { id: string }[]).map((entry) => entry.id))
    type Field = { path: string; tag: string; layer: string; note: { meaning: string; note: string; name: string; explain?: string; equivalent?: string; concept?: string } }
    const problems: string[] = []
    const summary: Record<string, { fields: number; layers: string[] }> = {}
    for (const sample of Object.values(xmlSamples) as { id: string; version: string; xml: string; defaultTag: string; resolve: unknown }[]) {
      for (const lang of ['es', 'en']) {
        const { fields } = parseStudyXml(sample.xml, lang, sample.resolve) as { fields: Field[] }
        if (!fields.some((field) => field.tag === sample.defaultTag)) problems.push(`${sample.id}: default tag ${sample.defaultTag} missing`)
        if (!sample.xml.includes(sample.version)) problems.push(`${sample.id}: version ${sample.version} not in XML`)
        for (const field of fields) {
          const text = [field.note.meaning, field.note.note, field.note.name, field.note.explain ?? '', field.note.equivalent ?? ''].join(' ')
          if (/No hay una explicación|No reviewed explanation/.test(text)) problems.push(`${sample.id} ${lang}: no note for ${field.path}`)
          if (text.includes('{value}')) problems.push(`${sample.id} ${lang}: unfilled value in ${field.path}`)
          if (field.note.concept && !known.has(field.note.concept)) problems.push(`${sample.id}: broken concept ${field.note.concept}`)
        }
        if (lang === 'es') summary[sample.id] = { fields: fields.length, layers: [...new Set(fields.map((field) => field.layer))].sort() }
      }
    }
    return { problems, summary }
  })
  expect(result.problems).toEqual([])
  expect(Object.keys(result.summary)).toHaveLength(13)
  for (const id of ['pacs.002', 'pacs.004', 'pacs.003', 'pacs.028', 'camt.056', 'camt.029', 'camt.003', 'camt.004']) expect(result.summary[id].layers, id).toEqual(['header', 'payment', 'transport'])
  for (const id of ['pain.001', 'pain.002', 'camt.053', 'camt.054']) expect(result.summary[id].layers, id).toEqual(['payment'])
})

test('each ISO message entry opens its own annotated XML', async ({ page }) => {
  const versions: Record<string, string> = { 'pain.001': 'pain.001.001.10', 'pain.002': 'pain.002.001.11', 'pacs.002': 'pacs.002.001.10', 'pacs.004': 'pacs.004.001.10', 'pacs.003': 'pacs.003.001.08', 'pacs.028': 'pacs.028.001.03', 'camt.053': 'camt.053.001.08', 'camt.054': 'camt.054.001.08', 'camt.056': 'camt.056.001.08', 'camt.029': 'camt.029.001.09', 'camt.003': 'camt.003.001.07', 'camt.004': 'camt.004.001.08' }
  for (const [id, version] of Object.entries(versions)) {
    await page.goto(`#/reference/${id}`)
    await page.getByRole('tab', { name: 'XML anotado' }).click()
    await expect(page.getByRole('heading', { name: version, exact: true })).toBeVisible()
    await expect(page.getByRole('complementary', { name: 'Detalle del campo' }).getByText('Qué es')).toBeVisible()
  }
  await page.goto('#/reference/pacs.002?tab=xml')
  await page.getByRole('group', { name: 'Ver solo una parte del mensaje' }).getByRole('button', { name: 'Referencias originales' }).click()
  await expect(page.getByRole('tabpanel', { name: 'Contenido XML' })).toContainText('OrgnlTxId')
  await expect(page.getByRole('tabpanel', { name: 'Contenido XML' })).not.toContainText('BizMsgIdr')
  await page.goto('#/reference/pain.002?tab=xml')
  await expect(page.getByRole('complementary', { name: 'Detalle del campo' })).toContainText('RJCT')
})
