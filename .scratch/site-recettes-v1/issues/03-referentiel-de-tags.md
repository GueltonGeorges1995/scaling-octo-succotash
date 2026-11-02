# 03: Référentiel de tags

**What to build:** l'auteur tient la liste des Tags autorisés dans un fichier Markdown et attribue des Tags à ses Recettes. Un Tag absent du Référentiel fait échouer le build avec un message clair.

**Blocked by:** 02

**Status:** resolved

- [x] Le Référentiel de tags est un fichier Markdown contenant une liste simple, lu au build
- [x] Une Recette peut porter plusieurs Tags, affichés sur sa page
- [x] Un Tag inconnu fait échouer le build et le message nomme le Tag et la Recette (testé)
- [x] L'autocomplétion des Tags dans VS Code est vérifiée ; si elle exige un autre format de Référentiel, demander à l'auteur avant de changer

## Comments

Reste à vérifier à la main dans VS Code : l'autocomplétion des Tags dans le frontmatter d'une Recette. Le JSON Schema généré par Astro (`.astro/collections/recettes.schema.json`) contient bien la liste du Référentiel, sans changer de format.

Vérifié par l'auteur dans VS Code : les Tags du Référentiel sont bien proposés dans le frontmatter d'une Recette. Aucun changement de format n'est nécessaire.
