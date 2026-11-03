# 01: Un Brouillon avec BOM et photo ne laisse aucune trace

**What to build:** prouver de bout en bout qu'un Brouillon dont l'en-tête commence par un BOM reste hors du site publié, photo comprise. La correction existe déjà dans l'arbre de travail et ne doit pas être réécrite : ce ticket ajoute le test sur le site généré, qui n'a été vérifié qu'à la main. Le test construit le site sur un dossier de Recettes temporaire, sur le modèle de ceux de `erreurDeBuild`.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Le site généré ne contient ni page ni image pour ce Brouillon
- [x] Une Recette publiée du même dossier est bien présente, pour que le test ne passe pas sur un site vide
- [x] Le test échoue si la détection des Brouillons ne reconnaît plus le BOM (vérifié en la cassant temporairement)
- [x] Le dossier temporaire est supprimé, même en cas d'échec
- [x] Les suites existantes passent

## Comments

Test ajouté dans `tests/site-genere.test.ts`, bloc « Brouillons ». En cassant la reconnaissance du BOM, il échoue sur `_astro/brouillon-avec-bom.*.jpg` : la page reste absente, mais la photo est publiée, ce qui est la fuite d'origine. Le dossier temporaire a bien disparu après cet échec. Vitest (88), Playwright (51) et `astro check` passent. Rien n'est commité : c'est l'objet du ticket 03.
