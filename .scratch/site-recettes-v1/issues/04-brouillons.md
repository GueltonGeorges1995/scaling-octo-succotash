# 04: Brouillons

**What to build:** l'auteur marque une Recette comme Brouillon pour la committer sans la publier. Il la voit en local, mais elle n'existe pas sur le site publié.

**Blocked by:** 02

**Status:** resolved

- [x] Le champ Brouillon est facultatif et vaut faux par défaut
- [x] Toutes les Recettes d'exemple inventées sont marquées comme Brouillons
- [x] Un Brouillon a sa page sous `astro dev`
- [x] Un Brouillon ne produit aucune page dans le build publié (testé)
- [x] Toutes les pages obtiennent les Recettes via un même accès, seul responsable de cette exclusion
- [x] Le build réussit même lorsque toutes les Recettes sont des Brouillons (testé)

## Comments

Vérifié sous `astro dev` : les trois Recettes d'exemple répondent en 200. Cette vérification est manuelle, sans test automatisé. Le tri et les Catégories et Tags utilisés, prévus par la spec pour l'Accès aux Recettes, restent à ajouter avec les tickets qui s'en servent.
