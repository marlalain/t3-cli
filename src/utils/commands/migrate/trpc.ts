import { Migrate } from '../migrate.js';

export class MigrateTRPC implements Migrate {
	packageName = 'trpc';
	fromVersion = 'v9';
	toVersion = 'v10';

	migrate(options: { cwd: string }): Promise<void> {
		return Promise.resolve(undefined);
	}
}
