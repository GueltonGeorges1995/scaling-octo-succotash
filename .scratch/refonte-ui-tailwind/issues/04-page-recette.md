# 04: Page d'une Recette dans la variante retenue

**What to build:** la page d'une Recette adopte la mise en page retenue dans le prototype, pensée pour la cuisine : la Catégorie en lien vers sa page, un bandeau regroupant les temps et les Portions, les Tags en pastilles, les Ingrédients et les Étapes faciles à suivre.

**Blocked by:** 03

**Status:** done

- [x] La Catégorie de la Recette est un lien vers la page de cette Catégorie
- [x] Le Temps de préparation, le Temps de cuisson, le Temps de repos (s'il existe) et le Temps total sont clairement distingués et regroupés avec le sélecteur de Portions
- [x] Le sélecteur de Portions est facile à toucher et garde ses libellés accessibles
- [x] Les Tags apparaissent comme des pastilles qui mènent toujours à l'accueil filtré sur ce Tag
- [x] Les Groupes d'ingrédients et les Étapes, écrites en liste numérotée dans le MDX, prennent le style de la variante retenue, sans modifier aucun fichier de Recette
- [x] Une Recette sans photo est aussi soignée qu'une Recette avec photo, sans image de remplacement
- [x] Le contraste d'au moins 4,5 est vérifié sur les nouveaux éléments (bandeau, pastilles, lien de Catégorie), en clair et en sombre
- [x] Pas de défilement horizontal à 320px ; à l'impression, la Recette reste en noir sur blanc avec les quantités ajustées
- [x] Nouveau test Playwright pour le lien de Catégorie ; les tests existants passent sans modification

## Comments

### 2026-11-05 : fait (agent)

- Page `src/pages/[id].astro` en variante A : Catégorie en surtitre, lien vers sa page (slug via `slugCategorie`, désormais partagé avec `lireCategories`) ; description en chapeau ; Tags en pastilles vers `?tag=` ; Étapes du MDX dans `.etapes`, stylées dans la feuille globale (filet, numéro en pastille ; à l'impression, numéro cerclé noir sur blanc).
- Bandeau « En bref » (`section` nommée) rendu par `IngredientsAjustables` : les temps lui arrivent en `children` depuis Astro, le sélecteur de Portions (boutons ronds de 3rem, mêmes libellés) le suit. Ingrédients en grille quantité / nom, toujours en `<li>`.
- Nouveau token `--color-encart` (fond opaque du bandeau, `#fff` à l'impression), plutôt que `bg-accent/5` du prototype : un fond opaque se mesure de façon fiable.
- `tests/navigateur/contraste.ts` mesure maintenant contre le premier fond opaque des ancêtres (ce que son commentaire prévoyait), et gagne `contrasteMinimal`. `en-tete.pw.ts` n'est pas modifié et passe toujours.
- Tests : `tests/navigateur/page-recette.pw.ts` (lien de Catégorie, lien d'un Tag, contrastes du lien de Catégorie, des pastilles et du bandeau en clair et en sombre). Numéros d'Étape (pseudo-élément, non mesurable par le helper) calculés à la main : 7,41 en clair, 8,68 en sombre.
- À suivre (05 / 07) : les règles globales `.tags`, `.temps`, `.categorie` servent encore à la liste de Recettes ; `presentation.pw.ts` garde sa propre copie du calcul de contraste, contre le fond de `body`.
