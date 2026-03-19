# Atelier — Private Chef Portfolio

Portfolio and showcase platform for a private chef, featuring meal preparations, recipes, and plating photography. Built with an agentic development workflow and LLM support.

## Architecture

- **Frontend**: Next.js (static export) → GitHub Pages
- **Backend**: Go API → Google Cloud Run (scales to 0)
- **Database**: PostgreSQL → Cloud SQL
- **Image storage**: Google Cloud Storage (public bucket)
- **Auth**: Firebase Authentication (admin panel)
- **Agentic CI/CD**: DMTools + GitHub Actions

## Repository Layout

```
/
├── .github/workflows/   — CI/CD + AI agent workflows
├── agents/              — DMTools agents submodule
├── api/                 — Go backend (Cloud Run)
├── web/                 — Next.js frontend (GitHub Pages)
├── infra/               — GCP provisioning scripts
└── testing/             — Playwright e2e tests
```

## Local Development

### API
```bash
cd api
DB_DSN="postgres://..." FIREBASE_PROJECT_ID="..." IMAGES_BUCKET="..." go run .
```

### Frontend
```bash
cd web
npm install
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

## Deployment

All deployments are managed via GitHub Actions:
- Push to `main` with changes in `api/` → triggers `deploy-api.yml` → Cloud Run
- Push to `main` → triggers `deploy-pages.yml` → GitHub Pages

## Agentic Workflow

AI agent tasks are triggered via `ai-teammate.yml` (workflow_dispatch). The agent reads Jira tickets, writes code, creates PRs, and the auto-merge workflow merges them after tests pass.
