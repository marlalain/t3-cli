import { getPackageVersion, isPackageInstalled, Package } from './index';
import { findPackageJson } from '../npm';

export class NextAuth implements Package {
	name = 'next-auth';
	devDependency = false;

	version = async (): Promise<string | undefined> => {
		return getPackageVersion(await findPackageJson(), this);
	};

	isInstalled = async (): Promise<boolean> => {
		return isPackageInstalled(await findPackageJson(), this);
	};
}