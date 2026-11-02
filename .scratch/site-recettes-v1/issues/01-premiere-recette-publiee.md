# 01: Première Recette publiée de bout en bout

**What to build:** un fichier MDX minimal devient une page accessible sous le chemin de base `/recettes/`, à la place de la page d'accueil Astro par défaut. C'est le premier passage complet, du fichier au HTML généré, vérifié par le premier test sur le site généré.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Le site est configuré en statique avec le chemin de base `/recettes/` et l'adresse GitHub Pages
- [x] Une Recette de test produit une page à une URL issue du nom de son fichier, sans doublon `/recettes/recette/`
- [x] La page d'accueil Astro par défaut a disparu
- [x] Liens et ressources générés respectent le chemin de base
- [x] Vitest est installé et un test lance un vrai build sur des Recettes de test, puis vérifie le HTML produit
