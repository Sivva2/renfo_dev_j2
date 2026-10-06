// Contrôle des zones sensibles d'une pull request : un test existant modifié ou supprimé exige
// « TEST-CHANGE: raison » ; la chaîne, les scripts, les dépendances et les configurations exigent
// « HARNAIS-CHANGE: raison ». Les justifications laissées en commentaire HTML ne comptent pas.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ZONE_TESTS = ['tests/', 'browser/'];
const ZONE_HARNAIS = ['.github/', 'scripts/', '.githooks/'];
const FICHIERS_HARNAIS = ['package.json', 'package-lock.json', 'dependances-autorisees.json', 'eslint.config.js', 'playwright.config.js', 'playwright.smoke.config.js', 'vercel.json', 'cahier-personnel.json'];
const LONGUEUR_MIN = 15;

export function lireChangements(sortieGit) {
  return sortieGit.split('\n').map((l) => l.trim()).filter(Boolean).map((ligne) => {
    const [statut, ...chemins] = ligne.split('\t');
    return { statut: statut[0], chemins };
  });
}

export function justification(description, etiquette) {
  const texte = (description ?? '').replace(/<!--[\s\S]*?-->/g, '');
  const trouve = texte.match(new RegExp(`^\\s*${etiquette}:\\s*(.+)$`, 'mi'));
  return trouve && trouve[1].trim().length >= LONGUEUR_MIN ? trouve[1].trim() : null;
}

const commencePar = (chemin, prefixes) => prefixes.some((p) => chemin.startsWith(p));

export function analyserChangements(changements, description) {
  const problemes = [];
  const testChange = justification(description, 'TEST-CHANGE');
  const harnaisChange = justification(description, 'HARNAIS-CHANGE');
  for (const { statut, chemins } of changements) {
    for (const brut of chemins) {
      const chemin = brut.replaceAll('\\', '/');
      if (commencePar(chemin, ZONE_TESTS) && statut !== 'A' && !testChange) {
        problemes.push(`Test existant modifié ou supprimé sans justification : ${chemin}. Ajoutez « TEST-CHANGE: raison précise » dans la description de la PR.`);
      }
      const harnais = commencePar(chemin, ZONE_HARNAIS) || FICHIERS_HARNAIS.includes(chemin) || (chemin === 'AGENTS.md' && statut !== 'A');
      if (harnais && !harnaisChange) {
        problemes.push(`Harnais modifié sans justification : ${chemin}. Ajoutez « HARNAIS-CHANGE: raison précise » dans la description de la PR.`);
      }
    }
  }
  return { ok: problemes.length === 0, problemes };
}

function principal() {
  const base = process.env.BASE_REF;
  if (!base) {
    console.log('Hors pull request : contrôle des tests et du harnais ignoré.');
    return;
  }
  const sortie = execFileSync('git', ['diff', '--name-status', '-M', `origin/${base}...HEAD`], { encoding: 'utf8' });
  const { ok, problemes } = analyserChangements(lireChangements(sortie), process.env.PR_BODY ?? '');
  if (ok) {
    console.log('Tests et harnais : aucun changement sensible sans justification.');
    return;
  }
  for (const p of problemes) console.error(p);
  process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  principal();
}
