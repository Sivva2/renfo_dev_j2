// Contrôle « zéro dépendance non justifiée » : package.json doit correspondre exactement
// à dependances-autorisees.json. Toute différence fait échouer la chaîne.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SECTIONS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];

export function comparerDependances(paquet, autorisees) {
  const problemes = [];
  for (const section of SECTIONS) {
    const recues = paquet[section] ?? {};
    const attendues = autorisees[section] ?? {};
    for (const [nom, version] of Object.entries(recues)) {
      if (!(nom in attendues)) problemes.push({ type: 'ajout', section, nom, recu: version });
      else if (attendues[nom] !== version) problemes.push({ type: 'version', section, nom, attendu: attendues[nom], recu: version });
    }
    for (const [nom, version] of Object.entries(attendues)) {
      if (!(nom in recues)) problemes.push({ type: 'retrait', section, nom, attendu: version });
    }
  }
  return problemes;
}

export function formaterProbleme(p) {
  if (p.type === 'ajout') return `Dépendance ajoutée sans autorisation : ${p.nom}@${p.recu} (${p.section})`;
  if (p.type === 'version') return `Version modifiée : ${p.nom} ${p.attendu} → ${p.recu} (${p.section})`;
  return `Dépendance retirée : ${p.nom}@${p.attendu} (${p.section})`;
}

async function principal() {
  const paquet = JSON.parse(await readFile('package.json', 'utf8'));
  const autorisees = JSON.parse(await readFile('dependances-autorisees.json', 'utf8'));
  const problemes = comparerDependances(paquet, autorisees);
  if (problemes.length === 0) {
    console.log('Dépendances conformes à dependances-autorisees.json.');
    return;
  }
  for (const p of problemes) console.error(formaterProbleme(p));
  console.error('Règle du harnais : aucune dépendance sans justification. Pour en ajouter une, modifiez dependances-autorisees.json dans la même PR et justifiez-le par une ligne « HARNAIS-CHANGE: raison » dans sa description.');
  process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await principal();
}
