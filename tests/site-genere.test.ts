import { exec } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const racine = resolve(import.meta.dirname, '..');

// Variables posées par Vitest : héritées, elles fausseraient le build (BASE_URL écrase le chemin de base).
const VARIABLES_VITEST = ['BASE_URL', 'MODE', 'DEV', 'PROD', 'SSR', 'TEST', 'VITEST', 'NODE_ENV'];

async function construireSite(recettes: string, referentiel = 'tags.md') {
	const sortie = mkdtempSync(join(tmpdir(), 'recettes-build-'));
	const env: NodeJS.ProcessEnv = { ...process.env, RECETTES_DIR: `tests/fixtures/${recettes}`, REFERENTIEL_TAGS: `tests/fixtures/${referentiel}` };
	for (const variable of VARIABLES_VITEST) delete env[variable];

	await promisify(exec)(`npm run build -- --outDir "${sortie}"`, { cwd: racine, env });
	return sortie;
}

function liensInternes(html: string) {
	return [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
		.map(([, lien]) => lien)
		.filter((lien) => lien.startsWith('/'));
}

describe('site généré', () => {
	let sortie: string;
	const lire = (chemin: string) => readFileSync(join(sortie, chemin), 'utf-8');

	beforeAll(async () => {
		sortie = await construireSite('recettes-publiees');
	}, 120_000);

	afterAll(() => rmSync(sortie, { recursive: true, force: true }));

	it("publie une Recette à l'URL issue du nom de son fichier", () => {
		const html = lire('tarte-aux-pommes/index.html');

		expect(html).toContain('Tarte aux pommes');
		expect(html).toContain('Étaler la pâte.');
		expect(html).toContain(
			'<link rel="canonical" href="https://gueltongeorges1995.github.io/recettes/tarte-aux-pommes/"',
		);
	});

	it("ne crée aucun doublon du chemin de base ni de segment « recette »", () => {
		expect(existsSync(join(sortie, 'recettes'))).toBe(false);
		expect(existsSync(join(sortie, 'recette'))).toBe(false);
	});

	it("remplace la page d'accueil Astro par défaut", () => {
		const html = lire('index.html');

		expect(html).toContain('<html lang="fr"');
		expect(html).not.toContain('Astro Basics');
		expect(html).not.toContain('docs.astro.build');
	});

	it('fait respecter le chemin de base aux liens et ressources', () => {
		for (const page of ['index.html', 'tarte-aux-pommes/index.html']) {
			const liens = liensInternes(lire(page));

			expect(liens).not.toHaveLength(0);
			for (const lien of liens) {
				expect(lien).toMatch(/^\/recettes\//);
			}
		}
	});

	it('génère les ressources aux emplacements annoncés par les liens', () => {
		for (const lien of liensInternes(lire('tarte-aux-pommes/index.html'))) {
			const chemin = lien.replace(/^\/recettes\//, '').replace(/[?#].*$/, '');
			const cible = chemin === '' || chemin.endsWith('/') ? join(chemin, 'index.html') : chemin;

			expect(existsSync(join(sortie, cible)), lien).toBe(true);
		}
	});
});

describe('Brouillons', { timeout: 120_000 }, () => {
	const fichiers = (sortie: string) =>
		readdirSync(sortie, { recursive: true, withFileTypes: true })
			.filter((entree) => entree.isFile())
			.map((entree) => join(entree.parentPath, entree.name));

	it("ne publie aucune trace d'un Brouillon, sans toucher aux autres Recettes", async () => {
		const sortie = await construireSite('recettes-publiees');
		try {
			expect(existsSync(join(sortie, 'brouillon-secret'))).toBe(false);
			expect(existsSync(join(sortie, 'tarte-aux-pommes/index.html'))).toBe(true);
			for (const fichier of fichiers(sortie)) {
				expect(readFileSync(fichier, 'utf-8'), fichier).not.toContain('Brouillon secret');
				expect(readFileSync(fichier, 'utf-8'), fichier).not.toContain('Étape encore confidentielle');
			}
		} finally {
			rmSync(sortie, { recursive: true, force: true });
		}
	});

	it('réussit le build lorsque toutes les Recettes sont des Brouillons', async () => {
		const sortie = await construireSite('recettes-brouillons');
		try {
			expect(existsSync(join(sortie, 'index.html'))).toBe(true);
			expect(existsSync(join(sortie, 'brouillon-secret'))).toBe(false);
		} finally {
			rmSync(sortie, { recursive: true, force: true });
		}
	});
});

describe('page de Recette', () => {
	let sortie: string;
	const texte = (page: string) =>
		readFileSync(join(sortie, page, 'index.html'), 'utf-8')
			.replace(/<[^>]+>/g, ' ')
			.replace(/\s+/g, ' ');

	beforeAll(async () => {
		sortie = await construireSite('recettes-publiees');
	}, 120_000);

	afterAll(() => rmSync(sortie, { recursive: true, force: true }));

	it('affiche toutes les informations de la Recette', () => {
		const page = texte('tarte-aux-pommes');

		for (const attendu of ['Tarte aux pommes', 'Une tarte simple et dorée.', 'Dessert', 'Étaler la pâte.']) {
			expect(page).toContain(attendu);
		}
		expect(page).toMatch(/Portions\s*:? 6/);
	});

	it('affiche tous les Tags de la Recette', () => {
		const page = texte('tarte-aux-pommes');

		expect(page).toContain('rapide');
		expect(page).toContain('végétarien');
	});

	it('calcule le temps total et omet un temps de repos absent', () => {
		const page = texte('tarte-aux-pommes');

		expect(page).toMatch(/Préparation\s*:? 20 min/);
		expect(page).toMatch(/Cuisson\s*:? 35 min/);
		expect(page).toMatch(/Total\s*:? 55 min/);
		expect(page).not.toContain('Repos');
	});

	it('compte le temps de repos dans le temps total', () => {
		const page = texte('quiche-en-groupes');

		expect(page).toMatch(/Repos\s*:? 10 min/);
		expect(page).toMatch(/Total\s*:? 55 min/);
	});

	it('affiche une liste plate avec ou sans quantité et unité', () => {
		const page = texte('tarte-aux-pommes');

		expect(page).toContain('4 pommes');
		expect(page).toContain('250 g farine');
		expect(page).toContain('sel, poivre');
	});

	it('affiche les Groupes, un même Ingrédient pouvant figurer dans plusieurs', () => {
		const page = texte('quiche-en-groupes');

		expect(page).toContain('Pour la pâte');
		expect(page).toContain('Pour la garniture');
		expect(page).toContain('100 g beurre');
		expect(page).toContain('½ c. à soupe beurre');
		expect(page).toContain('huile pour la poêle');
	});
});

describe('Recette invalide', { timeout: 120_000 }, () => {
	const valide = {
		titre: 'Test',
		description: 'Une Recette de test.',
		categorie: 'Plat',
		tags: ['rapide'],
		portions: 2,
		tempsPreparation: 0,
		tempsCuisson: 0,
		ingredients: [{ nom: 'eau' }],
	};

	async function erreurDeBuild(frontmatter: object) {
		const dossier = mkdtempSync(join(racine, 'tests/fixtures/.tmp-'));
		writeFileSync(join(dossier, 'test.mdx'), `---\n${JSON.stringify(frontmatter)}\n---\n\n1. Étape.\n`);
		try {
			const sortie = await construireSite(basename(dossier));
			rmSync(sortie, { recursive: true, force: true });
			return null;
		} catch (erreur) {
			const { stdout, stderr } = erreur as { stdout: string; stderr: string };
			return stdout + stderr;
		} finally {
			rmSync(dossier, { recursive: true, force: true });
		}
	}

	it('laisse passer une Recette valide, temps à 0 compris', async () => {
		expect(await erreurDeBuild(valide)).toBeNull();
	});

	it.each(['titre', 'description', 'categorie', 'tags', 'portions', 'tempsPreparation', 'tempsCuisson', 'ingredients'])(
		'fait échouer le build si %s manque',
		async (champ) => {
			expect(await erreurDeBuild({ ...valide, [champ]: undefined })).toContain(champ);
		},
	);

	it('nomme le Tag inconnu et la Recette concernée', async () => {
		const erreur = await erreurDeBuild({ ...valide, tags: ['rapide', 'rapidee'] });

		expect(erreur).toContain('rapidee');
		expect(erreur).toContain('test.mdx');
	});

	it('détecte un Tag retiré du Référentiel même si la Recette est inchangée', async () => {
		const sortie = await construireSite('recettes-publiees');
		rmSync(sortie, { recursive: true, force: true });

		await expect(construireSite('recettes-publiees', 'tags-sans-rapide.md')).rejects.toThrow();
	});

	it.each([
		['une Catégorie inconnue', { categorie: 'Goûter' }, 'categorie'],
		['des Portions nulles', { portions: 0 }, 'portions'],
		['des Portions non entières', { portions: 1.5 }, 'portions'],
		['un temps négatif', { tempsCuisson: -5 }, 'tempsCuisson'],
		['une unité inconnue', { ingredients: [{ nom: 'farine', quantite: 100, unite: 'gr' }] }, 'unite'],
		['une unité sans quantité', { ingredients: [{ nom: 'farine', unite: 'g' }] }, 'unite'],
		['un Ingrédient sans nom', { ingredients: [{ quantite: 100 }] }, 'nom'],
		['un Brouillon non booléen', { brouillon: 'oui' }, 'brouillon'],
		['une photo introuvable', { photo: './absente.jpg' }, 'absente.jpg'],
		['un Groupe invalide', { ingredients: [{ groupe: 'Pâte', ingredients: [{ nom: 'a', quantite: 1, unite: 'gr' }] }] }, 'unite'],
	])('fait échouer le build pour %s', async (_cas, champs, message) => {
		expect(await erreurDeBuild({ ...valide, ...champs })).toContain(message);
	});
});

describe('accueil', { timeout: 120_000 }, () => {
	const accueil = (sortie: string) => readFileSync(join(sortie, 'index.html'), 'utf-8');
	const texte = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

	describe('avec des Recettes publiées', () => {
		let sortie: string;

		beforeAll(async () => {
			sortie = await construireSite('recettes-publiees');
		}, 120_000);

		afterAll(() => rmSync(sortie, { recursive: true, force: true }));

		it('présente chaque Recette avec ses informations', () => {
			const page = texte(accueil(sortie));

			for (const attendu of ['Tarte aux pommes', 'Une tarte simple et dorée.', 'Dessert', 'rapide', 'végétarien']) {
				expect(page).toContain(attendu);
			}
			expect(page).toMatch(/Total\s*:? 55 min/);
		});

		it('mène à la page de chaque Recette', () => {
			const liens = liensInternes(accueil(sortie));

			expect(liens).toContain('/recettes/tarte-aux-pommes/');
			expect(liens).toContain('/recettes/quiche-en-groupes/');
			expect(liens).toContain('/recettes/un-eclair-au-cafe/');
		});

		it("trie par ordre alphabétique français, accents compris", () => {
			const page = texte(accueil(sortie));
			const positions = ['Éclair au café', 'Quiche en groupes', 'Tarte aux pommes'].map((titre) => page.indexOf(titre));

			expect(positions).not.toContain(-1);
			expect(positions).toEqual([...positions].sort((a, b) => a - b));
		});

		it('omet les Brouillons et le message de liste vide', () => {
			const page = accueil(sortie);

			expect(page).not.toContain('Brouillon secret');
			expect(page).not.toContain('Aucune recette pour l');
		});
	});

	it("affiche « Aucune recette pour l'instant » si rien n'est publié", async () => {
		const sortie = await construireSite('recettes-brouillons');
		try {
			expect(accueil(sortie).replace('&#39;', "'")).toContain("Aucune recette pour l'instant");
		} finally {
			rmSync(sortie, { recursive: true, force: true });
		}
	});
});

describe('Catégories', { timeout: 120_000 }, () => {
	const menu = (html: string) => liensInternes(html.match(/<nav\b.*?<\/nav>/s)?.[0] ?? '');

	describe('avec des Recettes publiées', () => {
		let sortie: string;
		const lire = (chemin: string) => readFileSync(join(sortie, chemin), 'utf-8');

		beforeAll(async () => {
			sortie = await construireSite('recettes-publiees');
		}, 120_000);

		afterAll(() => rmSync(sortie, { recursive: true, force: true }));

		it('crée une page par Catégorie publiée, avec une URL sans accents', () => {
			expect(readdirSync(join(sortie, 'categorie')).sort()).toEqual(['dessert', 'petit-dejeuner', 'plat']);
			expect(lire('categorie/petit-dejeuner/index.html')).toContain('<h1>Petit-déjeuner</h1>');
		});

		it('liste les Recettes de la Catégorie, et elles seules, par ordre alphabétique français', () => {
			const recettes = liensInternes(lire('categorie/dessert/index.html').match(/<main\b.*?<\/main>/s)?.[0] ?? '').filter(
				(lien) => !lien.includes('_astro') && lien !== '/recettes/',
			);

			expect(recettes).toEqual(['/recettes/un-eclair-au-cafe/', '/recettes/tarte-aux-pommes/']);
		});

		it.each(['index.html', 'tarte-aux-pommes/index.html', 'categorie/dessert/index.html'])(
			'propose dans le menu de %s les seules Catégories publiées',
			(page) => {
				expect(menu(lire(page))).toEqual([
					'/recettes/categorie/plat/',
					'/recettes/categorie/dessert/',
					'/recettes/categorie/petit-dejeuner/',
				]);
			},
		);

		it("n'offre ni page ni entrée de menu à une Catégorie qui n'a que des Brouillons", () => {
			expect(existsSync(join(sortie, 'categorie/sauce'))).toBe(false);
			expect(lire('index.html')).not.toContain('Sauce');
		});

		it("n'affiche pas un Brouillon sur la page de sa Catégorie", () => {
			const page = lire('categorie/plat/index.html');

			expect(page).toContain('Quiche en groupes');
			expect(page).not.toContain('Brouillon secret');
		});
	});

	it("n'a ni page ni menu si rien n'est publié", async () => {
		const sortie = await construireSite('recettes-brouillons');
		try {
			expect(existsSync(join(sortie, 'categorie'))).toBe(false);
			expect(readFileSync(join(sortie, 'index.html'), 'utf-8')).not.toContain('<nav');
		} finally {
			rmSync(sortie, { recursive: true, force: true });
		}
	});
});

describe('recherche', { timeout: 120_000 }, () => {
	it("publie l'index Pagefind sous le chemin de base, réglé pour le français", async () => {
		const sortie = await construireSite('recettes-publiees');
		try {
			const entree = JSON.parse(readFileSync(join(sortie, 'pagefind/pagefind-entry.json'), 'utf-8'));

			expect(Object.keys(entree.languages)).toEqual(['fr']);
			expect(existsSync(join(sortie, 'pagefind/pagefind.js'))).toBe(true);
		} finally {
			rmSync(sortie, { recursive: true, force: true });
		}
	});

	it("réussit le build sans proposer de champ de recherche si rien n'est publié", async () => {
		const sortie = await construireSite('recettes-brouillons');
		try {
			expect(readFileSync(join(sortie, 'index.html'), 'utf-8')).not.toContain('type="search"');
		} finally {
			rmSync(sortie, { recursive: true, force: true });
		}
	});
});

describe('photo de couverture', { timeout: 120_000 }, () => {
	let sortie: string;
	const lire = (chemin: string) => readFileSync(join(sortie, chemin), 'utf-8');
	const images = (html: string) => [...html.matchAll(/<img\b[^>]*>/g)].map(([balise]) => balise);
	const sources = (balise: string) => [
		...balise.matchAll(/\bsrc="([^"]+)"/g),
		...[...balise.matchAll(/\bsrcset="([^"]+)"/g)].flatMap(([, liste]) =>
			liste.split(',').map((source) => [source, source.trim().split(' ')[0]] as RegExpMatchArray),
		),
	].map(([, source]) => source);

	beforeAll(async () => {
		sortie = await construireSite('recettes-publiees');
	}, 120_000);

	afterAll(() => rmSync(sortie, { recursive: true, force: true }));

	it.each([
		['la page de la Recette', 'tarte-aux-pommes/index.html'],
		["la liste de l'accueil", 'index.html'],
	])('apparaît optimisée sous le chemin de base sur %s', (_lieu, page) => {
		const [balise, ...autres] = images(lire(page));

		expect(autres).toHaveLength(0);
		expect(balise).toContain('alt="Tarte aux pommes"');
		for (const source of sources(balise)) {
			expect(source).toMatch(/^\/recettes\/_astro\/.+\.webp/);
			expect(existsSync(join(sortie, source.replace(/^\/recettes\//, '').replace(/\?.*$/, ''))), source).toBe(true);
		}
	});

	it("ne publie pas l'image d'origine, seulement ses versions optimisées", () => {
		const originaux = readdirSync(sortie, { recursive: true, encoding: 'utf-8' }).filter((nom) => nom.endsWith('.jpg'));

		expect(originaux).toEqual([]);
	});

	it("ne publie pas la photo d'un Brouillon", () => {
		const fuites = readdirSync(sortie, { recursive: true, encoding: 'utf-8' }).filter((nom) => nom.includes('brouillon-secret'));

		expect(fuites).toEqual([]);
	});

	it('ne laisse aucune image sur une Recette sans photo', () => {
		expect(images(lire('quiche-en-groupes/index.html'))).toEqual([]);
	});
});
