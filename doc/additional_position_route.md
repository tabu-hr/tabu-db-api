# Additional Position Route Documentation

## Overview
The `additional_position` route is designed to check the existence of additional position data based on a unique ID. This route is similar to the `submission/check` route and responds with `additional_position_group` and `additional_position` columns.

## Endpoint
- **URL:** `/additional_position/check`
- **Method:** `POST`

## Request
### Headers
- **Content-Type:** `application/json`

### Body
```json
{
  "unique_id": "string"
}
```
- **unique_id** (required): The unique identifier for the additional position data.

## Response
### Success
```json
{
  "success": true,
  "response": {
    "message": "Additional position data exists",
    "exists": true,
    "additional_position_group": "string",
    "additional_position": "string"
  },
  "action": "queryAdditionalPositionByUniqueId",
  "error": null
}
```

### Failure
```json
{
  "success": true,
  "response": {
    "message": "Additional position data does not exist",
    "exists": false
  },
  "action": "queryAdditionalPositionByUniqueId",
  "error": null
}
```

## Example
### Request
```json
POST /additional_position/check
Content-Type: application/json

{
  "unique_id": "12345"
}
```

### Response
```json
{
  "success": true,
  "response": {
    "message": "Additional position data exists",
    "exists": true,
    "additional_position_group": "Group A",
    "additional_position": "Position X"
  },
  "action": "queryAdditionalPositionByUniqueId",
  "error": null
}
