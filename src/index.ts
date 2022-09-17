import { Package, packages } from './utils/packages/index.js';
import ora from 'ora';
import chalk from 'chalk';
import { TypesafeEnv } from './utils/checks/typesafe-env.js';

const getNotInstalledPackages = async () => {
	const notInstalledPackages: Package[] = [];

	const promises = Object.entries(packages).map(([, pkg]): Package => {
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
