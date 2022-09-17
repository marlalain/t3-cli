import { getPackageVersion, isPackageInstalled, Package } from './index';
import { findPackageJson } from '../npm';

export class TRPC implements Package {
	name = 'trpc';

	version = async (): Promise<string | undefined> => {
		return getPackageVersion(await findPackageJson(), this);
	};

	isInstalled = async (): Promise<boolean> => {
		return isPackageInstalled(await findPackageJson(), this);
	};
}
