# Use an official Node.js runtime as the base image
FROM node:18.17.1-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy the rest of the application code to the container
COPY ./ ./

# Build your React application
RUN npm run build



# Use an official nginx runtime as the server image
FROM nginx:alpine AS serve

# Copy nginx config
COPY ./cd/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build dir to the nginx serve dir
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port your React app runs on
EXPOSE 3000

# run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]