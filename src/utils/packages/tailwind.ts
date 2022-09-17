import { getPackageVersion, isPackageInstalled, Package } from './index.js';
import { findPackageJson } from '../npm.js';

export class Tailwind implements Package {
	name = 'Tailwind';
	value = 'tailwindcss';
	devDependency = true;

	version = async (): Promise<string | undefined> => {
		return getPackageVersion(await findPackageJson(), this);
	};

	isInstalled = async (): Promise<boolean> => {
		return isPackageInstalled(await findPackageJson(), this);
	};
}
