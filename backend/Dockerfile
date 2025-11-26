# syntax=docker/dockerfile:1

# 1) Install production dependencies
FROM node:18-bullseye AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# 2) Copy application source (no build step needed for Express)
FROM node:18-bullseye AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 3) Distroless runtime image (small, secure, non-root)
FROM gcr.io/distroless/nodejs18-debian12:nonroot
WORKDIR /app
ENV NODE_ENV=production
COPY --from=runner /app ./
EXPOSE 5000
# Distroless node images use node as entrypoint; supply script as CMD
CMD ["server.js"]
