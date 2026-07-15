# Availability Router API Tests - Postman/Curl Collection

## Base URL
```
http://localhost:3000/api/availability
```

## Authentication
All endpoints require the `x-user-id` header to be set (handled by `requireUserId` middleware).

## Test Data

### Valid Availability Rule Create Data (Full)
```json
{
  "weekday": 1,
  "startTime": "09:00",
  "endTime": "17:00",
  "isActive": true,
  "timezone": "America/New_York"
}
```

### Valid Availability Rule Create Data (Minimal - defaults applied)
```json
{
  "weekday": 2,
  "startTime": "10:00",
  "endTime": "18:00"
}
```

### Valid Availability Rule Create Data (Different Day)
```json
{
  "weekday": 5,
  "startTime": "14:00",
  "endTime": "22:00",
  "timezone": "Europe/London"
}
```

### Valid Availability Rule Create Data (Weekend)
```json
{
  "weekday": 0,
  "startTime": "10:00",
  "endTime": "16:00",
  "isActive": true
}
```

### Invalid Availability Rule Create Data - Invalid Weekday (Too High)
```json
{
  "weekday": 7,
  "startTime": "09:00",
  "endTime": "17:00"
}
```

### Invalid Availability Rule Create Data - Invalid Weekday (Negative)
```json
{
  "weekday": -1,
  "startTime": "09:00",
  "endTime": "17:00"
}
```

### Invalid Availability Rule Create Data - Invalid Start Time Format
```json
{
  "weekday": 1,
  "startTime": "9:00",
  "endTime": "17:00"
}
```

### Invalid Availability Rule Create Data - Invalid End Time Format
```json
{
  "weekday": 1,
  "startTime": "09:00",
  "endTime": "5:00 PM"
}
```

### Invalid Availability Rule Create Data - End Time Before Start Time
```json
{
  "weekday": 1,
  "startTime": "17:00",
  "endTime": "09:00"
}
```

### Invalid Availability Rule Create Data - Same Start and End Time
```json
{
  "weekday": 1,
  "startTime": "12:00",
  "endTime": "12:00"
}
```

### Invalid Availability Rule Create Data - Missing Required Fields
```json
{
  "startTime": "09:00"
}
```

### Valid Availability Rule Update Data (Full)
```json
{
  "weekday": 3,
  "startTime": "08:00",
  "endTime": "16:00",
  "isActive": false,
  "timezone": "Asia/Tokyo"
}
```

### Partial Availability Rule Update Data - Time Only
```json
{
  "startTime": "10:00",
  "endTime": "18:00"
}
```

### Partial Availability Rule Update Data - Toggle Active
```json
{
  "isActive": false
}
```

### Partial Availability Rule Update Data - Change Day
```json
{
  "weekday": 4
}
```

### Invalid Availability Rule Update Data - End Before Start
```json
{
  "startTime": "16:00",
  "endTime": "10:00"
}
```

### Valid Availability Exception Create Data (Block Full Day)
```json
{
  "date": "2024-12-25",
  "type": "BLOCK_FULL_DAY",
  "reason": "Christmas Holiday",
  "timezone": "America/New_York"
}
```

### Valid Availability Exception Create Data (Block Partial)
```json
{
  "date": "2024-12-24",
  "type": "BLOCK_PARTIAL",
  "startTime": "12:00",
  "endTime": "17:00",
  "reason": "Half day - Christmas Eve",
  "timezone": "America/New_York"
}
```

### Valid Availability Exception Create Data (Add Available Window)
```json
{
  "date": "2025-01-01",
  "type": "ADD_AVAILABLE_WINDOW",
  "startTime": "10:00",
  "endTime": "14:00",
  "reason": "Special New Year hours",
  "timezone": "America/New_York"
}
```

### Valid Availability Exception Create Data (Minimal - Block Full Day)
```json
{
  "date": "2024-07-04",
  "type": "BLOCK_FULL_DAY"
}
```

### Invalid Availability Exception Create Data - Invalid Date Format
```json
{
  "date": "25-12-2024",
  "type": "BLOCK_FULL_DAY"
}
```

### Invalid Availability Exception Create Data - Invalid Date (Not Real)
```json
{
  "date": "2024-02-30",
  "type": "BLOCK_FULL_DAY"
}
```

### Invalid Availability Exception Create Data - Invalid Type
```json
{
  "date": "2024-12-25",
  "type": "INVALID_TYPE"
}
```

