# Aspire Connector - Testing Guide

This guide provides comprehensive information about testing all 108 operations in the Aspire connector.

## Test Structure

Each operation has a test file (`handler.test.ts`) that includes:

1. **Operation Documentation** - HTTP method, endpoint, required inputs, and optional inputs
2. **Minimal Test Case** - Tests with only required inputs
3. **Full Test Case** - Tests with required + common optional inputs

## Required vs Optional Inputs

### Understanding Input Requirements

- **REQUIRED** inputs must be provided for the operation to execute
- **OPTIONAL** inputs enhance functionality but aren't mandatory

### Common Input Types

1. **Path Parameters** - Always required (e.g., `id` in `/OpportunityTags/{id}`)
2. **Query Parameters** - Usually optional (e.g., `$filter`, `$select`, `$orderby`)
3. **Request Body** - Required for POST/PUT/PATCH operations

## Running Tests

### Run All Tests
```bash
npm test
```

### Test Specific Operation
```bash
tray-cdk connector test properties_get -v
```

### Test with Verbose Output
```bash
tray-cdk connector test authorization_authenticate_api_request -v
```

## Operation Categories & Examples

### 1. GET Operations (List/Retrieve) - No Required Inputs

Most GET operations have **no required inputs** - all parameters are optional for filtering/pagination:

```typescript
// Example: properties_get
{
  // All optional
  select?: 'PropertyID,PropertyName',
  filter?: 'Active eq true',
  orderby?: 'CreatedDate desc',
  top?: '100'
}
```

**Operations with no required inputs:**
- `properties_get`
- `opportunities_get`
- `contacts_get`
- `work_tickets_get`
- `users_get`
- `branches_get`
- And 80+ more...

### 2. GET Operations with Path Parameters - Required ID

Some GET operations require a resource ID in the path:

```typescript
// Example: GET /Properties/{id}
{
  id: 123 // REQUIRED
}
```

### 3. DELETE Operations - Required ID

DELETE operations always require the resource ID:

```typescript
// Example: opportunity_tags_delete
{
  id: 456 // REQUIRED
}
```

### 4. POST/PUT Operations - Required Body

Create and update operations require a request body:

```typescript
// Example: authorization_authenticate_api_request
{
  body: { // REQUIRED
    ClientId: 'your-client-id',
    Secret: 'your-client-secret'
  }
}

// Example: work_tickets_create_as_needed_work_tickets
{
  body: { // REQUIRED
    ScheduledStartDate: '2025-01-15',
    OpportunityServiceId: 123,
    RouteId: 456
  }
}
```

## Complete Operation Reference

### Authentication Operations

#### `authorization_authenticate_api_request` (POST)
**Required:**
- `body.ClientId` (string)
- `body.Secret` (string)

**Optional:**
- `api_version` (string)

**Output:** `ApiAuthenticationResult` with `Token` and `RefreshToken`

#### `authorization_refresh_token` (POST)
**Required:**
- `body.RefreshToken` (string)

**Optional:**
- `api_version` (string)

### Work Tickets Operations

#### `work_tickets_get` (GET)
**Required:** None

**Optional:**
- `select` ($select)
- `filter` ($filter)
- `expand` ($expand)
- `orderby` ($orderby)
- `skip` ($skip)
- `top` ($top)
- `pageNumber` ($pageNumber)
- `limit` ($limit)
- `api_version` (api-version)

**Output:** `WorkTicket[]`

#### `work_tickets_create_as_needed_work_tickets` (POST)
**Required:**
- `body.ScheduledStartDate` (string - ISO date)

**Optional (in body):**
- `body.OpportunityServiceId` (number)
- `body.RouteId` (number)
- `body.StartDateTime` (string)
- `body.EndDateTime` (string)
- `body.HoursPerDay` (number)

**Output:** `void` (201 Created)

### Properties Operations

#### `properties_get` (GET)
**Required:** None

**Optional:** All OData query parameters (see above)

**Output:** `Property[]` with 65+ fields including:
- PropertyID, PropertyName, PropertyStatusName
- BranchID, BranchName
- AccountOwnerContactID, AccountOwnerContactName
- Address fields, GPS coordinates
- Budget, tax information
- And more...

#### `properties_create` (POST)
See input type for required fields.

### Opportunities Operations

#### `opportunities_get` (GET)
**Required:** None

**Optional:** All OData query parameters

**Output:** `Opportunity[]` with 120+ fields

#### `opportunity_tags_delete` (DELETE)
**Required:**
- `id` (path parameter)

**Optional:**
- `api_version`

**Output:** `void`

### Contacts Operations

#### `contacts_get` (GET)
**Required:** None

**Optional:** All OData query parameters

**Output:** `Contact[]`

### Invoice Operations

#### `invoices_get` (GET)
**Required:** None

**Optional:** All OData query parameters

**Output:** `Invoice[]`

## OData Query Parameters

Most GET operations support OData query parameters for advanced filtering and data retrieval:

### `$select` - Choose specific fields
```typescript
{
  select: 'PropertyID,PropertyName,BranchName'
}
```

### `$filter` - Filter results
```typescript
{
  filter: "Active eq true and Budget gt 10000"
}
```

### `$expand` - Include related entities
```typescript
{
  expand: 'PropertyContacts,PropertyTags'
}
```

### `$orderby` - Sort results
```typescript
{
  orderby: 'CreatedDate desc'
}
```

### `$skip` & `$top` - Pagination
```typescript
{
  skip: '0',
  top: '50'
}
```

### `$pageNumber` & `$limit` - Alternative pagination
```typescript
{
  pageNumber: '1',
  limit: '100'
}
```

## Test Context Configuration

Before running tests, configure `src/test.ctx.json`:

```json
{
  "auth": {
    "user": {
      "access_token": "your-token-here",
      "refresh_token": "your-refresh-token",
      "expires_at": "2025-12-31T23:59:59Z",
      "environment": "production",
      "client_id": "your-client-id",
      "client_secret": "your-client-secret"
    },
    "app": {}
  }
}
```

## Common Test Patterns

### Pattern 1: Simple GET (No Required Inputs)
```typescript
.when((ctx, testContext) => ({}))
```

### Pattern 2: GET with Filtering
```typescript
.when((ctx, testContext) => ({
  filter: "Active eq true",
  top: "10"
}))
```

### Pattern 3: DELETE with ID
```typescript
.when((ctx, testContext) => ({
  id: 123
}))
```

### Pattern 4: POST with Body
```typescript
.when((ctx, testContext) => ({
  body: {
    ClientId: ctx.auth.user.client_id,
    Secret: ctx.auth.user.client_secret
  }
}))
```

## Tips for Testing

1. **Start Simple** - Test with minimal required inputs first
2. **Add Filters** - Then test with common optional parameters
3. **Check Output Types** - Outputs are properly typed, use TypeScript features
4. **Use Verbose Mode** - Add `-v` flag to see full request/response
5. **Test Incrementally** - Test one operation at a time during development

## All 108 Operations Summary

- **80+ GET operations** - Mostly require no inputs, all support OData parameters
- **10+ POST operations** - Require request body
- **5+ PUT operations** - Require ID and request body
- **5+ DELETE operations** - Require ID
- **Special operations** - Authentication, file attachments, etc.

For detailed input/output types for each operation, see the generated TypeScript files in each operation's folder:
- `input.ts` - Input type definition
- `output.ts` - Output type definition
- `handler.test.ts` - Test examples with documentation

