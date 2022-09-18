import { IPackage } from './utils/packages/index.js';
import ora from 'ora';
import chalk from 'chalk';
import { TypesafeEnv } from './utils/checks/typesafe-env.js';
import { packages } from './utils/packages/packages.js';

const getNotInstalledPackages = async () => {
	const notInstalledPackages: IPackage[] = [];

	const promises = Object.entries(packages).map(([, pkg]): IPackage => {
		return pkg;
	});

	for (const pkg of await Promise.all(promises)) {
		const s = ora(`Checking ${pkg.name}`).start();
		if (await pkg.isInstalled()) {
			s.succeed(chalk.green(`${pkg.name} is installed`));
		} else {
			s.fail(chalk.red(`${pkg.name} is not installed`));
			notInstalledPackages.push(pkg);
		}
	}

	return notInstalledPackages;
};

(async () => {
	const env = new TypesafeEnv();
	await env.check();
})();
