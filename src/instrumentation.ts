/**
 * Next.js instrumentation hook (must live in `src/` because the app directory
 * is under `src/`): when Cypress drives the app (`CYPRESS_NODE_ENV=test`),
 * loads `cypressFetchMock.cjs` to stub outbound `fetch` with fixture JSON.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.CYPRESS_NODE_ENV !== 'test') return

  const setupCypressFetchMock = (await import('../cypressFetchMock.cjs')).default
  setupCypressFetchMock()
}
