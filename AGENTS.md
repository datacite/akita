# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Akita is the web frontend for [DataCite Commons](https://commons.datacite.org). It consists of:
- **Next.js frontend** (port 3000) — the main React/TypeScript app
- **Flask API backend** (port 5328) — Python microservice for related-works graph data

### Running services

- `yarn dev` — starts only the Next.js frontend
- `yarn dev-all` — starts both Next.js and Flask API via `concurrently`
- `yarn api` — starts only the Flask API (uses `uv` to sync and run)

The Flask API requires `uv` to be installed (`~/.local/bin/uv`). The `yarn api` command handles `uv sync --project api` automatically before starting Flask.

### Environment

Copy `.env.example` to `.env` before first run. All external APIs (DataCite, ORCID, ROR) default to staging endpoints — no secrets are required for basic development.

### Lint / Type-check / Test

- `yarn lint` — ESLint (pre-existing errors in `cypress.config.ts`, not blocking)
- `yarn type-check` — TypeScript compiler (pre-existing errors in test files, not blocking)
- `yarn cy:run` — Cypress E2E tests in headless mode (requires dev server on port 3000)
- `yarn cy:open` — Cypress interactive mode

### Notes

- `uv` must be on PATH (`export PATH="$HOME/.local/bin:$PATH"`) for `yarn api` / `yarn dev-all` to work.
- The app fetches all data from external staging APIs at runtime — no local database needed.
- `yarn build` produces a production build; `yarn dev` is preferred for development.
