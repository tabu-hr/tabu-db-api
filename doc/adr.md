# ADR: Example Title

## Status

Accepted

## Context

The project is currently in the development phase. The main components include the `src` directory with various modules and DTOs, and the `doc` directory with documentation files. The project uses BigQuery for data storage and retrieval.

The `src` directory contains the following key components:
- `index.js`: The main entry point of the application.
- `models`: Directory containing data models for various entities such as `user`, `submission`, and `bigQuery`.
- `dto`: Directory containing Data Transfer Objects (DTOs) for various entities.
- `routes`: Directory containing route definitions for the API.

The `doc` directory contains documentation files such as `project_structure.md`, `BigQuery setup.md`, and `contributing.md`.

## Decision

The decision was made to use BigQuery for data storage and retrieval due to its scalability and integration capabilities with other Google Cloud services. BigQuery offers a serverless architecture that automatically scales to handle large datasets and complex queries. Additionally, it integrates seamlessly with other Google Cloud services, allowing for a unified data management and analytics platform.

## Consequences

- The project will benefit from the scalability and performance of BigQuery, enabling efficient handling of large datasets and complex queries.
- Integration with other Google Cloud services will be straightforward, facilitating a unified data management and analytics platform.
- The team will need to learn and manage BigQuery-specific configurations and queries, which may require additional training and resources.
- Costs associated with BigQuery usage need to be monitored and managed to ensure they align with the project's budget.
- Data governance and security measures need to be implemented to protect sensitive data stored in BigQuery.
