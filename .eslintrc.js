module.exports = {
    env: {
      browser: true,
      node: true,
      jest: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-essential',
      'plugin:jest/recommended',
    ],
    plugins: ['jest'],
    rules: {
    },
  };