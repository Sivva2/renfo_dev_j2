# Cap Web

Cap Web est un petit assistant de conversation à règles, qui tourne dans le navigateur.
Il répond à quelques mots (« salut », « aide », « test » et deux mots personnels) et il n'utilise aucune IA.
Il sert de projet d'apprentissage : on y pratique les tests automatisés, la documentation et la revue de code.

Le README complet (installation, tests, route `/api/conseil`, arborescence) est à la racine du dépôt : [../README.md](../README.md).

## Installer et lancer

Il faut Node 24.20 ou plus (`node --version` pour vérifier).

```bash
cd atelier
npm ci
npm start
```

Ouvrez ensuite http://127.0.0.1:3000 dans le navigateur. Ctrl+C arrête le serveur.

Pour lancer les tests :

```bash
npm test
```

`npm ci` signale une vulnérabilité dans un outil de développement : c'est sans effet, ne lancez pas `npm audit fix`.

## Les 3 modules de `public/js`

- `brain.js` : les règles. Il contient `validateMessage` (refuse le vide, les espaces seuls et les messages trop longs) et `replyTo` (choisit la réponse). Ce sont des fonctions pures : aucun accès à la page.
- `view.js` : l'affichage. `renderMessages` dessine l'historique dans la page, avec du texte seulement. Il ne décide d'aucune réponse.
- `app.js` : le câblage. Il lit le formulaire, appelle `brain.js`, met à jour l'historique (sauvegardé dans le navigateur) et le compteur, demande un conseil au serveur (`/api/conseil`) et demande l'affichage à `view.js`.
