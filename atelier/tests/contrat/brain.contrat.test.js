import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { validateMessage, replyTo } from '../../public/js/brain.js';

// Contrat CP1 fourni par le formateur. Ne pas modifier : c'est la spécification du chatbot de J1.

// Cahier personnel du binôme : `cahier-personnel.json` à la racine du dépôt, posé par le formateur (fichier protégé : le modifier exige une ligne HARNAIS-CHANGE).
// Il fixe la limite de caractères du message et deux mots reconnus en plus de « salut », « aide » et « test ». Sans ce fichier, ou avec un fichier mal formé, les tests
// ÉCHOUENT : le contrat ne retombe jamais sur 280 caractères et aucun mot, ce qui permettrait de supprimer le fichier pour passer.
const cahier = (() => {
  let brut;
  try { brut = readFileSync(new URL('../../cahier-personnel.json', import.meta.url), 'utf8'); } catch { throw new Error('cahier-personnel.json absent : le formateur le pose à la racine du dépôt de chaque binôme ; sans lui le contrat refuse de juger'); }
  const c = JSON.parse(brut);
  const motsValides = Array.isArray(c.mots) && c.mots.length === 2 && c.mots.every((m) => typeof m === 'string' && /^[a-zàâçéèêëîïôûùüÿœ]{4,12}$/.test(m)) && new Set(c.mots).size === 2;
  if (!Number.isInteger(c.limite) || c.limite < 160 || c.limite > 400 || c.limite % 10 !== 0 || !motsValides || c.mots.some((m) => ['salut', 'bonjour', 'aide', 'test'].includes(m))) {
    throw new Error('cahier-personnel.json invalide : « limite » (160 à 400, par pas de 10) et « mots » (deux mots de 4 à 12 lettres minuscules, différents de salut, bonjour, aide et test) sont attendus');
  }
  return c;
})();
const LIMITE = cahier.limite;
const MOTS = cahier.mots;
const sansCommentaires = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const lire = async (fichier) => sansCommentaires(await readFile(new URL(`../../public/js/${fichier}`, import.meta.url), 'utf8'));

describe('Contrat CP1 — validateMessage', () => {
  it('refuse ce qui n’est pas du texte, avec un message d’erreur', () => {
    for (const entree of [undefined, null, 42, {}, []]) {
      const r = validateMessage(entree);
      assert.equal(r.ok, false);
      assert.equal(typeof r.error, 'string');
      assert.ok(r.error.trim().length > 0);
    }
  });

  it('refuse le vide et les espaces seuls', () => {
    for (const entree of ['', ' ', '   \n\t ']) {
      const r = validateMessage(entree);
      assert.equal(r.ok, false);
      assert.ok(r.error.trim().length > 0);
    }
  });

  it('accepte un message et retire les espaces autour', () => {
    assert.deepEqual(validateMessage('  salut  '), { ok: true, value: 'salut' });
  });

  it(`accepte ${LIMITE} caractères et refuse ${LIMITE + 1}`, () => {
    assert.deepEqual(validateMessage('a'.repeat(LIMITE)), { ok: true, value: 'a'.repeat(LIMITE) });
    assert.equal(validateMessage('a'.repeat(LIMITE + 1)).ok, false);
  });

  it('mesure la longueur après avoir retiré les espaces', () => {
    assert.equal(validateMessage(`  ${'a'.repeat(LIMITE)}  `).ok, true);
  });
});

describe('Contrat CP1 — replyTo', () => {
  it('répond toujours par un texte non vide', () => {
    for (const m of ['salut', 'aide', 'test', 'une phrase inconnue', '']) {
      const r = replyTo(m);
      assert.equal(typeof r, 'string');
      assert.ok(r.trim().length > 0);
    }
  });

  it('ignore la casse et les espaces autour', () => {
    assert.equal(replyTo('  SALUT '), replyTo('salut'));
    assert.equal(replyTo('Aide'), replyTo('aide'));
    assert.equal(replyTo(' TEST'), replyTo('test'));
  });

  it('donne la même réponse à « bonjour » et à « salut »', () => {
    assert.equal(replyTo('bonjour'), replyTo('salut'));
  });

  it('donne une réponse distincte à salut, aide et test', () => {
    assert.equal(new Set([replyTo('salut'), replyTo('aide'), replyTo('test')]).size, 3);
  });

  it('reconnaît les deux mots du cahier personnel, quelles que soient la casse et les espaces autour', () => {
    const repli = replyTo('parle-moi de la météo');
    for (const mot of MOTS) {
      assert.notEqual(replyTo(mot), repli, `« ${mot} » doit recevoir une réponse propre, pas le repli`);
      assert.equal(replyTo(`  ${mot.toUpperCase()} `), replyTo(mot));
    }
    assert.equal(new Set([replyTo(MOTS[0]), replyTo(MOTS[1]), replyTo('salut'), replyTo('aide'), replyTo('test')]).size, 5, 'chaque mot reconnu a sa propre réponse');
  });

  it('répond à une phrase inconnue par un repli distinct', () => {
    const repli = replyTo('parle-moi de la météo');
    assert.ok(![replyTo('salut'), replyTo('aide'), replyTo('test')].includes(repli));
  });
});

describe('Contrat CP1 — chaque module garde son rôle', () => {
  it('brain.js ne touche pas à la page', async () => {
    assert.doesNotMatch(await lire('brain.js'), /\bdocument\b|\bwindow\b|localStorage/, 'brain.js reste pur : aucun accès à la page');
  });

  it('view.js affiche du texte et ne décide pas des réponses', async () => {
    const code = await lire('view.js');
    assert.doesNotMatch(code, /innerHTML|outerHTML|insertAdjacentHTML/, 'affichage avec textContent uniquement');
    assert.doesNotMatch(code, /replyTo|validateMessage/, 'view.js ne décide pas des réponses');
  });

  it('app.js ne fabrique pas les lignes de la conversation', async () => {
    assert.doesNotMatch(await lire('app.js'), /createElement\(\s*['"]li['"]\s*\)/, 'la création des lignes appartient à view.js');
  });

  it('app.js n’injecte jamais de HTML', async () => {
    assert.doesNotMatch(await lire('app.js'), /innerHTML|outerHTML|insertAdjacentHTML/, 'le texte reste du texte, dans app.js aussi');
  });
});
