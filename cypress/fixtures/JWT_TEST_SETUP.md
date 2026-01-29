# JWT Test Fixtures Setup Guide

This guide explains how to configure JWT test fixtures for local development and CI/CD environments.

## Overview

The JWT authentication tests use test RSA key pairs stored in `cypress/fixtures/jwt-keys.json`. This allows tests to generate valid JWT tokens that can be verified by the application when the test public key is configured.

## Test Key Files

### `cypress/fixtures/jwt-keys.json`
Contains a test RSA key pair (2048-bit) used **only for testing**:
- `publicKey`: Used by the app to verify JWT tokens in tests
- `privateKey`: Used by test helpers to sign JWT tokens

**⚠️ IMPORTANT**: These keys are **NOT** production keys. They are test-only keys committed to the repository for testing purposes.

## Local Development Setup

### 1. Configure Environment Variables

Create or update your `.env` file with the test public key:

```bash
# For local JWT testing, use the public key from cypress/fixtures/jwt-keys.json
NEXT_PUBLIC_JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj760PNWDk5AWonv/G63Q
08b1XAqUdCVttXLxr6AEXcJeYWXwDPRZAGKBpMTVcu0SIl7I958ebVx2A1I4dNAZ
6xCku2bgOzoOiFJqNF1EzaxhHbk2gBQt6q92X5RaPFZh3UUkmvISACoiDH+Mja2W
kW3o8o4iRWaRUvo0sRpbv+O7PSx+3FBABGZSSz1wV7rz7YMjDUjHCF2gsS3XKeA3
ZzmwYlLmpxM1kD6h/XloO9OHgH2h2IlOyhm7VkhRYYc1auj5zJYKzKkWfCvbozF+
rufZNFqMGjlUzmH5KYr4CcnuzYFTN0RxUJrCs1UDh/KbI2wZx3ZXXt4zp4QQNAO0
RQIDAQAB
-----END PUBLIC KEY-----"
```

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

Add the following secret to your GitHub repository:

**`NEXT_PUBLIC_JWT_PUBLIC_KEY`** (Optional for JWT tests)
```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj760PNWDk5AWonv/G63Q
08b1XAqUdCVttXLxr6AEXcJeYWXwDPRZAGKBpMTVcu0SIl7I958ebVx2A1I4dNAZ
6xCku2bgOzoOiFJqNF1EzaxhHbk2gBQt6q92X5RaPFZh3UUkmvISACoiDH+Mja2W
kW3o8o4iRWaRUvo0sRpbv+O7PSx+3FBABGZSSz1wV7rz7YMjDUjHCF2gsS3XKeA3
ZzmwYlLmpxM1kD6h/XloO9OHgH2h2IlOyhm7VkhRYYc1auj5zJYKzKkWfCvbozF+
rufZNFqMGjlUzmH5KYr4CcnuzYFTN0RxUJrCs1UDh/KbI2wZx3ZXXt4zp4QQNAO0
RQIDAQAB
-----END PUBLIC KEY-----
```

### 2. Workflow Configuration

The workflow in `.github/workflows/cypress_tests.yml` is already configured to:
- Accept `NEXT_PUBLIC_JWT_PUBLIC_KEY` as an optional secret
- Pass it to the test environment
- Map `CYPRESS_USER_COOKIE` to `Cypress.env('userCookie')`

### 3. Existing Secrets

The CI already has these secrets configured:
- `CYPRESS_USER_COOKIE`: Contains a real user session cookie for integration tests
- `CYPRESS_RECORD_KEY`: For Cypress Dashboard recording
- Other API URLs and configurations

## JWT Test Helpers

The test suite provides helper functions in `cypress/support/jwt-helper.ts`:

### `generateTestJWT(payload, expiresIn)`
Generate a valid JWT token for testing:
```typescript
generateTestJWT({ uid: 'test-123', name: 'Test User' }).then((token) => {
  // Use token in tests
})
```

### `setAuthenticatedSession(user, expiresIn)`
Set up an authenticated session with a valid JWT:
```typescript
setAuthenticatedSession({ uid: 'test-123', name: 'Test User' })
cy.visit('/')
// User is now authenticated
```

### `generateExpiredTestJWT(payload)`
Generate an expired JWT token for testing error handling:
```typescript
generateExpiredTestJWT({ uid: 'test-123', name: 'Test User' }).then((token) => {
  // Use expired token to test error handling
})
```

## Test Behavior

### When JWT Key is Configured
- Tests can generate valid JWT tokens using the test private key
- The app verifies tokens using the test public key
- All JWT authentication flows work end-to-end

### When JWT Key is NOT Configured
- Tests that require valid JWT tokens will skip gracefully
- Error handling tests still run (invalid tokens, missing cookies, etc.)
- Unauthenticated user tests still run

## Security Notes

### Test Keys vs Production Keys

**Test Keys** (in `cypress/fixtures/jwt-keys.json`):
- ✅ Safe to commit to repository
- ✅ Used ONLY in test environments
- ✅ Different from production keys
- ✅ No security risk if exposed

**Production Keys**:
- ❌ NEVER commit to repository
- ❌ Store only in secure secret management (GitHub Secrets, environment variables)
- ❌ Different from test keys
- ❌ Required for production authentication

### Production vs Test Environment

The app automatically uses:
- **Test public key** when `NEXT_PUBLIC_JWT_PUBLIC_KEY` is set to the test key
- **Production public key** when configured with the actual production key
- **No JWT verification** when `NEXT_PUBLIC_JWT_PUBLIC_KEY` is not set

## Generating New Test Keys (Optional)

If you need to regenerate the test keys:

```bash
# Generate new RSA key pair
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

Then update:
1. `cypress/fixtures/jwt-keys.json` with both keys
2. `.env` with the new public key
3. GitHub secret `NEXT_PUBLIC_JWT_PUBLIC_KEY` with the new public key

## Troubleshooting

### Tests are skipped
**Cause**: `NEXT_PUBLIC_JWT_PUBLIC_KEY` is not set
**Solution**: Set the environment variable with the test public key

### JWT verification fails
**Cause**: Mismatch between the private key used to sign and the public key used to verify
**Solution**: Ensure both keys in `jwt-keys.json` match, and `NEXT_PUBLIC_JWT_PUBLIC_KEY` matches the public key

### Component tests can't find jwt-helper
**Cause**: Import path issue
**Solution**: Use relative path `../../../cypress/support/jwt-helper` from component test files

## Additional Resources

- [JWT.io](https://jwt.io/) - JWT debugger and information
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [RSA Key Generation](https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypairsync_type_options)
