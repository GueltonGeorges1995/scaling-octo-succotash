import { expect, test } from '@playwright/test';

const titres = (page: import('@playwright/test').Page) => page.getByRole('heading', { level: 2 }).filter({ visible: true });

async function chercher(page: import('@playwright/test').Page, texte: string) {
	const champ = page.getByRole('searchbox', { name: 'Rechercher une recette' });
	await expect(champ).toBeEnabled();
	await champ.fill(texte);
}

test.beforeEach(async ({ page }) => {
	await page.goto('./');
});

test.describe('trouve une Recette par', () => {
	for (const [champ, mot, titre] of [
		['un Ingrédient absent de son titre', 'farine', 'Tarte aux pommes'],
		['son titre', 'quiche', 'Quiche en groupes'],
		['sa description', 'dorée', 'Tarte aux pommes'],
		['une étape', 'foncer', 'Quiche en groupes'],
		['un mot au singulier, le contenu étant au pluriel', 'pomme', 'Tarte aux pommes'],
		['un mot après une élision', 'eau', 'Quiche en groupes'],
		['un mot saisi avec son élision', "l'eau", 'Quiche en groupes'],
		['un mot saisi avec une apostrophe typographique', 'l’eau', 'Quiche en groupes'],
		['un mot saisi avec une autre élision que celle du contenu', "d'eau", 'Quiche en groupes'],
		['un mot écrit avec la ligature', 'œufs', 'Quiche en groupes'],
		['un mot écrit sans la ligature', 'oeufs', 'Quiche en groupes'],
	]) {
		test(champ, async ({ page }) => {
			await chercher(page, mot);
			await expect(titres(page)).toHaveText([titre]);
		});
	}
});

test('trouve le singulier à partir du pluriel', async ({ page }) => {
	await chercher(page, 'pâtes');
	await expect(titres(page)).toHaveText(['Quiche en groupes', 'Tarte aux pommes']);
});

// Pagefind rapproche un mot absent des mots indexés qui le commencent : « c. », « g », « la », « les ».
for (const mot of ['courgette', 'gratin', 'lait', 'levure']) {
	test(`ne confond pas « ${mot} », absent des Recettes, avec un mot très court`, async ({ page }) => {
		await chercher(page, 'farine');
		await expect(titres(page)).toHaveCount(1);

		await chercher(page, mot);
		await expect(titres(page)).toHaveCount(0);
	});
}

for (const mot of ['cuisson', 'préparation', 'portions', 'étapes']) {
	test(`ne trouve pas « ${mot} » dans les libellés de la page de Recette`, async ({ page }) => {
		await chercher(page, 'farine');
		await expect(titres(page)).toHaveCount(1);

		await chercher(page, mot);
		await expect(titres(page)).toHaveCount(0);
	});
}

test('trouve un mot après un trait d\'union', async ({ page }) => {
	await chercher(page, 'déjeuner');
	await expect(titres(page)).toHaveText(['Tartines beurrées']);
});

test('réaffiche toute la liste quand le champ est vidé', async ({ page }) => {
	await chercher(page, 'farine');
	await expect(titres(page)).toHaveCount(1);

	await chercher(page, '');
	await expect(titres(page)).toHaveCount(4);
});

test("n'indexe pas les Brouillons", async ({ page }) => {
	await chercher(page, 'farine');
	await expect(titres(page)).toHaveCount(1);

	await chercher(page, 'confidentielle');
	await expect(titres(page)).toHaveCount(0);
});

test('garde la liste lisible et le signale si la recherche ne se charge pas', async ({ page }) => {
	await page.route('**/pagefind/**', (route) => route.abort());
	await page.goto('./');

	await expect(page.getByText('La recherche est indisponible')).toBeVisible();
	await expect(titres(page)).toHaveCount(4);
});

test("oublie le texte d'un lien partagé si la recherche ne se charge pas", async ({ page }) => {
	await page.route('**/pagefind/**', (route) => route.abort());
	await page.goto('./?q=farine&tag=rapide');

	await expect(page.getByText('La recherche est indisponible')).toBeVisible();
	await expect(page.getByRole('searchbox')).toHaveValue('');
	await expect(page).toHaveURL(/\?tag=rapide$/);
});

test('signale une recherche qui échoue après le chargement', async ({ page }) => {
	const champ = page.getByRole('searchbox', { name: 'Rechercher une recette' });
	await expect(champ).toBeEnabled();
	await page.route('**/pagefind/**', (route) => route.abort());

	await champ.fill('farine');

	await expect(page.getByText('La recherche est indisponible')).toBeVisible();
	await expect(titres(page)).toHaveCount(4);
	await expect(champ).toHaveValue('farine');
	await expect(page).toHaveURL(/\?q=farine$/);
});

test('réessaie à la saisie suivante après une panne passagère', async ({ page }) => {
	const champ = page.getByRole('searchbox', { name: 'Rechercher une recette' });
	await expect(champ).toBeEnabled();
	await page.route('**/pagefind/**', (route) => route.abort());
	await champ.fill('farine');
	await expect(page.getByText('La recherche est indisponible')).toBeVisible();

	await page.unroute('**/pagefind/**');
	await champ.fill('quiche');

	await expect(titres(page)).toHaveText(['Quiche en groupes']);
	await expect(page.getByText('La recherche est indisponible')).toBeHidden();
});

test.describe('sans JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('garde la liste complète et un champ inactif', async ({ page }) => {
		await page.goto('./');

		await expect(titres(page)).toHaveCount(4);
		await expect(page.getByRole('searchbox')).toBeDisabled();
	});
});
