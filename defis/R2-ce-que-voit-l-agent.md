# R2 · Documenter le projet

**Objectif** : écrire la documentation de Cap Web pour quelqu'un qui le découvre : le `README.md` (installer, lancer, comprendre), la spécification (`SPEC.md`), puis les conventions écrites du projet (`AGENTS.md`). Minimum attendu de tous : `README.md` et `SPEC.md` ; pour aller plus loin : les conventions, puis les demandes pièges du formateur, avec l'agent.

**Ce que vous apprenez** : un README se juge sur une question : un nouveau développeur peut-il installer, lancer et comprendre le projet sans vous ? Un critère de spécification ne vaut que s'il peut échouer : chaque critère de `SPEC.md` nomme ce qui le vérifie. Les conventions écrites sont lues par l'agent comme par un nouveau développeur : ce qui n'y est pas écrit, ni l'un ni l'autre ne le sait.

**À faire** (chrono : 45 min ; terminal et fichiers dans `atelier`). Le round se fait en 3 paliers, tous dans cette fiche : avancez à votre rythme.

Palier 1 sur 3, le README. Remplacez le contenu de `README.md` par le vôtre, en 3 parties : à quoi sert Cap Web (3 lignes), comment l'installer et le lancer (les commandes, dans l'ordre), et les 3 modules de `public/js`, avec le rôle de chacun. Le palier est fini quand le README est commité :
```powershell
git add -- README.md
git commit -m "docs: README"
```

Palier 2 sur 3, la spécification. Écrivez `SPEC.md` : 5 critères numérotés « Quand …, Cap Web … », chacun suivi de sa vérification, c'est-à-dire le test ou l'essai qui le vérifie. Un exemple, avec les valeurs de l'exemple et pas les vôtres : « 1. Quand on envoie 241 caractères, Cap Web refuse et l'erreur cite 240. Vérifié par : test « accepte 240 caractères et refuse 241 ». » Le palier est fini quand les 5 critères ont chacun leur vérification :
```powershell
git add -- SPEC.md
git commit -m "docs: spécification"
```

Palier 3 sur 3, les conventions. Écrivez `AGENTS.md`, les conventions écrites du projet, en deux parties : le nommage (une fonction, une constante, un fichier, un message de commit) et les interdits, 4 au moins. Un exemple de nommage : « Une fonction porte un verbe qui dit ce qu'elle fait, comme validateMessage. » Un exemple d'interdit : « Ne modifie jamais tests/contrat/ ni cahier-personnel.json. Si un test te semble faux, arrête-toi et explique pourquoi. » Le palier est fini quand `AGENTS.md` est commité :
```powershell
git add -- AGENTS.md
git commit -m "docs: conventions"
```

Pour aller plus loin, avec l'agent. Le formateur publie 3 demandes dans Teams. Pour chacune, ouvrez une nouvelle session dsh, collez la demande telle quelle, puis lisez la réponse et chaque demande d'autorisation. Si l'agent refuse en citant `AGENTS.md`, c'est bien. S'il veut écrire quelque chose d'interdit, refusez l'autorisation : `AGENTS.md` guide l'agent, il ne l'empêche de rien.

Si un fichier a changé quand même, restaurez-le (un fichier nouveau, supprimez-le). Après chaque demande, la deuxième commande n'affiche rien :
```powershell
git restore -- <fichier>
git status --short -- .
```

Dans le carnet, partie R2, écrivez pour chaque demande ce qu'a fait l'agent, votre décision et la règle concernée. Une règle manquait ? Ajoutez-la à `AGENTS.md`, puis faites son commit avec `git add -- AGENTS.md` et `git commit -m "docs: conventions, règle ajoutée"`.

**Comment on compte** (points de jeu) : `README.md` vaut 3 points, un par partie, si ses commandes marchent telles quelles. `SPEC.md` vaut 1 point par critère vérifiable, c'est-à-dire qui nomme un test ou un essai de 30 secondes qui échouerait sans lui (5 au plus). `AGENTS.md` vaut 2 points avec ses deux parties, le nommage et 4 interdits au moins. Bonus : +1 par demande piège déjouée (3 au plus), quand rien d'interdit n'entre dans un commit et que le carnet dit qui a refusé, l'agent ou vous ; +2 au premier binôme dont les 3 documents sont validés, +1 au deuxième.

**Preuve** : `README.md`, `SPEC.md` et `AGENTS.md` commités, chacun avec son commit `docs:` ; pour aller plus loin, `git status --short -- .` vide après chaque demande et une ligne par demande dans le carnet.
