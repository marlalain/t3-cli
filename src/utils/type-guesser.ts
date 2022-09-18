const possibleTypes = ['string', 'number', 'boolean', 'url', 'port', 'other'];
export type PossibleType = typeof possibleTypes[number];

export const typeGuesser = (env: string): PossibleType[] => {
	const isUrl = env.includes('URL');
	const isPort = env.includes('PORT');
	const isString = ['SECRET', 'ID'].some((text) => env.includes(text));
	const isNumber = ['TIMEOUT', 'MAX', 'MIN'].some((text) => env.includes(text));
	const isBoolean = ['ENABLED', 'DISABLE', 'DEBUG'].some((text) =>
		env.includes(text),
	);

	return possibleTypes.sort((a: PossibleType) => {
		if (a === 'string' && isString) return -1;
		if (a === 'number' && isNumber) return -1;
		if (a === 'boolean' && isBoolean) return -1;
		if (a === 'url' && isUrl) return -1;
		if (a === 'port' && isPort) return -1;
		return 0;
	});
};
