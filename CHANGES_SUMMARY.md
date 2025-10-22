# Changes Summary - Token Based Authentication Fix

## Date
October 22, 2025

## Overview
Fixed the Aspire connector to work with Tray's Token Based authentication instead of OAuth 2.0 Client Credentials.

## Critical Changes Made

### 1. Authentication Type (`src/AspireConnectorAuth.ts`)
**Changed from:**
```typescript
import type { Oauth2ClientCredentialsOperationHandlerAuth } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
export type AspireConnectorAuth = Oauth2ClientCredentialsOperationHandlerAuth<
  AspireUserAuth,
  AspireAppAuth
>;
```

**Changed to:**
```typescript
import type { TokenOperationHandlerAuth } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
export type AspireConnectorAuth = TokenOperationHandlerAuth<
  AspireUserAuth,
  AspireAppAuth
>;
```

### 2. Token Request Input Structure (`src/#token_request/input.ts`)
**Changed from:** Wrapped in `auth_form_input` object
```typescript
export type TokenRequestInput = {
  auth_form_input: {
    client_id: string;
    client_secret: string;
    environment: "production" | "sandbox" | "demo";
  };
};
```

**Changed to:** Direct parameters (Token Based auth requirement)
```typescript
export type TokenRequestInput = {
  client_id: string;
  client_secret: string;
  environment: "production" | "sandbox" | "demo";
};
```

### 3. Token Request Handler (`src/#token_request/handler.ts`)
**Changed from:** Accessing `input.auth_form_input.*`
```typescript
const rawEnv = input.auth_form_input.environment;
const clientId = input.auth_form_input.client_id;
const clientSecret = input.auth_form_input.client_secret;
```

**Changed to:** Accessing `input.*` directly
```typescript
const rawEnv = input.environment;
const clientId = input.client_id;
const clientSecret = input.client_secret;
```

### 4. Token Request Output (`src/#token_request/output.ts`)
**Changed from:** Wrapped response structure
```typescript
export type TokenRequestOutput = {
  status_code: number;
  body: {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
  };
  headers: HttpHeaders;
};
```

**Changed to:** Direct token data (Token Based auth requirement)
```typescript
export type TokenRequestOutput = {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
};
```

### 5. Token Request Handler Return (`src/#token_request/handler.ts`)
**Changed from:** Wrapped response
```typescript
return OperationHandlerResult.success({
  status_code: authResponse.status,
  headers: Object.fromEntries(authResponse.headers.entries()),
  body: {
    access_token: data.Token,
    refresh_token: data.RefreshToken,
    token_type: 'Bearer',
    expires_in: 86400
  }
});
```

**Changed to:** Direct token data
```typescript
return OperationHandlerResult.success({
  access_token: data.Token,
  refresh_token: data.RefreshToken,
  token_type: 'Bearer',
  expires_in: 86400
});
```

### 6. Token Refresh Output (`src/#token_refresh/output.ts`)
**Changed from:** Wrapped response structure
```typescript
export type TokenRefreshOutput = {
  status_code: number;
  body: {
    access_token: string;
    refresh_token?: string;
  };
  headers: HttpHeaders;
};
```

**Changed to:** Direct token data
```typescript
export type TokenRefreshOutput = {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
};
```

### 7. Token Refresh Handler (`src/#token_refresh/handler.ts`)
Updated both refresh token and re-authentication paths to return direct token data instead of wrapped response.

### 8. Service Configuration (`connector.json`)
**Changed service name to:**
```json
{
  "service": {
    "name": "NwO5PI9Po9o4D1_aspire_token",
    "version": "1.0"
  }
}
```

### 9. Documentation Updates
- Updated comments in `src/#token_request/handler.ts` to reflect Token Based authentication
- Updated `AUTHENTICATION_FIX_SUMMARY.md` with authentication type fix details
- Created `TOKEN_BASED_SERVICE_SETUP.md` with detailed setup instructions

### 10. Test Updates
- Updated `src/#token_request/handler.test.ts` to match new input/output structure
- Tests now expect direct token data instead of wrapped response

## Files Modified
1. `src/AspireConnectorAuth.ts` - Changed authentication type
2. `src/#token_request/input.ts` - Simplified input structure
3. `src/#token_request/output.ts` - Simplified output structure
4. `src/#token_request/handler.ts` - Updated to use new input/output format
5. `src/#token_request/handler.test.ts` - Updated test expectations
6. `src/#token_refresh/output.ts` - Simplified output structure
7. `src/#token_refresh/handler.ts` - Updated to return direct token data
8. `connector.json` - Updated service name
9. `AUTHENTICATION_FIX_SUMMARY.md` - Updated documentation
10. `TOKEN_BASED_SERVICE_SETUP.md` - Created new setup guide

## Why These Changes Were Necessary

Tray.io has two different authentication modes for custom connectors:
1. **OAuth 2.0 Client Credentials** - Uses `Oauth2ClientCredentialsOperationHandlerAuth`
2. **Token Based** - Uses `TokenOperationHandlerAuth`

The connector was originally set up for OAuth 2.0, but the Tray service was configured as Token Based. This mismatch caused Tray to never invoke the `#token_request` operation, resulting in 401 errors.

Token Based authentication in Tray has specific requirements:
- Input parameters must be passed directly to the operation (not wrapped in `auth_form_input`)
- Output must return token data directly (not wrapped in `status_code`, `body`, `headers`)
- Must use `TokenOperationHandlerAuth` type

## Testing
After these changes, the connector should:
1. Allow Tray to call the `#token_request` operation when authentication is needed
2. Properly receive and store the access_token and refresh_token
3. Automatically inject the Bearer token into all API requests
4. Use the correct environment-specific base URL for all API calls

## Next Steps
1. Test the `properties_get` operation in Tray
2. Verify that `[TokenRequest]` debug logs appear in execution logs
3. Confirm that API calls succeed with proper authentication

