import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../server/app.js';

// Tests rouges J1 pour Cap Web.
// Vérifie le contrat statique du serveur local (outillage fourni).
// Ces tests échouent tant que server/app.js et public/ manquent.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
const VERSION_TEST = 'test-j1';

let serveur;
let baseUrl;

before(async () => {
  const app = createApp({ publicDir, version: VERSION_TEST });
  await new Promise((resolve) => {
    serveur = app.listen(0, '127.0.0.1', resolve);
  });
  const adresse = serveur.address();
  const port = typeof adresse === 'object' && adresse !== null ? adresse.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;
});

after(
  () =>
    new Promise((resolve, reject) => {
      if (!serveur) {
        resolve();
        return;
      }
      serveur.close((erreur) => (erreur ? reject(erreur) : resolve()));
    }),
);

test('GET / sert la page d’accueil en HTML', async () => {
  const reponse = await fetch(`${baseUrl}/`);
  assert.equal(reponse.status, 200);
  const mime = reponse.headers.get('content-type') ?? '';
  assert.ok(mime.includes('text/html'), `MIME HTML attendu, reçu : ${mime}`);
  const corps = await reponse.text();
  assert.ok(corps.includes('<main'), 'la page d’accueil doit contenir un repère <main>');
});

test('GET /styles.css sert la feuille de style en CSS', async () => {
  const reponse = await fetch(`${baseUrl}/styles.css`);
  assert.equal(reponse.status, 200);
  const mime = reponse.headers.get('content-type') ?? '';
  assert.ok(mime.includes('text/css'), `MIME CSS attendu, reçu : ${mime}`);
  const corps = await reponse.text();
  assert.ok(corps.trim().length > 0, 'la feuille de style ne doit pas être vide');
});

test('GET /js/app.js sert le script en JavaScript', async () => {
  const reponse = await fetch(`${baseUrl}/js/app.js`);
  assert.equal(reponse.status, 200);
  const mime = reponse.headers.get('content-type') ?? '';
  assert.ok(mime.includes('javascript'), `MIME JavaScript attendu, reçu : ${mime}`);
  const corps = await reponse.text();
  assert.ok(corps.trim().length > 0, 'le script ne doit pas être vide');
});

test('HEAD / répond sans corps avec les mêmes en-têtes', async () => {
  const reponse = await fetch(`${baseUrl}/`, { method: 'HEAD' });
  assert.equal(reponse.status, 200);
  const mime = reponse.headers.get('content-type') ?? '';
  assert.ok(mime.includes('text/html'), `MIME HTML attendu, reçu : ${mime}`);
  const corps = await reponse.text();
  assert.equal(corps, '');
});

test('GET /version.json renvoie la version fournie', async () => {
  const reponse = await fetch(`${baseUrl}/version.json`);
  assert.equal(reponse.status, 200);
  const mime = reponse.headers.get('content-type') ?? '';
  assert.ok(mime.includes('application/json'), `MIME JSON attendu, reçu : ${mime}`);
  const donnees = await reponse.json();
  assert.deepEqual(donnees, { version: VERSION_TEST });
});

test('GET inconnu répond 404', async () => {
  const reponse = await fetch(`${baseUrl}/page-qui-n-existe-pas-12345`);
  assert.equal(reponse.status, 404);
});

test('POST sur une ressource statique est refusé avec 405', async () => {
  const reponse = await fetch(`${baseUrl}/`, { method: 'POST' });
  assert.equal(reponse.status, 405);
});

test('les chemins privés ne divulguent aucun fichier', async () => {
  const chemins = ['/server/app.js', '/server/start.js', '/.env', '/package.json'];
  for (const chemin of chemins) {
    const reponse = await fetch(baseUrl + chemin);
    assert.equal(reponse.status, 404, `attendu 404 pour ${chemin}`);
    const corps = await reponse.text();
    assert.ok(!corps.includes('createApp'), `pas de code privé pour ${chemin}`);
    assert.ok(!corps.includes('process.env'), `pas de secret pour ${chemin}`);
    const mime = reponse.headers.get('content-type') ?? '';
    assert.ok(!mime.includes('javascript'), `MIME neutre attendu pour ${chemin}, reçu : ${mime}`);
  }
});

test('traversal et chemins encodés ne divulguent aucun fichier', async () => {
  const attaques = [
    '/../server/app.js',
    '/js/../../server/app.js',
    '/%2e%2e/server/app.js',
    '/%2E%2E%2Fserver%2Fapp.js',
    '/..%2Fserver%2Fapp.js',
  ];
  for (const chemin of attaques) {
    const reponse = await fetch(baseUrl + chemin);
    assert.equal(reponse.status, 404, `attendu 404 pour ${chemin}`);
    const corps = await reponse.text();
    assert.ok(!corps.includes('createApp'), `pas de code privé pour ${chemin}`);
    const mime = reponse.headers.get('content-type') ?? '';
    assert.ok(!mime.includes('javascript'), `MIME neutre attendu pour ${chemin}, reçu : ${mime}`);
  }
});
