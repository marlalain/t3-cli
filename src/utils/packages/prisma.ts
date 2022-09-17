import { getPackageVersion, isPackageInstalled, Package } from './index.js';
import { findPackageJson } from '../npm.js';

export class Prisma implements Package {
	name = 'Prisma';
	value = '@prisma/client';
	devDependency = false;

	version = async (): Promise<string | undefined> => {
		return getPackageVersion(await findPackageJson(), this);
	};

	isInstalled = async (): Promise<boolean> => {
		return isPackageInstalled(await findPackageJson(), this);
	};
}
