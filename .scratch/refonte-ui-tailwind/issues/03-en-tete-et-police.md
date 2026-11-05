# 03: En-tête commun et police des titres

**What to build:** chaque page affiche un en-tête avec le nom du site, « Recettes », qui ramène à l'accueil, suivi du menu des Catégories. Les titres utilisent la police retenue dans le prototype, servie par le site lui-même.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Le nom du site est défini à un seul endroit
- [ ] Sur l'accueil, une page de Recette et une page de Catégorie, le nom du site est un lien qui mène à l'accueil, en respectant le chemin de base du site
- [ ] Le menu des Catégories reste dans l'en-tête, et l'en-tête tient à 320px sans défilement horizontal
- [ ] La police des titres est auto-hébergée, en version variable, avec un affichage immédiat du texte avant son chargement
- [ ] Aucune requête de police ne part vers un autre domaine que celui du site
- [ ] Le nom du site et les liens du menu ont un contraste d'au moins 4,5, en clair comme en sombre
- [ ] À l'impression, l'en-tête est masqué
- [ ] Nouveaux tests Playwright pour chacun de ces points ; les tests existants passent sans modification
