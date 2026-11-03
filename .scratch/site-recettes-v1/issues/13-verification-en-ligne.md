# 13: Vérification en ligne avec des Recettes publiées

**What to build:** le site en ligne est vérifié avec du contenu publié, ce que le ticket 12 n'a pas pu faire sur un site vide. L'auteur regarde le site sous `gueltongeorges1995.github.io/scaling-octo-succotash/` et confirme chaque point.

**Blocked by:** 12

**Status:** ready-for-human

- [ ] Une page de Recette s'affiche sous `/scaling-octo-succotash/`, avec sa photo s'il y en a une, et le sélecteur de Portions recalcule les quantités
- [ ] Une page de Catégorie liste ses Recettes, et une Catégorie sans Recette publiée (Accompagnement) n'a ni page ni entrée dans le menu
- [ ] La recherche trouve une Recette publiée et ne trouve aucun Brouillon
- [ ] Les filtres par Catégorie et par Tag fonctionnent, et leur état reste dans l'URL
- [ ] Un build en échec ne publie rien : sur une branche temporaire, une Recette reçoit un Tag inconnu et le workflow est lancé à la main sur cette branche ; le build échoue, l'étape de publication est sautée à cause de cet échec et non refusée par la règle de l'environnement `github-pages`, puis la branche est supprimée. `main` et le site en ligne ne sont jamais touchés
