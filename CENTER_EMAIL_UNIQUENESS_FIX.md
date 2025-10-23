# Center Email Uniqueness Fix

## Problem Description

The center registration system was allowing duplicate email addresses to be used across different fields within the same center registration and across different centers. This created data integrity issues and potential conflicts.

### Original Issues:
1. **Same email in multiple fields**: A center could use the same email for `officialEmail`, `authorizedPersonDetails.email`, and `loginCredentials.username`
2. **Cross-center email conflicts**: Different centers could use the same email addresses
3. **Inefficient validation**: The system used generic search queries instead of targeted email field checks
4. **Missing validation**: No validation prevented email reuse within the same registration

## Solution Implemented

### 1. Enhanced Service Layer Validation (`center.service.ts`)

**Before:**
```typescript
// Only checked officialEmail and authorizedPersonDetails.email separately
const existingCentersResult = await centerDal.getAllCentersDal({ 
    query: centerData.centerDetails.officialEmail, 
    limit: 1, 
    pageNumber: 1 
});
```

**After:**
```typescript
// Extract all email addresses from the center data
const officialEmail = centerData.centerDetails.officialEmail;
const authorizedPersonEmail = centerData.authorizedPersonDetails.email;
const loginUsername = centerData.loginCredentials.username;

// Check if any email is used in multiple fields within the same registration
const emails = [officialEmail, authorizedPersonEmail, loginUsername];
const uniqueEmails = [...new Set(emails)];
if (emails.length !== uniqueEmails.length) {
    throw new Error('Same email cannot be used in multiple fields...');
}

// Check each email field for uniqueness across all centers
const existingOfficialEmail = await centerDal.checkEmailExists(officialEmail);
const existingAuthorizedEmail = await centerDal.checkEmailExists(authorizedPersonEmail);
const existingLoginUsername = await centerDal.checkEmailExists(loginUsername);
```

### 2. New DAL Method (`center.dal.ts`)

Added a dedicated method for email uniqueness checks:

```typescript
const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    // Check if email exists in any of the email fields across all centers
    const existingCenter = await CenterModel.findOne({
      $or: [
        { 'centerDetails.officialEmail': email },
        { 'authorizedPersonDetails.email': email },
        { 'loginCredentials.username': email }
      ]
    });
    
    return !!existingCenter;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
```

### 3. Enhanced Joi Validation (`center.validation.ts`)

Added custom validation to prevent same email usage within a single registration:

```typescript
}).custom((value, helpers) => {
    // Check if any email is used in multiple fields within the same registration
    const officialEmail = value.officialEmail;
    const authorizedPersonEmail = value.email;
    const loginUsername = value.username;
    
    const emails = [officialEmail, authorizedPersonEmail, loginUsername];
    const uniqueEmails = [...new Set(emails)];
    
    if (emails.length !== uniqueEmails.length) {
        return helpers.error('custom.email.duplicate', {
            message: 'Same email cannot be used in multiple fields...'
        });
    }
    
    return value;
});
```

## Validation Rules Implemented

### 1. Within Same Registration
- ✅ `centerDetails.officialEmail` must be unique
- ✅ `authorizedPersonDetails.email` must be unique  
- ✅ `loginCredentials.username` must be unique
- ✅ All three fields must have different email addresses

### 2. Across All Centers
- ✅ No two centers can have the same `officialEmail`
- ✅ No two centers can have the same `authorizedPersonDetails.email`
- ✅ No two centers can have the same `loginCredentials.username`
- ✅ Cross-field uniqueness (e.g., one center's `officialEmail` cannot match another center's `authorizedPersonDetails.email`)

### 3. User System Integration
- ✅ All email addresses are also checked against the users collection
- ✅ Prevents conflicts with existing user accounts

## Error Messages

The system now provides clear, specific error messages:

- `"Same email cannot be used in multiple fields (official email, authorized person email, and login username must be unique)"`
- `"Center with this official email already exists"`
- `"Authorized person email already exists in another center"`
- `"Login username already exists in another center"`
- `"User with email {email} already exists"`

## Testing

### Test Files Created:
1. `src/test/center-email-uniqueness.test.ts` - Comprehensive unit tests
2. `src/test/center-email-demo.ts` - Demonstration script

### Test Cases Covered:
- ✅ Same email in multiple fields within same registration
- ✅ Unique emails in all fields (should succeed)
- ✅ Official email already exists in another center
- ✅ Authorized person email already exists in another center
- ✅ Login username already exists in another center

## Benefits

1. **Data Integrity**: Prevents duplicate email addresses across the system
2. **User Experience**: Clear error messages help users understand validation failures
3. **System Security**: Prevents email conflicts that could lead to authentication issues
4. **Maintainability**: Centralized email validation logic
5. **Performance**: Efficient MongoDB queries for email uniqueness checks

## Usage Example

```typescript
// This will now be rejected
const invalidCenter = {
  centerDetails: { officialEmail: "same@example.com" },
  authorizedPersonDetails: { email: "same@example.com" },
  loginCredentials: { username: "same@example.com" }
};

// This will be accepted
const validCenter = {
  centerDetails: { officialEmail: "official@example.com" },
  authorizedPersonDetails: { email: "authorized@example.com" },
  loginCredentials: { username: "login@example.com" }
};
```

## Files Modified

1. `src/components/centers/services/center.service.ts` - Enhanced validation logic
2. `src/components/centers/dals/center.dal.ts` - Added `checkEmailExists` method
3. `src/components/centers/validations/center.validation.ts` - Added custom validation
4. `src/test/center-email-uniqueness.test.ts` - Unit tests
5. `src/test/center-email-demo.ts` - Demonstration script

The fix ensures that email addresses are truly unique across all center registrations and prevents the data integrity issues that were occurring before.
