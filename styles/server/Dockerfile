# ─── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Copy Prisma schema before npm install so postinstall (prisma generate) works
COPY prisma ./prisma

# Install all dependencies (including dev — needed for prisma CLI)
RUN npm ci


# ─── Stage 2: Production image ────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling (PID 1 issue) and curl for healthcheck
RUN apk add --no-cache dumb-init curl

ENV NODE_ENV=production

# Copy installed node_modules + generated Prisma client from deps stage
COPY --chown=node:node --from=deps /app/node_modules ./node_modules

# Copy application source
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node src ./src
COPY --chown=node:node package.json ./

# Define healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

EXPOSE 4000

# Set non-root user
USER node

# Use dumb-init to handle signals correctly
# Run prisma migrate deploy first to ensure DB schema exists, then start the app
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
