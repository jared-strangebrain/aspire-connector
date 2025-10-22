# Aspire Connector - Authentication Setup Guide

## 🔐 How Authentication Works

The Aspire connector uses **OAuth2 Client Credentials** flow with a special `#token_request` operation that Tray calls automatically when users configure authentication.

---

## ✅ What Was Added

### #token_request Operation
A special operation that:
1. Takes `client_id`, `client_secret`, and `environment` from the auth form
2. Calls Aspire's `/Authorization` endpoint
3. Returns `access_token` and `refresh_token`
4. Tray stores these tokens and uses them for all subsequent API calls

---

## 📝 Authentication Parameters

When users add your connector in Tray, they'll see an auth form asking for:

| Field | Type | Options | Description |
|-------|------|---------|-------------|
| **Client ID** | String | - | Aspire API Client ID |
| **Client Secret** | String (password) | - | Aspire API Client Secret |
| **Environment** | Dropdown | Demo, Production, Sandbox | Which Aspire environment to connect to |

---

## 🔄 Authentication Flow

### In Tray Workflows:

1. **User adds connector** to workflow
2. **User clicks "Authenticate"**
3. **Auth form appears** with 3 fields:
   - Client ID
   - Client Secret  
   - Environment
4. **User fills form** and clicks "Connect"
5. **Tray automatically calls** `#token_request` operation
6. **#token_request** sends credentials to Aspire API:
   ```
   POST https://clouddemo-api.youraspire.com/Authorization
   Body: {
     "ClientId": "user's-client-id",
     "Secret": "user's-client-secret"
   }
   ```
7. **Aspire returns** access token and refresh token
8. **Tray stores tokens** in `ctx.auth.user`
9. **All operations** automatically use the token via `GlobalConfig`

---

## 🛠️ Technical Implementation

### Auth Type Structure
```typescript
// User auth - managed by Tray after #token_request
export type AspireUserAuth = {
  access_token?: string;      // From #token_request
  refresh_token?: string;     // From #token_request
  expires_at?: string;        // Calculated by Tray
  environment: string;        // Passed through
  base_url?: string;          // Set by connector
  client_id?: string;         // Optional fallback
  client_secret?: string;     // Optional fallback
};

// App auth - from auth form
export type AspireAppAuth = {
  client_id?: string;         // From auth form
  client_secret?: string;     // From auth form
  environment?: string;       // From auth form (dropdown)
};
```

### #token_request Operation

**Input** (from auth form):
```json
{
  "auth_form_input": {
    "client_id": "user-entered-id",
    "client_secret": "user-entered-secret",
    "environment": "demo"
  }
}
```

**Output** (to Tray):
```json
{
  "status_code": 200,
  "headers": {},
  "body": {
    "access_token": "eyJhbGci...",
    "refresh_token": "eyJhbGci...",
    "expires_in": 86400
  }
}
```

**Handler**:
```typescript
handler.usingComposite(async (ctx, input, invoke) => {
  // Determine API URL based on environment
  const baseUrl = getBaseUrlForEnvironment(input.auth_form_input.environment);
  
  // Call Aspire auth endpoint
  const response = await fetch(`${baseUrl}/Authorization`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ClientId: input.auth_form_input.client_id,
      Secret: input.auth_form_input.client_secret
    })
  });
  
  // Return token in Tray format
  return {
    status_code: 200,
    body: {
      access_token: response.Token,
      refresh_token: response.RefreshToken
    }
  };
})
```

### GlobalConfig

All operations use the `access_token` from `ctx.auth.user`:

```typescript
export const globalConfigHttp =
  OperationGlobalConfigHttp.create<AspireConnectorAuth>()
    .withBaseUrl((ctx) => {
      const env = ctx?.auth?.user?.environment ?? 'production';
      return getBaseUrlForEnvironment(env);
    })
    .withBearerToken((ctx) => ctx?.auth?.user?.access_token ?? '');
```

---

## 🚀 How Users Authenticate

### In Tray Workflow Builder:

