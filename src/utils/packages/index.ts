import { PackageJson } from 'type-fest';

export const getPackageVersion = (
	json: PackageJson,
	pkg: Package,
): string | undefined => {
	if (!json.dependencies || !json.dependencies[pkg.name]) return undefined;

	// We know this isn't undefined because of package.json specs
	// eslint-disable-next-line
	return json.dependencies[pkg.name]?.[1]!;
};

export const isPackageInstalled = (
	json: PackageJson,
	pkg: Package,
): boolean => {
	if (!json.dependencies)
		throw new Error('No dependencies found in package.json');

	return !!json.dependencies[pkg.name];
};

export interface Package {
	name: string;
	version: () => Promise<string | undefined>;
	isInstalled: () => Promise<boolean>;
}
