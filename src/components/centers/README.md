# Center Management API

This module handles the complete center registration and management system with comprehensive details including center information, authorized person details, infrastructure, bank details, and document uploads.

## API Endpoints

### 1. Create Center
- **POST** `/centers/create`
- **Description**: Creates a new center with all required details
- **Request Body**: See `center-registration-example.json` for structure
- **Response**: Created center object with generated ID

### 2. Get Center by ID
- **GET** `/centers/:centerId`
- **Description**: Retrieves a specific center by its ID
- **Parameters**: `centerId` (string)
- **Response**: Center object

### 3. Update Center
- **PUT** `/centers/:centerId`
- **Description**: Updates center information
- **Parameters**: `centerId` (string)
- **Request Body**: Partial center object (only fields to be updated)
- **Response**: Updated center object

### 4. Delete Center
- **DELETE** `/centers/:centerId`
- **Description**: Deletes a center
- **Parameters**: `centerId` (string)
- **Response**: Success confirmation

### 5. Get All Centers
- **GET** `/centers/`
- **Description**: Retrieves all centers
- **Response**: Array of center objects

### 6. Search Centers
- **GET** `/centers/search`
- **Description**: Search centers with filters
- **Query Parameters**:
  - `centerName` (string, optional): Filter by center name
  - `centerType` (string, optional): Filter by center type
  - `city` (string, optional): Filter by city
  - `state` (string, optional): Filter by state
  - `status` (string, optional): Filter by status (pending/approved/rejected)
  - `page` (number, optional): Page number for pagination
  - `limit` (number, optional): Number of items per page
- **Response**: Paginated list of centers

### 7. Update Center Status
- **PATCH** `/centers/:centerId/status`
- **Description**: Updates center approval status
- **Parameters**: `centerId` (string)
- **Request Body**: `{ "status": "pending" | "approved" | "rejected" }`
- **Response**: Updated center object

### 8. Get Center Auto Complete List
- **GET** `/centers/getCenterAutoCompleteList`
- **Description**: Get autocomplete suggestions for centers
- **Query Parameters**: `query` (string, optional)
- **Response**: Array of center names and IDs

## Data Structure

The center object includes the following main sections:

### Center Details
- Basic information like name, code, type, establishment year
- Contact information and address details

### Authorized Person Details
- Information about the authorized person/director
- Contact details and ID proof information

### Infrastructure Details
- Classroom count, computer count, internet facility
- Seating capacity and infrastructure photos

### Bank Details
- Bank information for financial transactions
- Account details and IFSC code

### Document Uploads
- URLs to uploaded documents (registration, PAN, address proof, etc.)

### Login Credentials
- Username and password for center access

### Declaration
- Declaration acceptance and signature

## Validation Rules

- **Email**: Must be valid email format
- **Phone Numbers**: Must be 10-digit Indian mobile numbers starting with 6-9
- **PIN Code**: Must be 6-digit numeric code
- **IFSC Code**: Must be valid IFSC format (4 letters + 0 + 6 alphanumeric)
- **Password**: Minimum 6 characters
- **Year of Establishment**: Must be between 1900 and current year
- **Declaration**: Must be accepted (true)

## Status Management

Centers have three possible statuses:
- **pending**: Newly registered, awaiting approval
- **approved**: Approved by admin, active
- **rejected**: Rejected by admin

## File Uploads

The system expects file URLs for:
- Photograph of authorized person
- Infrastructure photos
- Cancelled cheque
- Registration/GST certificate
- PAN card
- Address proof
- Director ID proof
- Signature/Stamp

## Error Handling

All endpoints return standardized error responses with appropriate HTTP status codes and error messages.

## Example Request

See `center-registration-example.json` for a complete example of the center registration request body.
