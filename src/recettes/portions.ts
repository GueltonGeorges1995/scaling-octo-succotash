import type { Ingredient } from './schema';

export interface QuantiteAffichee {
	nom: string;
	quantite?: string;
	unite?: Ingredient['unite'];
}

const MASSES_ET_VOLUMES: (Ingredient['unite'] | undefined)[] = ['g', 'kg', 'ml', 'cl', 'l'];
const FRACTIONS: Record<number, string> = { 0.25: '¼', 0.5: '½', 0.75: '¾' };

const enDecimal = (quantite: number) => quantite.toLocaleString('fr-FR');

/** Écrit une quantité multiple d'un quart en fraction, toute autre valeur en décimal. */
function enFraction(quantite: number) {
	const entier = Math.floor(quantite);
	const fraction = FRACTIONS[quantite - entier];
	if (fraction === undefined) return enDecimal(quantite);
	return entier === 0 ? fraction : `${entier} ${fraction}`;
}

const auQuart = (quantite: number) => Math.max(Math.round(quantite * 4) / 4, 0.25);
const valeurRonde = (quantite: number) => Number(quantite.toPrecision(2));

/** Calcule les quantités à afficher ; des Portions inchangées redonnent les quantités d'origine, sans arrondi. */
export function calculerQuantites(
	ingredients: Ingredient[],
	portionsOrigine: number,
	portionsVoulues: number,
): QuantiteAffichee[] {
	const inchangees = portionsOrigine === portionsVoulues;

	return ingredients.map((ingredient) => {
		const { quantite, unite } = ingredient;
		if (quantite === undefined) return ingredient as QuantiteAffichee;

		const calculee = (quantite * portionsVoulues) / portionsOrigine;
		const affichee = MASSES_ET_VOLUMES.includes(unite)
			? enDecimal(inchangees ? quantite : valeurRonde(calculee))
			: enFraction(inchangees ? quantite : auQuart(calculee));
		return { ...ingredient, quantite: affichee };
	});
}
