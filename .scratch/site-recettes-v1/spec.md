Status: ready-for-agent

# Site de recettes v1

## Problem Statement

L'auteur veut publier ses recettes de cuisine sur un site public, gratuit et sans infrastructure à entretenir. Il veut les écrire lui-même dans des fichiers du dépôt, sans back-office ni base de données. Les visiteurs doivent pouvoir trouver une Recette à partir d'un nom, d'un Ingrédient, d'une Catégorie ou de Tags, puis la suivre en cuisine pour un nombre de personnes différent de celui prévu.

## Solution

Un site 100 % statique en français, construit avec Astro et React, hébergé sur GitHub Pages à l'adresse `gueltongeorges1995.github.io/recettes/`. Chaque fichier MDX du dépôt devient une page de Recette, sauf s'il s'agit d'un Brouillon. L'accueil liste les Recettes par ordre alphabétique et propose une recherche sur tout le contenu, combinable avec des filtres par Catégorie et par Tags. Sur une page de Recette, changer le nombre de Portions recalcule aussitôt les quantités. Chaque push sur `main` construit le site, et une Recette invalide fait échouer le build sans toucher à la version en ligne.

## User Stories

### Rédaction

1. En tant qu'auteur, je veux ajouter une Recette en créant un fichier MDX, afin de publier sans back-office.
2. En tant qu'auteur, je veux que chaque fichier devienne automatiquement une page, afin de n'avoir aucune configuration à toucher.
3. En tant qu'auteur, je veux que l'URL d'une Recette vienne du nom de son fichier, afin d'obtenir des adresses lisibles comme `/recettes/tarte-aux-pommes/`.
4. En tant qu'auteur, je veux renseigner titre, description, Catégorie, Tags, Portions, temps de préparation, temps de cuisson et Ingrédients, afin que toutes les Recettes soient complètes et homogènes.
5. En tant qu'auteur, je veux qu'un champ obligatoire manquant fasse échouer le build, afin de ne jamais publier une Recette incomplète.
6. En tant qu'auteur, je veux écrire les étapes en liste numérotée dans le corps du fichier, afin de rédiger librement.
7. En tant qu'auteur, je veux pouvoir utiliser des composants dans le corps de la Recette, afin d'enrichir une Recette si besoin.
8. En tant qu'auteur, je veux pouvoir indiquer un temps de repos, afin de décrire les Recettes qui en ont un sans l'imposer aux autres.
9. En tant qu'auteur, je veux pouvoir ajouter une photo de couverture rangée à côté du fichier, afin d'illustrer une Recette sans y être obligé.
10. En tant qu'auteur, je veux que les photos soient optimisées au build, afin que le site reste léger.

### Ingrédients

11. En tant qu'auteur, je veux décrire un Ingrédient par un nom, une quantité et une unité, afin que le site puisse recalculer les quantités.
12. En tant qu'auteur, je veux que quantité et unité soient facultatives, afin d'écrire « sel, poivre » ou « huile pour la poêle ».
13. En tant qu'auteur, je veux pouvoir omettre l'unité, afin de compter des pièces comme « 3 œufs ».
14. En tant qu'auteur, je veux qu'une unité inconnue fasse échouer le build, afin d'éviter d'avoir `g` et `gr` en parallèle.
15. En tant qu'auteur, je veux pouvoir organiser les Ingrédients en Groupes d'ingrédients facultatifs, afin de séparer « Pour la pâte » et « Pour la garniture ».
16. En tant qu'auteur, je veux pouvoir citer le même Ingrédient dans plusieurs groupes, afin de refléter la réalité de la Recette.

### Classement

17. En tant qu'auteur, je veux attribuer exactement une Catégorie à chaque Recette, afin d'obtenir une navigation stable.
18. En tant qu'auteur, je veux qu'une Catégorie inconnue fasse échouer le build, afin d'éviter les fautes de frappe.
19. En tant qu'auteur, je veux tenir un Référentiel de tags dans un fichier Markdown, afin d'avoir au même endroit tous les Tags autorisés.
20. En tant qu'auteur, je veux attribuer plusieurs Tags à une Recette, afin de la qualifier précisément.
21. En tant qu'auteur, je veux qu'un Tag absent du Référentiel fasse échouer le build avec un message clair, afin de corriger aussitôt une faute de frappe.
22. En tant qu'auteur, je veux une autocomplétion des Tags dans VS Code si elle est possible, afin d'écrire plus vite.

### Brouillons

23. En tant qu'auteur, je veux marquer une Recette comme Brouillon, afin de la committer sans la publier.
24. En tant qu'auteur, je veux voir mes Brouillons en local, afin de les relire avant publication.
25. En tant qu'auteur, je veux que les Brouillons soient absents de toutes les pages publiées et de la recherche, afin qu'aucun visiteur ne tombe dessus sur le site.

### Accueil et navigation

