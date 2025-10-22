module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
		jest: true,
	},
	parserOptions: {
		ecmaVersion: 2018,
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	extends: ['airbnb-base-typescript', 'prettier'],
	parserOptions: {
		project: './tsconfig.eslint.json',
	},
	globals: {},
	ignorePatterns: ['src/*/dist/**'],
	rules: {
		'prettier/prettier': ['error'],

		/***	Formatting Overrides	***/
		'@typescript-eslint/indent': 0,
		'@typescript-eslint/comma-dangle': 0,
		'@typescript-eslint/naming-convention': 0,
		// allows us to throw literal objects as errors
		'@typescript-eslint/no-throw-literal': 0,
		'one-var': 0,
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],

		/***	Functional Overrides	***/
		// allow for grouping of variables in classes
		'@typescript-eslint/lines-between-class-members': [
			'error',
			'always',
			{ exceptAfterSingleLine: true },
		],

		// allow simple constructors in subclasses
		'@typescript-eslint/no-useless-constructor': 0,

		'max-classes-per-file': 0,
		'class-methods-use-this': 0,
		// allow reassignment of object properties
		'no-param-reassign': ['error', { props: false }],

		'@typescript-eslint/no-unused-vars': 'off',

		/***	Custom rules	***/
		'linebreak-style': ['error', 'unix'],

		// ensure block statements are wrapped in curly braces
		curly: 'error',

		'@typescript-eslint/no-redeclare': 0,
		'@typescript-eslint/no-use-before-define': 0,
		'no-underscore-dangle': 0,
		'consistent-return': 0,
		'default-case': 0,
		'no-fallthrough': 0,
		'no-case-declarations': 0,
		'no-restricted-syntax': [
			'error',
			{
				selector: 'ForInStatement',
				message:
					'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
			},
			{
				selector: 'LabeledStatement',
				message:
					'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
			},
			{
				selector: 'WithStatement',
				message:
					'`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
			},
		],
	},
	overrides: [
		{
			files: ['*.ts'],
			rules: {
				'import/no-extraneous-dependencies': 'off',
				'import/prefer-default-export': 'off',
			},
		},
		{
			// Overrides just for tests
			files: ['*.test.ts', '*.steps.ts'],
			rules: {
				// Allow square bracket notation to call private functions
				'dot-notation': 'off',
				'@typescript-eslint/dot-notation': 'off',
			},
		},
	],
	settings: {
		'import/core-modules': ['aws-sdk'],
	},
};
