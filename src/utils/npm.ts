import { PackageJson } from 'type-fest';
import path from 'path';
import * as fs from 'fs';

const findPackageJson = async (cwd: string = process.cwd()): Promise<PackageJson> => {
	const root = await findNpmRoot(cwd);
	const file = path.join(root, 'package.json');

	const json = JSON.parse(await fs.promises.readFile(file, 'utf8'));
	if (!json) throw new Error('Could not find package.json');
	return json;
};

const findNpmRoot = async (cwd: string): Promise<string> => {
	if (await isAtRoot(cwd)) return cwd;

	const parent = path.dirname(cwd);

	if (parent === cwd) throw new Error('Could not find package.json');

	return findNpmRoot(parent);
};

const isAtRoot = async (cwd: string): Promise<boolean> => {
	return fs.existsSync(path.join(cwd, 'package.json'));
};

export type Project = {
	root: string;
	hasWorkspaces: boolean;
	pkg: PackageJson;
};

export const project: Promise<Project> = (async () => {
	const [pkg, root] = await Promise.all([await findPackageJson(), await findNpmRoot(process.cwd())]);
	const hasWorkspaces = !!pkg.workspaces;

	return {
		root,
		hasWorkspaces,
		pkg,
	};
})();
