# Use the official Node.js 14 image as the base image
FROM node:alpine

# Set the working directory to /app
WORKDIR /trans

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application with the "npm run dev" command
CMD ["npm", "run", "dev"]

