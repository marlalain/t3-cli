import { Command } from 'commander';
import { checkCommand } from './utils/commands/checks.js';
import { packagesCommand } from './utils/commands/packages.js';
import { cliName, description, usage, version } from './const.js';
import { migrateCommand } from './utils/commands/migrate.js';

const program = new Command();

program.name(cliName).description(description).version(version).usage(usage);

[checkCommand(), packagesCommand(), migrateCommand()].forEach((command) => program.addCommand(command));

program.parse(process.argv);
