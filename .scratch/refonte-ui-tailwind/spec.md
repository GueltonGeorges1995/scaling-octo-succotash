Status: ready-for-agent

# Refonte de l'interface du site avec Tailwind

## Problem Statement

Le site fonctionne bien, mais il ressemble à une page de texte brut. Le visiteur qui cuisine, téléphone posé sur le plan de travail, doit chercher les Ingrédients et les Étapes dans une seule longue colonne. La Catégorie, les Tags et les temps d'une Recette sont de simples lignes grises, sans hiérarchie. Le site n'a ni nom ni en-tête : on n'y voit qu'une liste de Catégories, et rien ne ramène à l'accueil depuis une page de Catégorie. Les filtres de l'accueil (champ de recherche, liste déroulante, cases à cocher) sont empilés sans organisation.

L'auteur veut aussi un style plus facile à faire évoluer : tout le style tient aujourd'hui dans une feuille CSS globale, et il souhaite passer à Tailwind.

## Solution

Une refonte purement visuelle du site entier, dans une direction « carnet de recettes chaleureux » :

- Un en-tête commun porte le nom du site, « Recettes », qui ramène à l'accueil, puis le menu des Catégories.
- La page d'une Recette est pensée d'abord pour la cuisine. Les informations utiles d'un coup d'œil (Catégorie, temps, Portions) sont regroupées, et les Ingrédients et les Étapes sont faciles à suivre. Sa mise en page exacte est choisie parmi trois variantes, après les avoir comparées dans un prototype.
- L'accueil et la page d'une Catégorie suivent la mise en page retenue : une liste de Recettes plus lisible, et des filtres organisés.
- On garde la palette actuelle, crème et terracotta, en clair comme en sombre. Les titres prennent une police à empattements, et le texte courant reste en police système.
- Le style passe entièrement à Tailwind.

Aucun comportement ne change : recherche, filtres, Portions ajustables, impression, Brouillons. La seule nouveauté est de navigation : le nom du site mène à l'accueil, et la Catégorie d'une Recette mène à sa page.

## User Stories

