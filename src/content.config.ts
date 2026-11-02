import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { schemaRecette } from './recettes/schema';

const recettes = defineCollection({
	// RECETTES_DIR permet aux tests de construire le site sur leurs propres Recettes.
	loader: glob({ pattern: '*.mdx', base: process.env.RECETTES_DIR ?? 'src/content/recettes' }),
	// Une photo déclarée est publiée même si sa page ne l'est pas : on l'oublie pour un Brouillon au build.
	schema: ({ image }) =>
		z.preprocess(
			(data: any) => (import.meta.env.PROD && data?.brouillon === true ? { ...data, photo: undefined } : data),
			schemaRecette.extend({ photo: image().optional() }),
		),
});

export const collections = { recettes };
