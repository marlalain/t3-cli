import { Command } from 'commander';
import { error, success } from '../log.js';
import { repo } from '../../const.js';
import { MigrateTRPC } from './migrate/trpc.js';
import { findNpmRoot } from '../npm.js';
import * as process from 'process';

export interface Migrate {
	packageName: string;
	fromVersion: string;
	toVersion: string;
	migrate: (options: { cwd: string }) => Promise<void>;
}

export const migrateCommand = (): Command => {
	return new Command('migrate')
		.description('Migrate your project to a different version of a package')
		.argument('[package]', 'Package to migrate', 'trpc')
		.usage('[package]')
		.action(async (pkg) => {
			if (pkg !== 'trpc') {
				error(`Migrations for "${pkg}" are not (yet? ${repo}/issues) implemented`);
				process.exit(1);
			}

			const trpc = new MigrateTRPC();
			/*const confirm = await confirmPrompt(
				`Are you sure you want to migrate your project from ${trpc.packageName} ${trpc.fromVersion} to ${trpc.packageName} ${trpc.toVersion}?`,
			);
			if (!confirm) process.exit(0);*/

			await trpc.migrate({ cwd: await findNpmRoot(process.cwd()) });
			success(`Successfully migrated your project to ${trpc.packageName} ${trpc.toVersion}`);
		});
};
