import { expect, test, type Page } from '@playwright/test';

const PAGES = ['./', 'tarte-aux-pommes/', 'quiche-en-groupes/', 'categorie/dessert/'];

/** Le ratio de contraste WCAG entre la couleur d'un élément et le fond de la page. */
function contraste(page: Page, selecteur: string) {
	return page.locator(selecteur).first().evaluate((element) => {
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

test.describe('sur téléphone', () => {
	test.use({ viewport: { width: 320, height: 640 } });

	for (const chemin of PAGES) {
		test(`${chemin} ne défile pas horizontalement`, async ({ page }) => {
			await page.goto(chemin);
			const { largeur, visible } = await page.evaluate(() => ({
				largeur: document.documentElement.scrollWidth,
				visible: document.documentElement.clientWidth,
			}));
			expect(largeur).toBeLessThanOrEqual(visible);
		});
	}
});

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`thème ${colorScheme}`, () => {
		test.use({ colorScheme });

		test("suit le réglage de l'appareil, avec des contrastes lisibles", async ({ page }) => {
			await page.goto('tarte-aux-pommes/');
			const fond = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
			const canaux = fond.match(/\d+/g)!.slice(0, 3).map(Number);
			if (colorScheme === 'dark') expect(Math.max(...canaux)).toBeLessThan(60);
			else expect(Math.min(...canaux)).toBeGreaterThan(200);

			for (const selecteur of ['h1', 'article > p', '.categorie', '.temps', '.tags a', 'a.retour', 'output']) {
				expect(await contraste(page, selecteur), selecteur).toBeGreaterThanOrEqual(4.5);
			}
		});
	});
}

test.describe("à l'impression", () => {
	test.use({ colorScheme: 'dark' });

	test.beforeEach(async ({ page }) => {
		await page.emulateMedia({ media: 'print' });
	});

	test('une Recette masque le menu et les boutons, et garde les quantités affichées', async ({ page }) => {
		await page.emulateMedia({ media: 'screen' });
		await page.goto('tarte-aux-pommes/');
		await page.getByRole('button', { name: 'Ajouter une Portion' }).click();
		await page.emulateMedia({ media: 'print' });

		await expect(page.getByRole('navigation')).toBeHidden();
		await expect(page.getByRole('link', { name: 'Toutes les recettes' })).toBeHidden();
		await expect(page.getByRole('button', { name: 'Ajouter une Portion' })).toBeHidden();
		await expect(page.getByRole('button', { name: 'Retirer une Portion' })).toBeHidden();
		await expect(page.getByText('Portions : 7')).toBeVisible();
		await expect(page.getByText('290 g farine')).toBeVisible();
	});

	test("reste noir sur blanc quel que soit le thème de l'appareil", async ({ page }) => {
		await page.goto('tarte-aux-pommes/');
		await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
		await expect(page.locator('body')).toHaveCSS('color', 'rgb(0, 0, 0)');
	});

	test("l'accueil masque la recherche et les filtres", async ({ page }) => {
		await page.goto('./');
		await expect(page.getByRole('searchbox')).toBeHidden();
		await expect(page.getByRole('combobox', { name: 'Catégorie' })).toBeHidden();
		await expect(page.getByRole('checkbox').first()).toBeHidden();
		await expect(page.getByRole('heading', { name: 'Tarte aux pommes' })).toBeVisible();
	});
});
