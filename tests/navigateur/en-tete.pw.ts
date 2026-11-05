import { expect, test, type Page } from '@playwright/test';
import { contraste } from './contraste';

const PAGES = ['./', 'tarte-aux-pommes/', 'categorie/dessert/'];

/** Le nom du site, lien de l'en-tête commun. */
const nomDuSite = (page: Page) =>
	page.getByRole('banner').getByRole('link', { name: 'Recettes', exact: true });

for (const chemin of PAGES) {
	test(`${chemin} affiche le nom du site, qui mène à l'accueil`, async ({ page, baseURL }) => {
		await page.goto(chemin);
		await nomDuSite(page).click();
		await expect(page).toHaveURL(baseURL!);
		await expect(page.getByRole('heading', { level: 1, name: 'Recettes' })).toBeVisible();
	});
}

test('les titres utilisent une police variable servie par le site, affichée sans attente', async ({ page, baseURL }) => {
	const polices: string[] = [];
	page.on('request', (requete) => {
		if (requete.resourceType() === 'font') polices.push(requete.url());
	});
	await page.goto('tarte-aux-pommes/');
	await page.evaluate(() => document.fonts.ready);

	const titre = await page.getByRole('heading', { level: 1 }).evaluate((h1) => {
		const famille = getComputedStyle(h1).fontFamily.split(',')[0].replaceAll(/["']/g, '').trim();
		const faces = [...document.fonts].filter((face) => face.family.replaceAll(/["']/g, '') === famille);
		return {
			famille,
			chargee: faces.some((face) => face.status === 'loaded'),
			displays: [...new Set(faces.map((face) => face.display))],
			graisses: [...new Set(faces.map((face) => face.weight))],
		};
	});
	expect(titre.chargee, `police ${titre.famille} chargée`).toBe(true);
	expect(titre.displays).toEqual(['swap']);
	expect(titre.graisses.every((graisse) => /^\d+ \d+$/.test(graisse)), 'plage de graisses variable').toBe(true);

	expect(polices.length).toBeGreaterThan(0);
	for (const url of polices) expect(new URL(url).origin).toBe(new URL(baseURL!).origin);
});

for (const colorScheme of ['light', 'dark'] as const) {
	test(`en thème ${colorScheme}, le nom du site et le menu restent lisibles`, async ({ page }) => {
		await page.emulateMedia({ colorScheme });
		await page.goto('tarte-aux-pommes/');
		const entete = page.getByRole('banner');
		const liens = await entete.getByRole('link').all();
		expect(liens.length).toBeGreaterThan(1);
		for (const lien of liens) {
			expect(await contraste(lien), (await lien.textContent()) ?? '').toBeGreaterThanOrEqual(4.5);
		}
	});
}

test("à l'impression, l'en-tête est masqué", async ({ page }) => {
	await page.goto('tarte-aux-pommes/');
	await page.emulateMedia({ media: 'print' });
	await expect(page.getByRole('banner')).toBeHidden();
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test.describe('sur téléphone', () => {
	test.use({ viewport: { width: 320, height: 640 } });

	for (const chemin of PAGES) {
		test(`${chemin} garde le menu des Catégories dans un en-tête qui tient dans la largeur`, async ({ page }) => {
			await page.goto(chemin);
			const menu = page.getByRole('banner').getByRole('navigation', { name: 'Catégories' });
			await expect(menu.getByRole('link', { name: 'Dessert' })).toBeVisible();

			const { largeur, visible } = await page.getByRole('banner').evaluate((entete) => ({
				largeur: entete.scrollWidth,
				visible: entete.clientWidth,
			}));
			expect(largeur).toBeLessThanOrEqual(visible);
		});
	}
});
