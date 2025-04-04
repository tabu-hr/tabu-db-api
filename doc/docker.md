# Running the Project in a Docker Container

1. **Use existing shell script**
   - To build and run server with current dockerfile, use docker startup script: `scripts/docker_run_server.sh`, e.g.:
   ```shell
   docker build -t tabu-db-api . &&
   docker run --name tabu-db-api -p 3001:3001 tabu-db-api
   ```
   - To stop and remove existing `tabu-db-api` container, use `scripts/docker_remove_server.sh`, e.g.,:
   ```shell
   docker stop tabu-db-api &&
   docker rm tabu-db-api
   ```

2. **Create a Dockerfile**:
   ```Dockerfile
   FROM node:22
   WORKDIR /app
   COPY . .
   RUN npm install
   EXPOSE 3001
   CMD ["npm", "start"]
   ```

3. **Build the Docker Image**:
   ```bash
   docker build -t tabu-db-api .
   ```

4. **Run the Docker Container**:
   ```bash
   docker run --name tabu-db-api -p 3001:3001 tabu-db-api
   ```
