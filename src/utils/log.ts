// noinspection JSUnusedGlobalSymbols

import chalk from 'chalk';

export const log = (...e: string[]) => {
	console.log(chalk.blue(e));
};

export const warn = (...e: string[]) => {
	console.warn(chalk.yellow(e));
};

export const error = (...e: string[]) => {
	console.error('❌\t', chalk.red(e));
};

export const success = (...e: string[]) => {
	console.log(chalk.green(e));
};
