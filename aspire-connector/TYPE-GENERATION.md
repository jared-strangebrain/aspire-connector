# Type Generation Strategy

## Overview

The Aspire connector has two type generation approaches to balance between detailed type information and Tray CDK build compatibility.

## Approach 1: Enhanced Complex Types (Full Detail)

**Script**: `scripts/generate-enhanced-types.js`

This approach generates complete nested type definitions with all complex objects fully expanded.

### Examples of Enhanced Types

#### Properties Output (3 nested types)
```typescript
export type PropertyContact = {
  PropertyID?: number;
  ContactID?: number;
  ContactName?: string;
  PrimaryContact?: boolean;
  BillingContact?: boolean;
  EmailInvoiceContact?: boolean;
  EmailNotificationsContact?: boolean;
  CompanyID?: number;
  CompanyName?: string;
  SMSNotificationsContact?: boolean;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
};

export type PropertyTag = {
  PropertyTagID?: number;
  TagID?: number;
  TagName?: string;
};

export type PropertyTakeoffItem = {
  PropertyTakeoffItemID?: number;
  TakeoffItemID?: number;
  TakeoffItemName?: string;
  TakeoffItemValue?: number;
};

export type Property = {
  PropertyID?: number;
  PropertyName?: string;
  // ... 60+ more fields
  PropertyContacts?: PropertyContact[];
  PropertyTags?: PropertyTag[];
  PropertyTakeoffItems?: PropertyTakeoffItem[];
};

export type PropertiesGetOutput = Property[];
```

#### Invoices Output (3 levels of nesting)
```typescript
export type InvoiceOpportunityServiceItem = {
  InvoiceOpportunityServiceItemID?: number;
  Quantity?: number;
  UnitPrice?: number;
  ExtPrice?: number;
  // ... 8 more fields
};

export type InvoiceOpportunityService = {
  InvoiceOpportunityServiceID?: number;
  Description?: string;
  Amount?: number;
  // ... 19 more fields
  InvoiceOpportunityServiceItems?: InvoiceOpportunityServiceItem[];
};

export type InvoiceOpportunity = {
  InvoiceOpportunityID?: number;
  OpportunityID?: number;
  Amount?: number;
  // ... 20 more fields
  InvoiceOpportunityServices?: InvoiceOpportunityService[];
};

export type Invoice = {
  InvoiceID?: number;
  InvoiceNumber?: number;
  // ... 40+ more fields
  InvoiceOpportunities?: InvoiceOpportunity[];
};

export type InvoicesGetOutput = Invoice[];
```

#### Opportunities Output (4 nested types)
```typescript
export type OpportunityRevision = { /* 9 fields */ };
export type OpportunityBilling = { /* 10 fields */ };
export type ScheduleOfValue = { /* 16 fields */ };
export type ScheduleOfValueGroup = {
  Id?: number;
  Name?: string;
  ScheduleOfValues?: ScheduleOfValue[];
  // ... more fields
};

export type Opportunity = {
  OpportunityID?: number;
  OpportunityName?: string;
  // ... 120+ fields
  OpportunityRevisions?: OpportunityRevision[];
  OpportunityBillings?: OpportunityBilling[];
  ScheduleOfValueGroups?: ScheduleOfValueGroup[];
};
```

### Operations with Complex Nested Types

| Operation | Main Type | Nested Types | Total Fields |
|-----------|-----------|--------------|--------------|
| properties_get | Property | 3 | 65+ with 3 nested arrays |
| opportunities_get | Opportunity | 4 | 120+ with 4 nested types |
| invoices_get | Invoice | 3 (multi-level) | 45+ with 3-level nesting |
| routes_get | Route | 3 | 25+ with 3 nested arrays |
| work_tickets_get | WorkTicket | 5+ | 80+ fields |
| contacts_get | Contact | 2 | 50+ fields |
| equipments_get | Equipment | 3 | 60+ fields |
| ... and 30+ more | ... | ... | ... |

## Approach 2: Simplified Types (Build Compatible)

**Script**: `scripts/simplify-outputs.js`

This approach uses `any` for all output types to ensure maximum compatibility with Tray CDK build system.

```typescript
export type PropertiesGetOutput = any;
export type OpportunitiesGetOutput = any;
export type InvoicesGetOutput = any;
```

