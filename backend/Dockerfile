FROM node:20-alpine

# Install necessary build tools for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy only backend sources into /app
COPY backend/package*.json ./
# Install with devDependencies so Nest CLI is available for build
RUN npm install --include=dev && npm install -g @nestjs/cli
COPY backend/. ./

# Build (no DB access required here)
RUN nest build

EXPOSE 4000

# Start the application (Prisma generate/migrate will run in Render postdeploy)
CMD ["npm", "run", "start:prod"]