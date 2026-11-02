import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { motifsRecettes } from './recettes/brouillons';
import { schemaRecette } from './recettes/schema';

// RECETTES_DIR permet aux tests de construire le site sur leurs propres Recettes.
const dossier = process.env.RECETTES_DIR ?? 'src/content/recettes';

const recettes = defineCollection({
	loader: glob({ pattern: motifsRecettes(dossier), base: dossier }),
	schema: ({ image }) => schemaRecette.extend({ photo: image().optional() }),
});

export const collections = { recettes };
