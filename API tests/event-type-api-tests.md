# Event Type Router API Tests - Postman/Curl Collection

## Base URL
```
http://localhost:3000/api/event-types
```

## Authentication
All endpoints require the `x-user-id` header to be set (handled by `requireUserId` middleware).

## Test Data

### Valid Event Type Create Data (Full)
```json
{
  "title": "30 Minute Meeting",
  "description": "A standard 30-minute meeting for quick discussions",
  "durationMinutes": 30,
  "isActive": true,
  "locationType": "online",
  "locationValue": "https://calendly.com/meeting",
  "bufferBeforeMinutes": 5,
  "bufferAfterMinutes": 10,
  "slug": "30-min-meeting"
}
```

### Valid Event Type Create Data (Minimal - defaults applied)
```json
{
  "title": "15 Min Quick Call"
}
```

### Valid Event Type Create Data (In-Person)
```json
{
  "title": "1 Hour In-Person Consultation",
  "description": "Face-to-face consultation at office",
  "durationMinutes": 60,
  "locationType": "in-person",
  "locationValue": "123 Main St, Conference Room A",
  "bufferBeforeMinutes": 10,
  "bufferAfterMinutes": 15
}
```

### Valid Event Type Create Data (With Custom Slug)
```json
{
  "title": "Discovery Call",
  "durationMinutes": 45,
  "slug": "discovery-call"
}
```

### Invalid Event Type Create Data - Short Title
```json
{
  "title": "A"
}
```

### Invalid Event Type Create Data - Long Title
```json
{
  "title": "This title is way too long and exceeds the maximum character limit of fifty characters"
}
```

### Invalid Event Type Create Data - Short Description
```json
{
  "title": "Test Event",
  "description": "A"
}
```

### Invalid Event Type Create Data - Long Description
```json
{
  "title": "Test Event",
  "description": "This description is way too long. ".repeat(50)
}
```

### Invalid Event Type Create Data - Invalid Duration (Too Short)
```json
{
  "title": "Test Event",
  "durationMinutes": 10
}
```

### Invalid Event Type Create Data - Invalid Duration (Too Long)
```json
{
  "title": "Test Event",
  "durationMinutes": 150
}
```

### Invalid Event Type Create Data - Invalid Location Type
```json
{
  "title": "Test Event",
  "locationType": "phone"
}
```

### Invalid Event Type Create Data - Invalid Buffer Before
```json
{
  "title": "Test Event",
  "bufferBeforeMinutes": -5
}
```

### Invalid Event Type Create Data - Invalid Buffer After
```json
{
  "title": "Test Event",
  "bufferAfterMinutes": 150
}
```

### Invalid Event Type Create Data - Invalid Slug (Uppercase)
```json
{
  "title": "Test Event",
  "slug": "Invalid_Slug"
}
```

### Invalid Event Type Create Data - Invalid Slug (Special Characters)
```json
{
  "title": "Test Event",
  "slug": "invalid@slug!"
}
```

### Invalid Event Type Create Data - Invalid Slug (Too Long)
```json
{
  "title": "Test Event",
  "slug": "a".repeat(101)
}
```

### Valid Event Type Update Data (Full)
```json
{
  "title": "Updated 30 Minute Meeting",
  "description": "Updated description for the meeting",
  "durationMinutes": 45,
  "isActive": false,
  "locationType": "in-person",
  "locationValue": "New location",
  "bufferBeforeMinutes": 10,
  "bufferAfterMinutes": 15,
  "slug": "updated-meeting"
}
```

### Partial Event Type Update Data - Title Only
```json
{
  "title": "New Title Only"
}
```

### Partial Event Type Update Data - Deactivate
```json
{
  "isActive": false
}
```

### Partial Event Type Update Data - Change Duration
```json
{
  "durationMinutes": 60
}
```

### Invalid Event Type Update Data - Empty Body
```json
{}
```

---

## Curl Commands

### 1. List All Event Types
```bash
curl -X GET http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"
```

### 2. Get Event Type by ID
```bash
# Replace EVENT_TYPE_ID with actual event type ID
curl -X GET http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"
```

