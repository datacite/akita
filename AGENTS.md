# AGENTS.md

## Cursor Cloud specific instructions

### Overview

**Akita** is the web frontend for [DataCite Commons](https://commons.datacite.org) — a research discovery service. It has two local services:

| Service | Port | Command |
|---|---|---|
| Next.js frontend | 3000 | `yarn dev` |
| Flask Python API | 5328 | `yarn api` |

Both run together via `yarn dev-all`. The Flask API provides `/api/doi/related-graph/<doi>` and `/api/doi/related-list/<doi>` endpoints. All other data comes from remote DataCite/ORCID/ROR staging APIs (no local database).

### Key commands

See `package.json` scripts and `README.md` for full details:

- **Dev servers:** `yarn dev-all` (Next.js + Flask)
- **Lint:** `yarn lint`
- **Type check:** `yarn type-check`
- **Cypress E2E tests:** `yarn cy:run` (requires dev server running on port 3000)
- **Build:** `yarn build`

### Non-obvious notes

- `uv` (Python package manager) must be installed and on `PATH` — the `yarn api` script uses it to sync and run the Flask app. It is installed at `~/.local/bin/uv`.
- The `.env` file must exist (copy from `.env.example`). Default values point to DataCite staging APIs, which work without credentials.
- Cypress tests use `.test.ts`/`.test.tsx` extensions (not `.cy.ts`), located under `cypress/e2e/`.
- Pre-existing lint errors exist in `cypress.config.ts` (unused vars) and type errors exist in test files (`PersonMetadata.test.tsx`, `VerticalBarChart.test.tsx`). These are not regressions.
- The Flask API's `uv sync` step builds `datacitekit` from a GitHub archive URL on first run — this takes a few seconds.
- `yarn dev-all` uses `concurrently` to run both servers. In the terminal output, `[0]` is Next.js and `[1]` is Flask.
