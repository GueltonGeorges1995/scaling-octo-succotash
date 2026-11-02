import { useEffect, useState } from 'react';
import { calculerQuantites } from './portions';
import type { Ingredient } from './schema';

interface Props {
	portions: number;
	groupes: { groupe?: string; ingredients: Ingredient[] }[];
}

export default function IngredientsAjustables({ portions, groupes }: Props) {
	const [voulues, setVoulues] = useState(portions);
	// Sans JavaScript, les boutons restent désactivés : ils ne promettent rien qu'ils ne puissent tenir.
	const [interactif, setInteractif] = useState(false);
	useEffect(() => setInteractif(true), []);

	return (
		<>
			<p className="selecteur-portions" data-pagefind-ignore>
				Portions : <output>{voulues}</output>{' '}
				<button
					type="button"
					aria-label="Retirer une Portion"
					disabled={!interactif || voulues <= 1}
					onClick={() => setVoulues(voulues - 1)}
				>
					−
				</button>{' '}
				<button
					type="button"
					aria-label="Ajouter une Portion"
					disabled={!interactif}
					onClick={() => setVoulues(voulues + 1)}
				>
					+
				</button>
			</p>
			<h2 data-pagefind-ignore>Ingrédients</h2>
			{groupes.map(({ groupe, ingredients }, index) => (
				<div key={index}>
					{groupe && <h3>{groupe}</h3>}
					<ul>
						{calculerQuantites(ingredients, portions, voulues).map(({ nom, quantite, unite }, rang) => (
							<li key={rang}>{[quantite, unite, nom].filter(Boolean).join(' ')}</li>
						))}
					</ul>
				</div>
			))}
		</>
	);
}
