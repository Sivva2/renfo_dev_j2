# Bilan individuel · Kevin Abaskaran

## Mon niveau de départ

Au positionnement de mardi, je me suis noté « à l'aise » sur les six notions : structure HTML, CSS et responsive, JavaScript, DOM et événements, Git, tests. Mon objectif était de prendre le réflexe d'écrire le test avant le code et de le voir rouge.

## Deux acquis, prouvés par un commit

1. **Le test d'abord, rouge puis vert.** Pour `synonyme`, j'ai écrit les critères C1 à C5 en tests avant le code (`b1f14ae test: synonyme, critères C1 à C5`), j'ai vu le rouge, puis j'ai écrit la fonction (`5a6b5f1 feat: synonyme`).
2. **Échanger des données avec le serveur.** J'ai créé la route `/api/conseil` avec son test (`0249753 feat: route /api/conseil`), puis la page l'appelle avec `fetch` et affiche un message clair si le serveur ne répond pas (`773b472 feat: Cap Web donne un conseil`).

## Deux points à renforcer

1. **L'accessibilité.** Lighthouse est passé de 100 à 93 sans le label : je dois vérifier l'accessibilité dès que j'écris un formulaire, pas seulement à la fin.
2. **La revue de code.** Je dois prendre l'habitude de relire chaque pull request dans l'ordre (annonce, sécurité, lisibilité, tests) avant d'approuver.

## Mon objectif

Dans mon alternance, écrire le test avant le code pour chaque nouvelle fonction, et le voir rouge avant de le faire passer.
