# 08: Catégories et menu

**What to build:** un visiteur parcourt le site par type de plat, grâce à un menu et à une page statique par Catégorie, qui fonctionnent sans JavaScript.

**Blocked by:** 06

**Status:** resolved

- [x] Une page existe sous `/recettes/categorie/<nom>/` pour chaque Catégorie ayant au moins une Recette publiée, avec une URL sans accents
- [x] Chaque page liste ses Recettes par ordre alphabétique français
- [x] Le menu, présent sur toutes les pages, ne propose que ces Catégories
- [x] Une Catégorie sans Recette publiée, ou seulement avec des Brouillons, n'a ni page ni entrée de menu (testé)
