/* eslint-disable */
import { callExpression, identifier, memberExpression, objectProperty, ObjectProperty } from '@babel/types';

const possibleTypes = ['string', 'number', 'boolean', 'url', 'port', 'other'];
export type PossibleType = typeof possibleTypes[number];

export const typeGuesser = (env: string): PossibleType[] => {
	const isUrl = env.includes('URL');
	const isPort = env.includes('PORT');
	const isString = ['SECRET', 'ID'].some((text) => env.includes(text));
	const isNumber = ['TIMEOUT', 'MAX', 'MIN'].some((text) => env.includes(text));
	const isBoolean = ['ENABLED', 'DISABLE', 'DEBUG'].some((text) => env.includes(text));

	return possibleTypes.sort((a: PossibleType) => {
		if (a === 'string' && isString) return -1;
		if (a === 'number' && isNumber) return -1;
		if (a === 'boolean' && isBoolean) return -1;
		if (a === 'url' && isUrl) return -1;
		if (a === 'port' && isPort) return -1;
		return 0;
	});
};

export const zodAST = (env: string, type: PossibleType): ObjectProperty => {
	switch (type) {
		case 'string':
			return doAST(env, 'string');
		case 'number':
			return doAST(env, 'number');
		case 'boolean':
			return doAST(env, 'boolean');
		case 'url':
			return doAST(env, 'string', 'url');
		case 'port':
			return doAST(env, 'number');
		default:
			return doAST(env, 'string');
	}
};

const doAST = (env: string, first: string, second?: string): ObjectProperty => {
	if (!second)
		return objectProperty(identifier(env), callExpression(memberExpression(identifier('z'), identifier(first)), []));

	return objectProperty(
		identifier(env),
		callExpression(
			memberExpression(callExpression(memberExpression(identifier('z'), identifier(first)), []), identifier(second)),
			[],
		),
	);
};
