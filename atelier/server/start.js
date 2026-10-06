import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

// Dossier public servi : fixe, à côté du serveur.
const ici = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(ici, '..', 'public');

// Port validé : entier 1 à 65535, défaut 3000.
const brut = process.env.PORT ?? '3000';
const nombre = Number.parseInt(brut, 10);
const port = Number.isInteger(nombre) && nombre >= 1 && nombre <= 65535 ? nombre : 3000;
const host = '127.0.0.1';

const app = createApp({ publicDir, version: 'dev' });
const serveur = app.listen(port, host, () => {
  console.log(`Cap Web prêt sur http://${host}:${port}/`);
});

function arreter() {
  serveur.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1000).unref();
}

process.on('SIGINT', arreter);
process.on('SIGTERM', arreter);
