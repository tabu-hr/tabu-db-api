# Models Documentation

This document provides documentation for the models available in the Tabu DB API. Each model is described with its purpose, fields, and relationships.

## User Model

- **Function**: `queryUserTable`
- **Description**: Queries data from the `user` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `user` table.

- **Function**: `queryUserByEmail`
- **Description**: Queries data from the `user` table by email in the given dataset.
- **Parameters**:
  - `email`: The email of the user to query.
- **Response**: The data from the `user` table that matches the email.

## Submission Model

- **Function**: `querySubmissionByUniqueId`
- **Description**: Queries data from the `submission` table by unique ID in the given dataset.
- **Parameters**:
  - `unique_id`: The unique ID of the submission to query.
- **Response**: The data from the `submission` table that matches the unique ID.

## BigQuery Model

- **Function**: `listTables`
- **Description**: Lists all tables in the given dataset.
- **Parameters**: None
- **Response**: A list of table names.

- **Function**: `queryBigQuery`
- **Description**: Queries data from the specified table in the given dataset.
- **Parameters**:
  - `tableName`: The name of the table to query.
- **Response**: The data from the specified table.

## Additional Position Model

- **Function**: `queryAdditionalPositionTable`
- **Description**: Queries data from the `additional_position` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `additional_position` table.

## Benefit Children Model

- **Function**: `queryBenefitChildrenTable`
- **Description**: Queries data from the `benefit_children` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_children` table.

## Benefit Education Model

- **Function**: `queryBenefitEducationTable`
- **Description**: Queries data from the `benefit_education` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_education` table.

## Benefit Equipment Model

- **Function**: `queryBenefitEquipmentTable`
- **Description**: Queries data from the `benefit_equipment` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_equipment` table.

## Benefit Flexible Work Model

- **Function**: `queryBenefitFlexibleWorkTable`
- **Description**: Queries data from the `benefit_flexible_work` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_flexible_work` table.

## Benefit Food Drinks Model

- **Function**: `queryBenefitFoodDrinksTable`
- **Description**: Queries data from the `benefit_food_drinks` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_food_drinks` table.

## Benefit Health Model

- **Function**: `queryBenefitHealthTable`
- **Description**: Queries data from the `benefit_health` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_health` table.

## Benefit Mobility Model

- **Function**: `queryBenefitMobilityTable`
- **Description**: Queries data from the `benefit_mobility` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_mobility` table.

## Benefit Monetary Grants Model

- **Function**: `queryBenefitMonetaryGrantsTable`
- **Description**: Queries data from the `benefit_monetary_grants` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_monetary_grants` table.

## Benefit Social Responsibility Model

- **Function**: `queryBenefitSocialResponsibilityTable`
- **Description**: Queries data from the `benefit_social_responsibility` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_social_responsibility` table.

## Benefit Teambuilding Model

- **Function**: `queryBenefitTeambuildingTable`
- **Description**: Queries data from the `benefit_teambuilding` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_teambuilding` table.

## Benefit Vacation Model

- **Function**: `queryBenefitVacationTable`
- **Description**: Queries data from the `benefit_vacation` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_vacation` table.

## Benefit Wellbeing Model

- **Function**: `queryBenefitWellbeingTable`
- **Description**: Queries data from the `benefit_wellbeing` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `benefit_wellbeing` table.

## Company Model

- **Function**: `queryCompanyTable`
- **Description**: Queries data from the `company` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `company` table.

## Freelance Model

- **Function**: `queryFreelanceTable`
- **Description**: Queries data from the `freelance` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `freelance` table.

## History Model

- **Function**: `queryHistoryTable`
- **Description**: Queries data from the `history` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `history` table.

## Leading Model

- **Function**: `queryLeadingTable`
- **Description**: Queries data from the `leading` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `leading` table.

## Salary Model

- **Function**: `querySalaryTable`
- **Description**: Queries data from the `salary` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `salary` table.

## Seasonal Bonuses Model

- **Function**: `querySeasonalBonusesTable`
- **Description**: Queries data from the `seasonal_bonuses` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `seasonal_bonuses` table.

## Student Model

- **Function**: `queryStudentTable`
- **Description**: Queries data from the `student` table in the given dataset.
- **Parameters**: None
- **Response**: The data from the `student` table.

## List Tech Model

- **Purpose**: Represents a list of technologies associated with a user or submission.
- **View**: This model is a view of the database.
- **Fields**:
  - `unique_id`: The unique identifier for the list tech entry.
  - `tech`: The technology stack.
  - `amount`: The amount or count of the technology stack.
- **Relationships**:
  - A list tech entry belongs to a user.
  - A list tech entry can be associated with multiple submissions.

## List Country Salary Model

- **Purpose**: Represents a list of country salaries associated with a user or submission.
- **View**: This model is a view of the database.
- **Fields**:
  - `unique_id`: The unique identifier for the list country salary entry.
  - `countrySalary`: The country salary amount.
  - `amount`: The amount or count of the country salary.
- **Relationships**:
  - A list country salary entry belongs to a user.
  - A list country salary entry can be associated with multiple submissions.

## List Contract Type Model

- **Purpose**: Represents the contract type information for a user or submission.
- **View**: This model is a view of the database.
- **Fields**:
  - `unique_id`: The unique identifier for the contract type.
  - `contractType`: The type of contract.
  - `amount`: The amount or value associated with the contract type.
- **Relationships**:
  - A contract type belongs to a user.
  - A contract type can be associated with multiple submissions.

## Data Amount Model

- **Purpose**: Represents the data amount information for a user or submission.
- **View**: This model is a view of the database.
- **Fields**:
  - `unique_id`: The unique identifier for the data amount.
  - `amount`: The data amount value.
- **Relationships**:
  - A data amount belongs to a user.
  - A data amount can be associated with multiple submissions.
