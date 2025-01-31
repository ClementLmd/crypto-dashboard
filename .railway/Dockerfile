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

# Debug environment variables
CMD ["sh", "-c", "echo 'Railway Variables:' && \
     echo \"CONNECTION_STRING='$CONNECTION_STRING'\" && \
     echo \"NODE_ENV='$NODE_ENV'\" && \
     echo \"FRONTEND_URL='$FRONTEND_URL'\" && \
     echo \"COOKIE_DOMAIN='$COOKIE_DOMAIN'\" && \
     echo \"BIRDEYE_API_KEY='$BIRDEYE_API_KEY'\" && \
     node /app/back/dist/index.js"] 