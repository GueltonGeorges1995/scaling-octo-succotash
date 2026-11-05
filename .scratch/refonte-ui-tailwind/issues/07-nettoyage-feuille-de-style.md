# 07: Nettoyage de l'ancienne feuille de style

**What to build:** une fois toutes les pages migrées, la feuille de style globale ne garde que la couche de base que les classes utilitaires ne peuvent pas atteindre. Le visiteur ne voit aucune différence.

**Blocked by:** 04, 05, 06

**Status:** ready-for-agent

- [ ] La feuille globale ne contient plus que les tokens de couleur, la typographie du contenu MDX, les règles d'impression, et les styles de base des formulaires et du focus
- [ ] Les règles devenues inutiles sont supprimées
- [ ] Les classes `categorie`, `temps`, `tags` et `retour` restent présentes, car les tests les ciblent
- [ ] Tous les tests (Vitest et Playwright) passent sans modification
