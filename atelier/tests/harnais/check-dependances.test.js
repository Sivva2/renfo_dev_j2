import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { comparerDependances } from '../../scripts/check-dependances.js';

// Tests du contrôle « zéro dépendance non justifiée » : le harnais est lui aussi testé.
const autorisees = { devDependencies: { eslint: '10.10.0', '@playwright/test': '1.63.0' } };

describe('check-dependances', () => {
  it('accepte un package.json identique à la liste autorisée', () => {
    assert.deepEqual(comparerDependances({ devDependencies: { ...autorisees.devDependencies } }, autorisees), []);
  });

  it('signale une dépendance ajoutée', () => {
    const p = comparerDependances({ dependencies: { dayjs: '1.11.13' }, devDependencies: { ...autorisees.devDependencies } }, autorisees);
    assert.deepEqual(p, [{ type: 'ajout', section: 'dependencies', nom: 'dayjs', recu: '1.11.13' }]);
  });

  it('signale une version modifiée', () => {
    const p = comparerDependances({ devDependencies: { eslint: '9.0.0', '@playwright/test': '1.63.0' } }, autorisees);
    assert.deepEqual(p, [{ type: 'version', section: 'devDependencies', nom: 'eslint', attendu: '10.10.0', recu: '9.0.0' }]);
  });

  it('signale une dépendance retirée', () => {
    const p = comparerDependances({ devDependencies: { eslint: '10.10.0' } }, autorisees);
    assert.deepEqual(p, [{ type: 'retrait', section: 'devDependencies', nom: '@playwright/test', attendu: '1.63.0' }]);
  });
});
