FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.12.2

# Copy package files first and schema
COPY package.json pnpm-lock.yaml ./
COPY prisma/schema.prisma ./prisma/

# Install deps and generate prisma client
RUN pnpm install --frozen-lockfile

COPY . .

# Generate prisma client
RUN pnpm prisma generate

# Build app
RUN pnpm run build

# Prune dev deps
RUN pnpm prune --prod

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8001

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma/generated ./prisma/generated

EXPOSE 8001

CMD ["sh", "-c", "pnpm run prisma:migrate:prod && node ./build/app.js"]
