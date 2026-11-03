Status: ready-for-agent

# Fiabilité des Brouillons et de la recherche

## Problem Statement

L'auteur compte sur une garantie simple : un Brouillon n'apparaît jamais sur le site publié, et il reste consultable en local sous `astro dev`. La revue du commit `bb3d8e7` a montré que cette garantie dépendait de la façon d'écrire l'en-tête, de la façon de lancer la commande et de l'ordre des étapes de publication. Une photo de Brouillon pouvait ainsi être publiée sans aucune erreur.

Le visiteur, lui, perdait sa recherche à la moindre panne réseau, et une saisie comme « d'eau » ne trouvait pas une Recette qui écrit « l'eau ».

## Solution

- Un fichier est reconnu comme Brouillon exactement quand Astro lit `brouillon: true` dans son en-tête, quelle que soit la forme de cet en-tête.
- Les Brouillons sont visibles sous `astro dev`, et seulement là, quelle que soit la place des options sur la ligne de commande.
- Les Recettes de test ne peuvent plus atteindre le dossier publié.
- Une panne de recherche est passagère : le visiteur garde son texte et la saisie suivante réessaie.
- Un article élidé n'est plus exigé d'une Recette.

## État d'avancement

Ces corrections sont faites dans l'arbre de travail, **non commitées**, et les suites existantes passent. Il ne faut pas les réécrire.

Reste à faire :

1. Ajouter les tests de bout en bout listés dans « Testing Decisions », car ces comportements n'ont été vérifiés qu'à la main : le Brouillon avec BOM et photo, le mode dev et la lecture depuis la racine du projet.
2. Commiter l'ensemble.

## User Stories

1. En tant qu'auteur, je veux qu'un Brouillon dont l'en-tête commence par un BOM reste hors du site, afin qu'un éditeur Windows ne puisse pas publier mon travail.
2. En tant qu'auteur, je veux qu'un Brouillon précédé d'une ligne vide reste hors du site, afin qu'une erreur de frappe ne le publie pas.
3. En tant qu'auteur, je veux que toute écriture valide de `brouillon: true` (clé entre guillemets, valeur à la ligne, en-tête JSON ou TOML) soit reconnue, afin de ne pas retenir une syntaxe particulière.
4. En tant qu'auteur, je veux que la photo de couverture d'un Brouillon ne soit jamais publiée, afin qu'aucune trace ne subsiste sur le site.
5. En tant qu'auteur, je veux que les images du contenu d'un Brouillon ne soient jamais publiées, pour la même raison.
6. En tant qu'auteur, je veux qu'une clé mal écrite comme `Brouillon: true` ne fasse pas d'un fichier un Brouillon, afin que le site en local et le site publié montrent les mêmes Recettes.
7. En tant qu'auteur, je veux qu'un en-tête invalide fasse échouer le build en nommant le fichier, afin de corriger l'erreur au lieu de perdre une Recette en silence.
8. En tant qu'auteur, je veux voir mes Brouillons sous `astro dev`, afin de les relire avant publication.
9. En tant qu'auteur, je veux les voir aussi quand une option précède `dev`, comme dans `astro --root . dev`, afin que la façon de lancer le serveur ne change pas le résultat.
10. En tant qu'auteur, je veux les voir aussi avec `astro dev --background`, afin de pouvoir utiliser le mode recommandé par le projet.
11. En tant qu'auteur, je veux que toute autre commande exclue les Brouillons, même si l'environnement se dit en développement, afin qu'une variable d'environnement ne puisse pas les publier.
12. En tant qu'auteur, je veux que les Recettes et le Référentiel de tags soient lus depuis la racine du projet, afin qu'un autre dossier courant ne puisse pas fausser la liste des Brouillons.
13. En tant qu'auteur, je veux que les tests navigateur construisent ailleurs que dans le dossier publié, afin qu'un changement d'ordre des étapes ne publie pas de Recettes de test.
14. En tant que visiteur, je veux garder mon texte dans le champ après une panne de recherche, afin de ne pas avoir à le ressaisir.
15. En tant que visiteur, je veux garder mon texte dans l'URL après une panne, afin qu'un rechargement restaure ma recherche.
16. En tant que visiteur, je veux que ma saisie suivante réessaie, afin de ne pas avoir à recharger la page.
17. En tant que visiteur, je veux voir toutes les Recettes et un message pendant une panne, afin de pouvoir continuer à parcourir le site.
18. En tant que visiteur, je veux que le message disparaisse quand la recherche refonctionne, afin de ne pas croire à tort qu'elle est encore en panne.
19. En tant que visiteur, je veux que le chargement impossible de l'index garde le comportement actuel (champ inactif, texte retiré des liens partagés), afin que le site ne promette pas une recherche qu'il ne peut pas tenir.
20. En tant que visiteur, je veux que « l'eau » et « d'eau » trouvent une Recette qui contient « eau » sous n'importe quelle élision, afin que l'article ne compte pas.
21. En tant que visiteur, je veux qu'une recherche sur « déjeuner » trouve la Catégorie « Petit-déjeuner », afin que le trait d'union ne gêne pas.
22. En tant que mainteneur, je veux une seule définition de l'écriture commune à l'index et aux requêtes, afin qu'elles ne puissent pas diverger.
23. En tant que mainteneur, je veux que le test du trait d'union attende un titre exact, afin qu'il détecte vraiment une régression.