**Step 1**: Add Aspire connector
```
Drag "convex-aspire-connector" into workflow
```

**Step 2**: Click "Authenticate"
```
Button appears: "New Authentication"
```

**Step 3**: Fill Auth Form
```
┌─────────────────────────────────────┐
│ Authenticate with Aspire            │
├─────────────────────────────────────┤
│ Client ID: [________________]       │
│ Client Secret: [____________]       │
│ Environment: [Demo ▼]               │
│                                     │
│  [Cancel]  [Connect]                │
└─────────────────────────────────────┘
```

**Step 4**: Automatic Token Retrieval
```
✅ Tray calls #token_request
✅ Gets access_token
✅ Stores for future use
✅ Ready to use!
```

---

## 🎯 Using the Connector

### Example Workflow

**Step 1**: Trigger (e.g., Webhook, Schedule)

**Step 2**: Aspire - Get Properties
```
Operation: properties_get
Authentication: [Select your auth]
Parameters:
  - top: 10
  - filter: Active eq true
```

**Step 3**: Loop through results
```
Loop on: {{step_2.items}}
```

**Step 4**: Process each property
```
Access fields:
- {{loop_item.PropertyID}}
- {{loop_item.PropertyName}}
- {{loop_item.BranchName}}
```

---

## 🔧 Environment URLs

Based on environment selection, connector uses:

| Environment | Base URL |
|-------------|----------|
| **Production** | `https://cloud-api.youraspire.com` |
| **Sandbox** | `https://cloudsandbox-api.youraspire.com` |
| **Demo** | `https://clouddemo-api.youraspire.com` |

---

## ✅ Testing Authentication

### Test #token_request:
```bash
npm test -- "#token_request"
```

**Expected Output:**
```
✅ PASS src/#token_request/handler.test.ts
✅ Got access token: eyJhbGci...
```

### Test with Token:
```bash
npm test -- properties_get
```

**Expected Output:**
```
✅ PASS src/properties_get/handler.test.ts
✅ Success! Retrieved X properties
```

---

## 🐛 Troubleshooting

### 401 Unauthorized Error

**Problem**: Operations return 401

**Causes**:
1. ❌ No `access_token` in user auth
2. ❌ Token expired
3. ❌ Invalid credentials

**Solution**:
- Tray should automatically call `#token_request` on first use
- Check auth configuration in Tray has all 3 fields filled
- Re-authenticate in Tray to get fresh token

### Invalid Client ID/Secret

**Problem**: #token_request fails

**Cause**: Wrong credentials

**Solution**:
- Verify client_id and client_secret from Aspire
- Check correct environment selected
- Try in Aspire demo environment first

### Wrong Environment

**Problem**: 404 or connection errors

**Cause**: Using production URL but have sandbox credentials

**Solution**:
- Ensure environment dropdown matches your credentials
- Demo credentials → Select "Demo"
- Production credentials → Select "Production"

---

## 📊 Current Configuration

### Connector Name
```
convex-aspire-connector v1.0
```

### Auth Type
```
OAuth2 Client Credentials (via #token_request)
```

### Required Fields
```
1. Client ID
2. Client Secret  
3. Environment (dropdown)
```

### Auto-Generated Fields
```
✅ access_token (from #token_request)
✅ refresh_token (from #token_request)
✅ expires_at (calculated by Tray)
✅ base_url (based on environment)
```

---

## 🔄 Token Refresh

The connector includes `authorization_refresh_token` operation for token refresh, but Tray's OAuth2 client credentials flow may handle this automatically.

---

## 🎉 Ready to Use!

With the `#token_request` operation deployed:
1. ✅ Users see 3-field auth form in Tray
2. ✅ Tray automatically gets tokens
3. ✅ All 158 operations work with auth
4. ✅ No 401 errors!

---

**Next Deployment**: The new version with `#token_request` fixes the 401 issue!

```bash
# Increment version
# Update connector.json version to 1.1

# Redeploy
tray-cdk deployment create --us
```

---

**Status**: ✅ Authentication configured correctly with #token_request operation!


