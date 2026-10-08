# Cap Web · jour 2

Ce dossier contient tout le jour 2, sur votre poste : l'atelier (Cap Web et son contrat), les fiches des 4 rounds, le carnet et la [grille d'évaluation](GRILLE.md) du module. Les patchs du round 4 arrivent au début du round 4, dans un second ZIP. Pas de GitHub aujourd'hui.

## Installer (10 min)

Ouvrez un terminal PowerShell dans le dossier `cap-web-j2` décompressé, celui qui contient `atelier`, `defis` et `carnet-j2.md`. Vérifiez d'abord votre version de Node : il faut 24.20 ou plus.

```powershell
node --version
```

Installez ensuite les outils de l'atelier. Si PowerShell refuse `npm`, tapez `npm.cmd` à la place de `npm`, pour toutes les commandes de la journée.

```powershell
cd atelier
npm ci
```

`npm ci` annonce une vulnérabilité : c'est normal, ne lancez pas `npm audit fix`.

Créez vos réglages, avec les 3 valeurs reçues en privé à J1. Copiez l'exemple, puis ouvrez `cahier-personnel.json` dans l'éditeur : remplacez 240, boussole et refuge (l'exemple) par votre limite et vos deux mots, et enregistrez. Ne créez pas ce fichier avec `>` ni avec `Set-Content` : le contrat refuserait son encodage.

```powershell
Copy-Item cahier-personnel.exemple.json cahier-personnel.json
```

Lancez Cap Web et ouvrez http://127.0.0.1:3000 dans le navigateur. Ctrl+C l'arrête.

```powershell
npm start
```

Lancez ensuite les tests. Des tests rouges, c'est normal : c'est le round 1.

```powershell
npm test
```

Enfin, remontez dans le dossier `cap-web-j2`, puis sauvegardez le point de départ.

```powershell
cd ..
git init -b main
git add -- atelier carnet-j2.md
git commit -m "J2 : départ"
git tag depart
```

Si Git demande qui vous êtes, donnez votre nom et votre adresse, puis refaites le commit et le tag.

```powershell
git config user.name "Prénom Nom"
git config user.email "vous@exemple.fr"
```

Les tests navigateur sont facultatifs, et demandent environ 150 Mo à télécharger. Pour les lancer, dans `atelier` :

```powershell
npx playwright install chromium
npm run test:browser
```

Vous avez fini J1 et préférez votre propre code ? Avant de sauvegarder le point de départ, remplacez `atelier/public` par le dossier `public` de votre `cap-web-j1/atelier`.

## Les 4 rounds

Chaque round a un cours court, un défi chronométré et un podium. Les fiches sont dans `defis` : [les tests automatisés](defis/R1-contrat.md) en 45 min, [documenter le projet](defis/R2-ce-que-voit-l-agent.md) en 45 min, [premiers tests unitaires](defis/R3-rouge-d-abord.md) en 60 min, et [la revue de code](defis/R4-abordage.md) en 40 min. Chaque fiche contient tous les paliers du round : avancez à votre rythme. Elle dit aussi le minimum attendu de tous, et ce qui permet d'aller plus loin.

L'agent dsh est facultatif : sans agent, vous travaillez à la main, et ça compte pareil. Le [carnet](carnet-j2.md) commence par votre positionnement, chacun de vous deux, puis se remplit au fil des rounds.

Les points de jeu servent au podium du jour, où seuls les 3 premiers binômes sont affichés : 0 à 10 par round, puis à chaque round +2 au premier binôme qui finit, +1 au deuxième et +2 à la meilleure explication. Ils ne comptent pas dans l'évaluation du module, qui suit la [grille d'évaluation](GRILLE.md).

## Les règles du jour

Après le commit de départ, personne ne modifie `atelier/tests/contrat/`, `atelier/browser/contrat.spec.js` ni `atelier/cahier-personnel.json` : ni vous, ni l'agent.

Aucune clé, aucun mot de passe, aucune donnée personnelle ne va dans un fichier ou dans un chat d'IA. Et aucun changement de l'agent n'est accepté sans un diff relu, que vous savez expliquer.

## Remise, en fin de journée

Remplissez d'abord la partie « Fin de journée » du carnet. Ouvrez ensuite un terminal dans le dossier `cap-web-j2` (celui qui contient `atelier` et `carnet-j2.md`), faites le dernier commit, puis vérifiez que vos commits `fix:`, `docs:`, `test:` et `feat:` sont là.

```powershell
git add -- atelier carnet-j2.md
git commit -m "J2 : fin de journée"
git log --oneline
```

Préparez ensuite les 2 fichiers de la remise, en remplaçant `bXX` par votre identifiant de binôme. Déposez-les dans Teams, onglet Fichiers, dossier « Remise J2 ».

```powershell
git bundle create bXX-j2.bundle --all
Copy-Item carnet-j2.md bXX-carnet-j2.md
```

## Arborescence

```
atelier/
├── public/            # ce que le navigateur charge
│   ├── index.html     # la page
│   ├── styles.css     # le style (dont la version mobile)
│   └── js/
│       ├── brain.js   # les règles de réponse, sans toucher à la page
│       ├── view.js    # l'affichage des messages
│       └── app.js     # le câblage : formulaire, compteur, appels au serveur
├── server/            # le serveur Node
│   ├── app.js         # routes : fichiers statiques, /version.json, /api/conseil
│   └── start.js       # démarrage
├── tests/             # les tests (contrat, harnais, serveur, synonyme, conseil)
├── scripts/           # outils de vérification et de construction
├── README.md
└── SPEC.md
```
