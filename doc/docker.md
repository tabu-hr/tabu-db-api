# Running the Project in a Docker Container

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

   # Expose the application port
   EXPOSE 3000

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
