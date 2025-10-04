# Student Login API Documentation

## Overview
The student login endpoint allows students to authenticate using their registration number and date of birth.

## Endpoint
```
POST /api/user/student-login
```

## Request Body
```json
{
    "registrationNo": "string (required)",
    "dateOfBirth": "string (required)"
}
```

### Request Parameters
- `registrationNo`: The student's 12-digit registration number
- `dateOfBirth`: The student's date of birth (format: YYYY-MM-DD)

## Response

### Success Response (200)
```json
{
    "status": true,
    "message": "Student login successful",
    "data": {
        "user": {
            "id": "student_id",
            "name": "Student Name",
            "email": "student@example.com",
            "role": "student",
            "registrationNo": "123456789012"
        },
        "token": "jwt_token_here"
    }
}
```

### Error Responses

#### Missing Fields (400)
```json
{
    "status": false,
    "message": "Registration number and date of birth are required",
    "error": "Missing required fields"
}
```

#### Invalid Credentials (401)
```json
{
    "status": false,
    "message": "Invalid registration number or date of birth",
    "error": "Invalid registration number or date of birth"
}
```

## Usage Examples

### Using cURL
```bash
# Successful login
curl -X POST http://localhost:4000/api/user/student-login \
  -H "Content-Type: application/json" \
  -d '{
    "registrationNo": "123456789012",
    "dateOfBirth": "1995-05-15"
  }'

# Missing fields
curl -X POST http://localhost:4000/api/user/student-login \
  -H "Content-Type: application/json" \
  -d '{}'

# Invalid credentials
curl -X POST http://localhost:4000/api/user/student-login \
  -H "Content-Type: application/json" \
  -d '{
    "registrationNo": "999999999999",
    "dateOfBirth": "1995-05-15"
  }'
```

### Using JavaScript/Fetch
```javascript
const loginStudent = async (registrationNo, dateOfBirth) => {
  try {
    const response = await fetch('/api/user/student-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registrationNo,
        dateOfBirth
      })
    });

    const data = await response.json();
    
    if (data.status) {
      console.log('Login successful:', data.data.user);
      // Store token for authenticated requests
      localStorage.setItem('studentToken', data.data.token);
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
loginStudent('123456789012', '1995-05-15');
```

## Security Features
- JWT token-based authentication
- Date of birth verification
- Registration number validation
- Secure token generation with expiration

## Notes
- The endpoint is publicly accessible (no authentication required)
- Students must have a valid registration number and matching date of birth
- The returned JWT token can be used for subsequent authenticated requests
- Token includes student ID, role, and type information

## Implementation Details
- **Authentication Service**: `src/components/auth/services/auth.service.ts`
- **User Controller**: `src/components/users/controller/user.controller.ts`
- **User Routes**: `src/components/users/routes/user.route.ts`
- **Student DAL**: `src/components/students/dals/student.dal.ts`