## Implementation Decisions

Toutes ces décisions sont déjà appliquées dans l'arbre de travail.

- **Détection des Brouillons** : elle utilise le parser d'en-tête d'Astro, ajouté comme dépendance directe (`@astrojs/internal-helpers`). Ce paquet est interne à Astro, mais c'est le seul moyen de lire l'en-tête exactement comme lui. Une regex maison recréerait l'écart qui a causé la fuite.
- **En-tête invalide** : le fichier n'est pas traité comme un Brouillon et reste chargé, si bien que le build échoue en le nommant.
- **Contexte Astro** : une intégration transmet à `src/recettes`, par variables d'environnement écrites au hook de configuration, la commande et la racine du projet. Le hook les écrase à chaque lancement. Sans hook, la commande est absente et les Brouillons sont exclus : le défaut est sûr.
- **Écriture de l'index** : un module unique porte l'écriture commune à l'index et aux requêtes (ligature, apostrophes) ainsi que le retrait des élisions. La configuration d'Astro et le composant de recherche l'importent tous les deux.
- **Élisions** : seul un article d'une lettre suivi d'une apostrophe est retiré, de la requête et de la vérification des mots surlignés. Un mot isolé comme « l » ou « c. » reste cherché.
- **Panne de recherche** : l'état `indisponible` est réservé au chargement impossible de l'index. Une panne en cours de recherche passe par un état distinct, qui ne désactive pas le champ et ne touche pas à l'URL.
- **Réinitialisation de Pagefind** : Pagefind garde pour toujours une erreur survenue à son initialisation, qui a lieu à la première recherche. Après un échec, le composant détruit l'instance et la reconfigure, et la recherche suivante attend la fin de cette opération.
- **Sortie des tests navigateur** : ils construisent et servent un dossier distinct, ignoré par git et par la vérification de types. La publication n'impose plus d'ordre entre les étapes.

## Testing Decisions

Un bon test vérifie ce que voit l'auteur ou le visiteur : les fichiers du site généré, les réponses du serveur, la page dans le navigateur. Il ne dépend ni des variables d'environnement internes ni de l'état du composant.

Les interfaces de test existantes suffisent, et aucune nouvelle n'est nécessaire :

- **Site généré** (`construireSite`) : c'est l'interface principale pour les Brouillons. Les tests existants de la photo de couverture et de « aucune trace d'un Brouillon » servent de modèle.
- **Navigateur** (Playwright sur le site généré) : c'est l'interface de la recherche. Ces tests sont déjà écrits.
- **`estBrouillon`** : les formes d'en-tête y sont déjà couvertes par des tests unitaires.

Tests à ajouter :

- Un Brouillon avec BOM et photo, dans un dossier de Recettes temporaire comme ceux de `erreurDeBuild` : ni page ni image dans le site généré.
- Un serveur `astro dev` lancé avec une option avant `dev` : la page d'un Brouillon répond 200. Le test choisit son port et arrête son serveur à la fin, y compris en cas d'échec, car l'arrêt de `npx` ne tue pas le processus enfant.
- Un build lancé avec `RECETTES_DIR` et un dossier courant différent, si Astro le permet (voir « Further Notes ») ; sinon ce cas reste vérifié par lecture du code.

## Out of Scope

- Faire réussir `astro build --root mon-site` depuis le dossier parent : l'échec restant vient d'Astro.
- Changer le modèle de contenu ou le Référentiel de tags.
- Remplacer Pagefind.
- Traiter les élisions de plus d'une lettre, comme « qu' » ou « jusqu' ».

## Further Notes

- **Échec d'Astro avec `--root`** : notre code passe désormais cette étape, mais Astro écrit ensuite son prérendu dans `.astro/.prerender` du dossier courant et échoue avec `Cannot find package 'piccolore'`. Cet essai laisse un dossier `.astro` parasite dans le dossier courant.
- **Code 500 non expliqué** : un serveur `astro --root . dev` a renvoyé 500 une fois, alors qu'il avait survécu à l'arrêt de `npx` et qu'un dossier `.astro` avait été supprimé entre-temps. Relancé proprement, le même cas renvoie 200. La cause n'est pas confirmée ; le test du mode dev dira si le problème revient.
- **`astro --verbose dev`** n'est pas un cas à couvrir : cette commande n'a pas lancé de serveur lors des essais, et Astro semble lire `dev` comme la valeur de `--verbose`.