### Invalid Availability Exception Create Data - Missing Start Time for Partial
```json
{
  "date": "2024-12-24",
  "type": "BLOCK_PARTIAL",
  "endTime": "17:00"
}
```

### Invalid Availability Exception Create Data - Missing End Time for Partial
```json
{
  "date": "2024-12-24",
  "type": "BLOCK_PARTIAL",
  "startTime": "12:00"
}
```

### Invalid Availability Exception Create Data - Missing Times for Add Window
```json
{
  "date": "2025-01-01",
  "type": "ADD_AVAILABLE_WINDOW"
}
```

### Invalid Availability Exception Create Data - End Before Start
```json
{
  "date": "2024-12-24",
  "type": "BLOCK_PARTIAL",
  "startTime": "17:00",
  "endTime": "12:00"
}
```

### Invalid Availability Exception Create Data - Invalid Start Time Format
```json
{
  "date": "2024-12-24",
  "type": "BLOCK_PARTIAL",
  "startTime": "12:00 PM",
  "endTime": "17:00"
}
```

### Invalid Availability Exception Create Data - Reason Too Long
```json
{
  "date": "2024-12-25",
  "type": "BLOCK_FULL_DAY",
  "reason": "A".repeat(501)
}
```

### Valid Availability Exception Update Data (Full)
```json
{
  "date": "2024-12-26",
  "type": "BLOCK_PARTIAL",
  "startTime": "09:00",
  "endTime": "13:00",
  "reason": "Updated: Boxing Day morning only",
  "timezone": "Europe/London"
}
```

### Partial Availability Exception Update Data - Change Type and Times
```json
{
  "type": "ADD_AVAILABLE_WINDOW",
  "startTime": "14:00",
  "endTime": "18:00"
}
```

### Partial Availability Exception Update Data - Update Reason Only
```json
{
  "reason": "Updated reason for the exception"
}
```

### Partial Availability Exception Update Data - Change Date
```json
{
  "date": "2024-12-31"
}
```

### Invalid Availability Exception Update Data - End Before Start
```json
{
  "type": "BLOCK_PARTIAL",
  "startTime": "16:00",
  "endTime": "10:00"
}
```

---

## Curl Commands

### Availability Rules

#### 1. List All Availability Rules
```bash
curl -X GET http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"
```

#### 2. Create Availability Rule (Valid - Full)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 1,
    "startTime": "09:00",
    "endTime": "17:00",
    "isActive": true,
    "timezone": "America/New_York"
  }'
```

#### 3. Create Availability Rule (Valid - Minimal, defaults applied)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 2,
    "startTime": "10:00",
    "endTime": "18:00"
  }'
```

#### 4. Create Availability Rule (Valid - Different Day)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 5,
    "startTime": "14:00",
    "endTime": "22:00",
    "timezone": "Europe/London"
  }'
```

#### 5. Create Availability Rule (Valid - Weekend)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 0,
    "startTime": "10:00",
    "endTime": "16:00",
    "isActive": true
  }'
```

#### 6. Create Availability Rule (Invalid - Weekday Too High)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 7,
    "startTime": "09:00",
    "endTime": "17:00"
  }'
```

#### 7. Create Availability Rule (Invalid - Negative Weekday)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": -1,
    "startTime": "09:00",
    "endTime": "17:00"
  }'
```

#### 8. Create Availability Rule (Invalid - Start Time Format)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 1,
    "startTime": "9:00",
    "endTime": "17:00"
  }'
```

#### 9. Create Availability Rule (Invalid - End Time Format)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 1,
    "startTime": "09:00",
    "endTime": "5:00 PM"
  }'
```

#### 10. Create Availability Rule (Invalid - End Before Start)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 1,
    "startTime": "17:00",
    "endTime": "09:00"
  }'
```

#### 11. Create Availability Rule (Invalid - Same Start/End)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 1,
    "startTime": "12:00",
    "endTime": "12:00"
  }'
```

#### 12. Create Availability Rule (Invalid - Missing Required Fields)
```bash
curl -X POST http://localhost:3000/api/availability/rules \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "startTime": "09:00"
  }'
```

#### 13. Update Availability Rule (Valid - Full Update) - **Uses PATCH**
```bash
# Replace RULE_ID with actual rule ID
curl -X PATCH http://localhost:3000/api/availability/rules/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 3,
    "startTime": "08:00",
    "endTime": "16:00",
    "isActive": false,
    "timezone": "Asia/Tokyo"
  }'
```

