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

# Debug and run directly with node
CMD ["sh", "-c", "printenv && node /app/back/dist/index.js"] 