26. En tant que visiteur, je veux voir toutes les Recettes publiées sur l'accueil par ordre alphabétique, afin de trouver un plat rapidement.
27. En tant que visiteur, je veux voir le titre, la description, la Catégorie, les Tags et le temps total de chaque Recette dans la liste, afin de choisir sans ouvrir chaque page.
28. En tant que visiteur, je veux un menu des Catégories, afin de parcourir le site par type de plat.
29. En tant que visiteur, je veux une page statique pour chaque Catégorie, afin d'y accéder même sans JavaScript.
30. En tant que visiteur, je ne veux pas voir de Catégorie sans Recette publiée, afin de ne pas tomber sur une page vide.
31. En tant que visiteur, je veux voir le message « Aucune recette pour l'instant » si rien n'est publié, afin de comprendre que le site n'est pas cassé.

### Recherche et filtres

32. En tant que visiteur, je veux chercher un mot dans tout le contenu des Recettes, afin de trouver un gratin en tapant « courgette ».
33. En tant que visiteur, je veux filtrer par Tag, afin de restreindre la liste.
34. En tant que visiteur, je veux que plusieurs Tags sélectionnés ne gardent que les Recettes qui les ont tous, afin d'affiner le résultat.
35. En tant que visiteur, je veux combiner texte, Catégorie et Tags, afin de préciser ma recherche.
36. En tant que visiteur, je ne veux voir que les Tags présents sur au moins une Recette publiée, afin de ne pas utiliser un filtre sans résultat.
37. En tant que visiteur, je veux que la recherche et les filtres soient conservés dans l'URL, afin de partager ou de recharger une recherche.
38. En tant que visiteur, je veux cliquer sur un Tag dans une Recette, afin d'ouvrir l'accueil filtré sur ce Tag.
39. En tant que visiteur, je veux un message clair lorsqu'aucune Recette ne correspond, afin de savoir qu'il faut élargir ma recherche.

### Page de Recette

40. En tant que visiteur, je veux voir le temps de préparation, de cuisson, de repos éventuel et le temps total calculé, afin d'organiser ma cuisine.
41. En tant que visiteur, je veux changer le nombre de Portions, afin d'adapter la Recette au nombre de convives.
42. En tant que visiteur, je veux que les quantités se recalculent aussitôt, sans bouton à cliquer, afin de cuisiner sans friction.
43. En tant que visiteur, je veux des quantités arrondies de façon lisible, afin de lire 2 ¼ œufs ou 150 g plutôt que 2,25 œufs ou 153,7 g.
44. En tant que visiteur, je veux que les Ingrédients sans quantité restent inchangés, afin que « sel, poivre » reste correct pour tout nombre de Portions.
45. En tant que visiteur sans JavaScript, je veux voir la Recette et ses quantités d'origine, afin de pouvoir quand même la lire.

### Lecture en cuisine

46. En tant que visiteur, je veux une mise en page adaptée au téléphone, afin de suivre la Recette en cuisine.
47. En tant que visiteur, je veux une version imprimable sans menu ni filtres, afin de garder la Recette sur papier.
48. En tant que visiteur, je veux que le thème clair ou sombre suive le réglage de mon appareil, afin de lire confortablement.

### Publication

49. En tant qu'auteur, je veux que chaque push sur `main` publie le site, afin de n'avoir aucune étape manuelle.
50. En tant qu'auteur, je veux que le site ne soit publié que si le build réussit, afin que la dernière version valide reste en ligne en cas d'erreur.
51. En tant qu'auteur, je veux que mon adresse e-mail personnelle n'apparaisse pas dans l'historique public, afin de la garder privée.

## Implementation Decisions

### Hébergement et dépôt

- Site statique uniquement, sans adaptateur serveur, avec un chemin de base `/recettes/` que tous les liens internes et ressources doivent respecter.
- Dépôt GitHub public nommé `recettes`, dont la racine est l'actuel projet Astro. Il n'existe pas encore.
- Avant le premier push, la branche `master` est renommée `main`, l'adresse `noreply` de GitHub est configurée pour ce dépôt, et le commit `04c27b8` est réécrit pour ne plus exposer l'adresse personnelle.
- Le dépôt public et le premier push viennent en dernier, une fois le site vérifié en local.
- GitHub Actions construit et déploie à chaque push sur `main`, avec une version de Node respectant la contrainte `engines` du projet.

### Modèle de contenu

- Une collection de contenu unique, les Recettes, en MDX uniquement.
- Champs obligatoires : titre, description, Catégorie, Tags, Portions (entier positif), temps de préparation et de cuisson (minutes, `0` autorisé), Ingrédients.
- Champs facultatifs : temps de repos, photo de couverture, Brouillon (faux par défaut).
- Le temps total est calculé, jamais saisi.
- Ingrédients : soit une liste plate, soit une liste de Groupes d'ingrédients nommés. Forme d'un Ingrédient :

