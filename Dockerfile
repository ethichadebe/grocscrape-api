# Use the matching Playwright image
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Expose the port your server runs on
EXPOSE 5000

# Start the app
CMD ["node", "index.js"]
