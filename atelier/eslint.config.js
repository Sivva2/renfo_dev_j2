// ESLint : outil developpeur uniquement, pas un test fonctionnel.
// Flat config sans dependance externe.
// Regles pedagogiques simples : variables, egalite stricte, const.

const reglesDeBase = {
  "no-unused-vars": ["error", { caughtErrors: "none", argsIgnorePattern: "^_" }],
  "no-undef": "error",
  eqeqeq: "error",
  "no-var": "error",
  "prefer-const": "error"
};

// Globales navigateur pour le code execute dans le navigateur.
const globalesNavigateur = {
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  location: "readonly",
  history: "readonly",
  localStorage: "readonly",
  sessionStorage: "readonly",
  alert: "readonly",
  confirm: "readonly",
  fetch: "readonly",
  FormData: "readonly",
  Headers: "readonly",
  Request: "readonly",
  Response: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  TextEncoder: "readonly",
  TextDecoder: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  requestAnimationFrame: "readonly",
  cancelAnimationFrame: "readonly",
  console: "readonly",
  Intl: "readonly"
};

// Globales Node pour serveur, scripts, tests et config.
const globalesNode = {
  process: "readonly",
  console: "readonly",
  Buffer: "readonly",
  URL: "readonly",
  fetch: "readonly",
  Headers: "readonly",
  Request: "readonly",
  Response: "readonly",
  TextEncoder: "readonly",
  TextDecoder: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  setImmediate: "readonly",
  clearImmediate: "readonly",
  globalThis: "readonly",
  performance: "readonly",
  Intl: "readonly"
};

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/test-results/**",
      "**/playwright-report/**",
      "**/coverage/**"
    ]
  },
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module" },
    rules: { ...reglesDeBase }
  },
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globalesNavigateur }
    }
  },
  {
    files: [
      "server/**/*.js",
      "scripts/**/*.js",
      "tests/**/*.js",
      "playwright.config.js",
      "playwright.smoke.config.js",
      "eslint.config.js"
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globalesNode }
    }
  },
  {
    // Tests navigateur executes en Node par Playwright.
    // Eviter document direct : utiliser locator.evaluate.
    files: ["browser/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globalesNode }
    }
  }
];
