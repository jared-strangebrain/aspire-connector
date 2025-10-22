# Aspire Connector - Token-Based Authentication Setup

**Date**: October 20, 2025  
**Deployment ID**: `1291c2f5-a23e-4b62-903e-9b62802321c8`  
**Version**: 1.0  
**Status**: ✅ Deployed (Building)  
**Authentication Type**: Token-Based (Bearer Authentication)

---

## 🎯 Overview

The Aspire connector uses **Token-Based Authentication** with Tray's automatic token management. This implementation follows the [Aspire API Authentication documentation](https://guide.youraspire.com/apidocs/authentication-authorization-1).

### Key Facts

- ✅ **Token Validity**: 24 hours
- ✅ **Automatic Refresh**: Managed by Tray
- ✅ **Multi-Environment**: Demo, Sandbox, Production
- ✅ **Authentication Method**: Bearer Token (JWT)

---

## 🔐 Authentication Flow

### How It Works

1. **User provides credentials** in Tray authentication form:
   - Client ID
   - Client Secret
   - Environment (demo/sandbox/production)

2. **Connector calls** `POST {base_url}/Authorization`
   ```json
   {
     "ClientId": "your-client-id",
     "Secret": "your-client-secret"
   }
   ```

3. **Aspire API responds** with token:
   ```json
   {
     "Token": "eyJhbGc...",
     "RefreshToken": "eyJhbGc..."
   }
   ```

4. **Connector stores** token in Tray auth context:
   ```json
   {
     "access_token": "eyJhbGc...",
     "refresh_token": "eyJhbGc...",
     "environment": "demo",
     "base_url": "https://clouddemo-api.youraspire.com"
   }
   ```

5. **Tray manages** token lifecycle:
   - Automatically refreshes when expired
   - Stores securely in auth context
   - Injects into all operation requests

---

## 📚 API Documentation Reference

