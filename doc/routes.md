# Routes Documentation

This document provides documentation for the routes available in the Tabu DB API. Each route is described with its purpose, parameters, and expected response.

## List Tables

- **Route**: `/tables`
- **Method**: GET
- **Description**: Lists all tables in the given dataset.
- **Parameters**: None
- **Response**: A list of table names.

## Query Data

- **Route**: `/data/:tableName`
- **Method**: GET
- **Description**: Queries data from the specified table in the given dataset.
- **Parameters**:
  - `tableName`: The name of the table to query.
- **Response**: The data from the specified table.

## Documentation for Other Routes

- **Route**: `/user`
- **Method**: GET
- **Description**: Queries data from the `user` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `user` table.

- **Route**: `/submission`
- **Method**: GET
- **Description**: Queries data from the `submission` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `submission` table.

- **Route**: `/additional_position`
- **Method**: GET
- **Description**: Queries data from the `additional_position` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `additional_position` table.

- **Route**: `/benefit_children`
- **Method**: GET
- **Description**: Queries data from the `benefit_children` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_children` table.

- **Route**: `/benefit_education`
- **Method**: GET
- **Description**: Queries data from the `benefit_education` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_education` table.

- **Route**: `/benefit_equipment`
- **Method**: GET
- **Description**: Queries data from the `benefit_equipment` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_equipment` table.

- **Route**: `/benefit_flexible_work`
- **Method**: GET
- **Description**: Queries data from the `benefit_flexible_work` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_flexible_work` table.

- **Route**: `/benefit_food_drinks`
- **Method**: GET
- **Description**: Queries data from the `benefit_food_drinks` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_food_drinks` table.

- **Route**: `/benefit_health`
- **Method**: GET
- **Description**: Queries data from the `benefit_health` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_health` table.

- **Route**: `/benefit_mobility`
- **Method**: GET
- **Description**: Queries data from the `benefit_mobility` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_mobility` table.

- **Route**: `/benefit_monetary_grants`
- **Method**: GET
- **Description**: Queries data from the `benefit_monetary_grants` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_monetary_grants` table.

- **Route**: `/benefit_social_responsibility`
- **Method**: GET
- **Description**: Queries data from the `benefit_social_responsibility` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_social_responsibility` table.

- **Route**: `/benefit_teambuilding`
- **Method**: GET
- **Description**: Queries data from the `benefit_teambuilding` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_teambuilding` table.

- **Route**: `/benefit_vacation`
- **Method**: GET
- **Description**: Queries data from the `benefit_vacation` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_vacation` table.

- **Route**: `/benefit_wellbeing`
- **Method**: GET
- **Description**: Queries data from the `benefit_wellbeing` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_wellbeing` table.

- **Route**: `/company`
- **Method**: GET
- **Description**: Queries data from the `company` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `company` table.

- **Route**: `/freelance`
- **Method**: GET
- **Description**: Queries data from the `freelance` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `freelance` table.

- **Route**: `/history`
- **Method**: GET
- **Description**: Queries data from the `history` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `history` table.

- **Route**: `/leading`
- **Method**: GET
- **Description**: Queries data from the `leading` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `leading` table.

- **Route**: `/salary`
- **Method**: GET
- **Description**: Queries data from the `salary` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `salary` table.

- **Route**: `/seasonal_bonuses`
- **Method**: GET
- **Description**: Queries data from the `seasonal_bonuses` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `seasonal_bonuses` table.

- **Route**: `/student`
- **Method**: GET
- **Description**: Queries data from the `student` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `student` table.

- **Route**: `/user/check`
- **Method**: POST
- **Description**: Checks if a user with the given email exists and returns the result.
- **Parameters**:
  - `email`: The email of the user to check.
- **Response**: A message indicating whether the user email exists, along with the user's name and ID if the email exists.

- **Route**: `/submission/check`
- **Method**: POST
- **Description**: Checks if a submission with the given unique_id exists and returns the relevant fields.
- **Parameters**:
  - `unique_id`: The unique ID of the submission to check.
- **Response**: A message indicating whether the submission data exists, along with the relevant fields if the submission exists.

- **Route**: `/data_amount/filter`
- **Method**: POST
- **Description**: Retrieves data amount and salary statistics based on various filtering parameters.
- **Parameters**:
  - `parameter_position_group` OR `parameter_position`: Position group (e.g., "Engineering") or specific position (e.g., "Software Engineer"), one is required but not both
  - `parameter_seniority`: Seniority level (e.g., "Junior", "Middle", "Senior"), can be pipe-separated for multiple values
  - `parameter_country_salary`: Country for salary data (e.g., "USA", "Germany"), can be pipe-separated for multiple countries
  - `parameter_contract_type`: Type of contract (e.g., "Full-time", "Part-time"), can be pipe-separated for multiple types
  - `parameter_tech`: (Optional) Technology stack (e.g., "JavaScript", "Python"), can be pipe-separated for multiple technologies
- **Response**: Data including amount of matching records and salary statistics (average and median for both net and gross salary).


## API Routes

The following table describes the available API routes in the application:

| Method | Route                      | Description                                              |
|--------|-----------------------------|----------------------------------------------------------|
| GET    | /tables                     | Retrieves a list of all tables.                          |
| POST   | /user/check                 | Validates user email and checks if it exists.           |
| POST   | /submission/check           | Validates submission data and checks if it exists.    |
| POST   | /additional_position/check  | Validates additional position data and checks if it exists. |
| POST   | /salary/check               | Validates salary data and checks if it exists.          |
| POST   | /list_tech/check            | Validates list tech data and checks if it exists.      |
| POST   | /list_country_salary/check  | Validates list country salary data and checks if it exists. |
| POST   | /contract_type/check        | Validates contract type data and checks if it exists.  |
| POST   | /data_amount/filter         | Retrieves data amount and salary statistics based on filtering criteria. |
| GET    | /:tableName                 | Retrieves data for a specific table.                    |
