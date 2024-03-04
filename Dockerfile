ARG RENDERING_ENGINE
ARG LLM_ENGINE
ARG NEXT_PUBLIC_MAX_NB_PAGES
ARG NEXT_PUBLIC_ENABLE_RATE_LIMITER
ARG NEXT_PUBLIC_ENABLE_HUGGING_FACE_OAUTH
ARG NEXT_PUBLIC_ENABLE_HUGGING_FACE_OAUTH_WALL
ARG NEXT_PUBLIC_HUGGING_FACE_OAUTH_CLIENT_ID
ARG HUGGING_FACE_OAUTH_SECRET
ARG AUTH_HF_API_TOKEN
ARG AUTH_REPLICATE_API_TOKEN
ARG AUTH_OPENAI_API_KEY
ARG AUTH_VIDEOCHAIN_API_TOKEN
ARG AUTH_GROQ_API_KEY
ARG RENDERING_REPLICATE_API_MODEL
ARG ENDERING_REPLICATE_API_MODEL_VERSION
ARG RENDERING_HF_INFERENCE_ENDPOINT_URL
ARG RENDERING_HF_INFERENCE_API_BASE_MODEL
ARG RENDERING_HF_INFERENCE_API_REFINER_MODEL
ARG RENDERING_HF_INFERENCE_API_FILE_TYPE
ARG RENDERING_VIDEOCHAIN_API_URL
ARG RENDERING_OPENAI_API_BASE_URL
ARG RENDERING_OPENAI_API_MODEL
ARG LLM_GROQ_API_MODEL
ARG LLM_OPENAI_API_BASE_URL
ARG LLM_OPENAI_API_MODEL
ARG LLM_HF_INFERENCE_ENDPOINT_URL
ARG LLM_HF_INFERENCE_API_MODEL
ARG NEXT_PUBLIC_ENABLE_COMMUNITY_SHARING
ARG COMMUNITY_API_URL
ARG COMMUNITY_API_TOKEN
ARG COMMUNITY_API_ID
ARG ENABLE_CENSORSHIP
ARG SECRET_FINGERPRINT

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Uncomment the following lines if you want to use a secret at buildtime, 
# for example to access your private npm packages
# RUN --mount=type=secret,id=HF_EXAMPLE_SECRET,mode=0444,required=true \
#     $(cat /run/secrets/HF_EXAMPLE_SECRET)

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

# If you use yarn, comment out this line and use the line above
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/cache ./.next/cache
# COPY --from=builder --chown=nextjs:nodejs /app/.next/cache/fetch-cache ./.next/cache/fetch-cache

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
