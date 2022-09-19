import { TRPC } from '../packages/trpc.js';
import { Tailwind } from '../packages/tailwind.js';
import { NextAuth } from '../packages/nextAuth.js';
import { Prisma } from '../packages/prisma.js';
import { Command } from 'commander';
import { IPackage } from '../packages/index.js';
import ora from 'ora';
import chalk from 'chalk';

export const packages = {
	trpc: new TRPC(),
	tailwind: new Tailwind(),
	nextAuth: new NextAuth(),
	prisma: new Prisma(),
};

export const packagesCommand = (): Command => {
	return new Command('packages').description('Check if all packages are installed').action(async () => {
		const promises = Object.entries(packages).map(([, pkg]): IPackage => {
			return pkg;
		});

		for (const pkg of await Promise.all(promises)) {
			const s = ora(`Checking ${pkg.name}`).start();
			if (await pkg.isInstalled()) s.succeed(chalk.green(`${pkg.name} is installed`));
			else s.fail(chalk.red(`${pkg.name} is not installed`));
		}
	});
};
