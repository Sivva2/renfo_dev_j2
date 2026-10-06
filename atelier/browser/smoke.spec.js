import { test, expect } from '@playwright/test';

// Smoke test d'un déploiement : lancé par la chaîne contre l'adresse de preview ou de prod.
test('la page déployée s’affiche et répond', async ({ page }) => {
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  await page.goto('/');
  await expect(page.locator('#chat-form')).toBeVisible();
  const avant = await page.locator('#messages li').count();
  await page.locator('#message').fill('salut');
  await page.getByRole('button', { name: /envoyer/i }).click();
  await expect.poll(() => page.locator('#messages li').count()).toBeGreaterThanOrEqual(avant + 2);
  expect(erreurs).toHaveLength(0);
});

test('la version en ligne est le commit attendu', async ({ request }) => {
  test.skip(!process.env.EXPECTED_SHA, 'EXPECTED_SHA non fourni');
  const reponse = await request.get('/version.json');
  expect(reponse.ok()).toBe(true);
  expect((await reponse.json()).commit).toBe(process.env.EXPECTED_SHA);
});
