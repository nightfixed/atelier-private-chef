import tsParser from "@typescript-eslint/parser";

// Config minimal, fara eslint-config-next (incompatibil cu versiunile instalate — crapa la validare).
// Scop: garda automata impotriva bug-ului recurent de scroll (vezi /memories/repo/workflow.md).
const eslintConfig = [
  { ignores: [".next/**", "out/**", "node_modules/**"] },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // .focus() fara { preventScroll: true } lasa browserul sa scroleze singur spre camp,
      // taind textul/intrebarea de deasupra lui.
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='focus'][arguments.length=0]",
          message: "Foloseste .focus({ preventScroll: true }) in loc de .focus() fara argumente.",
        },
      ],
    },
  },
];

export default eslintConfig;
