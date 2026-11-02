# 05: Calcul et sélecteur de Portions

**What to build:** sur une page de Recette, changer le nombre de Portions recalcule aussitôt les quantités, sans bouton à cliquer et avec des arrondis lisibles.

**Blocked by:** 02

**Status:** resolved

- [x] Le calcul est une fonction pure testée directement : Ingrédients, Portions d'origine et Portions voulues en entrée, quantités à afficher en sortie
- [x] Pièces, cuillères et pincées sont arrondies au quart et affichées en fractions (2 ¼)
- [x] Masses et volumes sont arrondis à une valeur ronde lisible (150 g plutôt que 153,7 g)
- [x] Les Ingrédients sans quantité restent inchangés
- [x] Il n'y a pas de conversion d'unités
- [x] Le sélecteur est un composant React, avec 1 Portion au minimum
- [x] Sans JavaScript, la page affiche les quantités d'origine

## Comments

Le sélecteur est fait de deux boutons − et +, inactifs sans JavaScript : aucune saisie invalide n'est possible. Masses et volumes sont arrondis à deux chiffres significatifs. Des Portions inchangées redonnent les quantités d'origine sans arrondi, mais `0.5 c. à soupe` s'écrit désormais `½`. Le calcul est testé avec Vitest, le recalcul à l'écran avec Playwright (`npm run test:navigateur`).
