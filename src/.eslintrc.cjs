// eslint.config.js
module.exports = [
  {
    root: true,
    env: { browser: true, es2020: true },
    parser: "babel-eslint",
    extends: [
      "airbnb",
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
    ],
    rules: {
      semi: "error",
      "prefer-const": "error",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn", // <--- THIS IS THE NEW RULE
      "react/jsx-no-target-blank": "off",
      "react/jsx-uses-react": 1,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    settings: {
      "import/resolver": "meteor",
      react: { version: "18.2" },
    },
    globals: {
      _: true,
      CSSModule: true,
      Streamy: true,
      ReactClass: true,
      SyntheticKeyboardEvent: true,
    },
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    plugins: ["react-refresh"],
  },
];