import { useEffect, useRef, useState } from 'react';

interface Pagefind {
	options(options: { baseUrl: string; excerptLength: number }): Promise<void>;
	debouncedSearch(texte: string): Promise<{ results: { data(): Promise<{ url: string; excerpt: string }> }[] } | null>;
}

interface Props {
	categories: string[];
	tags: string[];
}

interface Filtres {
	texte: string;
	categorie: string;
	tags: string[];
}

const BASE = import.meta.env.BASE_URL;

const normaliser = (mot: string) =>
	mot
		.normalize('NFD')
		.replace(/[^\p{L}\p{N}]/gu, '')
		.toLowerCase();

/**
 * Pagefind rapproche un mot absent des mots indexés qui le commencent, même réduits à leur racine :
 * « courgette » trouve « c. », « levure » trouve « les ». On exige donc que le mot surligné partage
 * l'essentiel du début du mot cherché, ce qui garde les vrais pluriels : « pâtes » trouve « pâte ».
 */
function correspondVraiment(texte: string, extrait: string) {
	const surlignes = [...extrait.matchAll(/<mark>(.*?)<\/mark>/g)].map(([, mot]) => normaliser(mot));
	const debutCommun = (a: string, b: string) => [...a].findIndex((lettre, rang) => lettre !== b[rang]);
	return texte
		.split(/\s+/)
		.map(normaliser)
		.filter(Boolean)
		.every((mot) =>
			surlignes.some((surligne) => {
				const commun = debutCommun(mot, surligne);
				return commun === -1 || commun >= mot.length * 0.7;
			}),
		);
}

/** Lit les filtres de l'URL, en ignorant ceux qui n'existent pas sur le site. */
function lireUrl(categories: string[], tags: string[]): Filtres {
	const parametres = new URLSearchParams(location.search);
	const categorie = parametres.get('categorie') ?? '';
	return {
		texte: parametres.get('q') ?? '',
		categorie: categories.includes(categorie) ? categorie : '',
		tags: tags.filter((tag) => parametres.getAll('tag').includes(tag)),
	};
}

function ecrireUrl({ texte, categorie, tags }: Filtres) {
	const parametres = new URLSearchParams();
	if (texte !== '') parametres.set('q', texte);
	if (categorie !== '') parametres.set('categorie', categorie);
	for (const tag of tags) parametres.append('tag', tag);
	const recherche = parametres.toString();
	history.replaceState(null, '', recherche === '' ? location.pathname : `${location.pathname}?${recherche}`);
}

/** Masque les Recettes de la liste, déjà présente dans le HTML, et renvoie le nombre de celles qui restent. */
function afficherRecettes({ categorie, tags }: Filtres, urls: Set<string> | null) {
	let visibles = 0;
	for (const recette of document.querySelectorAll<HTMLElement>('[data-recette]')) {
		const sesTags: string[] = JSON.parse(recette.dataset.tags!);
		recette.hidden =
			(urls !== null && !urls.has(recette.dataset.recette!)) ||
			(categorie !== '' && recette.dataset.categorie !== categorie) ||
			!tags.every((tag) => sesTags.includes(tag));
		if (!recette.hidden) visibles++;
	}
	return visibles;
}

export default function RechercheRecettes({ categories, tags }: Props) {
	const pagefind = useRef<Pagefind | null>(null);
	const [etat, setEtat] = useState<'chargement' | 'pret' | 'indisponible'>('chargement');
	// Sans JavaScript, les contrôles restent désactivés : ils ne promettent rien qu'ils ne puissent tenir.
	const [interactif, setInteractif] = useState(false);
	const [filtres, setFiltres] = useState<Filtres>({ texte: '', categorie: '', tags: [] });
	const [urlsTrouvees, setUrlsTrouvees] = useState<Set<string> | null>(null);
	const [aucunResultat, setAucunResultat] = useState(false);

	useEffect(() => {
		setFiltres(lireUrl(categories, tags));
		setInteractif(true);

		// L'index n'existe qu'après un build : sous `astro dev`, le champ reste inactif.
		if (import.meta.env.DEV) return setEtat('indisponible');

		import(/* @vite-ignore */ `${BASE}pagefind/pagefind.js`)
			.then(async (module: Pagefind) => {
				// Un extrait assez long pour contenir tous les mots surlignés d'une Recette.
				await module.options({ baseUrl: BASE, excerptLength: 2000 });
				pagefind.current = module;
				setEtat('pret');
			})
			.catch(() => setEtat('indisponible'));
	}, []);

	useEffect(() => {
		const texte = filtres.texte;
		if (etat !== 'pret' || texte.trim() === '') return setUrlsTrouvees(null);

		let perimee = false;
		(async () => {
			const recherche = await pagefind.current!.debouncedSearch(texte);
			if (recherche === null) return;

			const resultats = await Promise.all(recherche.results.map((resultat) => resultat.data()));
			if (perimee) return;
			setUrlsTrouvees(new Set(resultats.filter(({ excerpt }) => correspondVraiment(texte, excerpt)).map(({ url }) => url)));
		})();
		return () => {
			perimee = true;
		};
	}, [filtres.texte, etat]);

	useEffect(() => {
		if (!interactif) return;
		ecrireUrl(filtres);
		setAucunResultat(afficherRecettes(filtres, urlsTrouvees) === 0);
	}, [interactif, filtres, urlsTrouvees]);

	function basculerTag(tag: string) {
		const choisis = filtres.tags.includes(tag) ? filtres.tags.filter((autre) => autre !== tag) : [...filtres.tags, tag];
		setFiltres({ ...filtres, tags: choisis });
	}

	return (
		<div className="recherche">
			<input
				type="search"
				aria-label="Rechercher une recette"
				placeholder="Rechercher une recette"
				disabled={etat !== 'pret'}
				value={filtres.texte}
				onChange={(evenement) => setFiltres({ ...filtres, texte: evenement.target.value })}
			/>
			<select
				aria-label="Catégorie"
				disabled={!interactif}
				value={filtres.categorie}
				onChange={(evenement) => setFiltres({ ...filtres, categorie: evenement.target.value })}
			>
				<option value="">Toutes les catégories</option>
				{categories.map((categorie) => (
					<option key={categorie}>{categorie}</option>
				))}
			</select>
			{tags.length > 0 && (
				<fieldset>
					<legend>Tags</legend>
					{tags.map((tag) => (
						<label key={tag}>
							<input
								type="checkbox"
								disabled={!interactif}
								checked={filtres.tags.includes(tag)}
								onChange={() => basculerTag(tag)}
							/>{' '}
							{tag}
						</label>
					))}
				</fieldset>
			)}
			{etat === 'indisponible' && (
				<p>
					{import.meta.env.DEV
						? "La recherche n'est disponible qu'après un build : lancez `npm run build` puis `npm run preview`."
						: 'La recherche est indisponible pour le moment, mais toutes les recettes restent listées ci-dessous.'}
				</p>
			)}
			{aucunResultat && <p role="status">Aucune recette ne correspond à cette recherche.</p>}
		</div>
	);
}
