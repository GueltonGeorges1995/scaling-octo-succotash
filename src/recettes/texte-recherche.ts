/**
 * Pagefind ne rapproche pas « œufs » de « oeufs » et lit « l'eau » comme un seul mot : l'index et les
 * requêtes n'écrivent que « oeufs » et « l eau ». Seul l'index voit ces écritures, jamais le visiteur.
 */
export const ecritureIndex = (texte: string) =>
	texte
		.replaceAll('œ', 'oe')
		.replaceAll('Œ', 'Oe')
		.replace(/(?<=\p{L})(?:['’]|&#x27;|&#39;)(?=\p{L})/gu, ' ');

/** « l'eau » cherche « eau » : l'article élidé ne doit pas être exigé d'une Recette qui écrit « d'eau ». */
export const sansElisions = (texte: string) => texte.replace(/(?<![\p{L}\p{N}])\p{L}['’](?=\p{L})/gu, '');
