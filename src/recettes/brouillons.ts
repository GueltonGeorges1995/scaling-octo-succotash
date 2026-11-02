import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Les Brouillons n'existent que sous `astro dev`. Toute autre commande les exclut, quel que soit l'environnement. */
export const brouillonsVisibles = process.argv[2] === 'dev';

export function estBrouillon(source: string) {
	const entete = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? '';
	return /^brouillon\s*:\s*true\s*(#.*)?$/im.test(entete);
}

/**
 * Tout ce qu'un fichier chargé référence est publié, y compris les images de son contenu :
 * hors de `astro dev`, un Brouillon ne doit donc pas être chargé du tout.
 */
export function motifsRecettes(dossier: string) {
	if (brouillonsVisibles) return ['*.mdx'];
	const brouillons = readdirSync(dossier)
		.filter((nom) => nom.endsWith('.mdx') && estBrouillon(readFileSync(join(dossier, nom), 'utf-8')))
		.map((nom) => `!${nom}`);
	return ['*.mdx', ...brouillons];
}
