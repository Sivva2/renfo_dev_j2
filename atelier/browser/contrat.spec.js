import { test, expect } from '@playwright/test';
import { replyTo } from '../public/js/brain.js';
/* global localStorage -- callbacks exécutés dans la page */

// Contrat CP1 fourni par le formateur, vérifié dans un vrai navigateur. Ne pas modifier.
function surveiller(page) {
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  return erreurs;
}

async function pageNeuve(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function envoyer(page, texte) {
  await page.locator('#message').fill(texte);
  await page.getByRole('button', { name: /envoyer/i }).click();
}

const lignes = (page) => page.locator('#messages li');

test.describe('Contrat CP1 — conversation', () => {
  test('envoyer affiche le message puis la réponse du cerveau', async ({ page }) => {
    const erreurs = surveiller(page);
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await expect(lignes(page).nth(0)).toContainText('salut');
    await expect(lignes(page).nth(1)).toContainText(replyTo('salut'));
    await expect(page.locator('#message')).toHaveValue('');
    expect(erreurs).toHaveLength(0);
  });

  test('un message fait d’espaces est refusé avec une erreur visible', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, '   ');
    await expect(page.locator('#status')).not.toHaveText(/^\s*$/);
    await expect(lignes(page)).toHaveCount(0);
  });

  test('le texte reste du texte, jamais du HTML', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, '<b>gras</b>');
    await expect(page.locator('#messages b')).toHaveCount(0);
    await expect(lignes(page).nth(0)).toContainText('<b>gras</b>');
  });
});

test.describe('Contrat CP1 — mémoire', () => {
  test('la conversation survit au rechargement', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'aide');
    await expect(lignes(page)).toHaveCount(2);
    await page.reload();
    await expect(lignes(page)).toHaveCount(2);
    await expect(lignes(page).nth(0)).toContainText('aide');
  });

  test('la mémoire est rangée sous la clé capweb.historique', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    const memoire = await page.evaluate(() => JSON.parse(localStorage.getItem('capweb.historique')));
    expect(Array.isArray(memoire)).toBe(true);
    expect(memoire).toHaveLength(2);
    expect(memoire[0]).toEqual({ role: 'user', text: 'salut' });
    expect(memoire[1].role).toBe('assistant');
  });

  test('une mémoire abîmée ne casse pas la page', async ({ page }) => {
    const erreurs = surveiller(page);
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('capweb.historique', '{pas du json'));
    await page.reload();
    await expect(page.locator('#chat-form')).toBeVisible();
    await expect(lignes(page)).toHaveCount(0);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    expect(erreurs).toHaveLength(0);
  });

  test('Effacer vide la conversation, même après rechargement', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    page.once('dialog', (d) => d.accept());
    await page.locator('#effacer').click();
    await expect(lignes(page)).toHaveCount(0);
    await page.reload();
    await expect(lignes(page)).toHaveCount(0);
  });

  test('annuler la confirmation garde la conversation', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    page.once('dialog', (d) => d.dismiss());
    await page.locator('#effacer').click();
    await expect(lignes(page)).toHaveCount(2);
  });
});
