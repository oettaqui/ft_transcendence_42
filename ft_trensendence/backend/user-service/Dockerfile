# Use a stable Node.js LTS version
FROM node:18.19-alpine

# Set working directory
WORKDIR /app

# Install sqlite3 dependencies
RUN apk add --no-cache sqlite python3 make g++

# Copy package.json first
COPY package.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm install --omit=dev --no-optional

# Copy source code
COPY . .

# Create data directory with proper permissions
RUN mkdir -p /app/data && chmod 755 /app/data

# Create nodejs user and set permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to nodejs user
USER nodejs

# Expose port
EXPOSE 3001

# Add a simple health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "server.js"]