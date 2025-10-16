# Aspire Connector

A comprehensive Tray.io CDK connector for the Aspire business management platform.

## Overview

Aspire is a comprehensive business management solution for landscape, lawn care, snow removal, and tree care companies. This connector provides access to all major Aspire API endpoints including work tickets, opportunities, properties, contacts, invoices, and more.

## Features

- **108 Operations** covering the complete Aspire API
- **Bearer Token Authentication** with automatic token refresh
- **Multi-Environment Support** (Production, Sandbox, Demo)
- **OData Query Support** for filtering, sorting, and pagination
- **Comprehensive Resource Coverage**:
  - Work Tickets & Work Ticket Management
  - Opportunities & Sales
  - Properties & Property Management
  - Contacts & Companies
  - Invoices & Payments
  - Equipment Management
  - Employee Management
  - And much more...

## Authentication

The connector uses Bearer token authentication with automatic token refresh. You'll need:

- **Client ID**: Your Aspire API client ID
- **Client Secret**: Your Aspire API client secret
- **Environment**: Choose from `production`, `sandbox`, or `demo`

### Environment URLs

- **Production**: `https://cloud-api.youraspire.com`
- **Sandbox**: `https://cloudsandbox-api.youraspire.com`
- **Demo**: `https://clouddemo-api.youraspire.com`

## Configuration

Update `src/test.ctx.json` with your credentials for testing:

```json
{
  "auth": {
    "user": {
      "access_token": "YOUR_ACCESS_TOKEN_HERE",
      "refresh_token": "YOUR_REFRESH_TOKEN_HERE",
      "expires_at": "2025-12-31T23:59:59Z",
      "environment": "production",
      "client_id": "YOUR_CLIENT_ID_HERE",
      "client_secret": "YOUR_CLIENT_SECRET_HERE"
    },
    "app": {}
  }
}
```

## Available Operations

### Authorization
- `authorization_authenticate_api_request` - Authenticate and get access token
- `authorization_refresh_token` - Refresh access token

### Work Tickets
- `work_tickets_get` - List work tickets
- `work_tickets_create_as_needed_work_tickets` - Create work tickets
- `work_ticket_visits_get` - List work ticket visits
- `work_ticket_times_get` - List work ticket times
- `work_ticket_items_get` - List work ticket items
- `work_ticket_revenues_get` - List work ticket revenues
- `work_ticket_status_mark_work_ticket_as_reviewed` - Mark work ticket as reviewed
- And more...

### Opportunities
- `opportunities_get` - List opportunities
- `opportunity_services_get` - List opportunity services
- `opportunity_statuses_get` - List opportunity statuses
- `opportunity_tags_get` - List opportunity tags
- `opportunity_tags_delete` - Delete opportunity tag
- And more...

### Properties
- `properties_get` - List properties
- `property_contacts_get` - List property contacts
- `property_types_get` - List property types
- `property_statuses_get` - List property statuses
- `property_custom_fields_get` - List property custom fields
- And more...

### Contacts
- `contacts_get` - List contacts
- `contact_types_get` - List contact types
- `contact_custom_fields_get` - List contact custom fields
- And more...

### Invoices & Payments
- `invoices_get` - List invoices
- `payments_get` - List payments
- `receipts_get` - List receipts
- `receipts_approve_receipt` - Approve receipt
- `receipts_receive_receipt` - Receive receipt
- And more...

### Equipment
- `equipments_get` - List equipment
- `equipment_models_get` - List equipment models
- `equipment_service_logs_get` - List equipment service logs
- And more...

### Users & Employees
- `users_get` - List users
- `employee_incidents_get` - List employee incidents
- `clock_times_get` - List clock times
- And more...

### Other Resources
- `branches_get` - List branches
- `companies_get` - List companies
- `jobs_get` - List jobs
- `services_get` - List services
- `vendors_get` - List vendors
- `activities_get` - List activities
- `tasks_create` - Create tasks
- `issues_create` - Create issues
- And many more...

## OData Query Parameters

Most GET operations support OData query parameters:

- `$select` - Select specific fields
- `$filter` - Filter results
- `$expand` - Expand related entities
- `$orderby` - Sort results
- `$skip` - Skip number of records
- `$top` - Limit number of records
- `$pageNumber` - Page number
- `$limit` - Records per page

Example:
```javascript
{
  filter: "Status eq 'Active'",
  orderby: "CreatedDate desc",
  top: "100"
}
```

## Development

### Build the Connector

```bash
tray-cdk connector build
```

### Run Tests

```bash
npm test
```

### Test Specific Operation

```bash
tray-cdk connector test properties_get -v
```

## Project Structure

```
aspire-connector/
├── connector.json          # Connector metadata
├── src/
│   ├── AspireConnectorAuth.ts  # Authentication configuration
│   ├── GlobalConfig.ts     # Global HTTP configuration
│   ├── test.ctx.json       # Test context (add your credentials)
│   ├── activities_get/     # Example operation
│   │   ├── handler.ts      # Operation handler
│   │   ├── handler.test.ts # Operation tests
│   │   ├── input.ts        # Input type definition
│   │   ├── output.ts       # Output type definition
│   │   └── operation.json  # Operation metadata
│   └── ... (108 operations total)
├── scripts/
│   ├── generate-operations.js   # Script to extract operations from OpenAPI
│   ├── scaffold-operations.js   # Script to scaffold operations
│   ├── configure-handlers.js    # Script to configure handlers
│   └── operations-list.json     # Generated operations list
└── package.json
```

## Deployment

To deploy the connector to Tray:

```bash
tray-cdk deployment create
```

Follow the prompts to complete the deployment.

## API Documentation

For more information about the Aspire API, visit:
https://guide.youraspire.com/apidocs/introduction-1

## Support

For issues or questions:
- Aspire API Documentation: https://guide.youraspire.com/apidocs/
- Tray CDK Documentation: https://tray.io/documentation/

## License

This connector is built for use with the Tray.io platform and Aspire API.

