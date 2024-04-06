module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ["react", "prettier"],
  rules: {
    'no-extra-boolean-cast': ["warn", {"enforceForLogicalOperands": true}],
    '@typescript-eslint/no-explicit-any': ["warn"],
    '@typescript-eslint/no-unused-vars': ["warn"],
  },
}
