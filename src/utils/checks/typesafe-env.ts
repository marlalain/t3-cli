import { Checks } from './index.js';
import { findNpmRoot } from '../npm.js';
import path from 'path';
import * as fs from 'fs';
import parser from '@babel/parser';
import {
	CallExpression,
	ExportNamedDeclaration,
	Identifier,
	ImportDeclaration,
	ObjectExpression,
	ObjectProperty,
	VariableDeclaration,
} from '@babel/types';
import { error } from '../log.js';
import { enviromentVariables } from '../env.js';
import ora from 'ora';

const getAST = async () => {
	// We are expecting for the project structure to be like this:
	// src
	// └── env
	//      ├─── *.mjs
	//      ├── schema.mjs
	//      └── *.mjs

	const folder = await findNpmRoot(process.cwd());
	const envFolder = path.join(folder, 'src', 'env');

	if (!fs.existsSync(envFolder))
		throw new Error(
			`Could not find env folder at ${envFolder}. Please create it.`,
		);

	const files = fs
		.readdirSync(envFolder)
		.filter((file) => file.endsWith('.mjs'))
		.map((file) => path.join(envFolder, file))
		.map((file) => fs.readFileSync(file, 'utf8'));

	const schema = files[1]; // TODO: Find the schema file

	return parser.parse(schema, {
		sourceType: 'module',
	});
};

export class TypesafeEnv implements Checks {
	check = async () => {
		const ast = await getAST();

		const usingZod = ast.program.body
			.filter((node) => node.type === 'ImportDeclaration')
			.some((node) => (node as ImportDeclaration).source.value === 'zod');

		if (!usingZod) {
			error(
				'This CLI can only work with "zod" and an scaffolded project from "create-t3-app"',
			);
			process.exit(1);
		}

		const declarators = ast.program.body
			.filter((node) => node.type === 'ExportNamedDeclaration')
			.map((node) => (node as ExportNamedDeclaration).declaration)
			.filter((node) => node?.type === 'VariableDeclaration')
			.map((node) => (node as VariableDeclaration).declarations)
			.flat(); // [][] -> []

		const schemas = declarators
			.map((declarator) => declarator.init)
			.filter((init) => init?.type === 'CallExpression')
			.map((init) => (init as CallExpression)?.arguments)
			.flat()
			.filter((arg) => arg?.type === 'ObjectExpression')
			.map((arg) => (arg as ObjectExpression).properties)
			.flat();

		const schemaEnvVars = schemas
			.filter((field) => field.type === 'ObjectProperty')
			.map((schema) => (schema as ObjectProperty).key)
			.filter((key) => key.type === 'Identifier')
			.map((key) => (key as Identifier).name);
		const actualEnvVars = await enviromentVariables();

		const spinner = ora('Checking env variables').start();

		for (const env of actualEnvVars) {
			const inSpinner = ora(`Checking ${env}`).start();
			if (!schemaEnvVars.includes(env)) {
				inSpinner.fail(`Env variable ${env} is not defined in the schema`);
				process.exit(1);
			} else {
				inSpinner.succeed(`Env variable ${env} is defined in the schema`);
			}
		}

		spinner.succeed('All env variables are present in your schema');
	};
}
