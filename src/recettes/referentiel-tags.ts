import { readFileSync } from 'node:fs';

// REFERENTIEL_TAGS permet aux tests d'utiliser leur propre Référentiel.
const CHEMIN = process.env.REFERENTIEL_TAGS ?? 'src/recettes/tags.md';

export function lireReferentielTags(): [string, ...string[]] {
	const tags = [...readFileSync(CHEMIN, 'utf-8').matchAll(/^\s*[-*]\s+(.+?)\s*$/gm)].map(([, tag]) => tag);
	if (tags.length === 0) throw new Error(`Le Référentiel de tags ${CHEMIN} ne contient aucun Tag`);
	return tags as [string, ...string[]];
}
