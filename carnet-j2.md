# Carnet de bord · J2

Binôme : b16 · Membres : Kevin Abaskaran, Haidar Esber · Nos réglages sont dans `atelier/cahier-personnel.json` : ne les recopiez pas ici.

## Mon positionnement (chacun de vous deux)

Pour chaque notion, chacun écrit « à l'aise » ou « à renforcer ». Ce n'est ni évalué ni classé : c'est votre point de départ pour le bilan individuel de fin de module.

| Notion            | Membre 1 : Kevin | Membre 2 : Haidar Esber |
| ----------------- | ---------------- | ----------------------- |
| Structure HTML    | À l'aise         | À l'aise                |
| CSS et responsive | À l'aise         | À l'aise                |
| JavaScript        | À l'aise         | À l'aise                |
| DOM et événements | À l'aise         | À l'aise                |
| Git               | À l'aise         | À l'aise                |
| Tests             | À l'aise         | À l'aise                |

Chacun, en une phrase, son objectif personnel pour J2 et J3.

Membre 1 : Prendre le réflexe d'écrire le test avant le code et de le voir rouge, pour l'appliquer dans mes projets perso et mon alternance.

Membre 2 : Savoir lire un test rouge et retrouver la cause dans le code sans l'aide de l'agent, puis savoir relire le code des autres en revue.

## R1 · Les tests automatisés

Les tests rouges du départ, et ce que vous en avez fait :

| Test rouge                                                                          | Cause trouvée (une phrase)                                                              | Fichier            | Message du commit `fix:`                                                |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------- |
| refuse le vide et les espaces seuls                                                 | Le test du vide se faisait avant `trim()`, donc des espaces seuls passaient.            | public/js/brain.js | fix: un message fait d'espaces seuls est refusé comme un message vide   |
| accepte 240 caractères et refuse 241                                                | La limite 280 était écrite en dur au lieu d'utiliser `LIMITE`.                          | public/js/brain.js | fix: la limite de caractères vient de LIMITE et non de 280 écrit en dur |
| ignore la casse et les espaces autour ; reconnaît les deux mots du cahier personnel | `replyTo` mettait en minuscules mais ne retirait pas les espaces autour.                | public/js/brain.js | fix: replyTo ignore les espaces autour du message                       |
| répond à une phrase inconnue par un repli distinct                                  | Le repli renvoyait la réponse d'aide au lieu d'une réponse propre.                      | public/js/brain.js | fix: un message inconnu reçoit un repli distinct de la réponse d'aide   |
| view.js affiche du texte et ne décide pas des réponses                              | `innerHTML` interprétait le message comme du HTML au lieu de l'afficher comme du texte. | public/js/view.js  | fix: view.js affiche le texte avec textContent, sans innerHTML          |

Avec l'agent : nous n'avons pas utilisé l'agent, les corrections ont été faites à la main.

Pour aller plus loin : non fait.

## R2 · Documenter le projet

Vos trois documents sont dans `atelier` : `README.md`, `SPEC.md` et `AGENTS.md`. Rien à recopier ici.

Pour aller plus loin, avec l'agent, les demandes du formateur : non fait.

## R3 · Premiers tests unitaires

| À remplir                                   | Votre réponse                                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Fonction tirée                              | `synonyme(message)` (F1)                                                                        |
| Le rouge vu (message exact)                 | The requested module '../public/js/brain.js' does not provide an export named 'synonyme'        |
| Identifiant du commit `test:`               | b1f14ae                                                                                         |
| Identifiant du commit `feat:`               | 5a6b5f1                                                                                         |
| Casse volontaire : la ligne changée         | `return Object.hasOwn(SYNONYMES, texte) ? SYNONYMES[texte] : texte;` remplacée par `return "";` |
| Casse volontaire : le test devenu rouge     | « C1 : coucou, hello et bonsoir donnent salut » (aussi C2, C3 et C4)                            |
| Pour aller plus loin : la deuxième fonction | non fait                                                                                        |

Les critères C1 à C5 de votre fonction, recopiés de la fiche :

- C1 : `'coucou'`, `'hello'` et `'bonsoir'` donnent `'salut'`.
- C2 : `'help'` et `'sos'` donnent `'aide'`.
- C3 : la casse et les espaces autour ne comptent pas, `'  HELLO '` donne `'salut'`.
- C4 : un autre message revient en minuscules, sans les espaces autour, `'  Météo '` donne `'météo'`.
- C5 : ce qui n'est pas du texte (`undefined`, `null`, `42`) donne `''`, sans erreur.

## R4 · La revue de code

| Patch | Accepté ou refusé | Fichier et ligne | Raison |
| ----- | ----------------- | ---------------- | ------ |
| 1     |                   |                  |        |
| 2     |                   |                  |        |
| 3     |                   |                  |        |

Pour aller plus loin : le patch que vous avez corrigé, et ce que vous avez changé.

## Fin de journée

Chacun, une phrase : ce que vous savez faire ce soir et que vous ne saviez pas faire ce matin. Relisez votre positionnement : une notion est-elle passée de « à renforcer » à « à l'aise » ?

Membre 1 : à l'aise sur le sujet

Membre 2 : à l'aise sur le sujet
