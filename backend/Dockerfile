FROM node:20-alpine

# Install necessary build tools for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy application code
COPY . .

# Install dependencies and build (no DB access required here)
RUN npm install \
    && npm run build

EXPOSE 4000

# At runtime (when DATABASE_URL is available on Render), generate client and run migrations, then start
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start:prod"]