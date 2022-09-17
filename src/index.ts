import { packages } from './utils/packages/index.js';
import ora from 'ora';

(async () => {
	const spinner = ora('Checking packages').start();

	const promises = Object.entries(packages).map(async ([, pkg]) => {
		const installed = await pkg.isInstalled();
		const version = await pkg.version();
		return {
			name: pkg.name,
			version,
			installed,
		};
	});

	const results = await Promise.all(promises);
	spinner.succeed('Checked packages');
	console.log(results);
})();
