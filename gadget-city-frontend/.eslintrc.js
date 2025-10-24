module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};