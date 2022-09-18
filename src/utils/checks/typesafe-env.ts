/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Checks } from './index.js';
import { findNpmRoot } from '../npm.js';
import path from 'path';
import * as fs from 'fs';
import parser, { ParseResult } from '@babel/parser';
import {
	CallExpression,
	File,
	Identifier,
	ImportDeclaration,
	MemberExpression,
	ObjectExpression,
	VariableDeclarator,
} from '@babel/types';
import { error, log } from '../log.js';
import { enviromentVariables } from '../env.js';
import ora from 'ora';
import inquirer from 'inquirer';
import { PossibleType, typeGuesser, zodAST } from '../type-guesser.js';
import generate from '@babel/generator';
import traverse, { NodePath } from '@babel/traverse';

export class TypesafeEnv implements Checks {
	ast: ParseResult<File> | undefined;
	code: string | undefined;
	schemaFilePath: string | undefined;

	check = async () => {
		this.ast = await this.getAST();
		await this.assertZod();

		const schemaEnvVars = await this.getSchemaEnvVars();
		const actualEnvVars = await enviromentVariables();
		const missingEnvVars: string[] = [];
		const spinner = ora('Checking env variables').start();

		for (const env of actualEnvVars) {
			const inSpinner = ora(`Checking ${env}`).start();
			if (!schemaEnvVars.includes(env)) {
				inSpinner.fail(`Environment variable $${env} is not defined in the schema`);
				missingEnvVars.push(env);
			} else {
				inSpinner.succeed(`Environment variable $${env} is defined in the schema`);
			}
		}

		if (missingEnvVars.length <= 0) {
			spinner.succeed('All environment variables are present in your schema');

			return;
		}

		spinner.fail('Some environment variables are missing');
		await this.handleErrors(missingEnvVars);

		return;
	};

	private getAST = async () => {
		// We are expecting for the project structure to be like this:
		// src
		// └── env
		//      ├── *.mjs
		//      ├── schema.mjs
		//      └── *.mjs

		const folder = await findNpmRoot(process.cwd());
		const envFolder = path.join(folder, 'src', 'env');

		if (!fs.existsSync(envFolder)) throw new Error(`Could not find env folder at ${envFolder}. Please create it.`);

		const filePaths = fs
			.readdirSync(envFolder)
			.filter((file) => file.endsWith('.mjs'))
			.map((file) => path.join(envFolder, file));

		const files = filePaths.map((file) => fs.readFileSync(file, 'utf8'));

		const schema = files[1]; // TODO: Find the schema file

		this.schemaFilePath = filePaths[1];
		this.code = schema;
		return parser.parse(schema, {
			sourceType: 'module',
		});
	};

	private getSchemaEnvVars = async () => {
		if (!this.ast) throw new Error('AST is not defined');

		const declarators = this.ast.program.body
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

		return schemas
			.filter((field) => field.type === 'ObjectProperty')
			.map((schema) => (schema as ObjectProperty).key)
			.filter((key) => key.type === 'Identifier')
			.map((key) => (key as Identifier).name);
	};

	private assertZod = async () => {
		const usingZod = this.ast?.program.body
			.filter((node) => node.type === 'ImportDeclaration')
			.some((node) => (node as ImportDeclaration).source.value === 'zod');

		if (!usingZod) {
			error('This CLI can only work with "zod" and an scaffolded project from "create-t3-app"');
			process.exit(1);
		}
	};

	/*
	 * We will ask the user if they want to add the missing env variables
	 * to the schema. If they do, we will add them and write the file.
	 * We also try to infer the type of the variable from the name.
	 */
	private handleErrors = async (envVars: string[]) => {
		for (const env of envVars) {
			if (!(await this.confirm(env))) continue;

			const type = await this.promptType(env);
			traverse.default(this.ast, {
				ObjectExpression(path: NodePath<ObjectExpression>) {
					const isZod =
						(((path.parent as CallExpression)?.callee as MemberExpression)?.object as Identifier)?.name === 'z';

					const isServerSchema =
						(((path.parentPath as NodePath<CallExpression>)?.parent as VariableDeclarator)?.id as Identifier)?.name ===
						'serverSchema';

					if (isZod && isServerSchema) {
						path.node.properties.push(zodAST(env, type));
					}
				},
			});
		}

		const output = generate.default(this.ast!, {}, this.code);
		fs.writeFileSync(this.schemaFilePath!, output.code);
	};

	private confirm = async (env: string) => {
		const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
			type: 'confirm',
			name: 'confirm',
			message: `Do you want to add $${env} to the schema?`,
			default: true,
		});

		return confirm;
	};

	private promptType = async (env: string): Promise<PossibleType> => {
		const { type } = await inquirer.prompt<{ type: PossibleType }>({
			type: 'list',
			name: 'type',
			message: `What type is $${env}? (we guessed the order)`,
			choices: typeGuesser(env),
			default: 0,
		});

		if (type === 'other') log('You are going to have to add it manually!');

		return type;
	};
}
