# BigQuery setup

This document provides documentation for the BigQuery setup required for the application to access the data.

## Steps to take:

1. Create a new project.
2. Create a dataset in the new project. Name it `app_demo`
3. Populate the dataset with the tables, views, and data. Create tables with [this script](bigquery/create_tables.sql).
   - Vatroslav can populate the data with [this script](bigquery/insert_demo_data.sql).
   - For mock data, use [this script](mock_data.sql).
4. [Create a Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) on Google Cloud for the newly created project.
5. [Grant access](https://console.cloud.google.com/iam-admin/iam) to the newly created Service Account on the newly created project.
   - The required permissions are contained in the roles `BigQuery Data Viewer` and `BigQuery Job User`. The latter role is the reason the access is granted on the project level, not the dataset level.
6. Download the JSON key for the Service Account from [Service Accounts page](https://console.cloud.google.com/iam-admin/serviceaccounts).
   1. Click on the correct Service Account to open its details.
   2. Go to Key tab and add a new key, of the JSON type.
   3. The key will immediately be downloaded.
