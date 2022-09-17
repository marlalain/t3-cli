import { TRPC } from './utils/packages/trpc';
import { Tailwind } from './utils/packages/tailwind';

(async () => {
	const trpc = new TRPC();
	const tailwind = new Tailwind();

	console.log([
		{
			name: trpc.name,
			version: await trpc.version(),
			isInstalled: await trpc.isInstalled(),
		},
		{
			name: tailwind.name,
			version: await tailwind.version(),
			isInstalled: await tailwind.isInstalled(),
		},
	]);
})();
