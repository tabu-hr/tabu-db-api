# Response Documentation

This document provides documentation for the response structure used in the Tabu DB API. Each response is described with its purpose, parameters, and expected structure.

## Response Structure

- **Field**: `success`
  - **Type**: Boolean
  - **Description**: Indicates whether the operation was successful.

- **Field**: `table`
  - **Type**: String
  - **Description**: The name of the table being queried.

- **Field**: `model`
  - **Type**: String
  - **Description**: The name of the model being used.

- **Field**: `response`
  - **Type**: Object
  - **Description**: The data returned from the query.

- **Field**: `error`
  - **Type**: String
  - **Description**: The error message if the operation was not successful.
