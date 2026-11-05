// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { close, createIndex } from 'pagefind';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { ecritureIndex } from './src/recettes/texte-recherche.ts';

/**
 * Transmet à `src/recettes` ce qu'Astro seul connaît avec certitude : sa commande et la racine du projet.
 * @returns {import('astro').AstroIntegration}
 */
function contexteAstro() {
  return {
    name: 'contexte-astro',
    hooks: {
      'astro:config:setup': ({ command, config }) => {
        process.env.ASTRO_COMMANDE = command;
        process.env.ASTRO_RACINE = fileURLToPath(config.root);
      },
    },
  };
}

/** @returns {import('astro').AstroIntegration} */
function indexPagefind() {
  return {
    name: 'index-pagefind',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const sortie = fileURLToPath(dir);
        const { index, errors } = await createIndex({ forceLanguage: 'fr' });
        if (!index) throw new Error(`Pagefind : ${errors.join(', ')}`);

        const erreurs = [];
        const pages = readdirSync(sortie, { recursive: true, encoding: 'utf-8' }).filter((nom) => nom.endsWith('.html'));
        for (const page of pages) {
          const content = ecritureIndex(readFileSync(join(sortie, page), 'utf-8'));
          erreurs.push(...(await index.addHTMLFile({ sourcePath: page.replaceAll('\\', '/'), content })).errors);
        }
        erreurs.push(...(await index.writeFiles({ outputPath: `${sortie}pagefind` })).errors);
        await close();
        if (erreurs.length > 0) throw new Error(`Pagefind : ${erreurs.join(', ')}`);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://gueltongeorges1995.github.io',
  base: '/scaling-octo-succotash/',
  output: 'static',
  integrations: [contexteAstro(), react(), mdx(), indexPagefind()],
  vite: { plugins: [tailwindcss()] },
});
