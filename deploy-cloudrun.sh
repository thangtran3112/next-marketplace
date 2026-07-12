#!/usr/bin/env bash
# =============================================================================
# deploy-cloudrun.sh - Deploy next-marketplace to GCP Cloud Run
# =============================================================================
# Prerequisites:
#   1. gcloud CLI installed and authenticated
#   2. GCP project set: gcloud config set project <PROJECT_ID>
#   3. Secrets stored in GCP Secret Manager (see setup instructions below)
#
# Usage:
#   chmod +x deploy-cloudrun.sh
#   ./deploy-cloudrun.sh
#
# First-time Secret Manager setup (run once):
#   gcloud services enable secretmanager.googleapis.com
#   gcloud secrets create MONGODB_URL --data-file=- <<< "your-mongodb-url"
#   gcloud secrets create PAYLOAD_SECRET --data-file=- <<< "your-payload-secret"
#   gcloud secrets create STRIPE_SECRET_KEY --data-file=- <<< "your-stripe-key"
#   gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- <<< "your-webhook-secret"
#   gcloud secrets create RESEND_API_KEY --data-file=- <<< "your-resend-key"
#   gcloud secrets create TRANSACTION_FEE_PRICE_ID --data-file=- <<< "your-price-id"
#   gcloud secrets create S3_ACCESS_KEY_ID --data-file=- <<< "your-s3-key-id"
#   gcloud secrets create S3_SECRET_ACCESS_KEY --data-file=- <<< "your-s3-secret"
# =============================================================================

set -euo pipefail

# ---- Configuration ----
SERVICE_NAME="next-marketplace"
REGION="us-west1"
DOMAIN="market.tobytran.dev"
SERVER_URL="https://${DOMAIN}"

# Non-sensitive env vars
GCS_MEDIA_BUCKET="tobytran-portfolio-media"
GCS_PRODUCT_FILES_BUCKET="tobytran-portfolio-product-files"

# ---- Pre-flight checks ----
echo "🔍 Checking gcloud configuration..."
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "❌ No GCP project set. Run: gcloud config set project <PROJECT_ID>"
  exit 1
fi
echo "   Project: $PROJECT_ID"
echo "   Region:  $REGION"
echo "   Service: $SERVICE_NAME"
echo "   Domain:  $DOMAIN"
echo ""

# ---- Enable required APIs ----
echo "🔧 Enabling required GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  --quiet

# ---- Deploy to Cloud Run ----
echo ""
echo "🚀 Deploying to Cloud Run..."
echo "   (Cloud Build will build the Docker image remotely)"
echo ""

gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 2 \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "NEXT_PUBLIC_SERVER_URL=${SERVER_URL}" \
  --set-env-vars "GCS_MEDIA_BUCKET=${GCS_MEDIA_BUCKET}" \
  --set-env-vars "GCS_PRODUCT_FILES_BUCKET=${GCS_PRODUCT_FILES_BUCKET}" \
  --set-env-vars "GCP_PROJECT_ID=${PROJECT_ID}" \
  --set-secrets "MONGODB_URL=MONGODB_URL:latest" \
  --set-secrets "PAYLOAD_SECRET=PAYLOAD_SECRET:latest" \
  --set-secrets "STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest" \
  --set-secrets "STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest" \
  --set-secrets "RESEND_API_KEY=RESEND_API_KEY:latest" \
  --set-secrets "TRANSACTION_FEE_PRICE_ID=TRANSACTION_FEE_PRICE_ID:latest"

# ---- Get the deployed URL ----
echo ""
echo "✅ Deployment complete!"
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format 'value(status.url)')
echo "   Cloud Run URL: $SERVICE_URL"
echo ""

# ---- Custom domain instructions ----
echo "📋 Custom domain setup (Cloudflare DNS):"
echo "   1. Map custom domain in Cloud Run:"
echo "      gcloud run domain-mappings create \\"
echo "        --service $SERVICE_NAME \\"
echo "        --domain $DOMAIN \\"
echo "        --region $REGION"
echo ""
echo "   2. In Cloudflare DNS for tobytran.dev, add a CNAME record:"
echo "      Name:    market"
echo "      Target:  ghs.googlehosted.com"
echo "      Proxy:   DNS only (gray cloud) — Cloud Run handles TLS"
echo ""
echo "   3. Verify the domain mapping:"
echo "      gcloud run domain-mappings describe \\"
echo "        --domain $DOMAIN \\"
echo "        --region $REGION"
echo ""
echo "   4. Update Stripe webhook endpoint to: ${SERVER_URL}/api/webhooks/stripe"
echo ""
echo "   5. Add tobytran.dev to Resend DNS (for email sending):"
echo "      https://resend.com/domains — add and verify tobytran.dev"
