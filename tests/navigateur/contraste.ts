import type { Locator } from '@playwright/test';

/**
 * Le ratio de contraste WCAG entre la couleur d'un élément et le fond de la page (celui de body) :
 * à revoir si un élément mesuré reçoit un fond propre, comme un en-tête coloré.
 */
export function contraste(element: Locator) {
	return element.evaluate((element) => {
		const canaux = (couleur: string) => {
			const contexte = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
			contexte.fillStyle = couleur;
			contexte.fillRect(0, 0, 1, 1);
			return [...contexte.getImageData(0, 0, 1, 1).data].slice(0, 3);
		};
		const luminance = (couleur: string) => {
			const [r, g, b] = canaux(couleur).map((canal) => {
				const c = canal / 255;
				return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
			});
			return 0.2126 * r + 0.7152 * g + 0.0722 * b;
		};
		const a = luminance(getComputedStyle(element).color);
		const b = luminance(getComputedStyle(document.body).backgroundColor);
		return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
	});
}
