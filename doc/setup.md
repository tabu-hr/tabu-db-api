# Setup and Run

REPLACE
## Project Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/tabu-hr/tabu-db-api.git
   cd tabu-db-api
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create and Configure `.env` File**:
   ```bash
   touch .env
   echo "GOOGLE_APPLICATION_CREDENTIALS=big_query_conn.json" > .env
   echo "PORT=3001" >> .env
   echo "API_ROUTE=/api" >> .env
   echo "DB_SHEMA=app_demo" >> .env
   ```

4. **Start the Development Server**:
   ```bash
   npm start
   ```

## Running the Project in a Docker Container

1. **Create a Dockerfile**:
   ```Dockerfile
   FROM node:18
   WORKDIR /app
   COPY . .
   RUN npm install
   CMD ["npm", "start"]
   ```

2. **Build and Run the Docker Image**:
   ```bash
   docker build -t tabu-db-api .
   docker run -p 3001:3001 tabu-db-api
   ```

## Using GitHub Secrets to Populate `process.env`

1. **Create a GitHub Secret**:
   - Go to your GitHub account > Repository settings > Secrets > New repository secret.
   - Enter a name (e.g., `GITHUB_TOKEN`) and click "Create secret".

2. **Add the Secret to Your Repository**:
   - Go to your repository on GitHub > Settings > Secrets > Actions > New repository secret.
   - Select the secret and click "Add secret".

3. **Use the Secret in Your Project**:
   ```bash
   echo "GITHUB_TOKEN=your_github_token" >> .env
   ```

## Using dotenvx to Encrypt the `.env` File

1. **Install dotenvx**:
   ```bash
   npm install dotenvx
   ```

2. **Create and Encrypt the `.env` File**:
   ```bash
   touch .env
   echo "PORT=3001" >> .env
   echo "API_ROUTE=/api" >> .env
   dotenvx encrypt .env
   ```

## Setting Up as a Systemd Service

1. **Run the setup script**:
   ```bash
   ./scripts/setup-service.sh
   ```

2. **Enable and start the service**:
   ```bash
   sudo systemctl enable tabu-db-api.service
   sudo systemctl start tabu-db-api.service
   ```

3. **Check service status**:
   ```bash
   sudo systemctl status tabu-db-api.service
   ```

## Server Management Scripts

The application includes utility scripts for server management and maintenance, located in the `scripts/` directory.

### Key Available Scripts

- **Service Management**
  - `tabudb-status.sh`: Check the current status of the service
  - `tabudb-restart.sh`: Restart the service
  - `tabudb-logs.sh`: View service logs with various options

- **Server Setup**
  - `tabudb-nginx-setup.sh`: Configure Nginx as a reverse proxy
  - `tabudb-ssl-setup.sh`: Set up SSL with Let's Encrypt

- **Maintenance**
  - `tabudb-backup.sh`: Create backups of application code, configs, and data
  - `tabudb-restore.sh`: Restore from backups when needed
  - `tabudb-update.sh`: Safely update the application

- **Monitoring and Security**
  - `tabudb-health.sh`: Check system and application health
  - `tabudb-security-audit.sh`: Perform basic security audits

### Usage Example

```bash
# Check service status
./scripts/tabudb-status.sh

# View real-time logs
./scripts/tabudb-logs.sh -f

# Create a backup
sudo ./scripts/tabudb-backup.sh

# Configure Nginx
sudo ./scripts/tabudb-nginx-setup.sh yourdomain.com
```

For detailed documentation of all scripts, including options and examples, please refer to [Server Management Scripts Documentation](server-management-scripts.md).

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
