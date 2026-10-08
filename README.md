# Cap Web

Cap Web est un petit assistant de conversation à règles, qui tourne dans le navigateur. Il répond à quelques mots (« salut », « aide », « test » et trois mots à nous), compte les caractères pendant la frappe, et peut demander un conseil au serveur. Il n'utilise aucune IA : chaque réponse vient d'une règle écrite dans `brain.js`.

C'est le projet du module « Renforcement Dev Web » du binôme b16 (Kevin Abaskaran, Haidar Esber) : on y pratique HTML, CSS, JavaScript, les tests automatisés, Git et la revue de code.

## Installer

Il faut Node 24.20 ou plus, et Git.

```powershell
node --version
git clone https://github.com/Sivva2/renfo_dev_j2.git
cd renfo_dev_j2\atelier
npm ci
```

Si PowerShell refuse `npm`, tapez `npm.cmd` à la place. `npm ci` signale une vulnérabilité dans un outil de développement : elle est sans effet sur Cap Web, ne lancez pas `npm audit fix`.

Les réglages du binôme (la limite de caractères et nos deux mots) sont dans `atelier/cahier-personnel.json`. Ce fichier est déjà dans le dépôt : il n'y a rien à créer.

## Lancer

Dans `atelier` :

```powershell
npm start
```

Ouvrez http://127.0.0.1:3000 dans le navigateur. Ctrl+C arrête le serveur. Le port 3000 est déjà pris ? Tapez `$env:PORT=3001`, puis `npm start`, et ouvrez http://127.0.0.1:3001.

Essayez « aide » pour voir les mots connus, et « conseil » pour recevoir un conseil du serveur.

## Tester

Dans `atelier` :

```powershell
npm run lint
npm test
```

`npm test` doit afficher `fail 0`. Les tests navigateur sont facultatifs (environ 150 Mo à télécharger) :

```powershell
npx playwright install chromium
npm run test:browser
```

## La route `/api/conseil`

Le serveur répond à `GET /api/conseil` par un objet JSON, avec un conseil tiré au hasard parmi trois :

```json
{ "conseil": "Écrivez le test avant le code." }
```

Le statut est 200 et l'en-tête `content-type` vaut `application/json; charset=utf-8`. Dans la page, le message « conseil » appelle cette route avec `fetch`. Si le serveur ne répond pas, Cap Web affiche « Le serveur ne répond pas : conseil indisponible. » au lieu de planter. Le test est dans `atelier/tests/conseil.test.js`.

Le serveur sert aussi `GET /version.json`, qui donne la version affichée en pied de page (« version indisponible » en cas d'erreur).

## Ce qui protège Cap Web

- Un message vide, fait d'espaces, ou plus long que la limite est refusé, avec une erreur visible sous le formulaire.
- Le texte des messages est affiché avec `textContent` : `<b>test</b>` s'affiche tel quel, chevrons compris, sans être interprété comme du HTML.
- Le serveur ne sert qu'une liste fixe de fichiers, et répond 404 à tout le reste.
- Sous 600 px de large, le bouton Envoyer prend toute la largeur : la page reste lisible sur téléphone.

## Arborescence

```
.
├── atelier/                 # le projet Cap Web
│   ├── public/              # ce que le navigateur charge
│   │   ├── index.html       # la page : formulaire, compteur, liste des messages
│   │   ├── styles.css       # le style, dont la version mobile
│   │   └── js/
│   │       ├── brain.js     # les règles de réponse, fonctions pures, sans toucher à la page
│   │       ├── view.js      # l'affichage des messages, en texte seulement
│   │       └── app.js       # le câblage : formulaire, compteur, historique, appels au serveur
│   ├── server/
│   │   ├── app.js           # les routes : fichiers statiques, /version.json, /api/conseil
│   │   └── start.js         # le démarrage du serveur sur 127.0.0.1
│   ├── tests/               # les tests node:test (contrat, serveur, conseil, synonyme, harnais)
│   ├── browser/             # les tests navigateur Playwright (facultatifs)
│   ├── scripts/             # les outils de vérification et de construction
│   ├── cahier-personnel.json  # nos réglages : limite et deux mots
│   ├── package.json         # les scripts npm et les outils de développement
│   ├── README.md            # le résumé des trois modules de public/js
│   └── SPEC.md              # la spécification de Cap Web
├── defis/                   # les fiches des 4 rounds du jour 2
├── carnet-j2.md             # notre carnet de bord, J2 et J3
├── GRILLE.md                # la grille d'évaluation du module
└── README.md                # ce fichier
```
