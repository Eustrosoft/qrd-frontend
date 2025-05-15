module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [2, 'never'], // Enforce non-empty scope
    'body-max-length': [2, 'always', 200], // Максимальная длина body в 200 символов
    'body-max-line-length': [2, 'always', 200], // Максимальная длина строки body в 200 символов
  },
};
