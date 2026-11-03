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

	for (const [cas, source] of [
		['un BOM', '﻿---\nbrouillon: true\n---\n'],
		['une ligne vide en tête', '\n---\nbrouillon: true\n---\n'],
		['une clé entre guillemets', '---\n"brouillon": true\n---\n'],
		['un en-tête JSON', '---\n{"titre":"Essai","brouillon":true}\n---\n'],
		['une valeur à la ligne', '---\nbrouillon:\n  true\n---\n'],
		['un en-tête TOML', '+++\nbrouillon = true\n+++\n'],
	]) {
		it(`reconnaît ${cas}, comme Astro`, () => {
			expect(estBrouillon(source)).toBe(true);
		});
	}

	for (const entete of ['brouillon: false', 'brouillon: oui', 'Brouillon: true', 'description: brouillon: true', '# brouillon: true']) {
		it(`ne retient pas « ${entete} »`, () => {
			expect(estBrouillon(recette(entete))).toBe(false);
		});
	}

	it("ignore le mot dans le contenu de la Recette", () => {
		expect(estBrouillon(recette('portions: 2', 'brouillon: true'))).toBe(false);
	});
});
