// Cap Web — cerveau à règles. Fonctions pures : aucun accès à la page.

// Nos réglages, recopiés de cahier-personnel.json : la limite et nos deux mots,
// plus un troisième mot ajouté à J3.
export const LIMITE = 240;

const MOTS = {
  boussole: "La boussole indique le nord.",
  refuge: "Un refuge accueille les randonneurs.",
  sentier: "Un sentier mène au sommet.",
};

// « a », « b » et « c » : des virgules, puis « et » avant le dernier mot.
const guillemets = Object.keys(MOTS).map((mot) => `« ${mot} »`);
const liste =
  guillemets.length > 1
    ? `${guillemets.slice(0, -1).join(", ")} et ${guillemets.at(-1)}`
    : guillemets.join("");

const REPONSES = {
  salut:
    "Bonjour ! Je suis Cap Web, un assistant à règles. Écrivez « aide » pour voir ce que je sais faire.",
  aide: `Je connais « salut », « aide », « test », et ${
    Object.keys(MOTS).length
  } mots à moi : ${liste}.`,
  test: "Test bien reçu : mes règles fonctionnent.",
  inconnu:
    "Je n’ai pas compris ce message. Écrivez « aide » pour voir ce que je sais faire.",
};

export function validateMessage(raw) {
  if (typeof raw !== "string") {
    return { ok: false, error: "Le message doit être du texte." };
  }
  const value = raw.trim();
  if (value === "") {
    return { ok: false, error: "Le message ne doit pas être vide." };
  }
  if (value.length > LIMITE) {
    return {
      ok: false,
      error: `Le message doit contenir ${LIMITE} caractères au maximum.`,
    };
  }
  return { ok: true, value };
}

// Un message de l'historique : un objet avec un rôle connu et un texte.
export function estMessage(m) {
  return (
    typeof m === "object" &&
    m !== null &&
    (m.role === "user" || m.role === "assistant") &&
    typeof m.text === "string"
  );
}

export function replyTo(message) {
  const texte = String(message).trim().toLowerCase();
  if (texte === "salut" || texte === "bonjour") {
    return REPONSES.salut;
  }
  if (texte === "aide") {
    return REPONSES.aide;
  }
  if (texte === "test") {
    return REPONSES.test;
  }
  if (Object.hasOwn(MOTS, texte)) {
    return MOTS[texte];
  }
  // Message inconnu : on rappelle ce que Cap Web sait faire.
  return REPONSES.inconnu;
}

const SYNONYMES = {
  coucou: "salut",
  hello: "salut",
  bonsoir: "salut",
  help: "aide",
  sos: "aide",
};

export function synonyme(message) {
  if (typeof message !== "string") {
    return "";
  }
  const texte = message.trim().toLowerCase();
  return Object.hasOwn(SYNONYMES, texte) ? SYNONYMES[texte] : texte;
}
