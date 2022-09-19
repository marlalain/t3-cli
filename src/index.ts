import { IPackage } from './utils/packages/index.js';
import ora from 'ora';
import chalk from 'chalk';
import { packages } from './utils/packages/packages.js';
import { Command } from 'commander';
import { checks } from './utils/checks/checks.js';

const program = new Command();

program.name('t3-cli').description('CLI for your create-t3-app project').version('1.1.5').usage('[commands]');

program
	.command('packages')
	.description('Check if all packages are installed')
	.action(async () => {
		const promises = Object.entries(packages).map(([, pkg]): IPackage => {
			return pkg;
		});

		for (const pkg of await Promise.all(promises)) {
			const s = ora(`Checking ${pkg.name}`).start();
			if (await pkg.isInstalled()) s.succeed(chalk.green(`${pkg.name} is installed`));
			else s.fail(chalk.red(`${pkg.name} is not installed`));
		}
	});

program
	.command('check')
	.description('Runs checks on your codebase')
	.action(async () => {
		await checks.typesafeEnv.check();
	});

program.parse(process.argv);
