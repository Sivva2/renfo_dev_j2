import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { analyserChangements, justification, lireChangements } from '../../scripts/check-tests.js';

// Tests du contrôle des zones sensibles d'une pull request.
describe('check-tests', () => {
  it('lit la sortie de git diff --name-status, renommages compris', () => {
    const sortie = 'M\tpublic/js/brain.js\nA\ttests/identite.test.js\nR087\ttests/a.test.js\ttests/b.test.js\n';
    assert.deepEqual(lireChangements(sortie), [
      { statut: 'M', chemins: ['public/js/brain.js'] },
      { statut: 'A', chemins: ['tests/identite.test.js'] },
      { statut: 'R', chemins: ['tests/a.test.js', 'tests/b.test.js'] },
    ]);
  });

  it('autorise l’ajout de nouveaux tests sans justification', () => {
    assert.equal(analyserChangements(lireChangements('A\ttests/identite.test.js\nM\tpublic/js/app.js'), '').ok, true);
  });

  it('refuse un test existant modifié sans TEST-CHANGE', () => {
    const r = analyserChangements(lireChangements('M\ttests/contrat/brain.contrat.test.js'), 'Petite correction');
    assert.equal(r.ok, false);
    assert.match(r.problemes[0], /TEST-CHANGE/);
  });

  it('accepte un test modifié avec une justification précise', () => {
    const r = analyserChangements(lireChangements('D\tbrowser/vieux.spec.js'), 'TEST-CHANGE: doublon exact de contrat.spec.js, même scénario');
    assert.equal(r.ok, true);
  });

  it('refuse une justification trop courte', () => {
    assert.equal(justification('TEST-CHANGE: flaky', 'TEST-CHANGE'), null);
  });

  it('ignore les justifications laissées en commentaire dans le modèle de PR', () => {
    const r = analyserChangements(lireChangements('M\ttests/server.test.js'), '<!-- TEST-CHANGE: raison précise si un test change -->');
    assert.equal(r.ok, false);
  });

  it('exige HARNAIS-CHANGE pour la chaîne, les scripts, package.json et les configurations', () => {
    for (const chemin of ['.github/workflows/chaine.yml', 'scripts/check-tests.js', '.githooks/pre-commit', 'cahier-personnel.json', 'package.json', 'package-lock.json', 'dependances-autorisees.json', 'eslint.config.js', 'playwright.config.js', 'vercel.json']) {
      assert.equal(analyserChangements(lireChangements(`M\t${chemin}`), '').ok, false, chemin);
    }
    assert.equal(analyserChangements(lireChangements('M\tpackage.json'), 'HARNAIS-CHANGE: ajout du script check:deps demandé en CP2').ok, true);
  });

  it('autorise la création d’AGENTS.md mais pas sa modification silencieuse', () => {
    assert.equal(analyserChangements(lireChangements('A\tAGENTS.md'), '').ok, true);
    assert.equal(analyserChangements(lireChangements('M\tAGENTS.md'), '').ok, false);
  });

  it('contrôle aussi l’ancien chemin d’un test déplacé hors des tests', () => {
    const r = analyserChangements(lireChangements('R100\ttests/contrat/brain.contrat.test.js\tdocs/ancien-contrat.js'), '');
    assert.equal(r.ok, false);
  });
});
