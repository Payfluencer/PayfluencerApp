FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.12.2

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Copy prisma schema
COPY prisma/schema.prisma ./prisma/

# Install deps and generate prisma client with proper binary targets
RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

# Now copy the rest of the files except for the generated prisma folder
# We can't use COPY . . directly as it would overwrite the generated files
COPY ./app.ts ./tsconfig.json ./
COPY ./controllers ./controllers
COPY ./database ./database
COPY ./middleware ./middleware
COPY ./router ./router
COPY ./types ./types
COPY ./utils ./utils

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

CMD ["node", "./build/app.js"]
