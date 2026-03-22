# JWT Test Fixtures Setup Guide

This guide explains how to configure JWT test fixtures for local development and CI/CD environments.

## Overview

The JWT authentication tests use a test RSA **public** key in `cypress/fixtures/jwt-keys.json`. Token **signing** uses the matching private key supplied at runtime via `TEST_JWT_PRIVATE_KEY` (env or CI). The private key is **never** committed to the repository.

## Test Key Files

### `cypress/fixtures/jwt-keys.json`

Contains **only** the test RSA **public** key (2048-bit), used for reference and by `loadJWTKeys()`:

- `publicKey`: Used by the app (via `NEXT_PUBLIC_JWT_PUBLIC_KEY`) to verify JWT tokens in tests.

**No `privateKey`** is stored in the fixture. Signing is done in Cypress Node tasks using `TEST_JWT_PRIVATE_KEY`.

### Credential rotation

**The key pair previously stored here was committed (including the private key) and must be treated as compromised.** Rotate credentials:

1. Generate a new RSA key pair:
2. Update `NEXT_PUBLIC_JWT_PUBLIC_KEY` and `TEST_JWT_PRIVATE_KEY` (and CI secrets) with the new pair.
3. Update `jwt-keys.json` with the new **public** key only.
4. **Never** commit the new private key.

## Local Development Setup

### 1. Configure Environment Variables

Create or update your `.env` file:

```bash
# Public key — app uses this to verify tokens (must match private key used for signing)
NEXT_PUBLIC_JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj760PNWDk5AWonv/G63Q
08b1XAqUdCVttXLxr6AEXcJeYWXwDPRZAGKBpMTVcu0SIl7I958ebVx2A1I4dNAZ
6xCku2bgOzoOiFJqNF1EzaxhHbk2gBQt6q92X5RaPFZh3UUkmvISACoiDH+Mja2W
kW3o8o4iRWaRUvo0sRpbv+O7PSx+3FBABGZSSz1wV7rz7YMjDUjHCF2gsS3XKeA3
ZzmwYlLmpxM1kD6h/XloO9OHgH2h2IlOyhm7VkhRYYc1auj5zJYKzKkWfCvbozF+
rufZNFqMGjlUzmH5KYr4CcnuzYFTN0RxUJrCs1UDh/KbI2wZx3ZXXt4zp4QQNAO0
RQIDAQAB
-----END PUBLIC KEY-----"

# Private key — used only by Cypress Node tasks to sign test tokens (never commit)
# Must match the public key above. Omit to skip JWT auth tests that need valid tokens.
TEST_JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----"
```

You can use the public key from `jwt-keys.json`. The private key must be the matching pair; obtain it from your team or generate a new pair and rotate (see above).

### 2. Run Tests Locally

```bash
# Run all tests
yarn cy:run

# Run JWT-specific tests
yarn cy:run --spec "cypress/e2e/jwtAuth.test.ts"

# Run component tests with JWT
yarn cy:run --component --spec "src/components/Header/NavRight.test.tsx"

# Open Cypress UI for interactive testing
yarn cy:open
```

## CI/CD Setup (GitHub Actions)

### 1. Configure GitHub Secrets

Add these **optional** secrets to run JWT authentication tests:

**`NEXT_PUBLIC_JWT_PUBLIC_KEY`**  
The test RSA public key (must match `TEST_JWT_PRIVATE_KEY`).

**`TEST_JWT_PRIVATE_KEY`**  
The matching test RSA private key. Used only by Cypress Node tasks for signing; never logged or committed.

### 2. Workflow Configuration

The workflow in `.github/workflows/cypress_tests.yml`:

- Accepts `NEXT_PUBLIC_JWT_PUBLIC_KEY` and `TEST_JWT_PRIVATE_KEY` as optional secrets
- Passes them to the test environment
- Maps `CYPRESS_USER_COOKIE` to `Cypress.env('userCookie')`

