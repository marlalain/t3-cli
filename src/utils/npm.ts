import { PackageJson } from 'type-fest';
import path from 'path';
import * as fs from 'fs';

let json: PackageJson | undefined;

export const findPackageJson = async (
	cwd: string = process.cwd(),
): Promise<PackageJson> => {
	if (json) return json;

	const root = await findNpmRoot(cwd);
	const file = path.join(root, 'package.json');

	json = JSON.parse(await fs.promises.readFile(file, 'utf8'));
	if (!json) throw new Error('Could not find package.json');
	return json;
};

export const findNpmRoot = async (cwd: string): Promise<string> => {
	if (await isAtRoot(cwd)) return cwd;

	const parent = path.dirname(cwd);

	if (parent === cwd) throw new Error('Could not find package.json');

	return findNpmRoot(parent);
};

const isAtRoot = async (cwd: string): Promise<boolean> => {
	return fs.existsSync(path.join(cwd, 'package.json'));
};
