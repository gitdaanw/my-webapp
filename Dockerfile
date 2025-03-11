# Use Node.js LTS version
FROM node:22-alpine

# Set working directory
WORKDIR /backend

# Install JSON Server globally
RUN npm install -g json-server

# Copy the database file
COPY backend/data/picture_collection.json /backend/data/picture_collection.json

# Expose API port
EXPOSE 4000

# Start both servers
CMD ["json-server", "/backend/data/picture_collection.json", "--host", "0.0.0.0", "--port", "4000"]