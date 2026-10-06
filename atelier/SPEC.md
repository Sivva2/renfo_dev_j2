# Spécification de Cap Web

1. Quand on envoie plus de 240 caractères, Cap Web refuse le message et l'erreur cite 240.
   Vérifié par : test « accepte 240 caractères et refuse 241 ».

2. Quand on envoie un message vide ou fait seulement d'espaces, Cap Web le refuse.
   Vérifié par : test « refuse le vide et les espaces seuls ».

3. Quand on envoie « salut » avec des majuscules ou des espaces autour, Cap Web répond comme à « salut ».
   Vérifié par : test « ignore la casse et les espaces autour ».

4. Quand on envoie « boussole » ou « refuge », Cap Web répond avec la phrase de ce mot.
   Vérifié par : test « reconnaît les deux mots du cahier personnel, quelles que soient la casse et les espaces autour ».

5. Quand on envoie `<b>gras</b>`, la page l'affiche tel quel, chevrons compris, sans le mettre en gras.
   Vérifié par : test « view.js affiche du texte et ne décide pas des réponses », et par un essai dans la page (npm start, envoyer `<b>gras</b>`).
