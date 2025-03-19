/**
* BigQueryService - A service that provides a singleton BigQuery client and methods
* for querying and executing BigQuery operations.
* 
* This service implements connection pooling by using the singleton pattern
* to ensure that only one BigQuery client instance is created and reused
* across the application, improving performance and resource utilization.
*/

const { BigQuery } = require('@google-cloud/bigquery');
const config = require('../config/config');
const { DatabaseError } = require('../errors/customErrors');

/**
* BigQueryService class implements the singleton pattern to provide
* a single, reusable BigQuery client instance.
*/
class BigQueryService {
/**
* Private instance variable to hold the single BigQuery client
* @private
*/
static #instance = null;

/**
* Private BigQuery client instance
* @private
*/
#bigQueryClient = null;

/**
* Schema name from configuration
* @private
*/
#schemaName = null;

/**
* Private constructor to prevent direct instantiation
* @private
*/
constructor() {
    // Initialize BigQuery client with authentication
    this.#bigQueryClient = new BigQuery({
    keyFilename: config.database.credentialsPath,
    });
    
    this.#schemaName = config.database.schema;
}

/**
* Gets the singleton instance of BigQueryService
* @returns {BigQueryService} The singleton instance
*/
static getInstance() {
    if (BigQueryService.#instance === null) {
    BigQueryService.#instance = new BigQueryService();
    }
    return BigQueryService.#instance;
}

/**
* Gets the BigQuery client instance
* @returns {BigQuery} The BigQuery client
*/
getClient() {
    return this.#bigQueryClient;
}

/**
* Gets the schema name
* @returns {string} The schema name
*/
getSchemaName() {
    return this.#schemaName;
}

/**
* Executes a BigQuery query
* @param {Object} options - Query options
* @returns {Promise<Array>} Query results
* @throws {DatabaseError} If there's an error executing the query
*/
async query(options) {
    try {
    const [rows] = await this.#bigQueryClient.query(options);
    return rows;
    } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError('Failed to execute BigQuery query', err);
    }
}

/**
* Executes a parametrized SQL query
* @param {string} sql - SQL query string
* @param {Object} params - Query parameters
* @returns {Promise<Array>} Query results
* @throws {DatabaseError} If there's an error executing the query
*/
async executeQuery(sql, params = {}) {
    const options = {
    query: sql,
    params: params,
    location: 'US',
    };

    try {
    return await this.query(options);
    } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError(`Failed to execute query: ${sql}`, err);
    }
}

/**
* Creates a dataset in BigQuery
* @param {string} datasetId - Dataset ID
* @returns {Promise<Array>} Operation result
* @throws {DatabaseError} If there's an error creating the dataset
*/
async createDataset(datasetId) {
    try {
    const [dataset] = await this.#bigQueryClient.createDataset(datasetId);
    return dataset;
    } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError(`Failed to create dataset: ${datasetId}`, err);
    }
}

/**
* Creates a table in BigQuery
* @param {string} datasetId - Dataset ID
* @param {string} tableId - Table ID
* @param {Object} schema - Table schema
* @returns {Promise<Array>} Operation result
* @throws {DatabaseError} If there's an error creating the table
*/
async createTable(datasetId, tableId, schema) {
    try {
    const options = {
        schema: schema,
        location: 'US',
    };

    const [table] = await this.#bigQueryClient
        .dataset(datasetId)
        .createTable(tableId, options);
        
    return table;
    } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError(`Failed to create table: ${datasetId}.${tableId}`, err);
    }
}

/**
* Inserts rows into a BigQuery table
* @param {string} datasetId - Dataset ID
* @param {string} tableId - Table ID
* @param {Array} rows - Rows to insert
* @returns {Promise<Array>} Operation result
* @throws {DatabaseError} If there's an error inserting rows
*/
async insertRows(datasetId, tableId, rows) {
    try {
    const [apiResponse] = await this.#bigQueryClient
        .dataset(datasetId)
        .table(tableId)
        .insert(rows);
        
    return apiResponse;
    } catch (err) {
    console.error('ERROR:', err);
    throw new DatabaseError(`Failed to insert rows into table: ${datasetId}.${tableId}`, err);
    }
}
}

module.exports = BigQueryService;

