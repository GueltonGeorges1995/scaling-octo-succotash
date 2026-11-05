import type { Locator } from '@playwright/test';

/**
 * Le ratio de contraste WCAG entre la couleur d'un élément et le fond sur lequel il s'affiche :
 * le premier fond non transparent parmi ses ancêtres, celui de body à défaut (un fond semi-transparent n'est pas géré).
 */
export function contraste(element: Locator) {
	return element.evaluate((element) => {
		const canaux = (couleur: string) => {
			const contexte = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
			contexte.fillStyle = couleur;
			contexte.fillRect(0, 0, 1, 1);
			return [...contexte.getImageData(0, 0, 1, 1).data];
		};
		const luminance = (couleur: string) => {
			const [r, g, b] = canaux(couleur)
				.slice(0, 3)
				.map((canal) => {
					const c = canal / 255;
					return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
				});
			return 0.2126 * r + 0.7152 * g + 0.0722 * b;
		};
		let support: Element = element;
		while (support !== document.body && canaux(getComputedStyle(support).backgroundColor)[3] === 0) {
			support = support.parentElement ?? document.body;
		}
		const a = luminance(getComputedStyle(element).color);
		const b = luminance(getComputedStyle(support).backgroundColor);
		return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
	});
}

/** Le plus faible contraste parmi les éléments qui portent eux-mêmes du texte, dans `zone` et elle comprise. */
export async function contrasteMinimal(zone: Locator) {
	const elements = [zone, ...(await zone.locator('*').all())];
	let minimum = Infinity;
	for (const element of elements) {
		const porteDuTexte = await element.evaluate((e) =>
			[...e.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim() !== ''),
		);
		if (porteDuTexte) minimum = Math.min(minimum, await contraste(element));
	}
	return minimum;
}
