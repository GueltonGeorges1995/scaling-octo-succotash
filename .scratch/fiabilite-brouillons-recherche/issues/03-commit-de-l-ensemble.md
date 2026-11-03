# 03: Commit de l'ensemble

**What to build:** enregistrer dans l'historique les corrections de la revue de `bb3d8e7`, la spec, les tickets et les nouveaux tests. Ce commit ne pousse rien : un push sur `main` publie le site, et reste une décision de l'auteur.

**Blocked by:** 01, 02

**Status:** resolved

- [x] `astro check`, les tests Vitest et les tests Playwright passent juste avant le commit
- [x] `git status` ne montre ni `dist-test`, ni dossier de Recettes temporaire, ni autre fichier parasite
- [x] Le dépôt contient les nouvelles dépendances avec leur lockfile
- [x] Rien n'est poussé sur le dépôt distant

## Comments

Juste avant le commit : Vitest (90), Playwright (51) et `astro check` (0 erreur) passent. Rien n'est poussé : le push sur `main` publie le site et reste la décision de l'auteur.
