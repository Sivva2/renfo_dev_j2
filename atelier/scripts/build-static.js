// Construit le site statique de prod : copie public/ dans dist/ et écrit dist/version.json,
// pour vérifier en ligne quel commit est réellement déployé.
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function contenuVersion(env, maintenant = new Date()) {
  const commit = env.DEPLOY_SHA || env.GITHUB_SHA || env.VERCEL_GIT_COMMIT_SHA || 'local';
  return { version: commit === 'local' ? 'local' : commit.slice(0, 7), commit, construit: maintenant.toISOString() };
}

export async function construire({ racine, env = process.env, maintenant = new Date() }) {
  const dist = path.join(racine, 'dist');
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(path.join(racine, 'public'), dist, { recursive: true });
  await writeFile(path.join(dist, 'version.json'), JSON.stringify(contenuVersion(env, maintenant)) + '\n');
  return dist;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dist = await construire({ racine: process.cwd() });
  console.log(`Site statique construit dans ${dist}`);
}
