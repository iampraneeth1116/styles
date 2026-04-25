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

# Install dumb-init for proper signal handling (PID 1 issue)
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

# Copy installed node_modules + generated Prisma client from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY prisma ./prisma
COPY src ./src
COPY package.json ./

EXPOSE 4000

# Use dumb-init to handle signals correctly, then run the app
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
