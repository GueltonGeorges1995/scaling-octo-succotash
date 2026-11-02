import { expect, test } from '@playwright/test';

const retirer = { name: 'Retirer une Portion' };
const ajouter = { name: 'Ajouter une Portion' };

test('recalcule les quantités dès que les Portions changent', async ({ page }) => {
	await page.goto('tarte-aux-pommes/');
	const ingredients = page.getByRole('listitem');

	await expect(page.getByRole('status')).toHaveText('6');
	await expect(ingredients.filter({ hasText: 'pommes' })).toHaveText('4 pommes');

	await page.getByRole('button', ajouter).click();
	await expect(page.getByRole('status')).toHaveText('7');
	await expect(ingredients.filter({ hasText: 'pommes' })).toHaveText('4 ¾ pommes');
	await expect(ingredients.filter({ hasText: 'farine' })).toHaveText('290 g farine');
	await expect(ingredients.filter({ hasText: 'sel' })).toHaveText('sel, poivre');

	await page.getByRole('button', retirer).click();
	await expect(ingredients.filter({ hasText: 'farine' })).toHaveText('250 g farine');
});

test('ne descend pas sous 1 Portion', async ({ page }) => {
	await page.goto('tarte-aux-pommes/');
	const bouton = page.getByRole('button', retirer);

	for (let restantes = 5; restantes >= 1; restantes--) {
		await bouton.click();
		await expect(page.getByRole('status')).toHaveText(String(restantes));
	}
	await expect(bouton).toBeDisabled();
});

test.describe('sans JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test("affiche les quantités d'origine et des boutons inactifs", async ({ page }) => {
		await page.goto('tarte-aux-pommes/');

		await expect(page.getByText('4 pommes')).toBeVisible();
		await expect(page.getByText('250 g farine')).toBeVisible();
		await expect(page.getByRole('button', ajouter)).toBeDisabled();
	});
});
