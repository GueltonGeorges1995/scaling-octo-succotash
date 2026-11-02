# 02: Recette complète

**What to build:** une page de Recette affiche toutes ses informations : titre, description, Catégorie, Portions, temps, Ingrédients et étapes. Le frontmatter est validé, si bien qu'une Recette invalide fait échouer le build. Des Recettes d'exemple inventées servent de contenu de départ.

**Blocked by:** 01

**Status:** resolved

- [x] Titre, description, Catégorie, Portions (entier positif), temps de préparation et de cuisson (minutes, `0` autorisé) et Ingrédients sont obligatoires
- [x] Le temps de repos est facultatif et le temps total est calculé, jamais saisi
- [x] Un Ingrédient exige un nom ; quantité et unité sont facultatives ; une unité sans quantité est invalide
- [x] Une liste plate d'Ingrédients et des Groupes d'ingrédients sont tous deux acceptés et affichés, un même Ingrédient pouvant figurer dans plusieurs groupes
- [x] Une Catégorie ou une unité inconnue, ou un champ obligatoire manquant, fait échouer le build (testé)
- [x] Unités et Catégories autorisées sont celles de la spec, définies à un seul endroit
- [x] Quelques Recettes d'exemple inventées couvrent les Groupes d'ingrédients et un Ingrédient sans quantité ; elles deviendront des Brouillons avec le ticket 04
