// Cap Web — affichage de l'historique. Aucune règle de réponse ici.

export function renderMessages(messages, container) {
  const lignes = messages.map((msg) => {
    const li = document.createElement("li");
    const nom = msg.role === "user" ? "Vous" : "Cap Web";
    const gras = document.createElement("strong");
    gras.textContent = nom;
    li.append(gras, ` : ${msg.text}`);
    if (msg.role === "assistant") {
      li.classList.add("bot");
    }
    return li;
  });
  container.replaceChildren(...lignes);
}