1. En tant que visiteur, je veux voir le nom du site en haut de chaque page, afin de savoir où je suis.
2. En tant que visiteur, je veux que le nom du site me ramène à l'accueil depuis n'importe quelle page, afin de ne jamais rester coincé sur une page de Catégorie.
3. En tant que visiteur, je veux retrouver le menu des Catégories dans l'en-tête, afin de parcourir le site par type de plat.
4. En tant que visiteur sur téléphone, je veux que l'en-tête et le menu des Catégories tiennent dans la largeur de l'écran, afin de ne jamais défiler horizontalement.
5. En tant que cuisinier, je veux voir la Catégorie, les temps et les Portions d'une Recette regroupés près du titre, afin de juger d'un coup d'œil si je peux la faire maintenant.
6. En tant que cuisinier, je veux voir le Temps de préparation, le Temps de cuisson, le Temps de repos (s'il existe) et le Temps total clairement distingués, afin de planifier mon repas.
7. En tant que cuisinier, je veux que le sélecteur de Portions soit bien visible et facile à toucher, afin d'ajuster les quantités avec des doigts pleins de farine.
8. En tant que cuisinier, je veux que les Ingrédients soient faciles à parcourir, Groupes d'ingrédients compris, afin de tout sortir avant de commencer.
9. En tant que cuisinier, je veux que chaque Étape soit nettement séparée et numérotée, afin de retrouver où j'en suis après avoir quitté l'écran des yeux.
10. En tant que cuisinier, je veux lire les Ingrédients et les Étapes à distance, sur un téléphone posé sur le plan de travail, afin de ne pas avoir à le reprendre en main.
11. En tant que cuisinier sur grand écran, je veux une mise en page qui profite de la largeur, afin de voir les Ingrédients et les Étapes sans trop défiler.
12. En tant que visiteur, je veux que la Catégorie d'une Recette soit un lien vers la page de cette Catégorie, afin de découvrir des Recettes du même type.
13. En tant que visiteur, je veux que les Tags d'une Recette ressemblent à des étiquettes cliquables, afin de comprendre qu'ils mènent aux Recettes qui les partagent.
14. En tant que visiteur, je veux que la description d'une Recette apparaisse comme un chapeau sous le titre, afin de savoir tout de suite de quel plat il s'agit.
15. En tant que visiteur, je veux que la photo d'une Recette, quand elle existe, mette en valeur la page sans la déséquilibrer, afin de donner envie.
16. En tant que visiteur, je veux qu'une Recette sans photo ait une mise en page tout aussi soignée, sans image de remplacement, afin que l'absence de photo ne paraisse pas être un oubli.
17. En tant que visiteur de l'accueil, je veux une liste de Recettes où chaque Recette montre son titre, sa description, sa Catégorie, ses Tags et son Temps total, afin de choisir rapidement.
18. En tant que visiteur de l'accueil, je veux que le champ de recherche soit mis en avant, afin de trouver une Recette par son nom ou un Ingrédient.
19. En tant que visiteur de l'accueil, je veux que les filtres par Catégorie et par Tag soient regroupés et lisibles, afin de les combiner sans effort.
20. En tant que visiteur de l'accueil, je veux voir quels Tags sont actifs en un coup d'œil, afin de comprendre pourquoi certaines Recettes sont masquées.
21. En tant que visiteur de l'accueil, je veux que le message « aucune recette ne correspond » et le message de recherche indisponible restent bien visibles, afin de ne pas croire que le site est vide.
22. En tant que visiteur d'une page de Catégorie, je veux la même présentation de liste que sur l'accueil, afin de m'y retrouver.
23. En tant que visiteur, je veux que le site suive le thème clair ou sombre de mon appareil, comme aujourd'hui, afin de cuisiner le soir sans être ébloui.
24. En tant que visiteur, je veux que tout texte garde un contraste d'au moins 4,5 en clair comme en sombre, afin de lire confortablement.
25. En tant que visiteur au clavier, je veux un contour de focus bien visible sur chaque lien et chaque contrôle, afin de naviguer sans souris.
26. En tant que visiteur sur un écran de 320px, je veux qu'aucune page ne défile horizontalement, afin de lire sans effort.
27. En tant que visiteur, je veux que les titres aient une police à empattements chaleureuse, afin que le site ait l'identité d'un carnet de recettes.
28. En tant que visiteur, je veux que le texte s'affiche immédiatement, même avant le chargement de la police des titres, afin de ne pas attendre pour lire.
29. En tant que visiteur, je veux que le site ne charge aucune police depuis un autre domaine, afin de préserver ma vie privée et la rapidité du site.
30. En tant que cuisinier qui imprime une Recette, je veux qu'elle reste en noir sur blanc, sans menu ni boutons, avec les quantités ajustées, afin d'avoir une fiche propre.
31. En tant que visiteur sans JavaScript, je veux voir toutes les Recettes, avec des contrôles désactivés plutôt que trompeurs, comme aujourd'hui.
32. En tant qu'auteur, je veux que mes Recettes existantes s'affichent dans la nouvelle présentation sans rien modifier dans leurs fichiers, afin que la refonte ne me coûte aucune réécriture.
33. En tant qu'auteur, je veux que les Étapes écrites en liste numérotée dans le MDX prennent automatiquement le style des Étapes, afin de continuer à écrire comme avant.
34. En tant qu'auteur, je veux pouvoir changer le nom du site en un seul endroit, afin de le renommer plus tard sans chercher partout.
35. En tant que mainteneur, je veux que les couleurs du site soient définies une seule fois, en clair et en sombre, afin de les ajuster sans toucher aux composants.
36. En tant que mainteneur, je veux que tous les tests navigateur existants passent sans modification, afin d'avoir la preuve que la refonte n'a changé aucun comportement.

## Implementation Decisions

- **Choix de la mise en page par prototype.** Avant tout changement définitif, un prototype jetable compare trois variantes de la page d'une Recette. Elles partagent la palette et les polices, et ne diffèrent que par la mise en page :
  1. **Une colonne améliorée** : la Catégorie en surtitre, la description en chapeau, un bandeau d'informations (temps et Portions), les Tags en pastilles, puis les Ingrédients et les Étapes l'un sous l'autre.
  2. **Deux colonnes** : sur grand écran, les Ingrédients restent fixes à gauche pendant que les Étapes défilent à droite. Sur téléphone, on retombe sur une colonne.
  3. **Fiche de cuisine** : les Ingrédients dans un encadré façon fiche, les Étapes avec de gros numéros.

  Le prototype vit sur une branche à part. Seule la variante retenue est reportée dans le vrai code, et le verdict est noté dans le ticket concerné. L'accueil et la page d'une Catégorie suivent ensuite cette variante.
- **Tailwind v4, en migration complète.** Tailwind est intégré par son plugin Vite officiel. Les composants Astro et React portent leurs styles en classes utilitaires.
- **Tokens de couleur.** Les couleurs actuelles (fond, texte, discret, accent, séparateur, contrôle) deviennent des tokens de thème Tailwind, avec leurs valeurs claires et sombres. Le passage au sombre suit `prefers-color-scheme`, sans bouton de bascule.
- **Couche de base restreinte.** La feuille globale ne garde que ce que les classes utilitaires ne peuvent pas atteindre :
  - la typographie du contenu MDX d'une Recette, en particulier la liste numérotée des Étapes ;
  - les règles d'impression ;
  - les styles de base des éléments de formulaire et du focus.
- **Classes sémantiques conservées.** Les classes `categorie`, `temps`, `tags` et `retour` restent sur leurs éléments, à côté des classes utilitaires, car les tests navigateur les ciblent.
- **Polices.** Une seule police de titres à empattements, en version variable, auto-hébergée via Fontsource (par exemple Fraunces ou Lora, à trancher dans le prototype), avec `font-display: swap`. Le texte courant reste en police système.
- **Nom du site.** « Recettes », défini à un seul endroit, affiché dans l'en-tête commun du layout et relié à l'accueil en respectant le chemin de base du site.
- **Nouveaux liens.** Sur la page d'une Recette, la Catégorie devient un lien vers la page de cette Catégorie, qui utilise le slug déjà calculé pour le menu. C'est le seul changement de comportement, avec le lien du nom du site.
- **Composants React.** La recherche et les Portions ajustables gardent leur logique, leurs libellés accessibles et leurs rôles ARIA. Seul leur balisage de présentation change.
- **Filtres par Tag.** Ils peuvent prendre l'apparence de pastilles à bascule, mais restent de vraies cases à cocher sous-jacentes, avec le même nom accessible.
- **Contenu et schéma inchangés.** Aucune modification du schéma d'une Recette, des fichiers MDX ou du Référentiel de tags.

## Testing Decisions

- **Un seul point de test : les tests Playwright sur le site généré** à partir des Recettes de test. C'est ce que voit le visiteur, donc le niveau le plus haut possible.
- **Un bon test vérifie un comportement observable** : un lien mène quelque part, un texte est lisible, une page tient dans la largeur, une requête ne part pas vers un autre domaine. On ne teste ni les classes Tailwind, ni l'apparence au pixel près, ni la structure du DOM. Il n'y a pas de capture d'écran comparée.
- **Non-régression** : les tests navigateur existants (présentation, Portions, recherche, filtres) doivent passer **sans modification**. Si l'un d'eux doit changer, c'est le signe d'un changement de comportement, à remonter à l'auteur au lieu de l'adapter en silence.
- **Nouveaux tests**, sur le modèle des tests de présentation existants :
  - le nom du site est présent sur chaque page (accueil, Recette, Catégorie) et mène à l'accueil ;
  - la Catégorie d'une Recette est un lien qui mène à la page de cette Catégorie ;
  - aucune requête de police ne part vers un autre domaine que celui du site ;
  - le contraste d'au moins 4,5 est étendu aux nouveaux éléments (nom du site, bandeau des temps et des Portions, pastilles de Tags, liens du menu), en clair et en sombre ;
  - l'absence de défilement horizontal à 320px reste vérifiée sur chaque page, y compris avec la mise en page retenue ;
  - à l'impression, l'en-tête commun est masqué, comme le menu aujourd'hui.
- **Tests de build** : les tests Vitest du site généré ne sont pas concernés et doivent continuer à passer.

## Out of Scope

- Les nouvelles fonctionnalités pratiques en cuisine : cocher les Ingrédients sortis, suivre l'Étape en cours, empêcher la mise en veille de l'écran. Elles feront l'objet de specs séparées.
- Un bouton de bascule entre thème clair et thème sombre.
- L'ajout de photos aux Recettes, ou d'images de remplacement par défaut.
- Toute modification du schéma d'une Recette, du contenu MDX ou du Référentiel de tags.
- Toute modification de la logique de recherche, de filtrage ou de calcul des Portions.
- Le choix d'un nom définitif pour le site : « Recettes » reste en place, et ce nom se change à un seul endroit.
- Les tests de régression visuelle par captures d'écran.

## Further Notes

- La direction visuelle et les décisions ci-dessus viennent d'une séance `/grill-with-docs` du 2026-11-05. Le terme **Étape** a été ajouté au glossaire à cette occasion.
- Le prototype de mise en page est la première étape. Le découpage en tickets doit le placer avant toute migration de page. L'installation de Tailwind et des tokens peut le précéder, puisqu'il en a besoin.
- La police exacte (Fraunces, Lora ou une autre) est à trancher dans le prototype, en même temps que la variante.
