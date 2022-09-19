import { TRPC } from '../packages/trpc.js';
import { Tailwind } from '../packages/tailwind.js';
import { NextAuth } from '../packages/nextAuth.js';
import { Prisma } from '../packages/prisma.js';

export const packages = {
	trpc: new TRPC(),
	tailwind: new Tailwind(),
	nextAuth: new NextAuth(),
	prisma: new Prisma(),
};
