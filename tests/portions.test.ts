import { describe, expect, it } from 'vitest';
import { calculerQuantites } from '../src/recettes/portions';

const quantite = (ingredient: Parameters<typeof calculerQuantites>[0][number], origine: number, voulues: number) =>
	calculerQuantites([ingredient], origine, voulues)[0].quantite;

describe('calcul des Portions', () => {
	it('arrondit les pièces au quart et les affiche en fractions', () => {
		expect(quantite({ nom: 'œufs', quantite: 3 }, 4, 3)).toBe('2 ¼');
		expect(quantite({ nom: 'œufs', quantite: 1 }, 2, 1)).toBe('½');
		expect(quantite({ nom: 'œufs', quantite: 3 }, 4, 1)).toBe('¾');
		expect(quantite({ nom: 'œufs', quantite: 2 }, 3, 6)).toBe('4');
	});

	it.each(['c. à café', 'c. à soupe', 'pincée'] as const)('arrondit les %s au quart', (unite) => {
		expect(quantite({ nom: 'x', quantite: 1, unite }, 3, 4)).toBe('1 ¼');
	});

	it('ne fait jamais disparaître une quantité comptée au quart', () => {
		expect(quantite({ nom: 'sel', quantite: 1, unite: 'pincée' }, 8, 1)).toBe('¼');
	});

	it.each(['g', 'kg', 'ml', 'cl', 'l'] as const)('arrondit les %s à une valeur ronde lisible', (unite) => {
		expect(quantite({ nom: 'x', quantite: 102.5, unite }, 2, 3)).toBe('150');
	});

	it('garde une décimale utile sur les petites masses et petits volumes', () => {
		expect(quantite({ nom: 'x', quantite: 1, unite: 'kg' }, 2, 3)).toBe('1,5');
	});

	it("rend les quantités d'origine lorsque les Portions ne changent pas", () => {
		expect(quantite({ nom: 'x', quantite: 153.7, unite: 'g' }, 4, 4)).toBe('153,7');
		expect(quantite({ nom: 'x', quantite: 0.33 }, 4, 4)).toBe('0,33');
		expect(quantite({ nom: 'x', quantite: 0.5, unite: 'c. à soupe' }, 4, 4)).toBe('½');
	});

	it('laisse inchangés les Ingrédients sans quantité', () => {
		expect(calculerQuantites([{ nom: 'sel, poivre' }], 4, 8)).toEqual([{ nom: 'sel, poivre' }]);
	});

	it("ne convertit pas les unités", () => {
		expect(calculerQuantites([{ nom: 'farine', quantite: 800, unite: 'g' }], 1, 2)).toEqual([
			{ nom: 'farine', quantite: (1600).toLocaleString('fr-FR'), unite: 'g' },
		]);
	});
});
