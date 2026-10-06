import { defineConfig } from '@playwright/test';

// Configuration du smoke test : aucune adresse par défaut, on vérifie un déploiement réel.
const baseURL = process.env.BASE_URL;
if (!baseURL) {
  throw new Error('BASE_URL manquant : adresse du déploiement à vérifier.');
}
const contournement = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: './browser',
  testMatch: /smoke\.spec\.js$/,
  workers: 1,
  retries: 1,
  reporter: 'list',
  timeout: 30000,
  use: {
    baseURL,
    viewport: { width: 1280, height: 800 },
    // Vercel Authentication protège les previews et les adresses uniques de déploiement :
    // le secret « Protection Bypass for Automation » les ouvre, le cookie couvre les requêtes suivantes.
    extraHTTPHeaders: contournement
      ? { 'x-vercel-protection-bypass': contournement, 'x-vercel-set-bypass-cookie': 'true' }
      : {}
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium', headless: true } }]
});
