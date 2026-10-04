import { test, expect } from '@playwright/test'

test('every encyclopedia text, XML note and journey phrase has an English version', async ({ page }) => {
  await page.goto('#/')
  const result = await page.evaluate(async () => {
    const load = (url: string) => import(/* @vite-ignore */ url)
    const { referenceEntries } = await load('/payment-lab/src/content/reference/entries.ts')
    const { entriesEn } = await load('/payment-lab/src/i18n/reference/entriesEn.ts')
    const { conceptsEn } = await load('/payment-lab/src/i18n/reference/conceptsEn.ts')
    const { messagesEn } = await load('/payment-lab/src/i18n/reference/messagesEn.ts')
    const { fieldNotesEn } = await load('/payment-lab/src/i18n/reference/xmlGuideEn.ts')
    const { parseStudyXml } = await load('/payment-lab/src/lib/xmlStudy.ts')
    const { journeys, journeyActors } = await load('/payment-lab/src/content/reference/journeys.ts')
    const { journeyPhrasesEn } = await load('/payment-lab/src/i18n/reference/journeysEn.ts')
    type Entry = { id: string; facts: unknown[]; diagram?: { steps: unknown[] }; architecture?: { nodes: unknown[] } }
    type En = { facts?: unknown[]; diagram?: { steps: unknown[] }; architecture?: { nodes: unknown[] } }
    const english: Record<string, En> = { ...entriesEn, ...conceptsEn, ...messagesEn }
    const entries = referenceEntries as Entry[]
    const tags = new Set((parseStudyXml().fields as { tag: string }[]).map((field) => field.tag))
    const phrases: string[] = []
    for (const journey of journeys as { title: string; kind: string; summary: string; takeaway: string; steps: { label: string; detail: string; money: string; status: string; phase: string }[] }[]) {
      phrases.push(journey.title, journey.kind, journey.summary, journey.takeaway)
      for (const step of journey.steps) phrases.push(step.label, step.detail, step.money, step.status, step.phase)
    }
    for (const actor of journeyActors as { title: string; does: string }[]) phrases.push(actor.title, actor.does)
    return {
      missingEntries: entries.filter((entry) => !english[entry.id]).map((entry) => entry.id),
      missingDiagrams: entries.filter((entry) => entry.diagram && english[entry.id]?.diagram?.steps.length !== entry.diagram.steps.length).map((entry) => entry.id),
      missingFacts: entries.filter((entry) => english[entry.id]?.facts?.length !== entry.facts.length).map((entry) => entry.id),
      missingArchitecture: entries.filter((entry) => entry.architecture && english[entry.id]?.architecture?.nodes.length !== entry.architecture.nodes.length).map((entry) => entry.id),
      missingXml: [...tags].filter((tag) => tag !== 'Prtry' && tag !== '@xmlns' && !fieldNotesEn[tag]),
      missingPhrases: [...new Set(phrases)].filter((phrase) => !journeyPhrasesEn[phrase]),
    }
  })
  expect(result).toEqual({ missingEntries: [], missingDiagrams: [], missingFacts: [], missingArchitecture: [], missingXml: [], missingPhrases: [] })
})

test('the language switch turns the new encyclopedia, XML and journeys into English', async ({ page }) => {
  await page.goto('#/')
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Payments encyclopedia' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.goto('#/reference/iban')
  await expect(page.getByText('In plain words')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'The IBAN in a payment' })).toBeVisible()
  await page.goto('#/reference/pacs.008?tab=xml')
  await expect(page.getByRole('complementary', { name: 'Field detail' })).toContainText('Amount settled between the institutions')
  await page.goto('#/recorridos')
  await expect(page.getByRole('heading', { name: 'A payment end to end' })).toBeVisible()
  await expect(page.getByRole('complementary', { name: 'Detail' })).toContainText('Step 1 of 13')
  await page.getByRole('button', { name: 'ES', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Un pago de punta a punta' })).toBeVisible()
})
