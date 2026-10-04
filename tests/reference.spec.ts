import { test, expect } from '@playwright/test'

test('search connects concepts, messages and XML paths', async ({ page }) => {
  await page.goto('#/')
  await expect(page.getByRole('heading', { name: 'Enciclopedia de pagos' })).toBeVisible()
  await page.getByRole('searchbox', { name: 'Buscar en la enciclopedia' }).fill('pacs008')
  await page.locator('main a[href="#/reference/pacs.008"]').click()
  await expect(page.getByRole('heading', { name: 'pacs.008', exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'XML anotado' }).click()
  await expect(page).toHaveURL(/#\/reference\/pacs\.008\?tab=xml/)
  await expect(page.getByRole('heading', { name: 'IntrBkSttlmAmt', exact: true })).toBeVisible()
  await page.goto('#/?q=EndToEndId&category=xml')
  await page.locator('main a[href^="#/reference/pacs.008?tab=xml&field="]').first().click()
  await expect(page.getByRole('heading', { name: 'EndToEndId', exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'EndToEndId', exact: true })).toBeVisible()
  await page.goto('#/?q=zzzznonexistent')
  await expect(page.getByText('Sin resultados para esta consulta.')).toBeVisible()
})

test('XML groups, repeated names, attributes, modes and downloads', async ({ page }) => {
  await page.goto('#/xml')
  const detail = page.getByRole('complementary', { name: 'Detalle del campo' })
  await detail.getByRole('button', { name: '@Ccy' }).click()
  await expect(detail.getByRole('heading', { name: '@Ccy', exact: true })).toBeVisible()
  await expect(detail.getByText('XXX', { exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'XML', exact: true }).click()
  await expect(page.getByRole('tabpanel', { name: 'Contenido XML' }).locator('[data-selected="true"]')).toHaveCount(1)
  await page.getByRole('tab', { name: 'Tabla', exact: true }).click()
  await page.getByRole('textbox', { name: 'Buscar campo XML' }).fill('Prtry')
  await page.getByRole('button', { name: /Inspeccionar .*LclInstrm\/Prtry$/ }).click()
  await expect(detail.getByText('Instrumento local propietario', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /Inspeccionar .*Purp\/Prtry$/ }).click()
  await expect(detail.getByText('Propósito propietario', { exact: true })).toBeVisible()
  await page.getByRole('textbox', { name: 'Buscar campo XML' }).fill('')
  await page.getByRole('combobox', { name: 'Bloque del mensaje' }).selectOption('header')
  await expect(page.getByRole('button', { name: /Inspeccionar .*\/AppHdr\/BizMsgIdr$/ })).toHaveCount(1)
  await expect(page.getByRole('button', { name: /Inspeccionar .*\/GrpHdr\/MsgId$/ })).toHaveCount(0)
  await page.getByRole('combobox', { name: 'Bloque del mensaje' }).selectOption('all')
  await page.getByRole('tab', { name: 'Árbol', exact: true }).click()
  await page.getByRole('button', { name: 'Contraer /DataPDU', exact: true }).click()
  await expect(page.getByRole('tabpanel', { name: 'Contenido XML' }).getByRole('button', { name: /AppHdr/ })).toHaveCount(0)
  await page.getByRole('button', { name: 'Expandir /DataPDU', exact: true }).click()
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Descargar XML sintético' }).click()
  const download = await downloadEvent
  expect(download.suggestedFilename()).toContain('pacs.008.001.10')
})

test('sequences, bookmarks and classic routes remain connected', async ({ page }) => {
  await page.goto('#/reference/fast-payments')
  await page.getByRole('tab', { name: 'Diagramas', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Paso 1: Orden de pago', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Paso siguiente', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Paso 2: Instrucción', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.screenshot({ path: 'test-results/sequence-desktop.png' })
  await page.getByRole('button', { name: 'Guardar', exact: true }).click()
  await page.goto('#/saved')
  await expect(page.locator('main a[href="#/reference/fast-payments"]')).toBeVisible()
  await page.goto('#/classic')
  await page.getByRole('link', { name: 'Mapa de aprendizaje', exact: true }).click()
  await expect(page.locator('main h1')).toBeVisible()
  await page.goto('#/classic/dashboard')
  await expect(page.locator('main h1')).toBeVisible()
  await page.goto('#/learn/info-extra')
  await expect(page.getByRole('heading', { name: 'Info extra', exact: true })).toBeVisible()
})

test('global search supports keyboard and restores focus', async ({ page }) => {
  await page.goto('#/')
  const search = page.getByRole('button', { name: 'Buscar en Payment Lab', exact: true })
  await search.click()
  await page.getByRole('combobox', { name: 'Buscar concepto, mensaje o campo' }).fill('EndToEndId')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'EndToEndId', exact: true })).toBeVisible()
  await search.click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(search).toBeFocused()
})

test('reference routes render without page overflow or runtime errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/xml', '/reference/pacs.008', '/reference/payment-web-app', '/classic']) {
      await page.goto(`#${route}`)
      await expect(page.locator('main h1')).toBeVisible()
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, main: document.querySelector('main')!.clientWidth, mainScroll: document.querySelector('main')!.scrollWidth }))
      expect(dimensions.scroll, `${width} ${route}: document overflow`).toBeLessThanOrEqual(dimensions.width + 1)
      expect(dimensions.mainScroll, `${width} ${route}: main overflow`).toBeLessThanOrEqual(dimensions.main + 1)
      if (width !== 320 && ['/', '/xml'].includes(route)) await page.screenshot({ path: `test-results/${route === '/' ? 'library' : 'xml'}-${width}.png` })
    }
  }
  await page.getByRole('button', { name: 'Abrir navegación' }).click()
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('link', { name: 'XML anotado' }).click()
  await expect(page.getByRole('heading', { name: 'pacs.008.001.10', exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test('XML annotations and internal reference links are complete', async ({ page }) => {
  await page.goto('#/')
  // Inspect the same Vite modules used by the application, including native DOMParser behavior.
  const result = await page.evaluate(async () => {
    const load = (url: string) => import(/* @vite-ignore */ url)
    const { parseStudyXml } = await load('/payment-lab/src/lib/xmlStudy.ts')
    const { referenceEntries } = await load('/payment-lab/src/content/reference/entries.ts')
    const fields = parseStudyXml().fields as { id: string; tag: string; layer: string; note: { note: string; concept?: string } }[]
    const entries = referenceEntries as { id: string; related: string[] }[]
    const known = new Set(entries.map((entry) => entry.id))
    let invalidRejected = false
    try { parseStudyXml('<broken>') } catch { invalidRejected = true }
    return {
      count: fields.length,
      unique: new Set(fields.map((field) => field.id)).size,
      layers: [...new Set(fields.map((field) => field.layer))].sort(),
      missingNotes: fields.filter((field) => field.note.note.includes('No hay una explicación')),
      brokenConcepts: fields.filter((field) => field.note.concept && !known.has(field.note.concept)),
      brokenLinks: entries.flatMap((entry) => entry.related.filter((id) => !known.has(id)).map((id) => `${entry.id} -> ${id}`)),
      invalidRejected,
    }
  })
  expect(result.count).toBeGreaterThan(60)
  expect(result.unique).toBe(result.count)
  expect(result.layers).toEqual(['header', 'payment', 'transport'])
  expect(result.missingNotes).toEqual([])
  expect(result.brokenConcepts).toEqual([])
  expect(result.brokenLinks).toEqual([])
  expect(result.invalidRejected).toBe(true)
})

test('old XML links redirect into the pacs.008 XML tab and concepts open their block', async ({ page }) => {
  await page.goto('#/xml?field=' + encodeURIComponent('/DataPDU/Body/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/EndToEndId'))
  await expect(page).toHaveURL(/#\/reference\/pacs\.008\?tab=xml/)
  await expect(page.getByRole('tab', { name: 'XML anotado' })).toHaveAttribute('aria-selected', 'true')
  await page.goto('#/reference/identifiers?tab=xml')
  await expect(page.getByRole('combobox', { name: 'Bloque del mensaje' })).toHaveValue('ids')
  await page.goto('#/')
  await page.getByRole('link', { name: /^AppHdr/ }).click()
  await expect(page.getByRole('combobox', { name: 'Bloque del mensaje' })).toHaveValue('header')
})

test('mobile inspection returns to the selected field and light diagrams render', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('#/xml')
  await page.getByRole('button', { name: /Inspeccionar .*\/IntrBkSttlmAmt$/ }).click()
  const detail = page.getByRole('complementary', { name: 'Detalle del campo' })
  await expect(detail.getByRole('heading', { name: 'IntrBkSttlmAmt' })).toBeInViewport()
  await page.screenshot({ path: 'test-results/xml-mobile-detail.png' })
  await page.getByRole('button', { name: 'Volver al XML' }).click()
  await expect(page.getByRole('tabpanel', { name: 'Contenido XML' })).toBeInViewport()
  await page.goto('#/reference/payment-web-app')
  await page.getByRole('button', { name: 'Cambiar tema' }).click()
  await page.getByRole('tab', { name: 'Diagramas', exact: true }).click()
  await page.getByRole('button', { name: 'Paso siguiente', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Paso 2: Recibido / pendiente', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Paso siguiente', exact: true }).scrollIntoViewIfNeeded()
  await page.screenshot({ path: 'test-results/diagram-mobile-light.png' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.screenshot({ path: 'test-results/architecture-light.png' })
  expect(await page.evaluate(() => document.querySelector('main')!.scrollWidth <= document.querySelector('main')!.clientWidth)).toBe(true)
})
