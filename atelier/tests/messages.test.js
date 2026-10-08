import { test } from "node:test";
import assert from "node:assert/strict";
import { estMessage } from "../public/js/brain.js";

test("un vrai message est accepté", () => {
  assert.equal(estMessage({ role: "user", text: "salut" }), true);
});

test("null n'est pas un message", () => {
  assert.equal(estMessage(null), false);
});

test("un rôle inconnu n'est pas un message", () => {
  assert.equal(estMessage({ role: "pirate", text: "à l'abordage" }), false);
});

test("un texte qui est un nombre n'est pas un message", () => {
  assert.equal(estMessage({ role: "assistant", text: 42 }), false);
});
