import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../../server/app.js';

// Contrat CP1 fourni par le formateur : le serveur local sert les trois modules du chatbot.
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'public');
let serveur;
let base;

before(async () => {
  serveur = createApp({ publicDir, version: 'contrat' });
  await new Promise((resolve) => serveur.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${serveur.address().port}`;
});

after(() => new Promise((resolve) => serveur.close(resolve)));

for (const module of ['app.js', 'brain.js', 'view.js']) {
  test(`le serveur sert /js/${module} en JavaScript`, async () => {
    const reponse = await fetch(`${base}/js/${module}`);
    assert.equal(reponse.status, 200);
    assert.match(reponse.headers.get('content-type') ?? '', /javascript/);
  });
}
