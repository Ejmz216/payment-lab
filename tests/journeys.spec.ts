import { test, expect } from '@playwright/test'

test('journeys play a full payment, explain steps, actors and XML', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('#/recorridos')
  await expect(page.getByRole('heading', { name: 'Un pago de punta a punta' })).toBeVisible()
  const scenarios = page.getByRole('group', { name: 'Escenarios' })
  await expect(scenarios.getByRole('button')).toHaveCount(7)

  const panel = page.getByRole('complementary', { name: 'Detalle' })
  await expect(panel).toContainText('Paso 1 de 13')
  await page.getByRole('button', { name: 'Paso 3: Instrucción de pago (pacs.008)' }).click()
  await expect(panel).toContainText('Reservado en BANK_A')
  await expect(panel.getByLabel('Fragmento XML del mensaje')).toContainText('<EndToEndId>E2E-001</EndToEndId>')
  await expect(panel.getByRole('link', { name: /Abrir pacs.008 en la enciclopedia/ })).toHaveAttribute('href', '#/reference/pacs.008')

  await page.locator('.journey-scroll').focus()
  await page.keyboard.press('ArrowRight')
  await expect(panel).toContainText('Paso 4 de 13')

  await page.locator('.journey-actor', { hasText: 'BANK_B' }).click()
  await expect(panel).toContainText('banco del que cobra')
  await panel.getByRole('button', { name: /Acepta el pago/ }).click()
  await expect(panel).toContainText('Aceptar no es liquidar')

  await scenarios.getByRole('button', { name: /Rechazo: cuenta inexistente/ }).click()
  await expect(page).toHaveURL(/scenario=credit-reject/)
  await page.getByRole('button', { name: /Rechaza · AC01/ }).click()
  await expect(panel.getByLabel('Fragmento XML del mensaje')).toContainText('<Cd>AC01</Cd>')
  await page.reload()
  await expect(scenarios.getByRole('button', { name: /Rechazo: cuenta inexistente/ })).toHaveAttribute('aria-pressed', 'true')
  expect(errors).toEqual([])
})

test('journeys fit every width in both themes', async ({ page }) => {
  for (const theme of ['dark', 'light']) {
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('#/recorridos?scenario=recall')
      const light = await page.locator('html').evaluate((element) => element.classList.contains('light'))
      if (light !== (theme === 'light')) await page.getByRole('button', { name: 'Cambiar tema' }).click()
      await expect(page.locator('main h1')).toBeVisible()
      expect(await page.evaluate(() => document.querySelector('main')!.scrollWidth <= document.querySelector('main')!.clientWidth), `${theme} ${width}: main overflow`).toBe(true)
      if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/journeys-${theme}-${width}.png`, fullPage: false })
    }
  }
})
