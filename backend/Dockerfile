FROM node:20-alpine

# Install necessary build tools for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy application code
COPY . .

# Install dependencies and build
RUN npm install \
    && npm run build \
    && npx prisma generate \
    && npx prisma migrate deploy

EXPOSE 4000

CMD ["npm", "run", "start:prod"]