# JWT Authentication Testing Documentation

## Overview

This document describes the JWT (JSON Web Token) authentication testing implementation for the Akita project. The tests ensure that JWT authentication is properly validated and handled across the application.

## JWT Implementation

The JWT authentication is implemented in `src/utils/session.ts`. This utility:

1. Retrieves the JWT token from the `_datacite` cookie
2. Verifies the token using the RSA public key (`NEXT_PUBLIC_JWT_PUBLIC_KEY`)
3. Uses RS256 algorithm for verification
4. Returns user information if the token is valid, otherwise returns null

### Components Using JWT

The following components use the `session()` function for authentication:

- `src/components/Header/NavRight.tsx` - Displays signed-in/signed-out content
- `src/components/Header/Dropdown.tsx` - User dropdown menu
- `src/components/Header/ClientButtons.tsx` - Client-specific buttons
- `src/components/Claim/Claim.tsx` - Claiming works to ORCID
- `src/components/DiscoverWorksAlert/DiscoverWorksAlert.tsx` - Work discovery alerts

## Test Coverage

### E2E Tests (`cypress/e2e/jwtAuth.test.ts`)

End-to-end tests that validate JWT authentication flows in the browser:

#### Unauthenticated User Tests
- Verifies sign-in link is visible when not authenticated
- Confirms user menu is not shown without authentication

#### Authenticated User Tests
- Tests for authenticated users with valid JWT tokens
- Uses test fixtures from `cypress/fixtures/jwt-keys.json` to generate valid tokens
- Tests conditionally skip if `NEXT_PUBLIC_JWT_PUBLIC_KEY` is not configured
- Validates user menu display and authentication state

#### Invalid JWT Token Tests
- **Invalid token format**: Ensures app handles malformed tokens gracefully
- **Malformed cookie**: Tests behavior with corrupted cookie data
- **Missing access_token**: Verifies handling when token is absent from cookie structure

#### JWT Verification Error Handling Tests
- **Expired token**: Ensures app doesn't crash with expired tokens
- **Corrupted token**: Validates graceful handling of corrupted token data

#### Session Persistence Tests
- **Cross-page navigation**: Verifies session persists across page changes
- **Missing NEXT_PUBLIC_JWT_PUBLIC_KEY**: Tests behavior when environment variable is not configured

### Component Tests (`src/components/Header/NavRight.test.tsx`)

Component-level tests for the NavRight component that uses JWT authentication:

#### Authentication State Tests
- **No JWT token**: Shows signed-out content when no token is present
- **NEXT_PUBLIC_JWT_PUBLIC_KEY not configured**: Handles missing environment variable
- **Missing access_token**: Handles incomplete cookie structure
- **Invalid JWT token**: Shows signed-out content for invalid tokens
- **Malformed cookie data**: Gracefully handles corrupted cookie data
- **Valid JWT token**: Shows signed-in content when valid token is present (requires test key setup)

## Running the Tests

### Running All Tests
```bash
yarn cy:run
```

### Running Specific Test Files
```bash
# E2E JWT tests
yarn cy:run --spec "cypress/e2e/jwtAuth.test.ts"

# Component tests
yarn cy:run --component --spec "src/components/Header/NavRight.test.tsx"
```

### Interactive Test Runner
```bash
yarn cy:open
```

## Test Environment Setup

### For Local Testing

1. Set the JWT public key in `.env` file:
```bash
NEXT_PUBLIC_JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
```

2. For testing with valid JWT tokens, use the test keys from `cypress/fixtures/jwt-keys.json`:
```bash
# Copy the test public key to your .env file
# See cypress/fixtures/JWT_TEST_SETUP.md for detailed instructions
```

3. The test suite provides helper functions to generate valid JWT tokens:
```typescript
import { setAuthenticatedSession } from '../support/jwt-helper'

// Set up authenticated session in tests
setAuthenticatedSession({ uid: 'test-123', name: 'Test User' })
```

### For CI/CD

Configure the following in your CI/CD environment:
- `NEXT_PUBLIC_JWT_PUBLIC_KEY`: The test RSA public key for JWT verification (optional)
  - Use the public key from `cypress/fixtures/jwt-keys.json` for tests
  - **Note**: This is a test-only key, safe to use in CI/CD
- `CYPRESS_USER_COOKIE`: A real user cookie for integration tests (already configured)

**Important**: The test keys in `cypress/fixtures/jwt-keys.json` are for testing only and are different from production keys.

For complete setup instructions, see: `cypress/fixtures/JWT_TEST_SETUP.md`

## Security Considerations

The tests validate several security aspects:

1. **Token Verification**: Ensures only properly signed tokens are accepted
2. **Expired Token Handling**: Confirms expired tokens are rejected
3. **Malformed Data**: Tests graceful degradation with corrupted data
4. **Missing Configuration**: Validates safe behavior without NEXT_PUBLIC_JWT_PUBLIC_KEY

## Future Improvements

1. **Add more authenticated flow tests**: Expand coverage to other components using `session()`
2. **Token refresh testing**: If token refresh is implemented, add tests for that flow
3. **Performance tests**: Validate JWT verification doesn't impact page load times
4. **Security scanning**: Automated security checks for JWT implementation

## References

- JWT Implementation: `src/utils/session.ts`
- JWT Public Key: Environment variable `NEXT_PUBLIC_JWT_PUBLIC_KEY`
- Cookie Name: `_datacite`
- Algorithm: RS256 (RSA with SHA-256)
