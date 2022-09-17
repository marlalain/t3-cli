import { findNpmRoot } from './npm.js';
import path from 'path';
import * as fs from 'fs';

export const enviromentVariables = async () => {
	const folder = await findNpmRoot(process.cwd());
	const envPath = path.resolve(folder, '.env');
	const env = fs.readFileSync(envPath, 'utf8');

	return env
		.split('\n')
		.filter((line) => line !== '')
		.map((line) => line.split('=')[0])
		.filter((env) => !env.startsWith('#'));
};
