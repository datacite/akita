# AGENTS.md

## Cursor Cloud specific instructions

Akita is the **DataCite Commons** frontend: a Next.js 15 / React 19 app (port `3000`)
plus an optional Flask Python API (port `5328`) used only for the related-works graph.
There is no local database — all data comes from remote APIs (DataCite stage, ORCID
sandbox, ROR), so the environment needs outbound network access. Standard scripts live
in `package.json`; setup lives in `README.md`. Notes below are the non-obvious bits.

### Services

| Service | Must run? | Port | Start command |
| --- | --- | --- | --- |
| Next.js frontend | Yes | 3000 | `yarn dev` |
| Flask API (related-works graph) | Optional | 5328 | `yarn api` |
| Both together | — | 3000 + 5328 | `yarn dev-all` |

The update script already runs `corepack enable` + `yarn install`, so Yarn 4 and the
Node dependencies are ready when a session starts. Just run `yarn dev-all` (or `yarn dev`
for frontend only). In dev, Next proxies `/api/*` → `http://127.0.0.1:5328` (see
`next.config.js`), which is how the frontend reaches the Flask API.

### Python API (uv)

- The API is managed by **uv** (installed system-wide at `/usr/local/bin/uv`; the update
  script does not install it). `yarn api` / `yarn dev-all` run `uv sync --project api`
  themselves on first launch, so you normally do not need to sync manually.
- The Flask app only serves `/api/doi/related-graph/<doi>` and `/api/doi/related-list/<doi>`;
  hitting `/` returns 404, which is expected — that does not mean the API is down.

### Linting caveat (important)

- `yarn lint` currently **fails**: `.eslintrc.js` references `eslint-plugin-react`, which is
  not a declared dependency, and no CI workflow runs lint. The same warning appears during
  `yarn build` but is non-fatal (the build still succeeds).
- Use `yarn type-check` (tsc) for type validation and `yarn prettier-format` for formatting.

### Cypress e2e tests

- Cypress runs against a **production build**, not the dev server. Use two terminals:
  1. `yarn build`, then `CYPRESS_NODE_ENV=test yarn start` (leave running on `:3000`).
  2. `yarn cy:run` once `:3000` is up.
- `CYPRESS_NODE_ENV=test` must be set on the **Next.js server**, not only on the Cypress
  command. It enables strict API mocking (unmocked browser calls return HTTP 599); without
  it, tests fail. The Flask API does not need to run — the related-graph is mocked.
- The Cypress binary is not installed by `yarn install` (`enableScripts: false` in
  `.yarnrc.yml`). It is cached under `~/.cache/Cypress`; if missing, run
  `yarn exec cypress install`.
- Free port 3000 before starting the dev server again after a Cypress run.
