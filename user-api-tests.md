# User Router API Tests - Postman/Curl Collection

## Base URL
```
http://localhost:3000/api/users
```

## Test Data

### Valid User Create Data
```json
{
  "email": "john.doe@example.com",
  "name": "John Doe",
  "password": "password123",
  "slug": "john-doe"
}
```

### Valid User Create Data (Minimal - slug auto-generated)
```json
{
  "email": "jane.smith@example.com",
  "name": "Jane Smith",
  "password": "securepass456"
}
```

### Invalid User Create Data - Invalid Email
```json
{
  "email": "not-an-email",
  "name": "Test User",
  "password": "password123"
}
```

### Invalid User Create Data - Short Name
```json
{
  "email": "test@example.com",
  "name": "A",
  "password": "password123"
}
```

### Invalid User Create Data - Short Password
```json
{
  "email": "test@example.com",
  "name": "Test User",
  "password": "123"
}
```

### Invalid User Create Data - Invalid Slug
```json
{
  "email": "test@example.com",
  "name": "Test User",
  "password": "password123",
  "slug": "Invalid_Slug!"
}
```

### Valid User Update Data
```json
{
  "email": "john.doe.updated@example.com",
  "name": "John Doe Updated"
}
```

### Partial User Update Data - Email Only
```json
{
  "email": "new.email@example.com"
}
```

### Partial User Update Data - Name Only
```json
{
  "name": "New Name Only"
}
```

### Invalid User Update Data - Both Empty
```json
{}
```

---

## Curl Commands

### 1. Get All Users
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Content-Type: application/json"
```

### 2. Get User by ID
```bash
# Replace USER_ID with actual user ID
curl -X GET http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json"
```

### 3. Create User (Valid - with slug)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "name": "John Doe",
    "password": "password123",
    "slug": "john-doe"
  }'
```

### 4. Create User (Valid - minimal, slug auto-generated)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "name": "Jane Smith",
    "password": "securepass456"
  }'
```

### 5. Create User (Invalid - bad email)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "name": "Test User",
    "password": "password123"
  }'
```

### 6. Create User (Invalid - short name)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "A",
    "password": "password123"
  }'
```

### 7. Create User (Invalid - short password)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "123"
  }'
```

### 8. Create User (Invalid - bad slug)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123",
    "slug": "Invalid_Slug!"
  }'
```

### 9. Create Duplicate User (should fail with conflict)
```bash
# Run this twice - second should fail
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "name": "Duplicate User",
    "password": "password123"
  }'
```

### 10. Update User (Valid - full update) - **Uses PATCH, not PUT**
```bash
# Replace USER_ID with actual user ID
# Note: Uses PATCH method (not PUT) as per router configuration
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe.updated@example.com",
    "name": "John Doe Updated"
  }'
```

### 11. Update User (Partial - email only) - **Uses PATCH, not PUT**
```bash
# Replace USER_ID with actual user ID
# Note: Uses PATCH method (not PUT) as per router configuration
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new.email@example.com"
  }'
```

### 12. Update User (Partial - name only) - **Uses PATCH, not PUT**
```bash
# Replace USER_ID with actual user ID
# Note: Uses PATCH method (not PUT) as per router configuration
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name Only"
  }'
```

### 13. Update User (Invalid - empty body) - **Uses PATCH, not PUT**
```bash
# Replace USER_ID with actual user ID
# Note: Uses PATCH method (not PUT) as per router configuration
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 14. Update User with Duplicate Email (should fail) - **Uses PATCH, not PUT**
```bash
# First create a user with email "existing@example.com"
# Then try to update another user to use that email
curl -X PATCH http://localhost:3000/api/users/2 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing@example.com"
  }'
```

### 15. Update Non-existent User (should fail 404) - **Uses PATCH, not PUT**
```bash
curl -X PATCH http://localhost:3000/api/users/999999 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Non Existent"
  }'
```

