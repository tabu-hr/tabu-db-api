# Salary Route Documentation

## Overview
The salary route provides endpoints to interact with the salary table in the database. This documentation covers the available endpoints and their usage.

## Endpoints

### POST /salary/check
- **Description**: Check if a salary entry exists based on a unique ID.
- **Request Body**:
  ```json
  {
    "unique_id": "string"
  }
  ```
- **Response**:
  - **Success**:
    ```json
    {
      "success": true,
      "response": {
        "message": "Salary data exists",
        "exists": true,
        "salary_net": "number",
        "salary_gross": "number"
      },
      "action": "querySalaryByUniqueId",
      "error": null
    }
    ```
  - **Failure**:
    ```json
    {
      "success": true,
      "response": {
        "message": "Salary data does not exist",
        "exists": false
      },
      "action": "querySalaryByUniqueId",
      "error": null
    }
    ```

## Models
The salary route uses the following models:
- `querySalaryByUniqueId`: Fetches salary data based on a unique ID.

## DTOs
The salary route uses the following DTOs:
- `responseSalaryData`: Formats the response for salary data.

## Example Usage
```bash
curl -X POST http://localhost:3000/salary/check -H "Content-Type: application/json" -d '{"unique_id": "12345"}'
```

## Notes
- Ensure that the `unique_id` provided in the request body is valid and exists in the salary table.
- The route returns the `salary_net` and `salary_gross` fields if the salary entry exists.