### 3. Create Event Type (Valid - Full)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "30 Minute Meeting",
    "description": "A standard 30-minute meeting for quick discussions",
    "durationMinutes": 30,
    "isActive": true,
    "locationType": "online",
    "locationValue": "https://calendly.com/meeting",
    "bufferBeforeMinutes": 5,
    "bufferAfterMinutes": 10,
    "slug": "30-min-meeting"
  }'
```

### 4. Create Event Type (Valid - Minimal, defaults applied)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "15 Min Quick Call"
  }'
```

### 5. Create Event Type (Valid - In-Person)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "1 Hour In-Person Consultation",
    "description": "Face-to-face consultation at office",
    "durationMinutes": 60,
    "locationType": "in-person",
    "locationValue": "123 Main St, Conference Room A",
    "bufferBeforeMinutes": 10,
    "bufferAfterMinutes": 15
  }'
```

### 6. Create Event Type (Valid - With Custom Slug)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Discovery Call",
    "durationMinutes": 45,
    "slug": "discovery-call"
  }'
```

### 7. Create Event Type (Invalid - Short Title)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "A"
  }'
```

### 8. Create Event Type (Invalid - Long Title)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "This title is way too long and exceeds the maximum character limit of fifty characters"
  }'
```

### 9. Create Event Type (Invalid - Short Description)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Test Event",
    "description": "A"
  }'
```

### 10. Create Event Type (Invalid - Invalid Duration Too Short)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Test Event",
    "durationMinutes": 10
  }'
```

### 11. Create Event Type (Invalid - Invalid Duration Too Long)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Test Event",
    "durationMinutes": 150
  }'
```

### 12. Create Event Type (Invalid - Invalid Location Type)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Test Event",
    "locationType": "phone"
  }'
```

### 13. Create Event Type (Invalid - Negative Buffer Before)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Test Event",
    "bufferBeforeMinutes": -5
  }'
```

### 14. Create Event Type (Invalid - Buffer After Too Large)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Test Event",
    "bufferAfterMinutes": 150
  }'
```

### 15. Create Event Type (Invalid - Invalid Slug Uppercase)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Test Event",
    "slug": "Invalid_Slug"
  }'
```

### 16. Create Event Type (Invalid - Invalid Slug Special Characters)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Test Event",
    "slug": "invalid@slug!"
  }'
```

### 17. Create Event Type (Invalid - Slug Too Long)
```bash
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Test Event",
    "slug": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  }'
```

### 18. Create Duplicate Slug (Should Fail - Conflict)
```bash
# Run this twice - second should fail with 409 Conflict
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Duplicate Slug Test",
    "slug": "duplicate-slug"
  }'
```

### 19. Update Event Type (Valid - Full Update) - **Uses PATCH**
```bash
# Replace EVENT_TYPE_ID with actual event type ID
# Note: Uses PATCH method (not PUT) as per router configuration
curl -X PATCH http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Updated 30 Minute Meeting",
    "description": "Updated description for the meeting",
    "durationMinutes": 45,
    "isActive": false,
    "locationType": "in-person",
    "locationValue": "New location",
    "bufferBeforeMinutes": 10,
    "bufferAfterMinutes": 15,
    "slug": "updated-meeting"
  }'
```

### 20. Update Event Type (Partial - Title Only) - **Uses PATCH**
```bash
# Replace EVENT_TYPE_ID with actual event type ID
curl -X PATCH http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "New Title Only"
  }'
```

### 21. Update Event Type (Partial - Deactivate) - **Uses PATCH**
```bash
# Replace EVENT_TYPE_ID with actual event type ID
curl -X PATCH http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "isActive": false
  }'
```

### 22. Update Event Type (Partial - Change Duration) - **Uses PATCH**
```bash
# Replace EVENT_TYPE_ID with actual event type ID
curl -X PATCH http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "durationMinutes": 60
  }'
```

### 23. Update Event Type (Invalid - Empty Body) - **Uses PATCH**
```bash
# Replace EVENT_TYPE_ID with actual event type ID
curl -X PATCH http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{}'
```

### 24. Update Event Type with Duplicate Slug (Should Fail - Conflict) - **Uses PATCH**
```bash
# First create an event type with slug "existing-slug"
# Then try to update another event type to use that slug
curl -X PATCH http://localhost:3000/api/event-types/2 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "slug": "existing-slug"
  }'
```

