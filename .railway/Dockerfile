FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY back/package.json ./back/
COPY shared/package.json ./shared/

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build shared package
RUN pnpm build-shared

# Build backend
RUN pnpm --filter back build

# Create env file from environment variables
RUN echo "NODE_ENV=production" > /app/back/.env
RUN echo "CONNECTION_STRING=$CONNECTION_STRING" >> /app/back/.env
RUN echo "FRONTEND_URL=$FRONTEND_URL" >> /app/back/.env
RUN echo "COOKIE_DOMAIN=$COOKIE_DOMAIN" >> /app/back/.env
RUN echo "BIRDEYE_API_KEY=$BIRDEYE_API_KEY" >> /app/back/.env

# Debug and run
CMD ["sh", "-c", "cat /app/back/.env && printenv && node /app/back/dist/index.js"] 