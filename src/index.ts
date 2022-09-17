import { TRPC } from './utils/packages/trpc';
import { Tailwind } from './utils/packages/tailwind';
import { NextAuth } from './utils/packages/nextAuth';

(async () => {
	const trpc = new TRPC();
	const tailwind = new Tailwind();
	const nextAuth = new NextAuth();

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
		{
			name: nextAuth.name,
			version: await nextAuth.version(),
			isInstalled: await nextAuth.isInstalled(),
		},
	]);
})();
