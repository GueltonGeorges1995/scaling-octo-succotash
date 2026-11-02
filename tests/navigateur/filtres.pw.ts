import { expect, test, type Page } from '@playwright/test';

const titres = (page: Page) => page.getByRole('heading', { level: 2 }).filter({ visible: true });
const champ = (page: Page) => page.getByRole('searchbox', { name: 'Rechercher une recette' });
const categorie = (page: Page) => page.getByRole('combobox', { name: 'Catégorie' });
const tag = (page: Page, nom: string) => page.getByRole('checkbox', { name: nom });
const aucunResultat = (page: Page) => page.getByText('Aucune recette ne correspond à cette recherche');

async function chercher(page: Page, texte: string) {
	await expect(champ(page)).toBeEnabled();
	await champ(page).fill(texte);
}

test.beforeEach(async ({ page }, { titlePath }) => {
	if (titlePath.includes('sans JavaScript')) return;
	await page.goto('./');
	await expect(categorie(page)).toBeEnabled();
});

test('filtre par Catégorie', async ({ page }) => {
	await categorie(page).selectOption('Dessert');
	await expect(titres(page)).toHaveText(['Éclair au café', 'Tarte aux pommes']);
});

test('ne garde que les Recettes ayant tous les Tags sélectionnés', async ({ page }) => {
	await tag(page, 'rapide').check();
	await expect(titres(page)).toHaveText(['Quiche en groupes', 'Tarte aux pommes', 'Tartines beurrées']);

	await tag(page, 'végétarien').check();
	await expect(titres(page)).toHaveText(['Tarte aux pommes']);
});

test('combine texte, Catégorie et Tags', async ({ page }) => {
	await chercher(page, 'beurre');
	await expect(titres(page)).toHaveText(['Quiche en groupes', 'Tartines beurrées']);

	await categorie(page).selectOption('Plat');
	await expect(titres(page)).toHaveText(['Quiche en groupes']);

	await tag(page, 'végétarien').check();
	await expect(titres(page)).toHaveCount(0);
});

test('ne propose que les Catégories et Tags publiés', async ({ page }) => {
	await expect(categorie(page).getByRole('option')).toHaveText(['Toutes les catégories', 'Plat', 'Dessert', 'Petit-déjeuner']);
	await expect(page.getByRole('checkbox')).toHaveCount(2);
	await expect(tag(page, 'rapide')).toBeVisible();
	await expect(tag(page, 'végétarien')).toBeVisible();
});

test('affiche un message clair sans résultat, puis le retire', async ({ page }) => {
	await expect(aucunResultat(page)).toBeHidden();

	await chercher(page, 'mozzarella');
	await expect(aucunResultat(page)).toBeVisible();

	await chercher(page, '');
	await expect(aucunResultat(page)).toBeHidden();
	await expect(titres(page)).toHaveCount(4);
});

test("conserve l'état dans l'URL et le restaure au rechargement, accents compris", async ({ page }) => {
	await chercher(page, 'pâte dorée');
	await categorie(page).selectOption('Dessert');
	await tag(page, 'végétarien').check();
	await expect(titres(page)).toHaveText(['Tarte aux pommes']);

	const url = new URL(page.url());
	expect(url.searchParams.get('q')).toBe('pâte dorée');
	expect(url.searchParams.get('categorie')).toBe('Dessert');
	expect(url.searchParams.getAll('tag')).toEqual(['végétarien']);

	await page.reload();

	await expect(champ(page)).toHaveValue('pâte dorée');
	await expect(categorie(page)).toHaveValue('Dessert');
	await expect(tag(page, 'végétarien')).toBeChecked();
	await expect(titres(page)).toHaveText(['Tarte aux pommes']);
});

test("restaure une Catégorie accentuée et retire de l'URL un filtre levé", async ({ page }) => {
	await page.goto('./?categorie=Petit-d%C3%A9jeuner');
	await expect(categorie(page)).toHaveValue('Petit-déjeuner');
	await expect(titres(page)).toHaveText(['Tartines beurrées']);

	await categorie(page).selectOption('');
	await expect(titres(page)).toHaveCount(4);
	expect(new URL(page.url()).search).toBe('');
});

test("ignore les filtres de l'URL qui n'existent pas sur le site", async ({ page }) => {
	await page.goto('./?categorie=Sauce&tag=inconnu');
	await expect(categorie(page)).toBeEnabled();

	await expect(categorie(page)).toHaveValue('');
	await expect(titres(page)).toHaveCount(4);
	await expect(aucunResultat(page)).toBeHidden();
});

test("ouvre l'accueil filtré en cliquant sur un Tag d'une Recette", async ({ page }) => {
	await page.goto('tarte-aux-pommes/');
	await page.getByRole('link', { name: 'végétarien' }).click();

	await expect(page).toHaveURL(/\/recettes\/\?tag=v/);
	await expect(tag(page, 'végétarien')).toBeChecked();
	await expect(titres(page)).toHaveText(['Tarte aux pommes']);
});

test('garde les filtres actifs si la recherche ne se charge pas', async ({ page }) => {
	await page.route('**/pagefind/**', (route) => route.abort());
	await page.goto('./');
	await expect(page.getByText('La recherche est indisponible')).toBeVisible();

	await categorie(page).selectOption('Plat');
	await expect(titres(page)).toHaveText(['Quiche en groupes']);
});

test.describe('sans JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('garde la liste complète et des filtres inactifs', async ({ page }) => {
		await page.goto('./?categorie=Plat');

		await expect(titres(page)).toHaveCount(4);
		await expect(page.getByRole('combobox', { name: 'Catégorie' })).toBeDisabled();
		await expect(page.getByRole('checkbox', { name: 'rapide' })).toBeDisabled();
	});
});
