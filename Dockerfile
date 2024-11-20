# Use an official Node.js runtime as the base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application with the base path
RUN npm run build

# Use a smaller image to serve the built application
FROM node:20-alpine

# Install serve globally
RUN npm install -g serve

# Copy the built files from the builder stage
COPY --from=builder /app/dist /app/dist

# Expose port 3000
EXPOSE 3000

# Command to serve the application with the base URL
CMD ["serve", "-s", "/app/dist", "-l", "3000"]
