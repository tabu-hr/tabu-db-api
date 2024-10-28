# Running the Project in a Docker Container

1. **Use existing shell script**
   - To build and run server with current dockerfile, use docker startup script: `scripts/docker_run_server.sh`, e.g.:
   ```shell
   docker build -t tabu-db-api ../ &&
   docker run --name tabu-db-api -p 3000:3000 tabu-db-api
   ```
   - To stop and remove existing `tabu-db-api` container, use `scripts/docker_remove_server.sh`, e.g.,:
   ```shell
   docker stop tabu-db-api &&
   docker rm tabu-db-api
   ```

2. **Create a Dockerfile**:
   ```Dockerfile

   # Use the official Node.js image as the base image
   FROM node:18

   # Set the working directory
   WORKDIR /app

   # Copy the application files to the container
   COPY . .

   # Install the dependencies
   RUN npm install

   # Expose the application port
   EXPOSE 3000

   # Start the application
   CMD ["npm", "start"]
   ```

3. **Build the Docker Image**:
   ```bash
   docker build -t tabu-db-api ../
   ```

4. **Run the Docker Container**:
   ```bash
   docker run --name tabu-db-api -p 3000:3000 tabu-db-api
   ```
