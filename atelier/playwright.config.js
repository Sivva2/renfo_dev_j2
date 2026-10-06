// Playwright : outil developpeur uniquement.
// Chromium headless, canal Chrome seulement si PLAYWRIGHT_CHANNEL=chrome.
// Serveur local fourni, jamais un autre processus.

import { execFileSync } from "node:child_process";
import { defineConfig } from "@playwright/test";

// Le serveur des tests prend un port libre, choisi une seule fois par lancement : plusieurs lancements peuvent tourner en meme temps
// sur la meme machine (les runners du serveur de CI) sans se gener, et un test ne tombe jamais sur le serveur d'un autre.
// Le premier chargement de la configuration fixe CAPWEB_PORT_TEST dans l'environnement ; les processus de test le heritent.
function portLibre() {
  const code = "const s=require('node:net').createServer();s.listen(0,'127.0.0.1',()=>{process.stdout.write(String(s.address().port));s.close();});";
  return execFileSync(process.execPath, ["-e", code], { encoding: "utf8" }).trim();
}
const port = process.env.CAPWEB_PORT_TEST ?? (process.env.CAPWEB_PORT_TEST = portLibre());
const baseURL = `http://127.0.0.1:${port}`;
const avecCanalChrome = process.env.PLAYWRIGHT_CHANNEL === "chrome";

export default defineConfig({
  testDir: "./browser",
  // Le smoke test vise un déploiement réel : il a sa propre configuration.
  testIgnore: /smoke\.spec\.js$/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  timeout: 20000,
  use: {
    baseURL,
    viewport: { width: 1280, height: 800 }
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        headless: true,
        ...(avecCanalChrome ? { channel: "chrome" } : {})
      }
    }
  ],
  webServer: {
    command: "node server/start.js",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 20000,
    env: {
      HOST: "127.0.0.1",
      PORT: port
    }
  }
});
