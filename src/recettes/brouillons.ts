import { parseFrontmatter } from '@astrojs/internal-helpers/frontmatter';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { depuisRacine } from './racine';

/** Les Brouillons n'existent que sous `astro dev`. Toute autre commande les exclut, quel que soit l'environnement. */
export const brouillonsVisibles = process.env.ASTRO_COMMANDE === 'dev';

/** Lit l'en-tête comme Astro. S'il est invalide, le fichier reste chargé pour que le build échoue en le nommant. */
export function estBrouillon(source: string) {
	try {
		return parseFrontmatter(source).frontmatter.brouillon === true;
	} catch {
		return false;
	}
}

/**
 * Tout ce qu'un fichier chargé référence est publié, y compris les images de son contenu :
 * hors de `astro dev`, un Brouillon ne doit donc pas être chargé du tout.
 */
export function motifsRecettes(dossier: string) {
	if (brouillonsVisibles) return ['*.mdx'];
	const chemin = depuisRacine(dossier);
	const brouillons = readdirSync(chemin)
		.filter((nom) => nom.endsWith('.mdx') && estBrouillon(readFileSync(join(chemin, nom), 'utf-8')))
		.map((nom) => `!${nom}`);
	return ['*.mdx', ...brouillons];
}
