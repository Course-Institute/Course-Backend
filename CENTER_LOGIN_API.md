# Center Login API Documentation

## Overview

The Center Login API allows registered and approved centers to authenticate and access the system. This API is part of the user authentication system and follows the same patterns as admin and student login.

## Endpoint

```
POST /api/user/center-login
```

## Request

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "jaat@gmail.com",
  "password": "123456"
}
```

### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Email address (can be official email, authorized person email, or login username) |
| password | string | Yes | Center login password |

## Response

### Success Response (200 OK)

```json
{
  "status": true,
  "message": "Center login successful",
  "data": {
    "user": {
      "id": "center_id_here",
      "name": "Center Owner Name",
      "email": "jaat@gmail.com",
      "role": "center",
      "centerName": "Center Name",
      "centerCode": "MIV-2025-12345"
    },
    "token": "jwt_token_here"
  }
}
```

### Error Responses

#### 400 Bad Request - Missing Fields
```json
{
  "status": false,
  "message": "Email and password are required"
}
```

#### 400 Bad Request - Invalid Email Format
```json
{
  "status": false,
  "message": "Invalid email format"
}
```

#### 401 Unauthorized - Invalid Credentials
```json
{
  "status": false,
  "message": "Login failed",
  "error": "Invalid email or password"
}
```

#### 401 Unauthorized - Center Not Approved
```json
{
  "status": false,
  "message": "Login failed",
  "error": "Center account is not approved yet"
}
```

## Authentication Features

### Multi-Email Support
The center login API supports authentication using any of the three email fields from center registration:

1. **Official Email** (`centerDetails.officialEmail`)
2. **Authorized Person Email** (`authorizedPersonDetails.email`)
3. **Login Username** (`loginCredentials.username`)

### Status Validation
- Only centers with `status: "approved"` can login
- Centers with `status: "pending"` or `status: "rejected"` will be rejected

### JWT Token
- Returns a JWT token for subsequent API calls
- Token includes center ID, role, and type information
- Token expires based on `JWT_EXPIRES_IN` environment variable (default: 24h)

## Implementation Details

### Files Modified/Created

1. **Auth Service** (`src/components/auth/services/auth.service.ts`)
   - Added `centerLogin()` method
   - Added `generateCenterToken()` method
   - Updated `LoginResponse` interface

2. **User Controller** (`src/components/users/controller/user.controller.ts`)
   - Added `centerLogin()` controller method
   - Added email format validation
   - Added proper error handling

3. **User Routes** (`src/components/users/routes/user.route.ts`)
   - Added `POST /center-login` route

4. **Center DAL** (`src/components/centers/dals/center.dal.ts`)
   - Added `findCenterByEmail()` method
   - Supports searching across all three email fields

### Security Features

- **Password Hashing**: Uses bcrypt for secure password comparison
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Email format and required field validation
- **Status Checking**: Only approved centers can login
- **Error Handling**: Generic error messages to prevent information leakage

## Usage Examples

### cURL Example
```bash
curl -X POST https://mivpsa.in/api/user/center-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jaat@gmail.com",
    "password": "123456"
  }'
```

### JavaScript/Fetch Example
```javascript
const response = await fetch('https://mivpsa.in/api/user/center-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'jaat@gmail.com',
    password: '123456'
  })
});

const data = await response.json();
console.log(data);
```

### Axios Example
```javascript
import axios from 'axios';

const loginData = {
  email: 'jaat@gmail.com',
  password: '123456'
};

try {
  const response = await axios.post('https://mivpsa.in/api/user/center-login', loginData);
  console.log('Login successful:', response.data);
  
  // Store token for future requests
  localStorage.setItem('token', response.data.data.token);
} catch (error) {
  console.error('Login failed:', error.response.data);
}
```

## Testing

### Test Files
- `src/test/center-login.test.ts` - Comprehensive unit tests
- `src/test/center-login-demo.ts` - Demonstration script

### Test Scenarios Covered
- ✅ Valid login with correct credentials
- ✅ Invalid email rejection
- ✅ Invalid password rejection
- ✅ Non-approved center rejection
- ✅ Empty field validation
- ✅ Response format validation
- ✅ Security checks (no password exposure)
- ✅ JWT token generation

## Error Handling

The API provides clear, user-friendly error messages:

- **Missing Fields**: "Email and password are required"
- **Invalid Format**: "Invalid email format"
- **Invalid Credentials**: "Invalid email or password"
- **Not Approved**: "Center account is not approved yet"

## Integration Notes

### Frontend Integration
1. Store the JWT token from the response
2. Include the token in subsequent API requests
3. Handle token expiration gracefully
4. Implement proper error handling for all scenarios

### Backend Integration
- The center login follows the same pattern as admin and student login
- JWT tokens can be verified using the existing auth middleware
- Center role can be checked using `authorizeCenter` middleware (if implemented)

## Security Considerations

1. **Password Security**: Passwords are hashed using bcrypt with salt rounds of 12
2. **Token Security**: JWT tokens are signed with a secret key
3. **Input Validation**: All inputs are validated before processing
4. **Error Messages**: Generic error messages prevent information leakage
5. **Status Validation**: Only approved centers can authenticate

## Future Enhancements

- [ ] Add rate limiting for login attempts
- [ ] Implement account lockout after failed attempts
- [ ] Add two-factor authentication support
- [ ] Add login attempt logging
- [ ] Add password reset functionality

## Related APIs

- `POST /api/user/admin-login` - Admin login
- `POST /api/user/student-login` - Student login
- `POST /api/user/register-admin` - Admin registration
- `GET /api/user/profile` - Get user profile (requires authentication)
