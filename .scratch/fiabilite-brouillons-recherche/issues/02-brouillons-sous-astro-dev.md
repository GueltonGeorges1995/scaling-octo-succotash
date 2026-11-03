# 02: Les Brouillons sont visibles sous astro dev, même avec une option avant dev

**What to build:** prouver de bout en bout que l'auteur peut relire un Brouillon sous `astro dev`, quelle que soit la place des options sur la ligne de commande. La correction existe déjà dans l'arbre de travail et ne doit pas être réécrite : ce ticket ajoute un test qui lance un vrai serveur de dev sur des Recettes de test et demande la page d'un Brouillon.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] La page d'un Brouillon répond 200 avec `astro dev`
- [x] La page d'un Brouillon répond 200 avec une option avant `dev`, comme `astro --root . dev`
- [x] Le test utilise son propre port et n'entre pas en conflit avec un serveur de dev déjà lancé (Astro refuse d'en lancer un second sans `--force`)
- [x] Le serveur est arrêté à la fin, même en cas d'échec, et aucun processus ne survit : l'arrêt de `npx` ne tue pas le processus enfant
- [x] Si un code 500 réapparaît, sa cause est identifiée et notée dans ce ticket
- [x] Les suites existantes passent

## Comments

Tests « montre un Brouillon sous … » dans `tests/site-genere.test.ts`, bloc « Brouillons ». Le serveur est lancé par `node node_modules/astro/bin/astro.mjs` (sans `npx`) avec `--ignore-lock` : il tourne à côté d'un serveur de dev déjà lancé sans le remplacer, ni toucher à `.astro/dev.json`. Le test demande le port 4390 et lit l'adresse qu'Astro annonce, au cas où ce port serait pris. L'arrêt tue toute l'arborescence (`taskkill /t /f` sous Windows, groupe de processus ailleurs), puis le test vérifie que l'adresse ne répond plus.

Avec l'ancienne détection (`process.argv[2] === 'dev'`), le cas `--root . dev` renvoie 404 et le test échoue ; aucun processus n'a survécu à cet échec. Le code 500 n'est pas réapparu en plusieurs lancements, sa cause reste donc inconnue. Vitest (90), Playwright (51) et `astro check` passent.

**Correction après coup.** `--ignore-lock` ne suffisait pas. En dev, Astro écrit son contenu dans `<racine>/.astro/data-store.json` (le build, lui, l'écrit dans `node_modules/.astro`), et Vite écrit son cache dans `<racine>/node_modules/.vite`. Le test a donc écrasé le contenu du serveur de dev de l'auteur, qui a affiché les Recettes de test et `LocalImageUsedWrongly` sur `./brouillon-secret.jpg`. Le test lance maintenant le serveur dans une racine temporaire faite de liens vers le projet, avec son propre `node_modules` (un lien par paquet), et vérifie que ces deux caches du projet ne bougent pas.
