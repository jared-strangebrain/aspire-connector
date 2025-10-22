# Aspire Connector - Complete Operations List

## Authorization (2 operations)
- `authorization_authenticate_api_request` - POST /Authorization
- `authorization_refresh_token` - POST /Authorization/RefreshToken

## Work Tickets (9 operations)
- `work_ticket_canceled_reasons_get` - GET /WorkTicketCanceledReasons
- `work_ticket_items_get` - GET /WorkTicketItems
- `work_ticket_revenues_get` - GET /WorkTicketRevenues
- `work_ticket_status_mark_work_ticket_as_reviewed` - POST /WorkTicketStatus/MarkWorkTicketAsReviewed
- `work_ticket_times_get` - GET /WorkTicketTimes
- `work_ticket_visit_notes_get` - GET /WorkTicketVisitNotes
- `work_ticket_visits_get` - GET /WorkTicketVisits
- `work_tickets_create_as_needed_work_tickets` - POST /WorkTickets/CreateAsNeededWorkTickets
- `work_tickets_get` - GET /WorkTickets

## Workers Compensation (1 operation)
- `workers_comps_get` - GET /WorkersComps

## Vendors (1 operation)
- `vendors_get` - GET /Vendors

## Version (1 operation)
- `version_get_api_version` - GET /Version/GetApiVersion

## Users (1 operation)
- `users_get` - GET /Users

## Unit Types (1 operation)
- `unit_types_get` - GET /UnitTypes

## Tax (2 operations)
- `tax_entities_get` - GET /TaxEntities
- `tax_jurisdictions_get` - GET /TaxJurisdictions

## Takeoff (2 operations)
- `takeoff_groups_get` - GET /TakeoffGroups
- `takeoff_items_get` - GET /TakeoffItems

## Tags (1 operation)
- `tags_get` - GET /Tags

## Services (4 operations)
- `service_tax_overrides_post` - POST /ServiceTaxOverrides
- `service_type_integration_codes_get` - GET /ServiceTypeIntegrationCodes
- `service_types_get` - GET /ServiceTypes
- `services_get` - GET /Services

## Sales (1 operation)
- `sales_types_get` - GET /SalesTypes

## Routes (1 operation)
- `routes_get` - GET /Routes

## Roles (1 operation)
- `roles_get` - GET /Roles

## Revenue (1 operation)
- `revenue_variances_get` - GET /RevenueVariances

## Regions (1 operation)
- `regions_get` - GET /Regions

## Receipts (4 operations)
- `receipt_statuses_get` - GET /ReceiptStatuses
- `receipts_approve_receipt` - POST /Receipts/Approve
- `receipts_get` - GET /Receipts
- `receipts_receive_receipt` - POST /Receipts/Receive

## Properties (11 operations)
- `properties_get` - GET /Properties
- `property_availabilities_get` - GET /PropertyAvailabilities
- `property_contacts_get` - GET /PropertyContacts
- `property_custom_field_definitions_get` - GET /PropertyCustomFieldDefinitions
- `property_custom_fields_get` - GET /PropertyCustomFields
- `property_groups_get` - GET /PropertyGroups
- `property_statuses_get` - GET /PropertyStatuses
- `property_types_get` - GET /PropertyTypes
- `prospect_ratings_get` - GET /ProspectRatings

## Payments (5 operations)
- `partial_payments_create` - POST /PartialPayments
- `pay_codes_get` - GET /PayCodes
- `pay_rate_override_pay_codes_get` - GET /PayRateOverridePayCodes
- `pay_rates_get` - GET /PayRates
- `pay_schedules_get` - GET /PaySchedules
- `payment_categories_get` - GET /PaymentCategories
- `payment_terms_get` - GET /PaymentTerms
- `payments_get` - GET /Payments

