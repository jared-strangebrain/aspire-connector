# Token Based Service Setup for Aspire Connector

## Service Configuration in Tray

For the Aspire connector to work with Token Based authentication, follow these steps **exactly**:

### Step 1: Configure the Service

1. Go to Tray.io and navigate to your services
2. Find or create the service: `NwO5PI9Po9o4D1_aspire_token`
3. Set the **Authentication Type** to: **Token Based**
4. In the **Authentication Form** section, add these 3 fields:

   - **Field 1:**
     - Name: `client_id`
     - Title: `Client ID`
     - Description: `Your Aspire API Client ID (created in Aspire Admin > API)`
     - Type: `String`
     - Required: `Yes`

   - **Field 2:**
     - Name: `client_secret`
     - Title: `Client Secret`
     - Description: `Your Aspire API Client Secret`
     - Type: `String`
     - Required: `Yes`
     - Input Type: `Password` (to hide the value)

   - **Field 3:**
     - Name: `environment`
     - Title: `Environment`
     - Description: `Select your Aspire environment`
     - Type: `Dropdown/Select`
     - Required: `Yes`
     - Options:
       - `demo` (Demo Environment)
       - `sandbox` (Sandbox Environment)
       - `production` (Production Environment)

4. **Save the service configuration**

### Step 2: Create an Authentication Instance

1. In your Tray workflow, when you add the Aspire connector
2. Click "Create new authentication"
3. You should see the authentication form with the 3 fields above
4. Fill in:
   - **Client ID**: `84b29ea6-1868-4937-8842-fd211bd20e03` (for demo)
   - **Client Secret**: `OYSZUnwCoMdbCkocZcCg4ueoJs6R0Z7P` (for demo)
   - **Environment**: Select `demo`
5. Save the authentication

### Step 3: Test with an Operation

1. Add the `properties_get` operation to your workflow
2. Use the authentication you just created
3. Set parameters:
   - `pageNumber`: `1`
   - `limit`: `5`
4. Run the workflow

## What Should Happen

When you run the workflow:

1. Tray detects that `properties_get` needs authentication
2. Tray automatically calls the `#token_request` operation with your auth form inputs
3. The connector receives the client_id, client_secret, and environment
4. The connector calls `https://clouddemo-api.youraspire.com/Authorization` (based on environment)
5. The connector receives a `Token` and `RefreshToken`
6. The connector returns them as `access_token` and `refresh_token`
7. Tray stores these in the authentication
8. Tray calls `properties_get` with the `access_token` as a Bearer token
9. The operation succeeds

## Troubleshooting

### Error: "Refreshing of access token was skipped because the authentication contains no refresh token"

This means:
- Tray is NOT calling `#token_request` first
- The service is not configured correctly for Token Based authentication
- OR you didn't create an authentication instance with the form filled out

### Check Your Service Configuration

The service MUST have:
- ✅ Authentication Type: **Token Based** (not OAuth 2.0)
- ✅ Authentication form with 3 fields: `client_id`, `client_secret`, `environment`
- ✅ The connector must have a `#token_request` operation (we have this)
- ✅ The `#token_request` operation must be marked as `private` (we have this)

### Debug Steps

1. **Verify the service type**: Go to the service settings and confirm it says "Token Based"
2. **Check the auth form**: Make sure all 3 fields are defined in the service
3. **Create a fresh authentication**: Delete any old authentications and create a new one
4. **Check the logs**: When you run `properties_get`, you should see `[TokenRequest]` logs appearing
5. **If NO logs appear**: Tray is not calling the `#token_request` operation, which means the service configuration is wrong

## Service Name

Make sure you're using the correct service name in your Tray workflow:
- Service Name: `NwO5PI9Po9o4D1_aspire_token`
- This is set in `connector.json`

## File References

- `src/#token_request/operation.json` - Defines the operation as `private`
- `src/#token_request/handler.ts` - Implements the token request logic
- `src/#token_request/input.ts` - Defines the auth_form_input structure
- `src/#token_request/output.ts` - Defines the token response structure
- `connector.json` - Contains the service name