### 16. Delete User
```bash
# Replace USER_ID with actual user ID
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json"
```

### 17. Delete Non-existent User (should fail 404)
```bash
curl -X DELETE http://localhost:3000/api/users/999999 \
  -H "Content-Type: application/json"
```

---

## Expected Response Formats

### Success Response (200/201)
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "email": "john.doe@example.com",
    "name": "John Doe",
    "slug": "john-doe-x7k9m2",
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
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["email"],
      "message": "Invalid email"
    }
  ]
}
```

### Error Response - Not Found (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Error Response - Conflict (409)
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

## Postman Collection Import

Save the following as `Calendly-User-API.postman_collection.json` and import into Postman:

```json
{
  "info": {
    "name": "Calendly Clone - User API",
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
    }
  ],
  "item": [
    {
      "name": "Get All Users",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Get User by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users/{{userId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "{{userId}}"]
        }
      }
    },
    {
      "name": "Create User (Valid)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john.doe@example.com\",\n  \"name\": \"John Doe\",\n  \"password\": \"password123\",\n  \"slug\": \"john-doe\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Create User (Minimal - Auto Slug)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"jane.smith@example.com\",\n  \"name\": \"Jane Smith\",\n  \"password\": \"securepass456\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Create User (Invalid Email)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"not-an-email\",\n  \"name\": \"Test User\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Create User (Short Name)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"name\": \"A\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Create User (Short Password)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"name\": \"Test User\",\n  \"password\": \"123\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Create User (Invalid Slug)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"name\": \"Test User\",\n  \"password\": \"password123\",\n  \"slug\": \"Invalid_Slug!\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Create Duplicate User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"duplicate@example.com\",\n  \"name\": \"Duplicate User\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Update User (Full)",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john.doe.updated@example.com\",\n  \"name\": \"John Doe Updated\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users/{{userId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "{{userId}}"]
        }
      }
    },
    {
      "name": "Update User (Email Only)",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"new.email@example.com\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users/{{userId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "{{userId}}"]
        }
      }
    },
    {
      "name": "Update User (Name Only)",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"New Name Only\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users/{{userId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "{{userId}}"]
        }
      }
    },
    {
      "name": "Update User (Invalid - Empty)",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users/{{userId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "{{userId}}"]
        }
      }
    },
    {
      "name": "Update Non-existent User",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Non Existent\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users/999999",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "999999"]
        }
      }
    },
    {
      "name": "Delete User",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users/{{userId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "{{userId}}"]
        }
      }
    },
    {
      "name": "Delete Non-existent User",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users/999999",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "999999"]
        }
      }
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

# 2. Get all users (should be empty initially)
curl -X GET http://localhost:3000/api/users

# 3. Create first user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "name": "User One", "password": "password123"}'

# 4. Create second user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user2@example.com", "name": "User Two", "password": "password123"}'

# 5. Get all users (should have 2)
curl -X GET http://localhost:3000/api/users

# 6. Get user by ID (use ID from step 3)
curl -X GET http://localhost:3000/api/users/1

# 7. Update user (uses PATCH, not PUT)
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "User One Updated"}'

# 8. Verify update
curl -X GET http://localhost:3000/api/users/1

# 9. Delete user
curl -X DELETE http://localhost:3000/api/users/1

# 10. Verify deletion
curl -X GET http://localhost:3000/api/users
```

---

## Validation Rules Summary

| Field | Required | Type | Constraints |
|-------|----------|------|-------------|
| email | Yes | string | Valid email format, unique |
| name | Yes | string | 2-50 characters |
| password | Yes | string | Minimum 6 characters |
| slug | No | string | lowercase, numbers, hyphens only, max 100 chars |

| Update Field | Required | Type | Constraints |
|-------------|----------|------|-------------|
| email | No | string | Valid email format, unique if provided |
| name | No | string | 2-50 characters |
| At least one field required | Yes | - | email or name must be provided |