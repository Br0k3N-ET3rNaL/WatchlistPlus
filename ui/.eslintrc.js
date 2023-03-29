module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
        'airbnb-typescript',
        "plugin:@typescript-eslint/recommended",
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 14,
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    ignorePatterns: ["_codux", "tests"],
    rules: {
        "react/require-default-props": 0,
        "react/static-property-placement": 0,
        "jsx-a11y/label-has-associated-control": 0,
    },
};
