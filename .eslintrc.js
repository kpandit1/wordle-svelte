module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ["svelte3"],
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  rules: {},
};
