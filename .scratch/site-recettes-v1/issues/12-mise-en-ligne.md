# 12: Mise en ligne

**What to build:** le site est publié sur `gueltongeorges1995.github.io/scaling-octo-succotash/`, et chaque push sur `main` le met à jour. Cette étape publie le code et réécrit l'historique : chaque action externe ou irréversible doit être confirmée par l'auteur au moment de la faire.

**Blocked by:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11

**Status:** ready-for-human

- [x] Le workflow GitHub Actions construit et déploie à chaque push sur `main`, avec une version de Node respectant la contrainte `engines`
- [x] Un build en échec ne déploie rien, et la dernière version valide reste en ligne
- [x] La branche `master` est renommée `main`
- [x] L'adresse `noreply` de GitHub est configurée pour ce dépôt, et le commit `04c27b8` est réécrit pour ne plus exposer l'adresse personnelle ; l'historique est vérifié avant le premier push
- [ ] Le dépôt public `scaling-octo-succotash` est créé et GitHub Pages est activé avec GitHub Actions comme source
- [ ] Le site en ligne fonctionne : accueil, message de site vide, ressources et index de recherche se chargent sous `/scaling-octo-succotash/`

## Comments

Le commit `04c27b8`, poussé avant la réécriture de l'historique, restait lisible sur GitHub par son SHA. L'auteur a donc supprimé le dépôt `recettes` et publié le code dans le dépôt `scaling-octo-succotash`, avec un historique repartant d'un seul commit. Le chemin de base devient `/scaling-octo-succotash/` ; la spec et les tickets résolus gardent l'ancien chemin `/recettes/`. Il reste à choisir GitHub Actions comme source de Pages, à publier le changement de chemin, puis à vérifier le site en ligne. Le refus de déploiement sur un build en échec repose sur `needs: build` : il n'a pas encore été observé sur GitHub.
