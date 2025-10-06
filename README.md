# Aspire Connector (Tray CDK)

This connector provides access to Aspire Cloud API across Production, Sandbox, and Demo environments. It supports Tray-managed background authentication, resource listing/creation operations, and a generic raw HTTP action for edge cases.

## Features
- Tray-managed OAuth-like token mint/refresh using client id/secret stored in the credential.
- Environment-aware base URLs: production, sandbox, demo.
- Rich input schemas for OData query options and create payloads.
- Generic `raw_http` operation for custom requests.

## Authentication
Store the following in the connector credential (user auth):
- `environment`: `production` | `sandbox` | `demo`
- `client_id`, `client_secret`

The connector will mint/refresh access tokens automatically and attach `Authorization: Bearer` to requests.

## Operations
- `verify_connection`: simple read from `/api/Contacts` to validate auth.
- `contacts.list`: OData-enabled list of Contacts.
- `contacts.create`: Create a Contact (pass full body object as `body`).
- `users.list`, `properties.list`, `opportunities.list`: OData-enabled list endpoints.
- `raw_http`: Build custom requests with method/path/query/headers and choose response mode.

## Development
- Build and test: `npm test`
- TypeScript config outputs to `dist/`. Operation metadata and test contexts are copied by `scripts/copy-operations.cjs`.

## Notes
- Outputs are pass-through from Aspire responses (JSON or text). Types are intentionally permissive unless the API guarantees are strict.
- For additional endpoints or field-level schemas, extend `operation.json` and `input.ts`/`output.ts` as needed, referencing Aspire Swagger.