According to the [Aspire API documentation](https://guide.youraspire.com/apidocs/authentication-authorization-1):

### Authentication Endpoint

**POST** `/Authorization`

**Request Body:**
```json
{
  "ClientId": "string (required)",
  "Secret": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "Token": "string (JWT bearer token)",
  "RefreshToken": "string (optional)"
}
```

### Token Characteristics

- **Valid For**: 24 hours from issuance
- **Type**: Bearer Token (JWT)
- **Usage**: Include in `Authorization: Bearer <token>` header
- **Expiration**: Fixed 24-hour period (not extended by usage)

### Refresh Endpoint

**POST** `/Authorization/RefreshToken`

**Request Body:**
```json
{
  "RefreshToken": "string"
}
```

**Response:**
```json
{
  "Token": "string (new access token)",
  "RefreshToken": "string (new refresh token)"
}
```

---

## 🏗️ Technical Implementation

### Authentication Types

```typescript
// User auth context (stored after #token_request)
export type AspireUserAuth = {
  access_token: string;           // Bearer token (24h validity)
  refresh_token?: string;         // Refresh token
  environment?: string;           // demo/sandbox/production
  base_url?: string;             // Environment-specific URL
};

// App auth (from authentication form)
export type AspireAppAuth = {
  client_id: string;             // Aspire API Client ID
  client_secret: string;         // Aspire API Client Secret
  environment: string;           // Selected environment
};

// Connector auth type
export type AspireConnectorAuth = 
  Oauth2ClientCredentialsOperationHandlerAuth<
    AspireUserAuth, 
    AspireAppAuth
  >;
```

### #token_request Operation

Located in: `src/#token_request/`

**Input** (`input.ts`):
```typescript
export type TokenRequestInput = {
  auth_form_input: {
    client_id: string;
    client_secret: string;
    environment: "production" | "sandbox" | "demo";
  };
};
```

**Output** (`output.ts`):
```typescript
export type TokenRequestOutput = {
  status_code: number;
  body: {
    access_token: string;
    refresh_token?: string;
    environment?: string;
    base_url?: string;
  };
  headers: HttpHeaders;
};
```

**Handler** (`handler.ts`):
```typescript
// Uses composite handler to dynamically select environment URL
handler.usingComposite(async (ctx, input, invoke) => {
  const baseUrl = getBaseUrlForEnvironment(input.auth_form_input.environment);
  const url = `${baseUrl}/Authorization`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ClientId: input.auth_form_input.client_id,
      Secret: input.auth_form_input.client_secret
    })
  });
  
  // Returns: { status_code, headers, body: { access_token, ... } }
});
```

---

## 🌍 Environment URLs

The connector supports three Aspire environments:

| Environment | Base URL |
|------------|----------|
| **Demo** | `https://clouddemo-api.youraspire.com` |
| **Sandbox** | `https://cloudsandbox-api.youraspire.com` |
| **Production** | `https://cloud-api.youraspire.com` |

**Implementation:**
```typescript
export function getBaseUrlForEnvironment(
  env: "production" | "sandbox" | "demo"
): string {
  switch (env) {
    case "production":
      return "https://cloud-api.youraspire.com";
    case "sandbox":
      return "https://cloudsandbox-api.youraspire.com";
    case "demo":
      return "https://clouddemo-api.youraspire.com";
    default:
      return "https://clouddemo-api.youraspire.com";
  }
}
```

---

## 👥 User Experience in Tray

### 1. Add Connector

1. Open Tray workflow builder
2. Search for "Aspire" connector
3. Drag into workflow

### 2. Configure Authentication

Click "New Authentication" to see:

```
┌──────────────────────────────────────┐
│ Aspire Authentication                │
├──────────────────────────────────────┤
│ Client ID *                          │
│ [________________________________]   │
│ Your Aspire API Client ID            │
│ (created in Aspire Admin > API)      │
│                                      │
│ Client Secret *                      │
│ [________________________________]   │
│ Your Aspire API Client Secret        │
│                                      │
│ Environment *                        │
│ [Demo                       ▼]       │
│  • Demo                              │
│  • Sandbox                           │
│  • Production                        │
│                                      │
│     [Cancel]  [Connect]              │
└──────────────────────────────────────┘
```

### 3. Obtain Credentials

According to [Aspire documentation](https://guide.youraspire.com/apidocs/authentication-authorization-1), credentials are created in Aspire:

1. Log in to Aspire desktop application (requires Admin permissions)
2. Navigate to: **Administration > Application > API > New**
3. Create description for the API user
4. **Copy and save** Client ID and Secret (cannot be retrieved later)
5. Select endpoint scopes (permissions)
6. Click **Save**

⚠️ **Important**: If you lose your credentials, you must regenerate new ones and update any integrations.

### 4. Use Operations

Once authenticated:
- ✅ All 159 operations are available
- ✅ Token automatically included in requests
- ✅ Tray manages token refresh (24-hour lifecycle)
- ✅ Environment-specific URLs handled automatically

---

## 🔄 Token Lifecycle

### Token Management by Tray

Tray's token-based authentication automatically:

1. **Stores** the access token securely
2. **Injects** token into operation requests as Bearer header
3. **Monitors** token expiration
4. **Refreshes** token before expiration (if refresh token available)
5. **Re-authenticates** if refresh fails (prompts user)

### Manual Token Operations (Optional)

While Tray manages tokens automatically, two legacy operations remain available:

1. **`authorization_authenticate_api_request`**
   - Direct auth call (not needed with #token_request)
   - Returns Token and RefreshToken
   - Endpoint: `POST /Authorization`

2. **`authorization_refresh_token`**
   - Manual token refresh (not needed with Tray auto-refresh)
   - Endpoint: `POST /Authorization/RefreshToken`

---

## 📦 Deployment Information

### Latest Deployment

```bash
# Deployment Command
tray-cdk deployment create --us

# Deployment Details
Connector: convex-aspire-connector
Version: 1.0
Deployment ID: 1291c2f5-a23e-4b62-903e-9b62802321c8
Region: US
Status: Building
Operations: 159 total
```

### Check Deployment Status

```bash
# Set your API token
$env:TRAY_API_TOKEN = "e3f519679d444db88549fdffbb5a212e12e8cddb49c84c6bbe7aa2d32f63b818"

# Check deployment status
tray-cdk deployment get convex-aspire-connector 1.0 1291c2f5-a23e-4b62-903e-9b62802321c8 --us
```

---

## 🔧 Helper Functions

The connector provides helper functions in `AspireConnectorAuth.ts`:

### Get Access Token

```typescript
import { getAccessToken } from '../AspireConnectorAuth';

// In an operation handler
const token = getAccessToken(ctx);
// Returns: "eyJhbGc..."
```

### Get Base URL

```typescript
import { getBaseUrl } from '../AspireConnectorAuth';

// In an operation handler
const baseUrl = getBaseUrl(ctx);
// Returns: "https://clouddemo-api.youraspire.com" (based on auth)
```

### Get Environment URL

```typescript
import { getBaseUrlForEnvironment } from '../AspireConnectorAuth';

// Get URL for specific environment
const url = getBaseUrlForEnvironment("production");
// Returns: "https://cloud-api.youraspire.com"
```

---

## 📊 Operations Summary

The connector includes **159 operations** for:

### Core Entities
- **Properties** (18 operations)
- **Contacts** (12 operations)
- **Opportunities** (14 operations)
- **Work Tickets** (12 operations)
- **Invoices** (4 operations)
- **Equipment** (12 operations)
- **Users** (3 operations)

### Special Operations
- `#token_request` - Token-based authentication
- `authorization_authenticate_api_request` - Direct auth (legacy)
- `authorization_refresh_token` - Manual refresh (legacy)

### Additional Categories
- Payments, Receipts, Tax Entities
- Activities, Tasks, Issues
- Branches, Divisions, Regions
- Inventory, Catalog Items
- And 100+ more...

---

## ✅ Authentication Validation

### Compliance Checklist

- ✅ Uses `#token_request` operation
- ✅ Returns `status_code`, `headers`, and `body`
- ✅ Body contains `access_token` (required)
- ✅ Follows Tray token-based auth pattern
- ✅ Matches Aspire API documentation
- ✅ Supports all three environments
- ✅ Includes refresh token support
- ✅ Stores environment context

### Security Best Practices

- ✅ Credentials only used during authentication
- ✅ Tokens stored in secure Tray auth context
- ✅ Automatic token expiration handling
- ✅ Environment-specific URLs
- ✅ No credentials in user context after auth
- ✅ Bearer token in Authorization header

---

## 🐛 Troubleshooting

### Authentication Fails (401 or 404)

**Problem**: Authentication returns error  
**Solutions**:
1. Verify Client ID and Secret are correct
2. Ensure credentials are created in Aspire Admin > API
3. Check that environment matches credentials
4. Confirm API scopes are configured in Aspire
5. Verify environment URLs are accessible

**Test manually**:
```bash
curl -X POST https://clouddemo-api.youraspire.com/Authorization \
  -H "Content-Type: application/json" \
  -d '{"ClientId":"your-id","Secret":"your-secret"}'
```

### Token Expired

**Problem**: Operations fail after 24 hours  
**Solution**: Tray should auto-refresh. If not:
1. Check that refresh_token was returned during auth
2. Re-authenticate in Tray
3. Verify Aspire API is accessible

### Wrong Environment

**Problem**: Data not found or incorrect  
**Solutions**:
1. Verify environment selection during authentication
2. Ensure credentials match selected environment
3. Check `base_url` in auth context
4. Confirm Aspire environment is active

### Missing Credentials

**Problem**: Lost Client ID or Secret  
**Solution**: According to Aspire docs:
1. Go to Aspire: **Administration > Application > API**
2. Find the existing API entry
3. Delete or regenerate credentials
4. Create new credentials
5. Update Tray authentication

---

## 🎉 Testing

### Quick Test in Tray

1. Add Aspire connector to workflow
2. Configure authentication (demo environment recommended)
3. Add `properties_get` operation
4. Run the workflow
5. Verify properties are returned

### Test with cURL

```bash
# Get token
TOKEN=$(curl -X POST https://clouddemo-api.youraspire.com/Authorization \
  -H "Content-Type: application/json" \
  -d '{"ClientId":"YOUR_ID","Secret":"YOUR_SECRET"}' \
  | jq -r '.Token')

# Use token
curl https://clouddemo-api.youraspire.com/Properties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

---

## 📝 Key Differences from OAuth2

Although we use `Oauth2ClientCredentialsOperationHandlerAuth` type (Tray's pattern for token-based auth), this is **NOT OAuth2**:

| Aspect | OAuth2 | Aspire Token Auth |
|--------|--------|------------------|
| **Standard** | OAuth 2.0 RFC 6749 | Custom Bearer Token |
| **Grant Type** | `client_credentials` | N/A (custom) |
| **Token Field** | `access_token` | `Token` (mapped to `access_token`) |
| **Refresh** | `refresh_token` | `RefreshToken` (optional) |
| **Endpoint** | `/oauth/token` | `/Authorization` |
| **Body Format** | Form URL encoded or JSON | JSON only |
| **Token Type** | Usually `Bearer` | Bearer (implicit) |

**Why we use the OAuth2 type:**
- Tray's token-based auth follows OAuth2 patterns
- Enables automatic token management
- Provides refresh token support
- Standard pattern for all token-based connectors

---

## 🚀 Next Steps

1. **Wait for Deployment** (~5-10 minutes)
   ```bash
   tray-cdk deployment get convex-aspire-connector 1.0 1291c2f5-a23e-4b62-903e-9b62802321c8 --us
   ```

2. **Test Authentication** in Tray
   - Create test workflow
   - Add Aspire connector
   - Configure auth with demo credentials
   - Test `properties_get` operation

3. **Share with Team**
   ```bash
   tray-cdk permissions add convex-aspire-connector 1.0 \
     --email="colleague@example.com"
   ```

4. **Monitor Usage**
   - Check connector in Tray UI
   - Monitor authentication success
   - Validate token refresh works
   - Test across all environments

---

## 📖 References

### Aspire API Documentation
- **Authentication Guide**: https://guide.youraspire.com/apidocs/authentication-authorization-1
- **Demo API**: https://clouddemo-api.youraspire.com
- **Sandbox API**: https://cloudsandbox-api.youraspire.com
- **Production API**: https://cloud-api.youraspire.com

### Tray CDK Documentation
- **Token Request Pattern**: See `token-request-example` in Tray CDK Examples
- **Auth Type**: `Oauth2ClientCredentialsOperationHandlerAuth<UserAuth, AppAuth>`
- **Handler Pattern**: Composite with fetch for dynamic URLs

---

**Last Updated**: October 20, 2025  
**Deployment**: v1.0 (ID: 1291c2f5-a23e-4b62-903e-9b62802321c8)  
**Maintained By**: Aspire Connector Team


