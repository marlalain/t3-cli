import { TRPC } from './utils/packages/trpc';

(async () => {
	const trpc = new TRPC();

	console.log(await trpc.isInstalled());
})();