### 25. Update Non-existent Event Type (Should Fail 404) - **Uses PATCH**
```bash
curl -X PATCH http://localhost:3000/api/event-types/999999 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Non Existent"
  }'
```

### 26. Delete Event Type
```bash
# Replace EVENT_TYPE_ID with actual event type ID
curl -X DELETE http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"
```

### 27. Delete Non-existent Event Type (Should Fail 404)
```bash
curl -X DELETE http://localhost:3000/api/event-types/999999 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"
```

---

## Expected Response Formats

### Success Response (200/201)
```json
{
  "success": true,
  "message": "Event type created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "30 Minute Meeting",
    "description": "A standard 30-minute meeting for quick discussions",
    "durationMinutes": 30,
    "isActive": true,
    "locationType": "online",
    "locationValue": "https://calendly.com/meeting",
    "bufferBeforeMinutes": 5,
    "bufferAfterMinutes": 10,
    "slug": "30-min-meeting-x7k9m2",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response - Validation (400)
```json
{
  "success": false,
  "message": "Invalid request body",
  "errors": [
    {
      "code": "too_small",
      "minimum": 2,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Title must be at least 2 characters long",
      "path": ["title"]
    }
  ]
}
```

### Error Response - Not Found (404)
```json
{
  "success": false,
  "message": "Event type not found"
}
```

### Error Response - Conflict (409)
```json
{
  "success": false,
  "message": "Event type with this slug already exists"
}
```

### Error Response - Unauthorized (401)
```json
{
  "success": false,
  "message": "User ID is required"
}
```

---

## Postman Collection Import

Save the following as `Calendly-EventType-API.postman_collection.json` and import into Postman.
This creates a **folder** named "Event Types" that can be added to your existing collection.

```json
{
  "info": {
    "name": "Calendly Clone - Event Type API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "userId",
      "value": "1",
      "type": "string"
    },
    {
      "key": "eventTypeId",
      "value": "1",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Event Types",
      "item": [
        {
          "name": "List All Event Types",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Get Event Type by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/event-types/{{eventTypeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types", "{{eventTypeId}}"]
            }
          }
        },
        {
          "name": "Create Event Type (Valid - Full)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"30 Minute Meeting\",\n  \"description\": \"A standard 30-minute meeting for quick discussions\",\n  \"durationMinutes\": 30,\n  \"isActive\": true,\n  \"locationType\": \"online\",\n  \"locationValue\": \"https://calendly.com/meeting\",\n  \"bufferBeforeMinutes\": 5,\n  \"bufferAfterMinutes\": 10,\n  \"slug\": \"30-min-meeting\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Valid - Minimal)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"15 Min Quick Call\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Valid - In-Person)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"1 Hour In-Person Consultation\",\n  \"description\": \"Face-to-face consultation at office\",\n  \"durationMinutes\": 60,\n  \"locationType\": \"in-person\",\n  \"locationValue\": \"123 Main St, Conference Room A\",\n  \"bufferBeforeMinutes\": 10,\n  \"bufferAfterMinutes\": 15\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Valid - With Custom Slug)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Discovery Call\",\n  \"durationMinutes\": 45,\n  \"slug\": \"discovery-call\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Short Title)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"A\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Long Title)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"This title is way too long and exceeds the maximum character limit of fifty characters\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Short Description)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Event\",\n  \"description\": \"A\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Duration Too Short)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Event\",\n  \"durationMinutes\": 10\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Duration Too Long)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Event\",\n  \"durationMinutes\": 150\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Location Type)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Event\",\n  \"locationType\": \"phone\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Negative Buffer Before)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Event\",\n  \"bufferBeforeMinutes\": -5\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Buffer After Too Large)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Event\",\n  \"bufferAfterMinutes\": 150\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Slug Uppercase)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Event\",\n  \"slug\": \"Invalid_Slug\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Slug Special Characters)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Event\",\n  \"slug\": \"invalid@slug!\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Event Type (Invalid - Slug Too Long)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Event\",\n  \"slug\": \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Create Duplicate Slug (Should Fail)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Duplicate Slug Test\",\n  \"slug\": \"duplicate-slug\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types"]
            }
          }
        },
        {
          "name": "Update Event Type (Full)",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated 30 Minute Meeting\",\n  \"description\": \"Updated description for the meeting\",\n  \"durationMinutes\": 45,\n  \"isActive\": false,\n  \"locationType\": \"in-person\",\n  \"locationValue\": \"New location\",\n  \"bufferBeforeMinutes\": 10,\n  \"bufferAfterMinutes\": 15,\n  \"slug\": \"updated-meeting\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types/{{eventTypeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types", "{{eventTypeId}}"]
            }
          }
        },
        {
          "name": "Update Event Type (Title Only)",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"New Title Only\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types/{{eventTypeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types", "{{eventTypeId}}"]
            }
          }
        },
        {
          "name": "Update Event Type (Deactivate)",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"isActive\": false\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types/{{eventTypeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types", "{{eventTypeId}}"]
            }
          }
        },
        {
          "name": "Update Event Type (Change Duration)",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"durationMinutes\": 60\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types/{{eventTypeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types", "{{eventTypeId}}"]
            }
          }
        },
        {
          "name": "Update Event Type (Invalid - Empty Body)",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types/{{eventTypeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types", "{{eventTypeId}}"]
            }
          }
        },
        {
          "name": "Update Event Type with Duplicate Slug (Should Fail)",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"slug\": \"existing-slug\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types/{{eventTypeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types", "{{eventTypeId}}"]
            }
          }
        },
        {
          "name": "Update Non-existent Event Type (Should Fail 404)",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Non Existent\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/event-types/999999",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types", "999999"]
            }
          }
        },
        {
          "name": "Delete Event Type",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/event-types/{{eventTypeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types", "{{eventTypeId}}"]
            }
          }
        },
        {
          "name": "Delete Non-existent Event Type (Should Fail 404)",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "x-user-id",
                "value": "{{userId}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/event-types/999999",
              "host": ["{{baseUrl}}"],
              "path": ["api", "event-types", "999999"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Quick Test Sequence

Run these in order to test the full CRUD lifecycle:

```bash
# 1. Start the server
pnpm dev

# 2. List all event types (should be empty initially)
curl -X GET http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"

# 3. Create first event type
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"title": "30 Min Meeting", "durationMinutes": 30}'

# 4. Create second event type
curl -X POST http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"title": "1 Hour Consultation", "durationMinutes": 60, "locationType": "in-person", "locationValue": "Office"}'

# 5. List all event types (should have 2)
curl -X GET http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"

# 6. Get event type by ID (use ID from step 3)
curl -X GET http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"

# 7. Update event type (uses PATCH, not PUT)
curl -X PATCH http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"title": "30 Min Meeting Updated", "durationMinutes": 45}'

# 8. Verify update
curl -X GET http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"

# 9. Delete event type
curl -X DELETE http://localhost:3000/api/event-types/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"

# 10. Verify deletion
curl -X GET http://localhost:3000/api/event-types \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"
```

---

## Validation Rules Summary

| Field | Required | Type | Constraints |
|-------|----------|------|-------------|
| title | Yes | string | 2-50 characters |
| description | No | string | 2-1000 characters |
| durationMinutes | No | number | 15-120 (default: 30) |
| isActive | No | boolean | default: true |
| locationType | No | enum | "online" or "in-person" (default: "online") |
| locationValue | No | string | any string |
| bufferBeforeMinutes | No | number | 0-120 (default: 0) |
| bufferAfterMinutes | No | number | 0-120 (default: 0) |
| slug | No | string | 1-100 chars, lowercase, numbers, hyphens only |

| Update Field | Required | Type | Constraints |
|-------------|----------|------|-------------|
| title | No | string | 2-50 characters |
| description | No | string | 2-1000 characters |
| durationMinutes | No | number | 15-120 |
| isActive | No | boolean | - |
| locationType | No | enum | "online" or "in-person" |
| locationValue | No | string | - |
| bufferBeforeMinutes | No | number | 0-120 |
| bufferAfterMinutes | No | number | 0-120 |
| slug | No | string | 1-100 chars, lowercase, numbers, hyphens only |
| At least one field required | Yes | - | Any field must be provided |