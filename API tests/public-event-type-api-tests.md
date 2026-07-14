# Public Event Type Router API Tests - Curl Commands

## Base URL
```
http://localhost:3000/api/users/:userId/event-types/:slug
```

## Authentication
**No authentication required** - This is a public endpoint. No `x-user-id` header needed.

## Test Data
- `userId`: 1 (existing user ID)
- `slug`: "30-min-meeting-x7k9m2" (example slug from an active event type)

---

## Curl Commands

### 1. Get Public Event Type (Valid - Success)
```bash
curl -X GET http://localhost:3000/api/users/1/event-types/30-min-meeting-x7k9m2 \
  -H "Content-Type: application/json"
```

### 2. Get Public Event Type (Non-existent User - 404)
```bash
curl -X GET http://localhost:3000/api/users/999999/event-types/30-min-meeting-x7k9m2 \
  -H "Content-Type: application/json"
```

### 3. Get Public Event Type (Non-existent Slug - 404)
```bash
curl -X GET http://localhost:3000/api/users/1/event-types/non-existent-slug \
  -H "Content-Type: application/json"
```

### 4. Get Public Event Type (Invalid User ID Format - 400)
```bash
curl -X GET http://localhost:3000/api/users/invalid/event-types/30-min-meeting-x7k9m2 \
  -H "Content-Type: application/json"
```

### 5. Get Public Event Type (Inactive Event Type - 404)
```bash
# First create an inactive event type, then try to access it
curl -X GET http://localhost:3000/api/users/1/event-types/inactive-event-slug \
  -H "Content-Type: application/json"
```

### 6. Get Public Event Type (Valid - Different User)
```bash
# Test with a different user who has event types
curl -X GET http://localhost:3000/api/users/2/event-types/discovery-call-abc123 \
  -H "Content-Type: application/json"
```

---

## Expected Response Formats

### Success Response (200)
```json
{
  "success": true,
  "message": "Event type retrieved successfully",
  "data": {
    "eventType": {
      "id": 1,
      "title": "30 Minute Meeting",
      "description": "A standard 30-minute meeting for quick discussions",
      "durationMinutes": 30,
      "locationType": "online"
    },
    "host": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Error Response - Not Found (404)
```json
{
  "success": false,
  "message": "Event type not found"
}
```

### Error Response - Bad Request (400)
```json
{
  "success": false,
  "message": "Invalid request parameters"
}
```

### Error Response - Not Found Host (404)
```json
{
  "success": false,
  "message": "Host not found"
}
```

---

## Expected Response Fields

### Event Type Object
| Field | Type | Description |
|-------|------|-------------|
| id | number | Event type ID |
| title | string | Event type title |
| description | string | Event type description |
| durationMinutes | number | Duration in minutes |
| locationType | string | "online" or "in-person" |

### Host Object
| Field | Type | Description |
|-------|------|-------------|
| name | string | Host's name |
| email | string | Host's email |

---

## Notes

1. **Public Access**: This endpoint does NOT require authentication (no `x-user-id` header)
2. **Only Active Event Types**: Only returns event types where `isActive = true`
3. **Slug Format**: The slug is generated as `{base-slug}-{shortId}` (e.g., `30-min-meeting-x7k9m2`)
4. **User Must Exist**: The userId must correspond to an existing user
5. **Host Info**: Returns host name and email for the event type owner