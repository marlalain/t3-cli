import { findRoot } from './utils/npm';

(async () => {
	console.log('root:', await findRoot(process.cwd()));
})();