```ts
{ nom: string; quantite?: number; unite?: Unite }
```

- Unités autorisées : `g`, `kg`, `ml`, `cl`, `l`, `c. à café`, `c. à soupe`, `pincée`. Une unité sans quantité est invalide.
- Catégories autorisées : Entrée, Plat, Dessert, Accompagnement, Sauce, Boisson, Petit-déjeuner, définies à un seul endroit de la configuration.
- Le Référentiel de tags est un fichier Markdown contenant une liste simple, lu au build et utilisé pour valider chaque Recette.

### Modules

- **Schéma de Recette** : valide le frontmatter et produit les erreurs de build.
- **Accès aux Recettes** : seule source des Recettes visibles. Il exclut les Brouillons du build publié, trie par ordre alphabétique français et fournit les Catégories et Tags effectivement utilisés. Toutes les pages passent par lui.
- **Calcul des Portions** : fonction pure qui reçoit des Ingrédients, les Portions d'origine et les Portions voulues, et renvoie les quantités à afficher.
  - Pièces, cuillères et pincées : arrondi au quart, affiché en fractions.
  - Masses et volumes : arrondi à une valeur ronde lisible.
  - Ingrédients sans quantité : inchangés.
- **Sélecteur de Portions** : composant React sur la page de Recette, entier minimal 1, qui s'appuie sur le calcul des Portions. Le HTML initial contient les quantités d'origine.
- **Recherche et filtres** : composant React sur l'accueil, appuyé sur Pagefind. La liste complète reste présente dans le HTML initial. Texte, Catégorie et Tags se combinent, les Tags en « et », et l'état est synchronisé avec l'URL.

### Pages

- Accueil : liste alphabétique, recherche et filtres, message si aucune Recette n'est publiée.
- Recette : une page par fichier, directement sous la racine du site. Les noms de fichier sont des identifiants sans accents.
- Catégorie : une page statique par Catégorie ayant au moins une Recette publiée, sous `/recettes/categorie/<nom>/`.
- Un Tag cliqué sur une Recette ouvre l'accueil filtré ; il n'y a pas de page statique par Tag.

### Présentation

- CSS d'Astro sans framework, style sobre, grande typographie, thème clair ou sombre selon l'appareil.
- Mise en page adaptée au téléphone et feuille d'impression masquant la navigation et les contrôles.

### Contenu de départ

- Quelques Recettes inventées, toutes en Brouillon, couvrant notamment les Groupes d'ingrédients et un Ingrédient sans quantité. Aucun contenu fictif n'est publié, donc le site publié démarre vide.

## Testing Decisions

- Un bon test vérifie ce qui est observable de l'extérieur (HTML généré, échec du build, comportement dans le navigateur), jamais la structure interne des composants.
- **Site généré (point principal)** : un vrai build sur des Recettes de test, dont on vérifie le résultat :
  - pages et URL sous `/recettes/` ;
  - exclusion des Brouillons, y compris de l'index de recherche ;
  - ordre alphabétique, accents compris ;
  - pages de Catégorie, et masquage des Tags et Catégories vides ;
  - build réussi et message affiché avec zéro Recette publiée ;
  - échec du build pour un Tag, une Catégorie ou une unité inconnus, ou un champ obligatoire manquant.
- **Calcul des Portions** : tests directs de la fonction pure, en particulier les arrondis, les fractions et les Ingrédients sans quantité.
- **Navigateur, sur le site généré** : combinaison texte, Catégorie et Tags, conservation de l'état dans l'URL, recalcul des quantités à l'écran. Pagefind n'existant qu'après le build, ces tests ne tournent pas sur `astro dev`.
- Outils : Vitest pour les deux premiers points, Playwright pour le navigateur.
- Le dépôt n'a aucun test à ce jour, donc il n'existe pas d'exemple à reprendre.

## Out of Scope

- Back-office, comptes utilisateurs, serveur, base de données.
- Commentaires, notes, favoris.
- Domaine personnel.
- Traduction : le site est uniquement en français.
- Écran maintenu allumé, cases à cocher sur les Ingrédients.
- Filtre par durée, le Tag `rapide` en tient lieu.
- Pages statiques par Tag.
- Conversion d'unités (par exemple de `g` à `kg`) lors du calcul des Portions.

## Further Notes

- Le dépôt étant public, le fichier d'un Brouillon reste lisible sur GitHub même s'il est absent du site.
- La recherche Pagefind n'existe qu'après un build : elle n'est donc pas disponible telle quelle sous `astro dev`, où les Brouillons sont visibles. L'implémentation doit prévoir un repli clair en développement plutôt qu'une erreur.
- L'autocomplétion des Tags avec un Référentiel en Markdown reste à vérifier. Si elle exige un autre format, demander à l'auteur avant de changer.
- Renommer un fichier de Recette change son URL et casse les liens déjà partagés.
