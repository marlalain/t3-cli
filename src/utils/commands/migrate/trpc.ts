/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Migrate } from '../migrate.js';
import * as fs from 'fs';
import parser from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';
import { CallExpression, Identifier, MemberExpression, VariableDeclarator } from '@babel/types';
import * as path from 'path';
import { NodePath, ParseResult } from '@babel/core';
import ora from 'ora';
import { log } from '../../log.js';

export class MigrateTRPC implements Migrate {
	packageName = 'trpc';
	fromVersion = 'v9';
	toVersion = 'v10';
	private rootDir: string | undefined = undefined;

	// TODO: Create an interactive mode for users to find files (in case it errors out).
	async migrate(options: { cwd: string }): Promise<void> {
		// this.rootDir = options.cwd;
		// await this.findTVariable();

		log('WIP!');
		return Promise.resolve();
	}

	private findTVariable = async () => {
		// We are expecting this folder structure:
		// src > server > trpc.ts
		// If it doesn't exist, we will create it.
		// TODO: Ask the user if they can provide the path to the file.

		const spinner = ora("Creating the 't' variable at 'src/server/trpc.ts'").start();
		const _path = path.join(this.rootDir!, 'src', 'server', 'trpc.ts');
		if (!fs.existsSync(_path)) {
			fs.mkdirSync(path.join(this.rootDir!, 'src', 'server'), { recursive: true });
			fs.writeFileSync(_path, '');
			await MigrateTRPC.generateTVariable({ path: _path });
			spinner.succeed();
			return;
		}
		const file = fs.readFileSync(_path, 'utf-8');
		const ast = parser.parse(file, {
			sourceType: 'module',
			plugins: ['typescript'],
		});

		traverse.default(ast, {
			// TODO: Handle Context and Meta
			// export const t = initTRPC.create();
			VariableDeclarator(path: NodePath<VariableDeclarator>) {
				const t = (<Identifier>path.node?.id).name;
				const me = (<CallExpression>path.node?.init)?.callee as MemberExpression;
				const initTRPC = (<Identifier>me.object)?.name;
				const create = (<Identifier>me.property)?.name;
				if (t === 't' && initTRPC === 'initTRPC' && create === 'create') return;

				MigrateTRPC.generateTVariable({
					ast,
					file,
					path: _path,
				});
			},
		});

		spinner.succeed("Created the 't' variable at 'src/server/trpc.ts'");
	};

	static generateTVariable = async (option: { ast?: ParseResult; file?: string; path: string }) => {
		const code = `
			import { initTRPC } from '@trpc/server';
			import superjson from 'superjson';
			export const t = initTRPC.create({
				transformer: superjson,
				errorFormatter({ shape }) {
					return {
						 ...shape,
						 data: {
								...shape.data,
						 },
					};
				},
			});
		`;

		const initTRPCImport = parser.parse(code, {
			sourceType: 'module',
			plugins: ['typescript'],
		});

		if (option.ast) option.ast.program.body.unshift(initTRPCImport.program.body[0]);
		else option.ast = initTRPCImport;

		const g = generate.default(option.ast, {}, option.file);
		fs.writeFileSync(option.path, g.code);
	};
}
