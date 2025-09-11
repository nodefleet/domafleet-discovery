FROM node:18-alpine

# Install additional dependencies
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/ ./backend/

# Install dependencies
WORKDIR /app/backend
RUN npm install

# Go back to app root
WORKDIR /app

# Expose port
EXPOSE 3001

# Health check (HTTP)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:3001/health || exit 1

# Start the backend application in development mode
CMD ["npm", "run", "dev", "--prefix", "backend"]