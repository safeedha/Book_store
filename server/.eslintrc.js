module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended", // Integrates Prettier with ESLint
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error", // Show Prettier issues as ESLint errors
  },
};
