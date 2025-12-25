# Heredity API Documentation

## Enhanced Features

### 1. Pagination
All list endpoints support pagination with the following query parameters:
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Sorting
Supported on list endpoints with:
- `sortBy` - Column name (e.g., `name`, `birth_date`, `created_at`)
- `sortOrder` - `asc` or `desc` (default: `asc`)

### 3. Filtering
Various filters available depending on endpoint (see specific endpoints below)

### 4. Soft Delete
All delete operations are soft deletes - data is marked as deleted but not removed from database

### 5. Activity History
All create, update, delete, and risk calculation operations are logged for audit trail

---

## API Endpoints

### Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## People Endpoints

### GET /api/people/filtered
Get people with pagination, sorting, and filtering

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `sortBy` (string) - Sort column: `name`, `birth_date`, `gender`, `created_at`, `condition_count` (default: `name`)
- `sortOrder` (string) - `asc` or `desc` (default: `asc`)
- `search` (string) - Search by name (case-insensitive)
- `gender` (string) - Filter by gender: `Male`, `Female`, `Other`
- `hasConditions` (string) - Filter by condition presence: `true`, `false`

**Example Request:**
```
GET /api/people/filtered?page=1&limit=10&sortBy=name&sortOrder=asc&search=john&hasConditions=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "birth_date": "1980-05-15",
      "gender": "Male",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "condition_count": 2,
      "parent_count": 2,
      "child_count": 1,
      "conditions": [
        {
          "id": 1,
          "condition_name": "Diabetes",
          "diagnosed_date": "2020-03-10"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /api/people
Get all people (legacy endpoint, no pagination)

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

### POST /api/person
Create a new person

**Request Body:**
```json
{
  "name": "John Doe",
  "birth_date": "1980-05-15",
  "gender": "Male"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "birth_date": "1980-05-15",
    "gender": "Male",
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/person/:personId
Update a person

**Request Body:**
```json
{
  "name": "John Updated",
  "birth_date": "1980-05-15",
  "gender": "Male"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Updated",
    ...
  }
}
```

### DELETE /api/person/:personId
Soft delete a person

**Response:**
```json
{
  "success": true,
  "message": "Person deleted successfully"
}
```

---

## Relationship Endpoints

### POST /api/relationship
Create a parent-child relationship

**Request Body:**
```json
{
  "parent_id": 1,
  "child_id": 2,
  "type": "Father"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "parent_id": 1,
    "child_id": 2,
    "type": "Father"
  }
}
```

### DELETE /api/relationship/:relationshipId
Soft delete a relationship

**Response:**
```json
{
  "success": true,
  "message": "Relationship deleted successfully"
}
```

---

## Condition Endpoints

### GET /api/conditions
Get conditions with pagination and filtering

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `personId` (number) - Filter by person ID
- `conditionName` (string) - Search by condition name (case-insensitive)

**Example Request:**
```
GET /api/conditions?page=1&limit=10&personId=5&conditionName=diabetes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "person_id": 5,
      "condition_name": "Diabetes",
      "diagnosed_date": "2020-03-10",
      "created_at": "2024-01-01T00:00:00Z",
      "person_name": "John Doe",
      "person_birth_date": "1980-05-15"
    }
  ],
  "pagination": {...}
}
```

### POST /api/condition
Add a condition to a person

**Request Body:**
```json
{
  "person_id": 1,
  "condition_name": "Diabetes",
  "diagnosed_date": "2020-03-10"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "person_id": 1,
    "condition_name": "Diabetes",
    "diagnosed_date": "2020-03-10"
  }
}
```

### DELETE /api/condition/:conditionId
Soft delete a condition

**Response:**
```json
{
  "success": true,
  "message": "Condition deleted successfully"
}
```

---

## Family Tree & Risk Endpoints

### GET /api/tree/:personId
Get family tree with ancestors

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "birth_date": "1980-05-15",
      "gender": "Male",
      "generation_level": 0,
      "conditions": [...]
    }
  ]
}
```

### GET /api/risk/:personId/:conditionName
Calculate genetic risk for a condition

**Response:**
```json
{
  "success": true,
  "data": {
    "patientName": "John Doe",
    "condition": "Diabetes",
    "totalRisk": 75,
    "riskLevel": "High",
    "affectedAncestors": [...],
    "aiReport": "...",
    "aiReportSuccess": true,
    "generatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## History Endpoint

### GET /api/history
Get activity history with pagination and filtering

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `actionType` (string) - Filter by action: `CREATE`, `UPDATE`, `DELETE`, `CALCULATE_RISK`
- `entityType` (string) - Filter by entity: `PERSON`, `RELATIONSHIP`, `CONDITION`, `REPORT`

**Example Request:**
```
GET /api/history?page=1&limit=20&actionType=CREATE&entityType=PERSON
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "action_type": "CREATE",
      "entity_type": "PERSON",
      "entity_id": 5,
      "details": {
        "name": "John Doe",
        "birth_date": "1980-05-15",
        "gender": "Male"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

## Report Endpoint

### POST /api/generate-report-pdf
Generate PDF report

**Request Body:**
```json
{
  "patientName": "John Doe",
  "condition": "Diabetes",
  "totalRisk": 75,
  "riskLevel": "High",
  "affectedAncestors": [...],
  "aiReport": "...",
  "generatedAt": "2024-01-01T00:00:00Z",
  "treeData": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "report_John_Doe_1234567890.pdf",
    "filepath": "/path/to/file",
    "url": "/reports/report_John_Doe_1234567890.pdf"
  }
}
```

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (access denied)
- `404` - Not Found
- `500` - Internal Server Error