### Pros & Cons

| Aspect | Enhanced Types | Simplified Types |
|--------|----------------|------------------|
| **Type Safety** | ✅ Full IntelliSense | ⚠️ Limited |
| **Documentation** | ✅ Self-documenting | ❌ Requires API docs |
| **Build Compatibility** | ⚠️ May have issues | ✅ Always works |
| **Development Experience** | ✅ Excellent | ⚠️ Basic |
| **Runtime Behavior** | ✅ Identical | ✅ Identical |

## Current Configuration

**Active**: Simplified Types (`any`)

**Reason**: Ensures reliable builds with Tray CDK

## Usage

### To Use Enhanced Types

```bash
cd aspire-connector
node scripts/generate-enhanced-types.js
tray-cdk connector build
```

If build fails with "root type undefined", switch back to simplified.

### To Use Simplified Types

```bash
cd aspire-connector
node scripts/simplify-outputs.js
tray-cdk connector build
```

## Type Coverage Summary

### Input Types: ✅ FULLY TYPED (108/108)

All input types are fully detailed regardless of output approach:
- Path parameters with correct types
- Query parameters mapped from OData syntax
- Request bodies with nested object definitions

### Output Types: ✅ AVAILABLE IN BOTH FORMATS

**Enhanced Format** (generated by `generate-enhanced-types.js`):
- 108/108 operations with detailed schemas
- 200+ nested type definitions
- Full property documentation
- 3-5 levels of nesting where applicable

**Simplified Format** (generated by `simplify-outputs.js`):
- 108/108 operations with `any` type
- Maximum build compatibility
- Identical runtime behavior

## Complex Object Examples

### Properties - Fully Expanded
- **PropertyContact**: 17 fields defining contact relationships
- **PropertyTag**: 3 fields for tagging
- **PropertyTakeoffItem**: 4 fields for measurements

### Invoices - Multi-Level Nesting
- **Invoice** → **InvoiceOpportunity** → **InvoiceOpportunityService** → **InvoiceOpportunityServiceItem**
- Each level fully typed with 10-40 fields

### Opportunities - Rich Business Objects
- **Opportunity**: 120+ fields
- **OpportunityRevision**: Version history
- **OpportunityBilling**: Billing schedules
- **ScheduleOfValueGroup**: Nested schedules with line items

### Work Tickets - Complete Workflow Data
- **WorkTicket**: 80+ fields
- **WorkTicketVisit**: Visit details
- **WorkTicketTime**: Time tracking
- **WorkTicketItem**: Materials/services used
- **WorkTicketRevenue**: Financial data

### Routes - Operational Data
- **Route**: 25+ fields
- **RouteProperty**: Properties on route
- **RouteService**: Services performed
- **RouteServiceType**: Service classifications

## Recommendation

For **development and testing**: Use **Enhanced Types** for better IntelliSense and type safety

For **production deployment**: Use **Simplified Types** to ensure reliable builds

Both approaches produce identical runtime behavior - the difference is only in TypeScript compile-time type checking and IDE support.

## Regenerating Types

```bash
# Generate enhanced types with full nesting
node scripts/generate-enhanced-types.js

# Generate simplified types (any)
node scripts/simplify-outputs.js

# Generate complete types from scratch (input + output)
node scripts/generate-complete-types.js
```

## Files Generated

Each operation directory contains:
- `input.ts` - Always fully typed
- `output.ts` - Either enhanced or simplified based on last script run
- `handler.ts` - Uses types from input.ts and output.ts
- `handler.test.ts` - Test cases with type checking
- `operation.json` - Metadata

## Type Safety in Tests

Tests work with both approaches:

```typescript
// With Enhanced Types
.then(({ output }) => {
  if (output.isSuccess) {
    const properties = output.value; // Type: Property[]
    expect(properties[0].PropertyID).toBeDefined();
    expect(properties[0].PropertyContacts).toBeInstanceOf(Array);
  }
})

// With Simplified Types
.then(({ output }) => {
  if (output.isSuccess) {
    const properties = output.value; // Type: any
    expect(properties[0].PropertyID).toBeDefined(); // Still works!
    expect(properties[0].PropertyContacts).toBeInstanceOf(Array);
  }
})
```

Runtime behavior is identical - only compile-time checking differs.

