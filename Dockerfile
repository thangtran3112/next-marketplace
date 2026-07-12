# =============================================================================
# Dockerfile - Optimized for GCP Cloud Run deployment
# =============================================================================
# Design Notes:
# - NEXT_PUBLIC_SERVER_URL must be a build-time ARG because Next.js inlines
#   NEXT_PUBLIC_* variables during the build step (they become static strings
#   in the client bundle).
# - Single-stage build because `npm run build:next` runs `node dist/server.js`
#   with NEXT_BUILD=true, which calls nextBuild(path.join(__dirname, "../"))
#   and needs the full project source tree present.
# - Build-time ENV fallbacks are defined to prevent compilation/build crashes
#   due to missing API keys or DB connections (since .env is gitignored and
#   not uploaded to Cloud Build). These are safely overridden at runtime by
#   Cloud Run configuration.
# - We clean up source files after build to reduce final image size.
# =============================================================================

FROM --platform=linux/amd64 node:20-alpine

# Only NEXT_PUBLIC_* vars need to be build-time ARGs (inlined by Next.js)
ARG NEXT_PUBLIC_SERVER_URL

# Build-time environment fallbacks to prevent compile/build crashes
ENV NEXT_PUBLIC_SERVER_URL="https://market.tobytran.dev" \
    PAYLOAD_SECRET="temp_secret_for_build" \
    MONGODB_URL="mongodb://localhost:27017/build" \
    RESEND_API_KEY="re_dummy_key_for_build" \
    STRIPE_SECRET_KEY="sk_test_dummy" \
    STRIPE_WEBHOOK_SECRET="whsec_dummy" \
    TRANSACTION_FEE_PRICE_ID="price_dummy" \
    GCS_MEDIA_BUCKET="dummy" \
    GCS_PRODUCT_FILES_BUCKET="dummy" \
    GCP_PROJECT_ID="dummy"

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev && \
    # Also install devDependencies needed for build, then prune after
    npm install && \
    cp -r node_modules /tmp/prod_modules_backup || true

COPY . .

# Full build: payload → server (tsc) → copyfiles → next
RUN npm run build

# Swap back to production-only node_modules to reduce image size
RUN rm -rf node_modules && \
    mv /tmp/prod_modules_backup node_modules || true && \
    # Clean up source files not needed at runtime
    rm -rf src/ && \
    rm -rf images/ && \
    rm -rf cdk-fargate/

ENV NODE_ENV=production
EXPOSE 3000

# Cloud Run sets PORT env var; our server.ts already reads process.env.PORT
CMD ["npm", "start"]