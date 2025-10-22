# Deployment Status & Guide

**Latest Update**: October 16, 2025

---

## 📊 **Current Deployments**

### Version 1.0 - Original (No Auth Fix)
```
✅ Status: Deployed Successfully
✅ Deployment ID: ad85961d-2851-4589-b9c7-ea8731346ab7
⚠️ Issue: 401 errors (no #token_request)
```

### Version 2.0 - With Authentication Fix
```
⏳ Status: Building
⏳ Deployment ID: 4baae4fb-314e-4c13-86f2-e9bb43b76b8d
✅ Fix: Includes #token_request operation
✅ Operations: 159 (158 + #token_request)
```

**Note**: Tray appears to automatically manage version numbers. Setting version to 1.0 in connector.json still deployed as 2.0.

---

## 🔍 **Check Current Status**

```bash
# Set your token
$env:TRAY_API_TOKEN = "6b349f286a964679871971317901ced0dfb5570cbd8c46dca6fdbeddc0e5ede2"

# Check v2.0 deployment
tray-cdk deployment get convex-aspire-connector 2.0 4baae4fb-314e-4c13-86f2-e9bb43b76b8d --us
```

---

## 🎯 **How to Use the Connector**

### Option 1: Use v1.0 (Available Now, Has 401 Issue)

**Workaround for 401 errors in v1.0:**

Since v1.0 doesn't have #token_request, you need to manually get a token first:

1. In Tray, add a step to call `authorization_authenticate_api_request` operation first
2. Pass your client_id and client_secret
3. Extract the access_token from response
4. Store it for use in subsequent steps

**Not ideal**, but works until v2.0 deploys.

### Option 2: Wait for v2.0 (Recommended)

v2.0 will have automatic authentication - just wait for deployment to complete (~5-10 min total).

---

## 🔐 **Authentication in v2.0**

Once v2.0 deploys, users will authenticate like this:

### In Tray Workflow:

**1. Add Aspire Connector**
- Search "Aspire"
- Drag into workflow

**2. Configure Authentication**
- Click "New Authentication"
- Auth form appears with 3 fields:

```
┌────────────────────────────────────┐
│ Aspire Authentication              │
├────────────────────────────────────┤
│ Client ID *                        │
│ [____________________________]     │
│                                    │
│ Client Secret *                    │
│ [____________________________]     │
│                                    │
│ Environment *                      │
│ [Demo              ▼]              │
│  • Demo                            │
│  • Production                      │
│  • Sandbox                         │
│                                    │
│    [Cancel]  [Connect]             │
└────────────────────────────────────┘
```

**3. Fill Form**
- **Client ID**: Your Aspire API Client ID
- **Client Secret**: Your Aspire API Client Secret  
- **Environment**: Demo / Production / Sandbox

**4. Click Connect**
```
✅ Tray calls #token_request
✅ Gets access_token from Aspire
✅ Stores token
✅ All operations work!
```

---

## 🛠️ **Version Management in Tray CDK**

Based on the behavior we're seeing:

**What Tray Does:**
- First deployment creates v1.0
- Subsequent deployments auto-increment (v2.0, v3.0, etc.)
- You cannot replace an existing version
- Each deployment creates a new version

**Best Practice:**
- Keep connector.json version as-is
- Let Tray handle version numbering
- Each deployment creates next version automatically

---

## 📝 **Deployment Commands Reference**

```bash
# Set token (required)
$env:TRAY_API_TOKEN = "your-token"

# Build connector
tray-cdk connector build

# Create deployment (auto-increments version)
tray-cdk deployment create --us

# Check deployment status
tray-cdk deployment get convex-aspire-connector <version> <deployment-id> --us

# List permissions
tray-cdk permissions list convex-aspire-connector <version>
```

---

## 🎉 **What You Have Now**

### Deployed Versions:

| Version | Status | Has #token_request | Ready to Use |
|---------|--------|-------------------|--------------|
| **1.0** | ✅ Live | ❌ No | ⚠️ Yes (with workaround) |
| **2.0** | ⏳ Building | ✅ Yes | ⏳ Soon! |

### In Tray.io:

- ✅ Connector available: `convex-aspire-connector`
- ✅ v1.0 can be used now (with manual auth)
- ⏳ v2.0 will have automatic auth (~5 min)

---

## 🚀 **Recommendation**

**For immediate use:**
- Use v1.0 with manual authentication (see Option 1 above)

**For best experience:**
- Wait ~5 more minutes for v2.0
- Use automatic authentication
- No 401 errors!

---

**Check Deployment**: Run the command above  
**Latest Deployment**: v2.0 (ID: 4baae4fb-314e-4c13-86f2-e9bb43b76b8d)  
**Status**: ⏳ Building


