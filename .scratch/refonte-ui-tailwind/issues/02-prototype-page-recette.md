# 02: Prototype des 3 variantes de la page d'une Recette

**What to build:** une page jetable où l'auteur compare, dans son navigateur, trois mises en page de la page d'une Recette et deux polices de titres, puis choisit celles à retenir. Voir la section « Choix de la mise en page par prototype » de la spec.

**Blocked by:** 01

**Status:** done

- [x] Le prototype vit sur une branche à part, hors de `main`, et il est clairement nommé comme prototype
- [x] Il se lance en une commande et affiche une vraie Recette avec des Groupes d'ingrédients, un Temps de repos et des Tags
- [x] On passe d'une variante à l'autre (une colonne améliorée, deux colonnes, fiche de cuisine) avec un paramètre d'URL et une barre flottante en bas de l'écran
- [x] Deux polices de titres candidates, à empattements et en version variable (par exemple Fraunces et Lora), sont aussi comparables
- [x] Chaque variante peut être vue en clair, en sombre, sur téléphone et sur grand écran
- [x] Le verdict de l'auteur (variante et police retenues, et pourquoi) est noté dans ce ticket, avec un lien vers la branche du prototype

## Comments

### 2026-11-05 : prototype prêt (agent)

Branche locale `prototype/page-recette` (commit `2fff8eb`), à ne jamais fusionner dans `main`. Pas encore poussée ; une fois poussée : https://github.com/GueltonGeorges1995/scaling-octo-succotash/tree/prototype/page-recette

**Lancer :** `git switch prototype/page-recette`, puis `npm run prototype` (ouvre la Tarte Tatin : Groupes d'ingrédients, Temps de repos, Tags).

**Comparer :**

- Barre flottante rose en bas de l'écran, ou paramètres d'URL `?variante=A|B|C`, `?police=fraunces|lora|systeme` (système = témoin), `?theme=auto|clair|sombre`.
- Clavier : `←` `→` variante, `P` police, `T` thème.
- Lien « Téléphone + grand écran » (`/prototype-apercu/`) : la même Recette dans un cadre de 390 px et un cadre de 1440 px, côte à côte.

**Les trois variantes :**

- **A · Une colonne améliorée** : Catégorie en surtitre, chapeau en italique, Tags en pastilles, bandeau « En bref » (temps en grille, Portions avec gros boutons ronds), Ingrédients en tableau quantité / nom, Étapes séparées par un filet avec numéro en pastille.
- **B · Deux colonnes** : sur grand écran, page élargie à 72rem, temps alignés à droite du titre, Ingrédients collants à gauche avec un sélecteur de Portions en pilule, Étapes à droite. Retombe sur une colonne sur téléphone.
- **C · Fiche de cuisine** : titre centré, fiche encadrée (Catégorie et temps en cartouche, Ingrédients sur des lignes pointillées, sur deux colonnes s'il y a plusieurs Groupes), gros numéros d'Étape « 01 ».

Vérifié par l'agent : aucune erreur de console ou d'hydratation, aucun défilement horizontal à 320 px pour les trois variantes, et les polices sont servies par le site lui-même (Fontsource, `font-display: swap`). En build de production, la page reste celle d'aujourd'hui : les variantes et la barre n'existent que sous `astro dev`.

À noter pour le report dans le vrai code : dans les trois variantes, la Catégorie est déjà un lien vers sa page, et les classes `categorie`, `temps`, `tags` et `retour` sont conservées.


### 2026-11-05 : verdict de l'auteur

- **Variante retenue : A · Une colonne améliorée.** Catégorie en surtitre (lien vers sa page), description en chapeau, Tags en pastilles, bandeau « En bref » avec les temps et les Portions, Ingrédients en tableau quantité / nom, Étapes séparées par un filet avec numéro en pastille.
- **Police de titres retenue : Fraunces** (variable, auto-hébergée via `@fontsource-variable/fraunces`).
- Pourquoi : choix de l'auteur après comparaison dans le prototype ; aucune raison détaillée donnée.
- Prototype complet (les trois variantes) : branche `prototype/page-recette`, commit `2fff8eb`.

Les tickets 03 (en-tête et police) et 04 (page d'une Recette) reprennent ces choix ; le code des variantes est à réécrire proprement, pas à copier.
