# R4 · La revue de code

**Objectif** : relire 3 contributions (des patchs) venues d'ailleurs et décider, par écrit, d'accepter ou de refuser chacune. Minimum attendu de tous : 2 patchs décidés ; pour aller plus loin : le troisième, puis votre propre version corrigée d'un patch que vous avez refusé.

**Ce que vous apprenez** : un patch se lit avant de s'appliquer, avec trois questions : quels fichiers, quelles lignes, pour quoi faire. Des tests verts ne veulent pas dire un patch sain : un patch peut affaiblir un test, ou passer à côté de ce que le contrat cherche. Une décision se justifie par un fait : un fichier, une ligne, un essai.

**À faire** (chrono : 40 min ; dans `abordage`, jamais dans `atelier`). Il y a 3 patchs, et 2 sont piégés. Le round se fait en 2 paliers, tous les deux dans cette fiche : avancez à votre rythme.

Palier 1 sur 2, préparer et lire. Téléchargez `cap-web-j2-abordage.zip` (Teams, onglet Fichiers) et décompressez-le dans votre dossier `cap-web-j2` : vous obtenez `cap-web-j2/abordage`, avec `base` et 3 fichiers `.patch`. Faites une copie neuve de la base par patch. Pour le patch 1, terminal dans `abordage` :
```powershell
Copy-Item -Recurse base essai-1
cd essai-1
git init
git add .
```

Le `git init` est obligatoire : sans lui, `git apply` peut ne rien appliquer, sans le dire. Lisez ensuite le patch avant de l'appliquer : ouvrez `patch-1.patch` dans l'éditeur (la description est en tête), puis listez les fichiers qu'il touche :
```powershell
git apply --stat ../patch-1.patch
```

Palier 2 sur 2, appliquer et décider. Arrêtez d'abord le serveur de l'atelier (Ctrl+C). Puis appliquez le patch, lisez le diff, lancez les tests, et lancez Cap Web depuis la copie. `git add -N .` fait entrer les fichiers nouveaux dans le diff :
```powershell
git apply ../patch-1.patch
git add -N .
git diff
npm test
npm start
```

La description et le diff disent-ils la même chose ? Dans la page, essayez `<b>gras</b>`, des espaces seuls, puis `aide`. Décidez à deux, et écrivez dans le carnet, partie R4 : accepté ou refusé, le fichier et la ligne, la raison. Par exemple : « Refusé : tests/x.test.js, ligne 12 : l'assertion sur … disparaît. » Arrêtez Cap Web (Ctrl+C), remontez dans `abordage`, puis recommencez avec `essai-2` et `patch-2.patch`, puis `essai-3` et `patch-3.patch`. Une copie neuve par patch : rien à restaurer entre deux. Ne modifiez jamais un fichier `.patch`.
```powershell
cd ..
```

Pour aller plus loin, une fois les 3 patchs décidés : dans la copie d'un patch que vous avez refusé, corrigez ce qui vous a fait le refuser, relancez `npm test`, puis enregistrez votre version dans `abordage` avec `git add -N .` et `git diff --output=../mon-patch.patch`. Notez dans le carnet ce que vous avez changé.

**Comment on compte** (points de jeu) : par patch, 2 points pour la bonne décision et 1 point si la raison cite le bon fichier et ce qui ne va pas (9 points). On ajoute +1 si les 3 décisions sont justes. Bonus : +2 au premier binôme qui trouve les 2 pièges avec la bonne raison, +1 au deuxième.

**Preuve** : une ligne dans le carnet par patch décidé, avec la décision, le fichier et la raison.
