# Admin Component

This component handles all admin-related functionality including student management and dashboard analytics.

## Structure

```
src/components/admin/
├── controller/
│   └── admin.controller.ts    # Admin route handlers
├── dals/
│   └── admin.dal.ts          # Database access layer
├── routes/
│   └── admin.route.ts        # Admin route definitions
├── services/
│   └── admin.service.ts      # Business logic layer
└── README.md                 # This documentation
```

## API Endpoints

All admin endpoints require authentication and admin role authorization.

### Authentication
- **Required**: Bearer token in Authorization header
- **Role**: Admin role required

### Base URL
```
/admin
```

### Endpoints

#### 1. Get Admin Profile
```http
GET /admin/profile
```
Returns the admin user profile information.

#### 2. Get Admin Dashboard
```http
GET /admin/dashboard
```
Returns dashboard statistics including:
- Total students count
- Recent registrations (last 7 days)
- Students by faculty
- Students by course
- Students by session
- Monthly registrations for current year

**Response:**
```json
{
  "status": true,
  "message": "Admin dashboard data retrieved successfully",
  "data": {
    "totalStudents": 150,
    "recentRegistrations": 12,
    "studentsByFaculty": [
      {
        "_id": "Engineering",
        "count": 75
      }
    ],
    "studentsByCourse": [
      {
        "_id": "Computer Science",
        "count": 45
      }
    ],
    "studentsBySession": [
      {
        "_id": "2024-2025",
        "count": 120
      }
    ],
    "monthlyRegistrations": [
      {
        "_id": 1,
        "count": 15
      }
    ]
  }
}
```

#### 3. List All Students
```http
GET /admin/students
```
Retrieves a paginated list of all students with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name, registration number, email, or phone
- `faculty` (optional): Filter by faculty
- `course` (optional): Filter by course
- `session` (optional): Filter by session

**Example:**
```http
GET /admin/students?page=1&limit=10&search=john&faculty=Engineering
```

**Response:**
```json
{
  "status": true,
  "message": "Students retrieved successfully",
  "data": {
    "students": [
      {
        "registrationNo": "123456789012",
        "candidateName": "John Doe",
        "emailAddress": "john.doe@example.com",
        "contactNumber": "9876543210",
        "faculty": "Engineering",
        "course": "Computer Science",
        "stream": "IT",
        "session": "2024-2025",
        "year": "1st Year",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 15,
      "totalCount": 150,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### 4. Get Student Details
```http
GET /admin/students/:registrationNo
```
Retrieves detailed information for a specific student.

**Path Parameters:**
- `registrationNo`: Student's registration number

**Example:**
```http
GET /admin/students/123456789012
```

**Response:**
```json
{
  "status": true,
  "message": "Student details retrieved successfully",
  "data": {
    "registrationNo": "123456789012",
    "candidateName": "John Doe",
    "motherName": "Jane Doe",
    "fatherName": "Robert Doe",
    "gender": "Male",
    "dateOfBirth": "2000-01-15",
    "adharCardNo": "123456789012",
    "category": "General",
    "contactNumber": "9876543210",
    "emailAddress": "john.doe@example.com",
    "faculty": "Engineering",
    "course": "Computer Science",
    "stream": "IT",
    "session": "2024-2025",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "status": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (student not found)
- `500`: Internal Server Error

## Features

### Search Functionality
The list students endpoint supports comprehensive search across:
- Student name
- Registration number
- Email address
- Contact number

### Filtering
Multiple filters can be applied simultaneously:
- Faculty
- Course
- Session

### Pagination
- Configurable page size
- Navigation metadata (hasNextPage, hasPrevPage)
- Total count information

### Dashboard Analytics
- Real-time statistics
- Faculty-wise distribution
- Course-wise distribution
- Session-wise distribution
- Monthly registration trends
- Recent registration activity
