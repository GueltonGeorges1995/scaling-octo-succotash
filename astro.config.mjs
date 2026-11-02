// @ts-check
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

        const erreurs = [
          ...(await index.addDirectory({ path: sortie })).errors,
          ...(await index.writeFiles({ outputPath: `${sortie}pagefind` })).errors,
        ];
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
