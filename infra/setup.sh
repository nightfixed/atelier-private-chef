#!/bin/bash
# Provisions GCP infrastructure for the Atelier Private Chef platform.
# Run once per environment to set up Cloud Storage, Cloud SQL, and IAM.
# Usage: GCP_PROJECT_ID=my-project GCP_REGION=us-central1 ./setup.sh

set -e

PROJECT="${GCP_PROJECT_ID:?GCP_PROJECT_ID is required}"
REGION="${GCP_REGION:-us-central1}"
IMAGES_BUCKET="${IMAGES_BUCKET:-atelier-private-chef-images}"
DB_INSTANCE="${DB_INSTANCE:-atelier-db}"
DB_NAME="${DB_NAME:-atelier}"
SERVICE_ACCOUNT="atelier-deploy@${PROJECT}.iam.gserviceaccount.com"
AI_SA="atelier-ai-teammate@${PROJECT}.iam.gserviceaccount.com"

echo "Project:  $PROJECT"
echo "Region:   $REGION"
echo "Bucket:   $IMAGES_BUCKET"
echo ""

# === Google Cloud Storage ===
echo "==> Creating GCS bucket: $IMAGES_BUCKET"
gcloud storage buckets create "gs://$IMAGES_BUCKET" \
  --project="$PROJECT" \
  --location="$REGION" \
  --uniform-bucket-level-access || echo "Bucket already exists, skipping."

echo "==> Making bucket public (allUsers objectViewer)"
gcloud storage buckets add-iam-policy-binding "gs://$IMAGES_BUCKET" \
  --project="$PROJECT" \
  --member="allUsers" \
  --role="roles/storage.objectViewer"

echo "==> Configuring CORS for direct browser uploads"
cat > /tmp/cors.json << 'EOF'
[{
  "origin": ["https://nightfixed.github.io"],
  "method": ["PUT", "GET"],
  "responseHeader": ["Content-Type"],
  "maxAgeSeconds": 3600
}]
EOF
gcloud storage buckets update "gs://$IMAGES_BUCKET" \
  --project="$PROJECT" \
  --cors-file=/tmp/cors.json

# === Cloud SQL ===
echo "==> Cloud SQL instance: $DB_INSTANCE (create manually if needed)"
echo "    gcloud sql instances create $DB_INSTANCE --database-version=POSTGRES_15 --tier=db-f1-micro --region=$REGION --project=$PROJECT"
echo "    gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE --project=$PROJECT"

# === Service Accounts ===
echo "==> Creating deployment service account: $SERVICE_ACCOUNT"
gcloud iam service-accounts create "atelier-deploy" \
  --display-name="Atelier Deployment SA" \
  --project="$PROJECT" || echo "SA already exists, skipping."

for role in \
  roles/run.admin \
  roles/cloudsql.client \
  roles/storage.admin \
  roles/secretmanager.secretAccessor \
  roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding "$PROJECT" \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="$role" --quiet
done

echo "==> Creating AI Teammate read-only SA: $AI_SA"
gcloud iam service-accounts create "atelier-ai-teammate" \
  --display-name="Atelier AI Teammate SA (read-only)" \
  --project="$PROJECT" || echo "SA already exists, skipping."

for role in \
  roles/run.viewer \
  roles/cloudsql.viewer \
  roles/storage.objectViewer \
  roles/logging.viewer; do
  gcloud projects add-iam-policy-binding "$PROJECT" \
    --member="serviceAccount:$AI_SA" \
    --role="$role" --quiet
done

echo ""
echo "==> Done. Next steps:"
echo "  1. Download key for $SERVICE_ACCOUNT → gcp-key.json"
echo "  2. Download key for $AI_SA → ai-teammate-gcp-key.json"
echo "  3. Run ./setup-github.sh nightfixed/atelier-private-chef dmtools.env"
