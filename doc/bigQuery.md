# BigQuery Documentation

This document provides documentation for the BigQuery interactions available in the Tabu DB API. Each interaction is described with its purpose, parameters, and expected response.

## List Tables

- **Interaction**: `listTables`
- **Description**: Lists all tables in the given dataset.
- **Parameters**: None
- **Response**: A list of table names.

## Query BigQuery

- **Interaction**: `queryBigQuery`
- **Description**: Queries data from the specified table in the given dataset.
- **Parameters**:
  - `tableName`: The name of the table to query.
- **Response**: The data from the specified table.
