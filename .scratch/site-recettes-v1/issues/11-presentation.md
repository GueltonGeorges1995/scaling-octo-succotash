# 11: Présentation : téléphone, thèmes et impression

**What to build:** le site devient agréable à lire en cuisine : sobre, lisible sur téléphone, adapté au thème de l'appareil et imprimable.

**Blocked by:** 05, 07, 08, 10

**Status:** resolved

- [x] Style sobre et grande typographie, avec le CSS d'Astro et sans framework
- [x] Toutes les pages sont utilisables sur téléphone, sans défilement horizontal
- [x] Le thème clair ou sombre suit le réglage de l'appareil, avec des contrastes lisibles dans les deux cas
- [x] L'impression d'une Recette masque le menu, la recherche, les filtres et le sélecteur de Portions, et garde les quantités affichées

## Comments

À l'impression, seuls les boutons du sélecteur disparaissent : le nombre de Portions reste affiché, car il donne leur sens aux quantités imprimées.

Les pages de Catégorie reçoivent aussi le lien « Toutes les recettes », sans lequel elles ne menaient nulle part vers l'accueil.
