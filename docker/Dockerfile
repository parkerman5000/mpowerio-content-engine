# mpowerio Content Engine - Docker Build
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# ================================
# Dependencies Stage
# ================================
FROM base AS deps

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/core/package.json ./packages/core/
COPY packages/dashboard/package.json ./packages/dashboard/
COPY packages/modules/research-pulse/package.json ./packages/modules/research-pulse/
COPY packages/modules/script-gen/package.json ./packages/modules/script-gen/
COPY packages/modules/video-gen/package.json ./packages/modules/video-gen/
COPY packages/modules/repurpose/package.json ./packages/modules/repurpose/
COPY packages/modules/post-queue/package.json ./packages/modules/post-queue/
COPY packages/modules/analytics/package.json ./packages/modules/analytics/

# Install dependencies
RUN pnpm install --frozen-lockfile

# ================================
# Builder Stage
# ================================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=deps /app/packages/dashboard/node_modules ./packages/dashboard/node_modules
COPY --from=deps /app/packages/modules/research-pulse/node_modules ./packages/modules/research-pulse/node_modules
COPY --from=deps /app/packages/modules/script-gen/node_modules ./packages/modules/script-gen/node_modules
COPY --from=deps /app/packages/modules/video-gen/node_modules ./packages/modules/video-gen/node_modules
COPY --from=deps /app/packages/modules/repurpose/node_modules ./packages/modules/repurpose/node_modules
COPY --from=deps /app/packages/modules/post-queue/node_modules ./packages/modules/post-queue/node_modules
COPY --from=deps /app/packages/modules/analytics/node_modules ./packages/modules/analytics/node_modules

# Copy source files
COPY . .

# Build all packages
RUN pnpm build

# ================================
# Runner Stage
# ================================
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/packages/dashboard/.next/standalone ./
COPY --from=builder /app/packages/dashboard/.next/static ./packages/dashboard/.next/static
COPY --from=builder /app/packages/dashboard/public ./packages/dashboard/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "packages/dashboard/server.js"]
