// module.exports = {
// 	env: {
// 		es2021: true,
// 	},
// 	root: true,
// 	// env: { browser: true, es2020: true },
// 	extends: [
// 		"eslint:recommended",
// 		"plugin:@typescript-eslint/recommended",
// 		"plugin:react-hooks/recommended",
// 	],
// 	ignorePatterns: ["dist", ".eslintrc.cjs"],
// 	parser: "@typescript-eslint/parser",
// 	plugins: ["react-refresh"],
// 	rules: {
// 		"react-refresh/only-export-components": [
// 			"warn",
// 			{ allowConstantExport: true },
// 		],
// 	},
// };

module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: true,
	},
	extends: [
		'plugin:prettier/recommended',
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/jsx-runtime',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
	ignorePatterns: ['node_modules/', 'build/', 'dist/', 'coverage/', 'locales/'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		camelcase: 'error',
		'spaced-comment': 'error',
		quotes: ['error', 'single'],
		'no-duplicate-imports': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			typescript: {},
		},
	},
};