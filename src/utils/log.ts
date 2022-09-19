/* eslint-disable @typescript-eslint/no-explicit-any */
// noinspection JSUnusedGlobalSymbols

import chalk from 'chalk';

export const log = (...e: any[]) => {
	console.log(chalk.blue(...e));
};

export const warn = (...e: any[]) => {
	console.warn(chalk.yellow(...e));
};

export const error = (...e: any[]) => {
	console.error(chalk.red(...e));
};

export const success = (...e: any[]) => {
	console.log(chalk.green(...e));
};
