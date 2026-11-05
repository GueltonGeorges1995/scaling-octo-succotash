import { useEffect, useState, type ReactNode } from 'react';
import { calculerQuantites } from './portions';
import type { Ingredient } from './schema';

interface Props {
	portions: number;
	groupes: { groupe?: string; ingredients: Ingredient[] }[];
	/** Les temps de la Recette, regroupés avec le sélecteur de Portions dans le bandeau « En bref ». */
	children?: ReactNode;
}

const classesBouton = 'size-12 rounded-full text-2xl leading-none print:hidden';

export default function IngredientsAjustables({ portions, groupes, children }: Props) {
	const [voulues, setVoulues] = useState(portions);
	// Sans JavaScript, les boutons restent désactivés : ils ne promettent rien qu'ils ne puissent tenir.
	const [interactif, setInteractif] = useState(false);
	useEffect(() => setInteractif(true), []);

	return (
		<>
			<section
				aria-label="En bref"
				className="my-6 rounded-xl border border-separateur bg-encart p-4 text-discret"
				data-pagefind-ignore
			>
				{children}
				<p className="selecteur-portions mt-4 mb-0 flex flex-wrap items-center gap-3 font-semibold border-t border-separateur pt-4 text-texte">
					<span className="me-auto">
						Portions : <output className="text-2xl">{voulues}</output>
					</span>{' '}
					<button
						type="button"
						className={classesBouton}
						aria-label="Retirer une Portion"
						disabled={!interactif || voulues <= 1}
						onClick={() => setVoulues(voulues - 1)}
					>
						−
					</button>{' '}
					<button
						type="button"
						className={classesBouton}
						aria-label="Ajouter une Portion"
						disabled={!interactif}
						onClick={() => setVoulues(voulues + 1)}
					>
						+
					</button>
				</p>
			</section>
			<h2 data-pagefind-ignore>Ingrédients</h2>
			{groupes.map(({ groupe, ingredients }, index) => (
				<div key={index}>
					{groupe && <h3>{groupe}</h3>}
					<ul className="m-0 list-none p-0">
						{calculerQuantites(ingredients, portions, voulues).map(({ nom, quantite, unite }, rang) => {
							const mesure = [quantite, unite].filter(Boolean).join(' ');
							return (
								<li key={rang} className="grid grid-cols-[6rem_1fr] gap-3 border-b border-separateur py-2">
									{mesure && (
										<>
											<span className="font-semibold">{mesure}</span>{' '}
										</>
									)}
									<span className="col-start-2">{nom}</span>
								</li>
							);
						})}
					</ul>
				</div>
			))}
		</>
	);
}
