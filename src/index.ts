import { Command } from 'commander';
import { checkCommand } from './utils/commands/checks.js';
import { packagesCommand } from './utils/commands/packages.js';
import { cliName, description, usage, version } from './const.js';

const program = new Command();

program.name(cliName).description(description).version(version).usage(usage);

program.addCommand(packagesCommand());
program.addCommand(checkCommand());

program.parse(process.argv);
