import { resolve } from 'node:path';

/** Résout un chemin comme le fait Astro, depuis la racine du projet et non le dossier courant : voir `contexteAstro`. */
export const depuisRacine = (chemin: string) => resolve(process.env.ASTRO_RACINE ?? '.', chemin);
