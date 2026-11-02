import { defineConfig } from '@playwright/test';

const PORT = 4322;

// Les tests tournent sur le site généré, à partir des Recettes de test.
export default defineConfig({
	testDir: 'tests/navigateur',
	testMatch: '*.pw.ts',
	use: { baseURL: `http://localhost:${PORT}/scaling-octo-succotash/` },
	webServer: {
		command: `npm run build && npm run preview -- --port ${PORT}`,
		url: `http://localhost:${PORT}/scaling-octo-succotash/`,
		timeout: 120_000,
		env: {
			RECETTES_DIR: 'tests/fixtures/recettes-publiees',
			REFERENTIEL_TAGS: 'tests/fixtures/tags.md',
		},
	},
});
