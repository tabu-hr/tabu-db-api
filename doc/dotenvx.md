# Using dotenvx to Encrypt the `.env` File

1. **Install dotenvx**:
   ```bash
   npm install dotenvx
   ```

2. **Create a `.env` File**:
   ```bash
   touch .env
   ```

3. **Add Environment Variables**:
   ```bash
   echo "GOOGLE_APPLICATION_CREDENTIALS=big_query_conn.json" > .env
   echo "PORT=3000" >> .env
   echo "API_ROUTE=/api" >> .env
   echo "DB_SHEMA=app_demo" >> .env
   ```

4. **Encrypt the `.env` File**:
   ```bash
   dotenvx encrypt .env
