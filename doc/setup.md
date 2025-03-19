# Setup and Run

## Project Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/tabu-hr/tabu-db-api.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd tabu-db-api
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Create `.env` File**:
   ```bash
   touch .env
   ```

5. **Add Environment Variables**:
   - You need to have BigQuery connection credentials in JSON format before connecting
   ```bash
   echo "GOOGLE_APPLICATION_CREDENTIALS=big_query_conn.json" > .env
   echo "PORT=3001" >> .env
   echo "API_ROUTE=/api" >> .env
   echo "DB_SHEMA=app_demo" >> .env
   ```

6. **Start the Development Server**:
   ```bash
   npm start
   ```

## Running the Project in a Docker Container

1. **Create a Dockerfile**:
   ```Dockerfile
   # Use the official Node.js image as the base image
   FROM node:18

   # Set the working directory
   WORKDIR /app

   # Copy the application files to the container
   COPY . .

   # Install the dependencies
   RUN npm install

   # Start the application
   CMD ["npm", "start"]
   ```

2. **Build the Docker Image**:
   ```bash
   docker build -t tabu-db-api .
   ```

3. **Run the Docker Container**:
   ```bash
   docker run -p 3001:3001 tabu-db-api
   ```

## Using GitHub Secrets to Populate `process.env`

1. **Create a GitHub Secret**:
   - Go to your GitHub account.
   - Navigate to the repository settings.
   - Click on "Secrets" in the left sidebar.
   - Click on "New repository secret".
   - Enter a name for the secret (e.g., `GITHUB_TOKEN`).
   - Click on "Create secret".

2. **Add the Secret to Your Repository**:
   - Go to your repository on GitHub.
   - Click on "Settings" in the top right corner.
   - Click on "Secrets" in the left sidebar.
   - Click on "Actions" and then "New repository secret".
   - Select your newly created secret from the dropdown.
   - Click on "Add secret".

3. **Use the Secret in Your Project**:
   - In your project, create a `.env` file if it doesn't already exist.
   - Add the following line to the `.env` file:
     ```bash
     GITHUB_TOKEN=your_github_token
     ```

## Using dotenvx to Encrypt the `.env` File

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
   echo "PORT=3001" >> .env
   echo "API_ROUTE=/api" >> .env
   ```

4. **Encrypt the `.env` File**:
   ```bash
   dotenvx encrypt .env
   ```

## Setting Up as a Systemd Service

To set up the application as a systemd service with all environment variables from the .env.example file:

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

The application comes with several utility scripts to help with server management and maintenance tasks. These scripts are located in the `scripts/` directory and can be used to manage various aspects of your deployment.

### Key Available Scripts

- **Service Management**
  - `tabudb-status.sh` - Check the current status of the service
  - `tabudb-restart.sh` - Restart the service
  - `tabudb-logs.sh` - View service logs with various options

- **Server Setup**
  - `tabudb-nginx-setup.sh` - Configure Nginx as a reverse proxy
  - `tabudb-ssl-setup.sh` - Set up SSL with Let's Encrypt

- **Maintenance**
  - `tabudb-backup.sh` - Create backups of application code, configs, and data
  - `tabudb-restore.sh` - Restore from backups when needed
  - `tabudb-update.sh` - Safely update the application

- **Monitoring and Security**
  - `tabudb-health.sh` - Check system and application health
  - `tabudb-security-audit.sh` - Perform basic security audits

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
