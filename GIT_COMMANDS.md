# Git Commands to Update Repository

## To commit and push all changes from today's session:

```bash
# 1. Check current status
git status

# 2. Stage all modified files
git add src/AspireConnectorAuth.ts
git add src/#token_request/input.ts
git add src/#token_request/output.ts
git add src/#token_request/handler.ts
git add src/#token_request/handler.test.ts
git add src/#token_refresh/output.ts
git add src/#token_refresh/handler.ts
git add connector.json
git add AUTHENTICATION_FIX_SUMMARY.md
git add TOKEN_BASED_SERVICE_SETUP.md
git add CHANGES_SUMMARY.md
git add GIT_COMMANDS.md

# 3. Review what will be committed
git diff --staged

# 4. Commit the changes
git commit -m "Fix: Convert authentication from OAuth 2.0 to Token Based

- Changed authentication type from Oauth2ClientCredentialsOperationHandlerAuth to TokenOperationHandlerAuth
- Simplified #token_request input to accept direct parameters (not wrapped in auth_form_input)
- Simplified #token_request and #token_refresh output to return token data directly
- Updated service name to NwO5PI9Po9o4D1_aspire_token
- Updated all handlers to match Token Based authentication requirements
- Updated tests to match new input/output structure
- Added detailed documentation of changes and setup instructions

This fixes the 401 authentication errors by properly configuring the connector
for Tray's Token Based authentication mode."

# 5. Push to GitHub
git push origin main
# (or use 'master' if that's your default branch: git push origin master)
```

## Alternative: Stage all changes at once

If you want to commit everything at once:

```bash
# Stage all changes
git add .

# Commit
git commit -m "Fix: Convert authentication from OAuth 2.0 to Token Based"

# Push
git push origin main
```

## If you need to create a new branch first:

```bash
# Create and switch to a new branch
git checkout -b fix/token-based-authentication

# Stage all changes
git add .

# Commit
git commit -m "Fix: Convert authentication from OAuth 2.0 to Token Based"

# Push the new branch
git push origin fix/token-based-authentication
```

## To verify the changes before committing:

```bash
# See what files have changed
git status

# See the actual changes in detail
git diff

# See changes that are staged
git diff --staged
```

## Files Changed Today:
1. `src/AspireConnectorAuth.ts`
2. `src/#token_request/input.ts`
3. `src/#token_request/output.ts`
4. `src/#token_request/handler.ts`
5. `src/#token_request/handler.test.ts`
6. `src/#token_refresh/output.ts`
7. `src/#token_refresh/handler.ts`
8. `connector.json`
9. `AUTHENTICATION_FIX_SUMMARY.md`
10. `TOKEN_BASED_SERVICE_SETUP.md`
11. `CHANGES_SUMMARY.md` (new)
12. `GIT_COMMANDS.md` (new)

