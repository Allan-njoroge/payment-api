# ---------- Base Stage ----------
FROM node:24-alpine AS base

WORKDIR /usr/app

# Set default NODE_ENV (can be overridden at build time)
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Install build tools (only needed for native deps during install)
RUN apk add --no-cache \
  bash \
  python3 \
  make \
  g++ \
  && rm -rf /var/cache/apk/*

COPY package*.json ./

# ---------- Dependencies Stage ----------
FROM base AS deps

# Install dependencies based on NODE_ENV
RUN npm install

# ---------- Builder Stage ----------
FROM deps AS builder

COPY . .

# Only run build in production mode
RUN [ "$NODE_ENV" = "production" ] && npm run build || echo "Skipping build"

# ---------- Final Runtime Stage ----------
FROM node:24-alpine AS final

WORKDIR /usr/app

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

COPY --from=builder /usr/app .

# Install only necessary deps for runtime
RUN if [ "$NODE_ENV" = "production" ]; then \
      npm ci --omit=dev; \
    else \
      npm install; \
    fi

EXPOSE 3000

# Run appropriate command
CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then node dist/index.js; else npm run dev; fi" ]