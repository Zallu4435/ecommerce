# 1) Install production dependencies
FROM node:20-bullseye AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# 2) Copy application source
FROM node:20-bullseye AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 3) Distroless runtime image (Node 20)
FROM gcr.io/distroless/nodejs20-debian12:nonroot
WORKDIR /app
ENV NODE_ENV=production
COPY --from=runner /app ./
EXPOSE 5000
CMD ["server.js"]
