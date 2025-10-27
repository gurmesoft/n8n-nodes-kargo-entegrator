FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies (including dev dependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Remove dev dependencies after build
RUN npm ci --only=production && npm cache clean --force

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S n8nuser -u 1001

# Change ownership of the app directory
RUN chown -R n8nuser:nodejs /app
USER n8nuser

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]