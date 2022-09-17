import * as fs from 'fs';
import * as path from 'path';

export const findRoot = async (cwd: string): Promise<string> => {
	if (await isAtRoot(cwd)) return cwd;

	const parent = path.dirname(cwd);

	if (parent === cwd) throw new Error('Could not find package.json');

	return findRoot(parent);
};

const isAtRoot = async (cwd: string): Promise<boolean> => {
	return fs.existsSync(path.join(cwd, 'package.json'));
};