Cypress config sets `config.env.jwtPublicKey` and `jwtPublicKeyConfigured` **only** when `NEXT_PUBLIC_JWT_PUBLIC_KEY` is set. Tests that require valid JWTs skip when it is not configured.

### 3. Existing Secrets

The CI already uses:

- `CYPRESS_USER_COOKIE`: Real user session cookie for integration tests
- `CYPRESS_RECORD_KEY`: Cypress Dashboard recording
- Other API URLs and config

## JWT Test Helpers

Helpers live in `cypress/support/jwt-helper.ts`. Signing and verification run in **Cypress Node tasks** (not in the browser).

### `generateTestJWT(payload, expiresIn)`

Generates a valid JWT via `cy.task('signJWT')` (uses `TEST_JWT_PRIVATE_KEY`):

```typescript
generateTestJWT({ uid: 'test-123', name: 'Test User' }).then((token) => {
  // Use token in tests
})
```

### `setAuthenticatedSession(user, expiresIn)`

Sets up an authenticated session with a valid JWT:

```typescript
setAuthenticatedSession({ uid: 'test-123', name: 'Test User' })
cy.visit('/')
// User is now authenticated
```

### `generateExpiredTestJWT(payload)`

Generates an expired JWT for error handling:

```typescript
generateExpiredTestJWT({ uid: 'test-123', name: 'Test User' }).then((token) => {
  // Use expired token
})
```

### `verifyTestJWT(token)`

Verifies a JWT via `cy.task('verifyJWT')` (uses `NEXT_PUBLIC_JWT_PUBLIC_KEY`). Returns decoded payload or `null`.

### `loadJWTKeys()`

Returns `cy.fixture('jwt-keys')` (public key only). Use when you need the public key in spec context.

## Test Behavior

### When JWT is configured

- `NEXT_PUBLIC_JWT_PUBLIC_KEY` is set → `jwtPublicKeyConfigured` is true.
- `TEST_JWT_PRIVATE_KEY` is set → tasks can sign tokens.
- Authenticated-user tests run; helpers generate valid JWTs.

### When JWT is NOT configured

- Tests that require valid JWTs skip (check `Cypress.env('jwtPublicKeyConfigured')`).
- Error-handling tests (invalid tokens, missing cookies, etc.) still run.
- Unauthenticated-user tests still run.

## Security Notes

- **`jwt-keys.json`**: Contains **only** the public key. Safe to commit.
- **Private key**: Supplied via `TEST_JWT_PRIVATE_KEY` only. Never commit, never add to fixtures.
- **Rotation**: If the previous test key pair was committed, rotate both keys and update env/secrets (see above).

## Generating New Test Keys

```bash
node -e "
const crypto = require('crypto');
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
console.log('PUBLIC_KEY:', publicKey);
console.log('PRIVATE_KEY:', privateKey);
"
```

Then:

1. Update `jwt-keys.json` with the **public** key only.
2. Set `NEXT_PUBLIC_JWT_PUBLIC_KEY` (e.g. in `.env`) to that public key.
3. Set `TEST_JWT_PRIVATE_KEY` to the private key (env or CI secret). **Never commit it.**
4. In CI, update `NEXT_PUBLIC_JWT_PUBLIC_KEY` and `TEST_JWT_PRIVATE_KEY` secrets.

## Troubleshooting

### Tests are skipped

**Cause**: `NEXT_PUBLIC_JWT_PUBLIC_KEY` is not set.  
**Solution**: Set it (and `TEST_JWT_PRIVATE_KEY` for signing) as above.

### JWT verification fails / "TEST_JWT_PRIVATE_KEY is required"

**Cause**: Missing or mismatched keys.  
**Solution**: Ensure `NEXT_PUBLIC_JWT_PUBLIC_KEY` and `TEST_JWT_PRIVATE_KEY` are a matching pair.

### Component tests can't find jwt-helper

**Cause**: Import path.  
**Solution**: Use `../../../cypress/support/jwt-helper` from component test files.

## Additional Resources

- [JWT.io](https://jwt.io/) – JWT debugger and information
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [RSA Key Generation](https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypairsync_type_options)
