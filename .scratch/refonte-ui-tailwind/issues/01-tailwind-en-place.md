# 01: Tailwind en place, rendu identique

**What to build:** Tailwind v4 est branché sur le site, et les couleurs actuelles deviennent des tokens de thème, avec leurs valeurs claires et sombres. Le visiteur ne voit aucune différence : c'est une préparation qui rend la suite de la refonte facile.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Tailwind v4 est intégré par son plugin Vite officiel, et une classe utilitaire posée dans un composant prend effet au build comme sous `astro dev`
- [x] Les couleurs (fond, texte, discret, accent, séparateur, contrôle) sont définies une seule fois comme tokens de thème, en clair et en sombre, et le passage au sombre suit toujours le réglage de l'appareil
- [x] Le préflight de Tailwind ne change pas le rendu actuel : titres, listes, liens et formulaires gardent leur apparence
- [x] Les règles d'impression s'appliquent toujours
- [x] Tous les tests existants (Vitest et Playwright) passent sans modification
