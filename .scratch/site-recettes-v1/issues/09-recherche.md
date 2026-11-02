# 09: Recherche sur tout le contenu

**What to build:** depuis l'accueil, un visiteur cherche un mot dans tout le contenu des Recettes, par exemple « courgette » pour trouver un gratin dont le titre ne contient pas ce mot.

**Blocked by:** 06

**Status:** resolved

- [x] Pagefind génère son index au build, réglé pour le français, et ses ressources respectent le chemin de base
- [x] La recherche couvre titre, description, Ingrédients et étapes
- [x] Les Brouillons sont absents de l'index
- [x] La liste complète reste dans le HTML initial et reste lisible si la recherche ne se charge pas
- [x] Sous `astro dev`, un repli clair s'affiche à la place d'une erreur
- [x] Le build et la recherche fonctionnent avec zéro Recette publiée
- [x] Playwright est installé et un test trouve une Recette par un Ingrédient absent de son titre, sur le site généré

## Comments

Pagefind rapproche un mot absent des mots indexés qui le commencent (« courgette » trouve « c. », « levure » trouve « les »), sans option documentée pour l'éviter. Le composant écarte donc les résultats dont le texte surligné ne partage pas au moins 70 % du début du mot cherché (testé).

Avec zéro Recette publiée, l'accueil ne propose pas de champ de recherche : il n'y aurait rien à chercher.
