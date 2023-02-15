module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        'no-console': 0,
        'no-unused-vars': 1,
        'no-empty-function': 1,
        'class-methods-use-this': 0,
        'linebreak-style': 0,
        indent: ['error', 4],
    },
};
