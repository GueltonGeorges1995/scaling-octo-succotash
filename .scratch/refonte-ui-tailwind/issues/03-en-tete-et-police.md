# 03: En-tête commun et police des titres

**What to build:** chaque page affiche un en-tête avec le nom du site, « Recettes », qui ramène à l'accueil, suivi du menu des Catégories. Les titres utilisent la police retenue dans le prototype, servie par le site lui-même.

**Blocked by:** 02

**Status:** done

- [x] Le nom du site est défini à un seul endroit
- [x] Sur l'accueil, une page de Recette et une page de Catégorie, le nom du site est un lien qui mène à l'accueil, en respectant le chemin de base du site
- [x] Le menu des Catégories reste dans l'en-tête, et l'en-tête tient à 320px sans défilement horizontal
- [x] La police des titres est auto-hébergée, en version variable, avec un affichage immédiat du texte avant son chargement
- [x] Aucune requête de police ne part vers un autre domaine que celui du site
- [x] Le nom du site et les liens du menu ont un contraste d'au moins 4,5, en clair comme en sombre
- [x] À l'impression, l'en-tête est masqué
- [x] Nouveaux tests Playwright pour chacun de ces points ; les tests existants passent sans modification

## Comments

### 2026-11-05 : fait (agent)

- Nom du site dans `src/site.ts` (`NOM_DU_SITE`), utilisé par l'en-tête du layout et par l'accueil (titre et `h1`).
- En-tête commun (`<header>`, masqué à l'impression par `print:hidden`) : le nom du site, lien vers `BASE_URL`, puis le menu des Catégories. Les anciennes règles `nav` de la feuille globale sont remplacées par des classes utilitaires.
- Fraunces via `@fontsource-variable/fraunces` (variable, `font-display: swap`, fichiers servis depuis `_astro/`), token `--font-titre` appliqué aux `h1`–`h3`. Nouveau token `--container-page` (44rem) partagé par l'en-tête et `main`.
- Tests : `tests/navigateur/en-tete.pw.ts` ; les tests existants passent sans modification.
- À suivre : `tests/navigateur/contraste.ts` reprend le calcul de contraste de `presentation.pw.ts`, laissé intact pour respecter « sans modification ». Ce fichier pourra l'importer plus tard, par exemple au ticket 07.
