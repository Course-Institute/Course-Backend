# Admin API Documentation

This module handles admin-specific operations including student management and center registration.

## Authentication & Authorization

All admin routes require:
1. **Authentication**: Valid JWT token
2. **Authorization**: Admin role verification

Routes are protected with middleware:
- `authenticateToken`: Validates JWT token
- `authorizeAdmin`: Ensures user has admin role

## API Endpoints

### Admin Profile
- **GET** `/admin/profile` - Get admin profile information

### Admin Dashboard
- **GET** `/admin/dashboard` - Get dashboard statistics and data

### Student Management
- **GET** `/admin/students/:registrationNo` - Get specific student details
- **POST** `/admin/approve-student` - Approve a student registration

### Center Management (Admin Only)
- **POST** `/admin/register-center` - Register a new center (Admin Only)

## Center Registration (Admin Only)

### Endpoint
**POST** `/admin/register-center`

### Description
Allows admins to register new centers with complete details. Centers registered by admins are automatically approved.

### Authentication Required
- JWT Token with Admin role

### Request Body
The request body should follow the complete center registration structure:

```json
{
  "centerDetails": {
    "centerName": "ABC Learning Center",
    "centerCode": "ALC001",
    "centerType": "Educational Institute",
    "yearOfEstablishment": 2020,
    "fullAddress": "123 Main Street, Near City Mall",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400001",
    "officialEmailId": "info@abclearning.com",
    "primaryContactNo": "9876543210",
    "alternateContactNo": "9876543211",
    "website": "https://www.abclearning.com"
  },
  "authorizedPersonDetails": {
    "name": "John Doe",
    "designation": "Director",
    "contactNo": "9876543210",
    "emailId": "john.doe@abclearning.com",
    "aadhaarIdProofNo": "1234-5678-9012",
    "photographUrl": "uploads/photographs/john_doe.jpg"
  },
  "infrastructureDetails": {
    "numberOfClassrooms": 10,
    "numberOfComputers": 50,
    "internetFacility": true,
    "seatingCapacity": 200,
    "infrastructurePhotosUrls": [
      "uploads/infrastructure/classroom1.jpg",
      "uploads/infrastructure/computer_lab.jpg"
    ]
  },
  "bankDetails": {
    "bankName": "State Bank of India",
    "accountHolderName": "ABC Learning Center",
    "accountNumber": "1234567890123456",
    "ifscCode": "SBIN0001234",
    "branchName": "Mumbai Main Branch",
    "cancelledChequeUrl": "uploads/bank/cancelled_cheque.jpg"
  },
  "documentUploads": {
    "registrationGstCertificateUrl": "uploads/documents/registration_certificate.pdf",
    "panCardUrl": "uploads/documents/pan_card.pdf",
    "addressProofUrl": "uploads/documents/address_proof.pdf",
    "directorIdProofUrl": "uploads/documents/director_id_proof.pdf"
  },
  "loginCredentials": {
    "username": "abclearning_admin",
    "password": "SecurePassword123",
    "confirmPassword": "SecurePassword123"
  },
  "declaration": {
    "declaration": true,
    "signatureUrl": "uploads/signatures/director_signature.jpg"
  }
}
```

### Response
**Success (201 Created):**
```json
{
  "status": true,
  "message": "Center registered successfully by admin",
  "data": {
    "id": "center_1703123456789_abc123def",
    "centerDetails": { ... },
    "authorizedPersonDetails": { ... },
    "infrastructureDetails": { ... },
    "bankDetails": { ... },
    "documentUploads": { ... },
    "loginCredentials": { ... },
    "declaration": { ... },
    "status": "approved",
    "createdAt": "2023-12-21T10:30:00.000Z",
    "updatedAt": "2023-12-21T10:30:00.000Z"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "status": false,
  "message": "Center name is required",
  "error": "Center name is required"
}
```

### Key Features
1. **Admin-Only Access**: Only users with admin role can register centers
2. **Automatic Approval**: Centers registered by admins are automatically set to "approved" status
3. **Complete Validation**: All validation rules from the center service are applied
4. **Comprehensive Data**: Supports all center registration fields including documents and infrastructure

### Validation Rules
- **Email**: Must be valid email format
- **Phone Numbers**: Must be 10-digit Indian mobile numbers starting with 6-9
- **PIN Code**: Must be 6-digit numeric code
- **IFSC Code**: Must be valid IFSC format (4 letters + 0 + 6 alphanumeric)
- **Password**: Minimum 6 characters and must match confirm password
- **Year of Establishment**: Must be between 1900 and current year
- **Declaration**: Must be accepted (true)

### Error Handling
The API returns appropriate HTTP status codes:
- `201`: Center created successfully
- `400`: Validation error or bad request
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (non-admin user)
- `500`: Internal server error

### Usage Example
```javascript
// Frontend example
const registerCenter = async (centerData) => {
  try {
    const response = await fetch('/admin/register-center', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(centerData)
    });
    
    const result = await response.json();
    if (result.status) {
      console.log('Center registered successfully:', result.data);
    } else {
      console.error('Registration failed:', result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Security Notes
- All admin routes are protected with authentication and authorization middleware
- Centers registered by admins bypass the approval workflow
- Admin tokens should be securely stored and transmitted
- All validation is performed server-side for security