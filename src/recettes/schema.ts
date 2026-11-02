import { z } from 'astro/zod';
import { lireReferentielTags } from './referentiel-tags';

export const CATEGORIES = ['Entrée', 'Plat', 'Dessert', 'Accompagnement', 'Sauce', 'Boisson', 'Petit-déjeuner'] as const;

export const UNITES = ['g', 'kg', 'ml', 'cl', 'l', 'c. à café', 'c. à soupe', 'pincée'] as const;

const ingredient = z
	.strictObject({
		nom: z.string().min(1),
		quantite: z.number().positive().optional(),
		unite: z.enum(UNITES).optional(),
	})
	.refine((i) => i.unite === undefined || i.quantite !== undefined, {
		message: 'Une unité sans quantité est invalide',
		path: ['unite'],
	});

const groupeIngredients = z.strictObject({
	groupe: z.string().min(1),
	ingredients: z.array(ingredient).min(1),
});

const tag = z.enum(lireReferentielTags(), {
	error: ({ input }) => `Tag « ${input} » absent du Référentiel de tags`,
});

const minutes = z.number().int().nonnegative();

export const schemaRecette = z.object({
	titre: z.string().min(1),
	description: z.string().min(1),
	categorie: z.enum(CATEGORIES),
	tags: z.array(tag),
	portions: z.number().int().positive(),
	tempsPreparation: minutes,
	tempsCuisson: minutes,
	tempsRepos: minutes.optional(),
	brouillon: z.boolean().default(false),
	ingredients: z.union([z.array(ingredient).min(1), z.array(groupeIngredients).min(1)]),
});

type Recette = z.infer<typeof schemaRecette>;
export type Ingredient = z.infer<typeof ingredient>;

export function tempsTotal({ tempsPreparation, tempsCuisson, tempsRepos = 0 }: Recette) {
	return tempsPreparation + tempsCuisson + tempsRepos;
}

/** Présente une liste plate comme un unique groupe sans nom. */
export function groupesIngredients({ ingredients }: Recette): { groupe?: string; ingredients: Ingredient[] }[] {
	const estGroupes = (liste: Recette['ingredients']): liste is z.infer<typeof groupeIngredients>[] =>
		'groupe' in liste[0];
	return estGroupes(ingredients) ? ingredients : [{ ingredients }];
}
