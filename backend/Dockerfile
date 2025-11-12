FROM node:20-alpine

# Install necessary build tools for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy only backend sources into /app
COPY backend/package*.json ./
# Install with devDependencies so Nest CLI is available for build
RUN npm install --include=dev
COPY backend/. ./

# Build (no DB access required here)
RUN npm run build

EXPOSE 4000

# At runtime (when DATABASE_URL is available on Render), generate client and run migrations, then start
CMD ["sh", "-c", "npx prisma generate --schema=prisma/schema.prisma && npx prisma migrate deploy --schema=prisma/schema.prisma && npm run start:prod"]