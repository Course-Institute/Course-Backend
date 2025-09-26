# Admin Authentication System

This document describes the complete admin authentication system with role-based access control.

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control (Admin only)
- ✅ Password hashing with bcrypt
- ✅ Input validation
- ✅ Token expiration
- ✅ Secure middleware protection
- ✅ Comprehensive error handling

## API Endpoints

### Public Endpoints

#### 1. Admin Login
```
POST /api/user/admin-login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Admin logged in successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Admin Name",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

### Protected Endpoints (Require Authentication)

#### 2. Admin Registration
```
POST /api/user/register?password=ADMIN_REGISTRATION_PASSWORD
```

**Request Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "secure_password"
}
```

#### 3. Get Admin Profile
```
GET /api/admin/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "status": true,
  "message": "Admin profile retrieved successfully",
  "data": {
    "id": "user_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. Admin Dashboard
```
GET /api/admin/dashboard
Authorization: Bearer <jwt_token>
```

## Authentication Flow

1. **Login**: Admin provides email and password
2. **Validation**: System validates credentials and role
3. **Token Generation**: JWT token is created with user info
4. **Protected Access**: Token is used for subsequent requests
5. **Role Verification**: Middleware ensures admin role for protected routes

## Security Features

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 12
- Minimum password length of 6 characters
- Password validation on registration

### Token Security
- JWT tokens with configurable expiration (default: 24h)
- Secret key from environment variables
- Token includes user ID, role, and type for verification

### Role-Based Access
- Only users with `role: "admin"` can access admin endpoints
- Middleware validates both authentication and authorization
- Automatic role checking on protected routes

## Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h
PASSWORD=your_admin_registration_password
MONGODB_URI=your_mongodb_connection_string
```

## Usage Examples

### 1. Register a new admin
```bash
curl -X POST http://localhost:5000/api/user/register?password=ADMIN_REGISTRATION_PASSWORD \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Admin",
    "email": "john@admin.com",
    "password": "secure123"
  }'
```

### 2. Login as admin
```bash
curl -X POST http://localhost:5000/api/user/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@admin.com",
    "password": "secure123"
  }'
```

### 3. Access protected admin route
```bash
curl -X GET http://localhost:5000/api/admin/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling

The system provides comprehensive error handling:

- **400**: Bad Request (missing fields, invalid format)
- **401**: Unauthorized (invalid credentials, missing token)
- **403**: Forbidden (insufficient role permissions)
- **404**: Not Found (admin not found)
- **500**: Internal Server Error

## Testing

Run the test suite to verify the admin login system:

```bash
npm test
```

The test suite covers:
- Successful admin login
- Invalid credentials handling
- Role-based access control
- Token validation
- Protected route access

## Middleware Stack

1. **authenticateToken**: Validates JWT token
2. **authorizeAdmin**: Ensures admin role
3. **validatePassword**: Protects admin registration

## Database Schema

The User model includes:
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (required, "admin" for admin users)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

## Security Best Practices

1. **Environment Variables**: Never hardcode secrets
2. **Password Hashing**: Always hash passwords before storage
3. **Token Expiration**: Use reasonable token expiration times
4. **Input Validation**: Validate all user inputs
5. **Role Verification**: Always check user roles for protected resources
6. **Error Messages**: Don't expose sensitive information in error messages
