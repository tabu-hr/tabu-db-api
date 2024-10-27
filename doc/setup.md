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
   echo "PORT=3000" >> .env
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
   docker run -p 3000:3000 tabu-db-api
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
   echo "PORT=3000" >> .env
   echo "API_ROUTE=/api" >> .env
   ```

4. **Encrypt the `.env` File**:
   ```bash
   dotenvx encrypt .env
   ```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
