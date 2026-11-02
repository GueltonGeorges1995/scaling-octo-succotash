// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { close, createIndex } from 'pagefind';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

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
          // Pagefind ne rapproche pas « œufs » de « oeufs » et lit « l'eau » comme un seul mot : on n'indexe
          // que « oeufs » et « l eau ». Seul l'index voit ces écritures, jamais le visiteur.
          const content = readFileSync(join(sortie, page), 'utf-8')
            .replaceAll('œ', 'oe')
            .replaceAll('Œ', 'Oe')
            .replace(/(?<=\p{L})(?:['’]|&#x27;|&#39;)(?=\p{L})/gu, ' ');
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
  integrations: [react(), mdx(), indexPagefind()]
});
