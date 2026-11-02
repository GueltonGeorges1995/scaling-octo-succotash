# 07: Photo de couverture

**What to build:** l'auteur peut ajouter une photo facultative, rangée à côté du fichier de la Recette. Elle apparaît sur la page et dans la liste.

**Blocked by:** 06

**Status:** resolved

- [x] La photo de couverture est un champ facultatif
- [x] La photo est optimisée au build et son URL respecte le chemin de base
- [x] Elle s'affiche sur la page de la Recette et dans la liste de l'accueil
- [x] Sans photo, la page et la liste restent propres, sans espace vide ni image cassée
- [x] Une photo référencée mais introuvable fait échouer le build

## Comments

Déclarer une photo la publie même si sa page n'est pas générée : la photo d'un Brouillon se retrouvait dans `_astro/`. Le schéma l'oublie donc au build (testé), et elle reste visible sous `astro dev` (vérifié à la main). En contrepartie, la photo introuvable d'un Brouillon ne fait échouer le build qu'à sa publication.
