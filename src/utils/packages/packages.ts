import { TRPC } from './trpc.js';
import { Tailwind } from './tailwind.js';
import { NextAuth } from './nextAuth.js';
import { Prisma } from './prisma.js';

export const packages = {
	trpc: new TRPC(),
	tailwind: new Tailwind(),
	nextAuth: new NextAuth(),
	prisma: new Prisma(),
};
