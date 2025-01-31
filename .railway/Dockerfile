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

# Start the app
CMD ["pnpm", "turbo", "run", "start", "--filter", "back"] 