# 10: Filtres et état dans l'URL

**What to build:** un visiteur combine texte, Catégorie et Tags pour affiner la liste, puis partage ou recharge sa recherche grâce à l'URL.

**Blocked by:** 09

**Status:** resolved

- [x] Texte, Catégorie et Tags se combinent ; avec plusieurs Tags, une Recette doit tous les avoir
- [x] Seuls les Tags présents sur au moins une Recette publiée sont proposés
- [x] L'état est conservé dans l'URL et restauré au rechargement, accents compris
- [x] Cliquer sur un Tag dans une Recette ouvre l'accueil filtré sur ce Tag
- [x] Un message clair s'affiche lorsqu'aucune Recette ne correspond
- [x] Ces parcours sont couverts par des tests Playwright sur le site généré, tout comme le recalcul des quantités à l'écran
