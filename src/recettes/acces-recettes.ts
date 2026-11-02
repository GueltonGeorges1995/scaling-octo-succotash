import { getCollection } from 'astro:content';
import { brouillonsVisibles } from './brouillons';
import { CATEGORIES } from './schema';

const ordreFrancais = new Intl.Collator('fr');

/** Seule source des Recettes visibles, triées par titre : les Brouillons n'existent que sous `astro dev`. */
export async function lireRecettes() {
	const recettes = await getCollection('recettes', ({ data }) => brouillonsVisibles || !data.brouillon);
	return recettes.sort((a, b) => ordreFrancais.compare(a.data.titre, b.data.titre));
}

/** Les Tags présents sur au moins une Recette visible. */
export async function lireTags() {
	const recettes = await lireRecettes();
	return [...new Set(recettes.flatMap(({ data }) => data.tags))].sort(ordreFrancais.compare);
}

/** Les Catégories ayant au moins une Recette visible, avec leur identifiant d'URL sans accents. */
export async function lireCategories() {
	const recettes = await lireRecettes();
	return CATEGORIES.map((nom) => ({
		nom,
		slug: nom.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase(),
		recettes: recettes.filter(({ data }) => data.categorie === nom),
	})).filter((categorie) => categorie.recettes.length > 0);
}
