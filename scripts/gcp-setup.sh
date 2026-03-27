#!/usr/bin/env bash
# =============================================================================
# Atelier Private Dining — GCP Infrastructure Setup
# Run this in GCP Cloud Shell: https://shell.cloud.google.com
#
# Usage:
#   1. Open https://shell.cloud.google.com
#   2. Clone repo or upload this file
#   3. chmod +x gcp-setup.sh && ./gcp-setup.sh
# =============================================================================
set -euo pipefail

# ── CONFIGURATION ─────────────────────────────────────────────────────────────
# Edit these before running:
PROJECT_ID="atelier-private-dining"        # Must be globally unique in GCP
REGION="europe-west1"                      # Closest to Romania (Belgium)
DB_INSTANCE="atelier-db"
DB_NAME="atelier"
DB_USER="atelier"
BUCKET_NAME="${PROJECT_ID}-images"
SERVICE_ACCOUNT="atelier-api-sa"
# ─────────────────────────────────────────────────────────────────────────────

echo "╔══════════════════════════════════════════════════╗"
echo "║   Atelier Private Dining — GCP Setup             ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "Project ID : $PROJECT_ID"
echo "Region     : $REGION"
echo ""

# ── 1. SET PROJECT ────────────────────────────────────────────────────────────
echo "▶ Setting active project..."
gcloud config set project "$PROJECT_ID"

# ── 2. ENABLE APIS ───────────────────────────────────────────────────────────
echo "▶ Enabling required APIs (this may take ~2 minutes)..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  sql-component.googleapis.com \
  secretmanager.googleapis.com \
  storage.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  firebase.googleapis.com \
  --quiet

echo "  ✓ APIs enabled"

# ── 3. CLOUD SQL ──────────────────────────────────────────────────────────────
echo "▶ Creating Cloud SQL PostgreSQL instance (this takes ~5 minutes)..."
gcloud sql instances create "$DB_INSTANCE" \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region="$REGION" \
  --storage-auto-increase \
  --backup-start-time=02:00 \
  --quiet

echo "  ✓ Cloud SQL instance created"

echo "▶ Creating database..."
gcloud sql databases create "$DB_NAME" --instance="$DB_INSTANCE" --quiet
echo "  ✓ Database '$DB_NAME' created"

echo "▶ Creating DB user with random password..."
DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)
gcloud sql users create "$DB_USER" \
  --instance="$DB_INSTANCE" \
  --password="$DB_PASSWORD" \
  --quiet
echo "  ✓ DB user '$DB_USER' created"

CLOUD_SQL_CONNECTION_NAME=$(gcloud sql instances describe "$DB_INSTANCE" \
  --format="value(connectionName)")
echo "  Connection name: $CLOUD_SQL_CONNECTION_NAME"

# ── 4. GCS BUCKET ─────────────────────────────────────────────────────────────
echo "▶ Creating GCS bucket..."
gcloud storage buckets create "gs://$BUCKET_NAME" \
  --location="$REGION" \
  --uniform-bucket-level-access \
  --quiet
echo "  ✓ Bucket '$BUCKET_NAME' created"

echo "▶ Making bucket publicly readable for images..."
gcloud storage buckets add-iam-policy-binding "gs://$BUCKET_NAME" \
  --member="allUsers" \
  --role="roles/storage.objectViewer" \
  --quiet
echo "  ✓ Bucket is public"

CDN_BASE_URL="https://storage.googleapis.com/$BUCKET_NAME"

# ── 5. SERVICE ACCOUNT ────────────────────────────────────────────────────────
echo "▶ Creating service account..."
gcloud iam service-accounts create "$SERVICE_ACCOUNT" \
  --display-name="Atelier API Service Account" \
  --quiet

SA_EMAIL="${SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com"
echo "  ✓ Service account: $SA_EMAIL"

echo "▶ Granting IAM roles..."
for ROLE in \
  "roles/run.admin" \
  "roles/cloudsql.client" \
  "roles/storage.admin" \
  "roles/secretmanager.secretAccessor" \
  "roles/containerregistry.ServiceAgent" \
  "roles/iam.serviceAccountUser"; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="$ROLE" \
    --quiet
  echo "  ✓ Granted $ROLE"
done

echo "▶ Creating service account key..."
gcloud iam service-accounts keys create sa-key.json \
  --iam-account="$SA_EMAIL" \
  --quiet
echo "  ✓ Key saved to sa-key.json"

# ── 6. SECRET MANAGER ─────────────────────────────────────────────────────────
echo "▶ Creating Secret Manager secrets..."

echo -n "$DB_USER" | gcloud secrets create "atelier-db-user" \
  --data-file=- --quiet
echo -n "$DB_PASSWORD" | gcloud secrets create "atelier-db-password" \
  --data-file=- --quiet

echo "  ✓ DB secrets created"
echo ""
echo "  ⚠  You must add the ANTHROPIC_API_KEY secret manually:"
echo "     echo -n 'sk-ant-YOUR-KEY' | gcloud secrets create ANTHROPIC_API_KEY --data-file=-"
echo ""

# Grant Cloud Run's default compute SA access to secrets
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$COMPUTE_SA" \
  --role="roles/secretmanager.secretAccessor" \
  --quiet
echo "  ✓ Compute SA granted secret accessor role"

# ── 7. SUMMARY ────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   Setup complete! Add these to GitHub:           ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "── GitHub SECRETS (Settings → Secrets → Actions) ──"
echo ""
echo "  GCP_SA_KEY           → contents of sa-key.json (cat sa-key.json)"
echo "  ANTHROPIC_API_KEY    → your Anthropic key (already set if done before)"
echo ""
echo "── GitHub VARIABLES (Settings → Variables → Actions) ──"
echo ""
echo "  GCP_PROJECT_ID            = $PROJECT_ID"
echo "  GCP_REGION                = $REGION"
echo "  CLOUD_SQL_CONNECTION_NAME = $CLOUD_SQL_CONNECTION_NAME"
echo "  DB_NAME                   = $DB_NAME"
echo "  GCP_DB_USER_SECRET        = atelier-db-user"
echo "  GCP_DB_PASSWORD_SECRET    = atelier-db-password"
echo "  IMAGES_BUCKET             = $BUCKET_NAME"
echo "  CDN_BASE_URL              = $CDN_BASE_URL"
echo "  API_URL                   = (set after first successful deploy)"
echo ""
echo "── NEXT STEP ──"
echo ""
echo "  1. Copy sa-key.json contents → GitHub Secret GCP_SA_KEY"
echo "  2. Set all Variables above"
echo "  3. Add ANTHROPIC_API_KEY to Secret Manager (command above)"
echo "  4. Push any change to api/ to trigger deploy"
echo ""
echo "  ⚠  Delete sa-key.json when done: rm sa-key.json"
echo ""
