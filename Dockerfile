# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install the dotenvx package globally
RUN curl -sfS https://dotenvx.sh/install.sh | sh

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Install the dotenvx package globally
##RUN npm install -g dotenvx

# Copy the rest of the application code to the container
COPY . .

# Encrypt the .env file
RUN dotenvx encrypt .env


# Expose port 3000
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
