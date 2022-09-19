import { TypesafeEnv } from '../checks/typesafe-env.js';
import { Command } from 'commander';

export const checks = {
	typesafeEnv: new TypesafeEnv(),
};

export const checkCommand = (): Command => {
	return new Command('check').description('Runs checks on your codebase').action(async () => {
		await checks.typesafeEnv.check();
	});
};