#### 14. Update Availability Rule (Partial - Time Only) - **Uses PATCH**
```bash
# Replace RULE_ID with actual rule ID
curl -X PATCH http://localhost:3000/api/availability/rules/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "startTime": "10:00",
    "endTime": "18:00"
  }'
```

#### 15. Update Availability Rule (Partial - Toggle Active) - **Uses PATCH**
```bash
# Replace RULE_ID with actual rule ID
curl -X PATCH http://localhost:3000/api/availability/rules/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "isActive": false
  }'
```

#### 16. Update Availability Rule (Partial - Change Day) - **Uses PATCH**
```bash
# Replace RULE_ID with actual rule ID
curl -X PATCH http://localhost:3000/api/availability/rules/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "weekday": 4
  }'
```

#### 17. Update Availability Rule (Invalid - End Before Start) - **Uses PATCH**
```bash
# Replace RULE_ID with actual rule ID
curl -X PATCH http://localhost:3000/api/availability/rules/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "startTime": "16:00",
    "endTime": "10:00"
  }'
```

#### 18. Update Non-existent Availability Rule (Should Fail 404) - **Uses PATCH**
```bash
curl -X PATCH http://localhost:3000/api/availability/rules/999999 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "startTime": "10:00",
    "endTime": "18:00"
  }'
```

#### 19. Delete Availability Rule
```bash
# Replace RULE_ID with actual rule ID
curl -X DELETE http://localhost:3000/api/availability/rules/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"
```

#### 20. Delete Non-existent Availability Rule (Should Fail 404)
```bash
curl -X DELETE http://localhost:3000/api/availability/rules/999999 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"
```

---

### Availability Exceptions

#### 21. List All Availability Exceptions
```bash
curl -X GET http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1"
```

#### 22. Create Availability Exception (Valid - Block Full Day)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2024-12-25",
    "type": "BLOCK_FULL_DAY",
    "reason": "Christmas Holiday",
    "timezone": "America/New_York"
  }'
```

#### 23. Create Availability Exception (Valid - Block Partial)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2024-12-24",
    "type": "BLOCK_PARTIAL",
    "startTime": "12:00",
    "endTime": "17:00",
    "reason": "Half day - Christmas Eve",
    "timezone": "America/New_York"
  }'
```

#### 24. Create Availability Exception (Valid - Add Available Window)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2025-01-01",
    "type": "ADD_AVAILABLE_WINDOW",
    "startTime": "10:00",
    "endTime": "14:00",
    "reason": "Special New Year hours",
    "timezone": "America/New_York"
  }'
```

#### 25. Create Availability Exception (Valid - Minimal Block Full Day)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2024-07-04",
    "type": "BLOCK_FULL_DAY"
  }'
```

#### 26. Create Availability Exception (Invalid - Date Format)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "25-12-2024",
    "type": "BLOCK_FULL_DAY"
  }'
```

#### 27. Create Availability Exception (Invalid - Non-existent Date)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2024-02-30",
    "type": "BLOCK_FULL_DAY"
  }'
```

#### 28. Create Availability Exception (Invalid - Type)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2024-12-25",
    "type": "INVALID_TYPE"
  }'
```

#### 29. Create Availability Exception (Invalid - Missing Start Time for Partial)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2024-12-24",
    "type": "BLOCK_PARTIAL",
    "endTime": "17:00"
  }'
```

#### 30. Create Availability Exception (Invalid - Missing End Time for Partial)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2024-12-24",
    "type": "BLOCK_PARTIAL",
    "startTime": "12:00"
  }'
```

#### 31. Create Availability Exception (Invalid - Missing Times for Add Window)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2025-01-01",
    "type": "ADD_AVAILABLE_WINDOW"
  }'
```

#### 32. Create Availability Exception (Invalid - End Before Start)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2024-12-24",
    "type": "BLOCK_PARTIAL",
    "startTime": "17:00",
    "endTime": "12:00"
  }'
```

#### 33. Create Availability Exception (Invalid - Start Time Format)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2024-12-24",
    "type": "BLOCK_PARTIAL",
    "startTime": "12:00 PM",
    "endTime": "17:00"
  }'
```

#### 34. Create Availability Exception (Invalid - Reason Too Long)
```bash
curl -X POST http://localhost:3000/api/availability/exceptions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "date": "2024-12-25",
    "type": "BLOCK_FULL_DAY",
