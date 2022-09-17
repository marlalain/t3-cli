import { PackageJson } from 'type-fest';
import { TRPC } from './trpc.js';
import { Tailwind } from './tailwind.js';
import { NextAuth } from './nextAuth.js';
import { Prisma } from './prisma.js';

export const packages = {
	trpc: new TRPC(),
	tailwind: new Tailwind(),
	nextAuth: new NextAuth(),
	prisma: new Prisma(),
};

export const getPackageVersion = (
	json: PackageJson,
	pkg: Package,
): string | undefined => {
	return pkg.devDependency
		? json.devDependencies?.[pkg.name]
		: json.dependencies?.[pkg.name];
};

export const isPackageInstalled = (
	json: PackageJson,
	pkg: Package,
): boolean => {
	if (pkg.devDependency) {
		if (!json.devDependencies) return false;
		return !!json.devDependencies[pkg.name];
	}

	if (!json.dependencies) return false;
	return !!json.dependencies[pkg.name];
};

export interface Package {
	name: string;
	version: () => Promise<string | undefined>;
	isInstalled: () => Promise<boolean>;
	devDependency: boolean;
}
