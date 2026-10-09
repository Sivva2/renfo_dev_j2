# Bilan individuel · Haidar Esber

## Mon niveau de départ

Au positionnement de mardi, je me suis noté « à l'aise » sur les six notions : structure HTML, CSS et responsive, JavaScript, DOM et événements, Git, tests. Mon objectif était de savoir lire un test rouge et retrouver la cause dans le code sans l'aide de l'agent, puis de savoir relire le code des autres en revue.

## Deux acquis, prouvés par un commit

1. **Vérifier ce qui vient de dehors, et le prouver par un test.** Avec `[null]` dans le stockage, la page plantait. J'ai ajouté `estMessage` pour filtrer chaque élément de l'historique (`d8fcf6d fix: historique abîmé ignoré`), puis quatre tests (`354ac4d test: estMessage`). J'ai cassé exprès la fonction avec `return true;` : trois tests sont devenus rouges, donc ils servent à quelque chose.
2. **Travailler à deux avec Git et GitHub.** J'ai travaillé sur une branche, ouvert une pull request avec ce qui change et comment le vérifier, puis fusionné (`d089443 feat: nouvelle couleur`, PR #2). J'ai aussi mis en place la CI qui lance le lint et les tests à chaque push (`7d557f5 ci: lint et tests à chaque push`).

## Deux points à renforcer

1. **Le code asynchrone.** `fetch`, `async` et `await` marchent dans Cap Web, mais je dois encore m'entraîner à expliquer l'ordre d'exécution sans relire le code, surtout dans l'écouteur `submit`.
2. **La revue de code.** Je repère les tests modifiés et le HTML injecté, mais je dois prendre l'habitude de laisser des commentaires précis, avec leur type et un fait, sur chaque pull request.

## Mon objectif

Dans mes prochains projets, écrire au moins un test pour chaque bug corrigé avant de le fermer, et faire tourner la CI dès le premier push.
