# Aspire Connector - OAuth2 Client Credentials Setup

**Date**: October 20, 2025  
**Deployment ID**: `34ed0b2f-128c-4638-a1b3-dc97f37ff3a1`  
**Version**: 1.0  
**Status**: ✅ Deployed (Building)

---

## 🎯 Overview

The Aspire connector now uses **OAuth2 Client Credentials** authentication flow with Tray's native OAuth2 support. This provides a streamlined authentication experience for users.

---

## 🔐 Authentication Flow

### OAuth2 Client Credentials with Environment Selection

The connector implements OAuth2 Client Credentials with an additional **environment** parameter to support Aspire's multi-environment architecture.

#### Authentication Parameters

When users authenticate in Tray, they'll see a form with these fields:

1. **Client ID** *(required)*
   - Your Aspire API Client ID
   
2. **Client Secret** *(required)*
   - Your Aspire API Client Secret
   
3. **Environment** *(required)*
   - **Demo**: `https://clouddemo-api.youraspire.com`
   - **Sandbox**: `https://cloudsandbox-api.youraspire.com`
   - **Production**: `https://cloud-api.youraspire.com`

---

## 🏗️ Technical Implementation

### #token_request Operation

The `#token_request` operation is the core of the OAuth2 flow:

**Endpoint**: `POST {base_url}/Authorization`

**Request Body**:
```json
{
  "ClientId": "your-client-id",
  "Secret": "your-client-secret"
}
```

**Response** (mapped to OAuth2 standard):
```json
{
  "status_code": 200,
  "body": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 86400,
    "environment": "demo",
    "base_url": "https://clouddemo-api.youraspire.com"
  },
  "headers": {}
}
```

### Authentication Context

After successful authentication, the auth context (`ctx.auth.user`) contains:

```typescript
{
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  expires_at?: string;
  environment: "production" | "sandbox" | "demo";
  base_url: string;
}
```

---

## 📝 Key Changes from Previous Setup

### Before (Custom Auth)
```typescript
export type AspireUserAuth = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  environment: "production" | "sandbox" | "demo";
  base_url?: string;
  client_id?: string;        // ❌ Stored in user context
  client_secret?: string;    // ❌ Stored in user context
};
```

### After (OAuth2 Client Credentials)
```typescript
export type AspireUserAuth = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  expires_in?: number;
  environment: "production" | "sandbox" | "demo";
  base_url?: string;
  // ✅ client_id and client_secret are only used during #token_request
  // They are NOT stored in the user context for security
};

export type AspireAppAuth = Record<string, never>;  // Empty for OAuth2 Client Credentials

export type AspireConnectorAuth = Oauth2ClientCredentialsOperationHandlerAuth<
  AspireUserAuth,
  AspireAppAuth
>;
```

---

## 🔄 Token Refresh

The connector includes automatic token refresh functionality:

**Endpoint**: `POST {base_url}/Authorization/RefreshToken`

**Request Body**:
```json
{
  "RefreshToken": "your-refresh-token"
}
```

**Response**:
```json
{
  "Token": "new-access-token",
  "RefreshToken": "new-refresh-token"
}
```

The `ensureBearer()` helper function in `AspireConnectorAuth.ts` automatically refreshes tokens when they're close to expiry (within 1 hour).

---

## 🚀 Deployment Information

### Latest Deployment

```bash
# Deployment Command
tray-cdk deployment create --us

# Deployment Details
Connector: convex-aspire-connector
Version: 1.0
Deployment ID: 34ed0b2f-128c-4638-a1b3-dc97f37ff3a1
Region: US
Status: Building
```

### Check Deployment Status

```bash
# Set your API token
$env:TRAY_API_TOKEN = "your-token-here"

# Check deployment status
tray-cdk deployment get convex-aspire-connector 1.0 34ed0b2f-128c-4638-a1b3-dc97f37ff3a1 --us
```

---

## 👥 User Experience in Tray

### 1. Add Connector to Workflow

- Open Tray workflow builder
- Search for "Aspire" connector
- Drag connector into workflow

### 2. Authenticate

Click "New Authentication" to see the auth form:

