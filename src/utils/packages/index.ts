/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PackageJson } from 'type-fest';
import { TRPC } from './trpc.js';
import { Tailwind } from './tailwind.js';
import { NextAuth } from './nextAuth.js';
import { Prisma } from './prisma.js';
import { findPackageJson } from '../npm.js';

export const packages = {
	trpc: new TRPC(),
	tailwind: new Tailwind(),
	nextAuth: new NextAuth(),
	prisma: new Prisma(),
};

export const getPackageVersion = (
	json: PackageJson,
	pkg: IPackage,
): string | undefined => {
	return pkg.devDependency
		? json.devDependencies?.[pkg.value!]
		: json.dependencies?.[pkg.value!];
};

export const isPackageInstalled = (
	json: PackageJson,
	pkg: IPackage,
): boolean => {
	if (pkg.devDependency) {
		if (!json.devDependencies) return false;
		return !!json.devDependencies[pkg.value!];
	}

	if (!json.dependencies) return false;
	return !!json.dependencies[pkg.value!];
};

export interface IPackage {
	name?: string;
	value?: string;
	devDependency?: boolean;
	version: () => Promise<string | undefined>;
	isInstalled: () => Promise<boolean>;
}

export class Package implements IPackage {
	version = async (): Promise<string | undefined> => {
		return getPackageVersion(await findPackageJson(), this);
	};

	isInstalled = async (): Promise<boolean> => {
		return isPackageInstalled(await findPackageJson(), this);
	};
}
