# Multi-stage build following Next.js's own standalone-output recipe
# (https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
# so the final image ships only the traced runtime files, not the full
# node_modules or the build toolchain.

FROM node:22-alpine AS base

# ---- Dependencies -----------------------------------------------------
FROM base AS deps
# Required by some native deps (e.g. sharp) on Alpine's musl libc.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build --------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Runtime --------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Public assets and prerendered static files aren't included in the
# standalone trace on purpose (Next.js expects a CDN in front of them in a
# typical deploy) — copied in by hand here since this image serves them
# itself.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