```
┌──────────────────────────────────────┐
│ Aspire OAuth2 Authentication         │
├──────────────────────────────────────┤
│ Client ID *                          │
│ [________________________________]   │
│ Your Aspire API Client ID            │
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

### 3. Use Connector

Once authenticated, users can:
- Access all 159 operations
- Tokens automatically refresh
- Environment-specific base URLs are used automatically

---

## 📊 Operations Summary

The connector includes **159 operations** across these categories:

### Core Entities
- **Properties**: Create, Read, Update (+ custom fields, contacts, availabilities)
- **Contacts**: Create, Read, Update (+ custom fields, types)
- **Opportunities**: Create, Read, Update (+ services, statuses, tags)
- **Work Tickets**: Create, Read (+ visits, times, items, revenues)
- **Invoices**: Read (+ batches, revenues, taxes)
- **Tasks**: Create
- **Issues**: Create

### Supporting Data
- Branches, Divisions, Regions
- Users, Roles, Companies
- Equipment & Inventory
- Payments & Receipts
- Tax Entities & Jurisdictions
- And many more...

### Special Operations
- `#token_request`: OAuth2 authentication
- `authorization_authenticate_api_request`: Direct auth (legacy)
- `authorization_refresh_token`: Manual token refresh (legacy)

---

## 🔧 Development & Testing

### Test Configuration

Tests are configured in `src/test.ctx.json`:

```json
{
  "auth": {
    "user": {
      "environment": "demo"
    },
    "app": {}
  }
}
```

**Note**: Most tests are skipped by default as they require valid API credentials.

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- src/#token_request/handler.test.ts
```

---

## 🎨 Code Structure

```
aspire-connector/
├── connector.json                    # Connector metadata
├── src/
│   ├── AspireConnectorAuth.ts       # OAuth2 auth types & helpers
│   ├── GlobalConfig.ts              # Global configuration
│   ├── test.ctx.json                # Test auth context
│   ├── #token_request/              # OAuth2 token operation
│   │   ├── handler.ts
│   │   ├── input.ts
│   │   ├── output.ts
│   │   ├── operation.json
│   │   └── handler.test.ts
│   └── [159 operation folders...]
└── dist/                            # Compiled output
```

---

## 📚 References

### Aspire API Documentation
- Production API: https://cloud-api.youraspire.com
- Sandbox API: https://cloudsandbox-api.youraspire.com
- Demo API: https://clouddemo-api.youraspire.com
- API Docs: https://guide.youraspire.com/apidocs/introduction-1

### Tray CDK Documentation
- OAuth2 Client Credentials: Part of `@trayio/cdk-dsl`
- Type: `Oauth2ClientCredentialsOperationHandlerAuth<UserAuth, AppAuth>`

---

## ✅ Validation

### OAuth2 Compliance

The connector follows OAuth2 Client Credentials standards:

- ✅ Uses `#token_request` operation
- ✅ Returns standard OAuth2 response (`access_token`, `refresh_token`, `expires_in`)
- ✅ Includes token refresh endpoint
- ✅ Secure credential handling (not stored in user context)
- ✅ Environment-specific URLs managed internally

### Security Best Practices

- ✅ Client credentials only used during authentication
- ✅ Tokens stored in secure Tray auth context
- ✅ Automatic token expiry handling
- ✅ Refresh token support
- ✅ Environment isolation

---

## 🎉 Next Steps

1. **Wait for Deployment** (~5-10 minutes)
   ```bash
   tray-cdk deployment get convex-aspire-connector 1.0 34ed0b2f-128c-4638-a1b3-dc97f37ff3a1 --us
   ```

2. **Test Authentication** in Tray.io
   - Add connector to a workflow
   - Configure authentication
   - Test a simple operation (e.g., `properties_get`)

3. **Share with Team**
   ```bash
   tray-cdk permissions add convex-aspire-connector 1.0 --email="colleague@example.com"
   ```

4. **Monitor Usage**
   - Check connector in Tray UI
   - Monitor authentication success
   - Validate all operations work correctly

---

## 🐛 Troubleshooting

### Authentication Fails

**Problem**: Authentication returns 401 or 404  
**Solution**: 
- Verify Client ID and Secret are correct
- Ensure correct environment is selected
- Check that API credentials are active in Aspire

### Token Expired

**Problem**: Operations fail with 401 after some time  
**Solution**:
- The connector should auto-refresh tokens
- If manual refresh needed, re-authenticate in Tray
- Check `expires_at` in auth context

### Wrong Environment

**Problem**: Data not found or operations fail  
**Solution**:
- Verify environment selection during auth
- Ensure using credentials for the selected environment
- Check `base_url` in auth context matches expectation

---

**Last Updated**: October 20, 2025  
**Maintained By**: Aspire Connector Team


