# tabu-db-api: API Source Code Analysis

## Overview

The tabu-db-api is a Node.js/Express API application that serves as an interface to a Google BigQuery database. It manages various data models related to user information, submissions, positions, and salary data, likely for a professional job platform or similar application.

## API Architecture

- **Framework**: Express.js
- **Database**: Google BigQuery
- **Authentication**: Uses Google Cloud credentials specified in environment variables
- **Entry Point**: `src/index.js`

## Core Components

### Main Application Setup (src/index.js)
- Configures Express with CORS support
- Loads environment variables from .env file
- Implements optional request logging
- Sets up JSON parsing middleware
- Configures API routes with a configurable base path

## API Endpoints

1. **GET /api/tables**
- Lists all available tables in the BigQuery database

2. **GET /api/user**
- Retrieves user data (excluding password hashes) with default limit of 10 records

3. **POST /api/user/check**
- Validates if a user exists by email
- Handles Google login integration
- Returns user ID if found

4. **POST /api/submission/check**
- Checks for submission data by unique ID
- Returns position data including position_group, position, seniority, tech, contract_type, country_salary

5. **POST /api/additional_position/check**
- Checks for additional position data by unique ID
- Returns position information (additional_position_group, additional_position)

6. **POST /api/salary/check**
- Retrieves salary information by unique ID
- Returns salary data (salary_net, salary_gross)

7. **GET /api/:tableName**
- Generic endpoint to query any table in the database
- Returns the first 10 rows of the specified table

## Data Models

### User Model
- Stores user information in the `user` table
- Excludes password hashes from queries for security
- Provides methods to find users by email

### Submission Model
- Stores submission data including position details
- Data retrievable by unique ID
- Contains fields for position group, position, seniority, tech stack, contract type, and salary country

### Additional Position Model
- Stores supplementary position data
- Contains fields for additional position groups and positions
- Accessible via unique ID

### Salary Model
- Stores salary information (net and gross values)
- Linked to users via unique ID

## Technical Implementation

- **Security**:
- Uses parameterized queries to prevent SQL injection
- Excludes sensitive data like password hashes

- **Architecture**:
- Follows MVC-like pattern with separation of:
    - Routes (API endpoints)
    - Models (data access layer)
    - DTOs (Data Transfer Objects for response formatting)

- **Middleware**:
- CORS handling for cross-origin requests
- Error management
- Request logging (configurable)
- JSON body parsing

## Environment Configuration

The application relies on several environment variables:
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google Cloud credentials file
- `DB_SHEMA`: Database schema name (defaults to 'app_demo' if not specified)
- `API_ROUTE`: Base route for API endpoints (defaults to '/api')
- `LOG_REQUESTS`: Flag to enable/disable request logging

## Project Structure

```
src/
├── index.js           # Main application entry point
├── routes/            # API route definitions
│   └── api.js         # Main API routes
├── models/            # Data models
│   ├── bigQuery.js    # Base BigQuery functionality
│   ├── user.js        # User data operations
│   ├── submission.js  # Submission data operations
│   ├── salary.js      # Salary data operations
│   └── additional_position.js  # Position data operations
├── middleware/        # Express middleware
└── dto/               # Data Transfer Objects
```

## Conclusion

The tabu-db-api provides a structured interface to a BigQuery database with multiple data models related to professional information. It follows good practices for security and code organization, with a clean separation between route handling and data access. The API appears well-suited for supporting a professional data platform, possibly for job listings, salary information, or professional profiles.

