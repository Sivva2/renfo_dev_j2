# R3 · Premiers tests unitaires

**Objectif** : ajouter à `brain.js` la fonction pure (sans accès à la page) tirée au sort, en deux commits : le test vu rouge, puis le code vert. Minimum attendu de tous : les paliers 1 et 2 ; pour aller plus loin : le palier 3, puis une deuxième fonction de la liste, avec ses deux commits `test:` et `feat:`.

**Ce que vous apprenez** : un test jamais vu rouge ne prouve rien, alors on le voit échouer avant d'écrire le code. Le test vient des critères, pas du code : chaque critère a au moins une assertion. Et un bon test casse quand on retire le code.

**À faire** (chrono : 60 min ; terminal dans `atelier`). Le formateur tire votre fonction parmi les trois ci-dessous. Chacune est exportée par `public/js/brain.js`, sans accès à la page. Dans les commandes et les demandes de cette fiche, remplacez `<fonction>` par son nom. Le round se fait en 3 paliers, tous dans cette fiche : avancez à votre rythme. Sans agent, vous écrivez le test et le code à la main : ça compte pareil.

F1, `synonyme(message)`, donne le mot de référence. C1 : `'coucou'`, `'hello'` et `'bonsoir'` donnent `'salut'`. C2 : `'help'` et `'sos'` donnent `'aide'`. C3 : la casse et les espaces autour ne comptent pas, `'  HELLO '` donne `'salut'`. C4 : un autre message revient en minuscules, sans les espaces autour, `'  Météo '` donne `'météo'`. C5 : ce qui n'est pas du texte (`undefined`, `null`, `42`) donne `''`, sans erreur.

F2, `compterMots(message)`, compte les mots. C1 : `'salut'` donne 1, `'où est le refuge'` donne 4. C2 : `'un   deux'` donne 2, `'un\tdeux\ntrois'` donne 3. C3 : `'   salut   '` donne 1. C4 : `''` et les espaces seuls donnent 0. C5 : ce qui n'est pas du texte donne 0, sans erreur.

F3, `estEnMajuscules(message)`, dit si le message est en majuscules. C1 : `'SALUT'` et `'OÙ EST LE REFUGE ?'` donnent `true`. C2 : `'Salut'` et `'SALUT toi'` donnent `false`. C3 : sans lettre (`'123 !'`), `false`. C4 : il faut deux lettres au moins, `'OK'` donne `true`, `'A'` donne `false`. C5 : ce qui n'est pas du texte donne `false`, sans erreur.

Palier 1 sur 3, le test d'abord. Recopiez dans le carnet, partie R3, la fonction tirée et ses critères. Créez `tests/<fonction>.test.js`, avec une assertion au moins par critère, écrite par vous ou par l'agent. Le fichier commence par `import { it } from 'node:test';`, `import assert from 'node:assert/strict';` et `import { <fonction> } from '../public/js/brain.js';`.

Pour l'agent, la demande est `Écris uniquement tests/<fonction>.test.js, une assertion au moins par critère C1 à C5. Ne touche à aucun autre fichier.` Lancez ensuite les tests : le bon rouge est `does not provide an export named '<fonction>'`, car la fonction n'existe pas encore. Une faute de frappe dans le test n'est pas le bon rouge : corrigez le test. Puis faites le commit du test seul :
```powershell
npm test
git add -- tests/<fonction>.test.js
git commit -m "test: <fonction>, critères C1 à C5"
```

Palier 2 sur 3, le code. Écrivez à la fin de `public/js/brain.js` la fonction exportée `<fonction>`, pure, pour faire passer votre test. Avec l'agent, ouvrez une nouvelle session dsh et collez cette demande : `Ajoute à la fin de public/js/brain.js la fonction exportée <fonction>, pure, pour faire passer tests/<fonction>.test.js. Ne modifie aucun test.` Relisez le diff avec `git diff`, puis lancez les tests : ils affichent `fail 0`. Faites alors le commit du code :
```powershell
npm test
git add -- public/js/brain.js
git commit -m "feat: <fonction>"
```

Palier 3 sur 3, le test vérifie-t-il vraiment ? Seulement si votre commit `feat:` est fait (sinon `git restore` efface votre code) : remplacez la ligne `return` finale de votre fonction par une valeur fixe (F1 : `return '';`, F2 : `return 1;`, F3 : `return false;`). Lancez les tests : un test au moins rougit, recopiez son nom dans le carnet. Puis remettez le code et vérifiez que tout est vert. Pour aller plus loin ensuite, reprenez les paliers 1 et 2 avec une deuxième fonction de la liste :
```powershell
npm test
git restore -- public/js/brain.js
npm test
```

**Comment on compte** (points de jeu) : 3 points si le commit `test:` ne contient que le test et qu'il est rouge pour la bonne raison (le formateur le rejoue). 3 points si le commit `feat:` rend `npm test` vert, contrat compris, sans toucher aucun test. 2 points si chaque critère a son assertion, et 2 points si votre test rougit quand le formateur fausse votre code. Bonus : +2 au premier binôme dont les deux commits sont validés, +1 au deuxième.

**Preuve** : `git log --oneline` montre `test:` sous `feat:`, et la casse volontaire est dans le carnet.
