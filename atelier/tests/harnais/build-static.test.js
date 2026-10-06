import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { construire, contenuVersion } from '../../scripts/build-static.js';

// Tests de la construction du site statique de prod.
const date = new Date('2026-09-15T09:00:00.000Z');

describe('build-static', () => {
  it('utilise le commit déployé en priorité', () => {
    assert.deepEqual(contenuVersion({ DEPLOY_SHA: 'abcdef1234567', GITHUB_SHA: '9999999999999' }, date),
      { version: 'abcdef1', commit: 'abcdef1234567', construit: '2026-09-15T09:00:00.000Z' });
  });

  it('indique « local » hors chaîne', () => {
    assert.deepEqual(contenuVersion({}, date), { version: 'local', commit: 'local', construit: '2026-09-15T09:00:00.000Z' });
  });

  it('copie public dans dist et écrit version.json', async () => {
    const racine = await mkdtemp(path.join(tmpdir(), 'capweb-build-'));
    try {
      await mkdir(path.join(racine, 'public', 'js'), { recursive: true });
      await writeFile(path.join(racine, 'public', 'index.html'), '<main></main>');
      await writeFile(path.join(racine, 'public', 'js', 'app.js'), '// app');
      const dist = await construire({ racine, env: { GITHUB_SHA: '1234567890abc' }, maintenant: date });
      assert.equal(await readFile(path.join(dist, 'index.html'), 'utf8'), '<main></main>');
      assert.equal(await readFile(path.join(dist, 'js', 'app.js'), 'utf8'), '// app');
      assert.equal(JSON.parse(await readFile(path.join(dist, 'version.json'), 'utf8')).commit, '1234567890abc');
    } finally {
      await rm(racine, { recursive: true, force: true });
    }
  });

  it('repart d’un dist vide à chaque construction', async () => {
    const racine = await mkdtemp(path.join(tmpdir(), 'capweb-build-'));
    try {
      await mkdir(path.join(racine, 'public'), { recursive: true });
      await writeFile(path.join(racine, 'public', 'index.html'), '<main></main>');
      await mkdir(path.join(racine, 'dist'), { recursive: true });
      await writeFile(path.join(racine, 'dist', 'ancien.js'), '// reste d’un ancien build');
      await construire({ racine, env: {}, maintenant: date });
      await assert.rejects(readFile(path.join(racine, 'dist', 'ancien.js'), 'utf8'));
    } finally {
      await rm(racine, { recursive: true, force: true });
    }
  });
});
