# R1 · Les tests automatisés

**Objectif** : faire passer le contrat (les 15 tests de `brain.contrat`), sans jamais toucher au contrat. Minimum attendu de tous : 3 tests passés au vert, chacun dans un commit `fix:` (un commit peut en faire passer deux) ; pour aller plus loin : 15 sur 15, puis un commit `refactor:` qui renomme un nom peu clair.

**Ce que vous apprenez** : un test rouge se lit. Son nom dit la règle, son message dit l'écart. On corrige le code, jamais le test, parce que le contrat est la spécification. Et on fait un commit par correction : chaque commit répond à la question « quel test passe au vert ? ».

**À faire** (chrono : 45 min ; terminal dans `atelier`). Le départ contient 5 défauts cachés, et un défaut peut faire rougir deux tests. Le round se fait en 3 paliers, tous dans cette fiche : avancez à votre rythme. Sans agent, vous corrigez à la main : ça compte pareil.

Palier 1 sur 3, vos réglages. En haut de `public/js/brain.js`, mettez votre `LIMITE` et les deux mots de `MOTS`, chacun avec sa phrase, comme dans `cahier-personnel.json`, et enregistrez. Depuis le dossier `cap-web-j2`, entrez dans `atelier`, faites le commit de vos réglages, puis lancez les tests. Recopiez dans le carnet, partie R1, le nom de chaque test rouge (les lignes en retrait, marquées d'une croix) :
```powershell
cd atelier
git add -- public/js/brain.js
git commit -m "J2 : nos réglages"
npm test
```

Palier 2 sur 3, un test à la fois. Pour chaque test rouge, trouvez la cause dans `public/js/` et corrigez-la, à la main ou avec l'agent. Avec l'agent, lancez dsh dans `atelier`, ouvrez une nouvelle session et collez cette demande, complétée avec le nom du test et sa ligne d'erreur :
```text
Le test « <nom du test> » de tests/contrat/brain.contrat.test.js est rouge. Son message : <la ligne d'erreur>. Trouve la cause dans public/js/ et explique-la en une phrase, puis propose la correction. Ne modifie aucun fichier de tests/ ni cahier-personnel.json.
```

Avec l'agent, lisez ce que l'écriture change avant de l'autoriser. Dans tous les cas, relisez le diff : une ligne que vous ne savez pas expliquer se refuse. Relancez les tests : le test visé est vert, et aucun autre n'a rougi. Faites alors le commit de cette correction seule, avec un message qui dit ce qui est corrigé, par exemple « fix: bonjour reçoit la même réponse que salut » :
```powershell
git diff
npm test
git add -- public/js
git commit -m "fix: <ce qui est corrigé>"
```

Palier 3 sur 3, le contrôle. Le palier 2 est fini quand chaque test corrigé a son commit `fix:` ; recommencez-le jusqu'à `fail 0` si vous le pouvez. Faites ensuite le contrôle final : la première commande affiche vos verts sur 15 (ligne `pass`), la deuxième n'affiche rien. Lancez enfin Cap Web avec `npm start` et envoyez `<b>gras</b>` dans la page : il s'affiche tel quel, chevrons compris.
```powershell
node --test tests/contrat/brain.contrat.test.js
git diff --stat depart -- tests cahier-personnel.json
```

Pour aller plus loin, à 15 sur 15 : choisissez dans `public/js` un nom peu clair, une variable ou une constante qui n'est pas exportée, et renommez-le partout où il apparaît. Relancez `npm test` (tout reste vert), puis faites le commit avec `git add -- public/js` et `git commit -m "refactor: <ancien nom> devient <nouveau nom>"`.

**Comment on compte** (points de jeu) : chaque test rouge au départ et passé au vert dans un commit `fix:` (un commit peut en faire passer deux) vaut 2 points, 10 au plus (15 sur 15 vaut 10). Vos verts sur 15 se lisent sur la ligne `pass` de la première commande du palier 3. Un commit qui modifie `tests/` ou `cahier-personnel.json` met le round à 0 : c'est la règle de `scripts/check-tests.js`, qu'un test existant ne change pas sans raison écrite. Le formateur la contrôle avec la deuxième commande du palier 3, puis relance le contrat d'origine du ZIP sur votre code. Bonus : +2 au premier binôme à 15 sur 15, +1 au deuxième.

**Preuve** : la ligne `pass` du contrat, un commit `fix:` par correction dans `git log --oneline`, et la deuxième commande du palier 3 qui n'affiche rien.
