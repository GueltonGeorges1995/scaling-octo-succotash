import { describe, expect, it } from 'vitest';
import { estBrouillon } from '../src/recettes/brouillons';

const recette = (entete: string, contenu = '') => `---\ntitre: Essai\n${entete}\n---\n${contenu}\n`;

describe('estBrouillon', () => {
	for (const entete of ['brouillon: true', 'brouillon:   true  ', 'brouillon : true', 'brouillon: True', 'brouillon: true # à relire']) {
		it(`reconnaît « ${entete} »`, () => {
			expect(estBrouillon(recette(entete))).toBe(true);
		});
	}

	it('reconnaît les fins de ligne Windows', () => {
		expect(estBrouillon('---\r\ntitre: Essai\r\nbrouillon: true\r\n---\r\n')).toBe(true);
	});

	for (const entete of ['brouillon: false', 'brouillon: oui', 'description: brouillon: true', '# brouillon: true']) {
		it(`ne retient pas « ${entete} »`, () => {
			expect(estBrouillon(recette(entete))).toBe(false);
		});
	}

	it("ignore le mot dans le contenu de la Recette", () => {
		expect(estBrouillon(recette('portions: 2', 'brouillon: true'))).toBe(false);
	});
});
