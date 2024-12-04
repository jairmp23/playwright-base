# Stage 1: Build stage
FROM mcr.microsoft.com/playwright:v1.46.0-noble as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Install Playwright dependencies and browsers
RUN npx playwright install --with-deps

# Stage 2: Final stage
FROM mcr.microsoft.com/playwright:v1.46.0-noble

# Set working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=builder /app /app

# Copy the Playwright browsers from the builder stage
COPY --from=builder /ms-playwright /ms-playwright

# Default command
CMD ["node", "app/main.js"]
