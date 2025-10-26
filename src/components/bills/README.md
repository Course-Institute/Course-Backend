# Bills API

This component provides a generic bills management system that supports three types of bills:
- **Student Bills**: For student-related payments
- **Center Bills**: For center-related payments  
- **Other Bills**: For any other type of payments

## API Endpoints

All endpoints require authentication and admin role.

### Base URL
`/api/admin`

### Endpoints

#### 1. Create Bill
**POST** `/api/admin/create-bill`

Creates a new bill with automatic bill type detection and bill number generation.

**Request Body Examples:**

**Student Bill:**
```json
{
  "studentName": "rahul",
  "registrationNo": "123456780",
  "course": "BCA",
  "amount": 12000,
  "paymentMethod": "cash",
  "billDate": "2025-10-26",
  "dueDate": "2025-10-26",
  "description": "Paid",
  "status": "paid",
  "centerId": "center_id_here"
}
```

**Center Bill:**
```json
{
  "centerName": "sumit",
  "centerCode": "MIV-2024-23422",
  "centerType": "franchise",
  "amount": 50000,
  "paymentMethod": "upi",
  "billDate": "2025-10-26",
  "dueDate": "2025-10-26",
  "description": "Paid",
  "status": "paid",
  "billType": "center_fee",
  "centerId": "center_id_here"
}
```

**Other Bill:**
```json
{
  "recipientName": "Other bills",
  "recipientType": "other",
  "recipientId": "829238292",
  "amount": 60000,
  "paymentMethod": "cheque",
  "billDate": "2025-10-26",
  "dueDate": "2025-10-26",
  "description": "overdue",
  "status": "overdue",
  "billType": "other",
  "category": "other",
  "centerId": "center_id_here"
}
```

#### 2. Get All Bills
**GET** `/api/admin/bills`

Retrieves all bills with optional filtering and pagination.

**Query Parameters:**
- `billType` (optional): Filter by bill type (`student`, `center`, `other`)
- `status` (optional): Filter by status (`paid`, `pending`, `overdue`, `cancelled`)
- `centerId` (optional): Filter by center ID
- `studentName` (optional): Search by student name
- `centerName` (optional): Search by center name
- `recipientName` (optional): Search by recipient name
- `dateFrom` (optional): Filter from date (YYYY-MM-DD)
- `dateTo` (optional): Filter to date (YYYY-MM-DD)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

#### 3. Get Bills List (Infinite Scroll)
**POST** `/api/admin/getBillsList`

Retrieves bills with infinite scroll functionality and global search.

**Request Body:**
```json
{
  "query": "search term",
  "page": 1,
  "limit": 10
}
```

**Search Capabilities:**
- Search across student name, registration number
- Search across center name, center code  
- Search across recipient name, recipient ID
- Search by bill number
- Search by description
- Search by amount
- Case-insensitive partial matching

#### 4. Get Bill by ID
**GET** `/api/admin/bills/:billId`

Retrieves a specific bill by its ID.

#### 5. Get Bill by Bill Number
**GET** `/api/admin/bills/bill-number/:billNumber`

Retrieves a specific bill by its bill number.

#### 6. Update Bill Status
**PUT** `/api/admin/bills/:billId/status`

Updates the status of a bill.

**Request Body:**
```json
{
  "status": "paid" // or "pending", "overdue", "cancelled"
}
```

#### 7. Delete Bill
**DELETE** `/api/admin/bills/:billId`

Deletes a bill by its ID.

#### 8. Get Bills by Center
**GET** `/api/admin/centers/:centerId/bills`

Retrieves all bills for a specific center.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

#### 9. Get Bills by Student
**GET** `/api/admin/students/:registrationNo/bills`

Retrieves all bills for a specific student.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

## Bill Number Format

Bills are automatically assigned unique bill numbers in the format:
- `{TYPE}-{YEAR}{MONTH}-{SEQUENCE}`
- Example: `STU-202510-000001` (Student bill)
- Example: `CEN-202510-000002` (Center bill)
- Example: `OTH-202510-000003` (Other bill)

## Response Format

All responses follow the standard format:

```json
{
  "status": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "status": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Validation

The API includes comprehensive validation for:
- Required fields based on bill type
- Data type validation
- Date format validation (YYYY-MM-DD)
- Status and bill type enum validation
- Pagination parameter validation

## Database Schema

The bills collection uses a flexible schema that supports:
- Common fields for all bill types
- Type-specific fields for student, center, and other bills
- Additional dynamic fields for future extensibility
- Automatic bill number generation
- Timestamps for creation and updates
