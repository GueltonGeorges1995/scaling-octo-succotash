# 04: Page d'une Recette dans la variante retenue

**What to build:** la page d'une Recette adopte la mise en page retenue dans le prototype, pensée pour la cuisine : la Catégorie en lien vers sa page, un bandeau regroupant les temps et les Portions, les Tags en pastilles, les Ingrédients et les Étapes faciles à suivre.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] La Catégorie de la Recette est un lien vers la page de cette Catégorie
- [ ] Le Temps de préparation, le Temps de cuisson, le Temps de repos (s'il existe) et le Temps total sont clairement distingués et regroupés avec le sélecteur de Portions
- [ ] Le sélecteur de Portions est facile à toucher et garde ses libellés accessibles
- [ ] Les Tags apparaissent comme des pastilles qui mènent toujours à l'accueil filtré sur ce Tag
- [ ] Les Groupes d'ingrédients et les Étapes, écrites en liste numérotée dans le MDX, prennent le style de la variante retenue, sans modifier aucun fichier de Recette
- [ ] Une Recette sans photo est aussi soignée qu'une Recette avec photo, sans image de remplacement
- [ ] Le contraste d'au moins 4,5 est vérifié sur les nouveaux éléments (bandeau, pastilles, lien de Catégorie), en clair et en sombre
- [ ] Pas de défilement horizontal à 320px ; à l'impression, la Recette reste en noir sur blanc avec les quantités ajustées
- [ ] Nouveau test Playwright pour le lien de Catégorie ; les tests existants passent sans modification
