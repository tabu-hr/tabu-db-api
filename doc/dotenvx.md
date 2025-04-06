# Using dotenvx to Encrypt the `.env` File

1. **Install dotenvx**:
   ```bash
   npm install dotenvx
   ```

2. **Create and Encrypt the `.env` File**:
   ```bash
   touch .env
   echo "GOOGLE_APPLICATION_CREDENTIALS=big_query_conn.json" > .env
   echo "PORT=3001" >> .env
   echo "API_ROUTE=/api" >> .env
   echo "DB_SCHEMA=app_demo" >> .env
   echo "NODE_ENV=development" >> .env
   echo "LOG_REQUESTS=false" >> .env
   echo "RATE_LIMIT_WINDOW_MS=900000" >> .env
   echo "RATE_LIMIT_MAX=100" >> .env
   echo "RATE_LIMIT_MESSAGE=Too many requests from this IP, please try again later." >> .env
   echo "PAGINATION_LIMIT=10" >> .env
   echo "PAGINATION_OFFSET=0" >> .env
   echo "JWT_SECRET=your-jwt-secret-key" >> .env
   echo "JWT_ACCESS_TOKEN_EXPIRY=1h" >> .env
   echo "JWT_REFRESH_TOKEN_EXPIRY=7d" >> .env
   echo "GOOGLE_CLIENT_ID=your-google-client-id" >> .env
   echo "REDIS_HOST=localhost" >> .env
   echo "REDIS_PORT=6379" >> .env
   echo "REDIS_PASSWORD=" >> .env
   echo "API_KEY=your-api-key-here" >> .env
   echo "TEST_UNIQUE_ID=your-test-unique-id-here" >> .env
   echo "TEST_EMAIL=your-test-email@example.com" >> .env
   dotenvx encrypt .env
   ```
