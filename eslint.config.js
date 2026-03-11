const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "commonjs",
      globals: {
        ...globals.commonjs,
        ...globals.es2017,
        ...globals.node,
      },
    },
    rules: {
      "no-console": 1,
    },
  },
  {
    files: ["example/**/*.js"],
    rules: {
      "no-console": 0,
    },
  },
];
