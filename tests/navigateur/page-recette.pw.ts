import { expect, test } from '@playwright/test';
import { contraste, contrasteMinimal } from './contraste';

test('la Catégorie de la Recette mène à la page de cette Catégorie', async ({ page, baseURL }) => {
	await page.goto('tarte-aux-pommes/');
	await page.getByRole('article').getByRole('link', { name: 'Dessert', exact: true }).click();

	await expect(page).toHaveURL(`${baseURL}categorie/dessert/`);
	await expect(page.getByRole('heading', { level: 1, name: 'Dessert' })).toBeVisible();
});

test("un Tag de la Recette mène à l'accueil filtré sur ce Tag", async ({ page, baseURL }) => {
	await page.goto('tarte-aux-pommes/');
	await page.getByRole('article').getByRole('link', { name: 'végétarien', exact: true }).click();

	await expect(page).toHaveURL(`${baseURL}?tag=v%C3%A9g%C3%A9tarien`);
	await expect(page.getByRole('checkbox', { name: 'végétarien' })).toBeChecked();
});

for (const colorScheme of ['light', 'dark'] as const) {
	test(`en thème ${colorScheme}, la Catégorie, les Tags et le bandeau des temps et des Portions restent lisibles`, async ({
		page,
	}) => {
		await page.emulateMedia({ colorScheme });
		await page.goto('quiche-en-groupes/');
		const article = page.getByRole('article');

		const liens = await article.getByRole('link').all();
		expect(liens.length).toBeGreaterThan(1);
		for (const lien of liens) {
			expect(await contraste(lien), (await lien.textContent()) ?? '').toBeGreaterThanOrEqual(4.5);
		}
		const bandeau = article.getByRole('region', { name: 'En bref' });
		await expect(bandeau).toContainText('Repos');
		expect(await contrasteMinimal(bandeau)).toBeGreaterThanOrEqual(4.5);
	});
}