## Opportunities (10 operations)
- `opportunities_get` - GET /Opportunities
- `opportunity_lost_reasons_get` - GET /OpportunityLostReasons
- `opportunity_service_groups_get` - GET /OpportunityServiceGroups
- `opportunity_service_items_get` - GET /OpportunityServiceItems
- `opportunity_service_kit_items_get` - GET /OpportunityServiceKitItems
- `opportunity_services_get` - GET /OpportunityServices
- `opportunity_statuses_get` - GET /OpportunityStatuses
- `opportunity_tags_delete` - DELETE /OpportunityTags/{id}
- `opportunity_tags_get` - GET /OpportunityTags

## Jobs (3 operations)
- `job_statuses_get` - GET /JobStatuses
- `jobs_get` - GET /Jobs
- `object_codes_get` - GET /ObjectCodes

## Invoices (5 operations)
- `invoice_batches_get` - GET /InvoiceBatches
- `invoice_revenues_get` - GET /InvoiceRevenues
- `invoice_taxes_get` - GET /InvoiceTaxes
- `invoices_get` - GET /Invoices
- `item_allocations_get` - GET /ItemAllocations

## Inventory (1 operation)
- `inventory_locations_get` - GET /InventoryLocations

## Equipment (13 operations)
- `equipment_classes_get` - GET /EquipmentClasses
- `equipment_disposal_reasons_get` - GET /EquipmentDisposalReasons
- `equipment_manufacturers_get` - GET /EquipmentManufacturers
- `equipment_model_service_schedules_get` - GET /EquipmentModelServiceSchedules
- `equipment_models_get` - GET /EquipmentModels
- `equipment_reading_logs_get` - GET /EquipmentReadingLogs
- `equipment_requested_services_get` - GET /EquipmentRequestedServices
- `equipment_service_logs_get` - GET /EquipmentServiceLogs
- `equipment_service_tags_get` - GET /EquipmentServiceTags
- `equipment_sizes_get` - GET /EquipmentSizes
- `equipments_get` - GET /Equipments

## Employees (3 operations)
- `employee_incident_types_get` - GET /EmployeeIncidentTypes
- `employee_incidents_get` - GET /EmployeeIncidents
- `clock_times_get` - GET /ClockTimes

## Divisions (2 operations)
- `division_integration_codes_get` - GET /DivisionIntegrationCodes
- `divisions_get` - GET /Divisions

## Localities (1 operation)
- `localities_get` - GET /Localities

## Contacts (5 operations)
- `contact_custom_field_definitions_get` - GET /ContactCustomFieldDefinitions
- `contact_custom_fields_get` - GET /ContactCustomFields
- `contact_types_get` - GET /ContactTypes
- `contacts_get` - GET /Contacts

## Companies (1 operation)
- `companies_get` - GET /Companies

## Certifications (2 operations)
- `certification_types_get` - GET /CertificationTypes
- `certifications_get` - GET /Certifications

## Catalog (2 operations)
- `catalog_item_categories_get` - GET /CatalogItemCategories
- `catalog_items_get` - GET /CatalogItems

## Branches (1 operation)
- `branches_get` - GET /Branches

## Bank Deposits (1 operation)
- `bank_deposits_get` - GET /BankDeposits

## Attachments (4 operations)
- `attachment_types_get` - GET /AttachmentTypes
- `attachments_get` - GET /Attachments
- `attachments_get_attachment_file_data` - GET /Attachments/AttachmentFileData
- `attachments_new_link` - GET /Attachments/NewLink

## Addresses (1 operation)
- `addresses_get` - GET /Addresses

## Activities (4 operations)
- `activities_get` - GET /Activities
- `activity_categories_get` - GET /ActivityCategories
- `activity_comment_histories_get` - GET /ActivityCommentHistories
- `activity_contacts_get` - GET /ActivityContacts

## Tasks & Issues (2 operations)
- `issues_create` - POST /Issues
- `tasks_create` - POST /Tasks

---

**Total: 108 Operations**

