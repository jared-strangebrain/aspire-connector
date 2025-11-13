# Future Improvements for Aspire Connector

## Pending Authentication Fix
**Status:** Waiting for Tray support to enable `#token_request` operation for service `NwO5PI9Po9o4D1_aspire_token`

Once authentication is working, test these potential improvements:

---

## 1. Enhance CREATE Operation Outputs (Test First)

### Current State:
CREATE operations (POST endpoints) return bare strings/numbers:
```typescript
export type ContactsCreateOutput = string;  // Returns "190"
```

### Potential Improvement:
Wrap IDs in objects with meaningful property names:
```typescript
export type ContactsCreateOutput = {
  contact_id: string;
};
// Returns { "contact_id": "190" }
```

### Operations That Would Benefit:
- `contacts_create` → `{ contact_id: string }`
- `properties_create` → `{ property_id: string }`
- `opportunities_create` → `{ opportunity_id: string }`
- `companies_post` → `{ company_id: string }`
- `users_create` → `{ user_id: string }`
- `vendors_post` → `{ vendor_id: string }`
- `branches_post` (if exists) → `{ branch_id: string }`
- All other CREATE/POST operations that return just an ID

### Benefits:
- ✅ Clearer output - users know what the value represents
- ✅ Consistent structure - all operations return objects
- ✅ Easier workflow references - `$.contact_id` vs `$`
- ✅ Extensible - can add `success`, `message`, etc. later

### Decision Criteria:
**Test in a real workflow first:**
- Is the bare string confusing?
- Does Tray's workflow builder make it easy to use?
- Do users understand what the value represents?
- Would an object wrapper genuinely improve UX?

**If YES to improvements needed:**
- Update output.ts for each CREATE operation
- Update handlers to wrap the response
- Redeploy and test

**If NO, current approach is fine:**
- Keep as-is (simpler is better if it works)

---

## 2. Complete Swagger Spec Audit (After Auth Works)

### Issue:
Audit script showed 116 operations "not found in Swagger" - likely due to naming convention mismatches.

### Next Steps:
1. Improve the audit script's matching logic
2. Handle different naming patterns:
   - Swagger: `Contacts_Create`, `Contacts_Get`, `Contacts_Update`
   - Connector: `contacts_create`, `contacts_get`, `contacts_update`
3. For operations truly not in Swagger, determine if they should be removed or are custom additions

---

## 3. Review All Input/Output Completeness (After Auth Works)

Once we can successfully test operations:
1. Verify all required parameters are present in input definitions
2. Verify all response properties are captured in output definitions
3. Check for any missing optional parameters that might be useful
4. Ensure all data types match the API (string, number, boolean, date-time, etc.)

---

## 4. Error Handling Improvements (After Auth Works)

### Consider Adding:
- More descriptive error messages for common failure scenarios
- Validation for required fields before making API calls
- Better handling of API-specific error responses
- Retry logic for transient failures

---

## 5. Documentation (After Auth Works)

### Add to Each Operation:
- Usage examples
- Common use cases
- Parameter descriptions
- Response field explanations

---

## Testing Checklist (Once Auth Is Working)

- [ ] Test `properties_get` - verify token injection works
- [ ] Test `contacts_create` - verify ID is returned and usable
- [ ] Test an UPDATE operation - verify it works end-to-end
- [ ] Test error scenarios - invalid auth, missing params, etc.
- [ ] Test token refresh after 24 hours (or force expiration)
- [ ] Test all three environments (demo, sandbox, production)
- [ ] Verify debug logs appear correctly
- [ ] Test multiple operations in sequence in a workflow

---

## Notes:
- **Priority:** Wait for Tray support response on `#token_request` enablement
- **Then:** Test real workflows to inform improvement decisions
- **Philosophy:** Don't over-engineer - implement improvements only if they solve real user problems


