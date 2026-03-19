# Atelier — Private Chef Platform

## Overview
Portfolio and showcase website for a **private chef**. Features meal preparations, recipes, plating photography, and a contact/booking form.

**This is an agentic codebase.** All development is driven by AI agents (DMTools + Cursor/Codemie/Copilot) triggered via GitHub Actions. Human developers define requirements in Jira; the AI agent codes, commits, and opens PRs.

---

## Stack

| Layer | Technology | Deployment |
|-------|-----------|------------|
| Frontend | Next.js 16 (static export), React 19, Tailwind CSS | GitHub Pages |
| Backend API | Go 1.24, `net/http` | Google Cloud Run (`atelier-api`) |
| Database | PostgreSQL 15 | Cloud SQL |
| Image storage | Google Cloud Storage | `atelier-private-chef-images` (public) |
| Auth | Firebase Authentication | Admin panel only |
| Agentic CI/CD | DMTools + GitHub Actions | ai-teammate.yml |

---

## Repository Structure

```
api/              — Go HTTP server
  main.go         — server bootstrap, route registration
  internal/
    auth/         — Firebase ID-token verification
    database/     — PostgreSQL DSN helper
    handler/      — HTTP handlers (dishes, recipes, gallery, contact, upload, health)
    middleware/   — auth (RequireAuth), CORS
    migration/    — golang-migrate wrapper
    repository/   — PostgreSQL queries (dishes, recipes, gallery, contact)
    storage/      — GCS signed URL + delete helpers
  migrations/     — numbered SQL migration files
web/              — Next.js frontend
  src/app/        — App Router pages
  src/lib/        — firebase.ts, api.ts client
infra/            — GCP provisioning (setup.sh)
testing/          — Playwright e2e tests
.github/workflows/
  ai-teammate.yml       — AI agent (main workflow)
  deploy-api.yml        — Build → GCR → Cloud Run on push to main (api/**)
  deploy-pages.yml      — Next.js build → GitHub Pages on push to main
  unit-tests.yml        — Go + web tests on PR
  merge-trigger.yml     — Auto-merge PRs after unit-tests pass
  auto-update-prs.yml   — Rebase open PRs when main changes
agents/           — git submodule: IstiN/dmtools-agents (SM, coding agents)
```

---

## API Endpoints

All JSON. Public endpoints require no auth. Admin endpoints require `Authorization: Bearer <Firebase ID token>`.

### Dishes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/dishes` | public | List dishes. `?category=<cat>` filter |
| GET | `/api/dishes/featured` | public | List featured dishes |
| GET | `/api/dishes/{id}` | public | Get dish by ID |
| POST | `/api/dishes` | admin | Create dish |
| PUT | `/api/dishes/{id}` | admin | Update dish |
| DELETE | `/api/dishes/{id}` | admin | Delete dish + GCS cleanup |

### Recipes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/recipes` | public | List all recipes |
| GET | `/api/recipes/{id}` | public | Get recipe by ID |
| POST | `/api/recipes` | admin | Create recipe |
| PUT | `/api/recipes/{id}` | admin | Update recipe |
| DELETE | `/api/recipes/{id}` | admin | Delete recipe |

### Gallery
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/gallery` | public | List gallery items. `?category=<cat>` filter |
| GET | `/api/gallery/{id}` | public | Get gallery item |
| POST | `/api/gallery` | admin | Add gallery item |
| PUT | `/api/gallery/{id}` | admin | Update gallery item |
| DELETE | `/api/gallery/{id}` | admin | Delete + GCS cleanup |

### Contact
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/contact` | public | Submit contact/booking request. Body: `{name, email, message?, event_date?, guests_count?, occasion?}` |
| GET | `/api/contact` | admin | List requests. `?status=new\|read\|replied` |
| PUT | `/api/contact/{id}` | admin | Update status |

### Herbarium
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/herbarium` | public | List all specimens ordered by display_order |
| GET | `/api/herbarium/{id}` | public | Get specimen by ID |
| POST | `/api/herbarium` | admin | Create specimen |
| PUT | `/api/herbarium/{id}` | admin | Update specimen |
| DELETE | `/api/herbarium/{id}` | admin | Delete specimen |

### Upload
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/upload?filename=<f>&content_type=<ct>` | admin | Get signed GCS PUT URL |

### Health
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | public | DB connectivity check |

---

## Database Schema

```sql
dishes              — id (uuid), title, description, category, image_url, featured (bool), created_at, updated_at
recipes             — id, dish_id (fk→dishes), title, description, ingredients (jsonb), steps (jsonb), prep_time_min, cook_time_min, servings, created_at, updated_at
gallery_items       — id, image_url, caption, category, display_order (int), created_at, updated_at
contact_requests    — id, name, email, message, event_date (date), guests_count, occasion, status (new/read/replied), created_at, updated_at
herbarium_specimens — id, num, code (unique), category, name_ro, name_en, latin_name, name_large, badge, badge_cls,
                      meta (jsonb [{k,ro,en}]), spectrum (jsonb [color strings]), pills (jsonb [strings]),
                      desc_ro, desc_en, note_ro, note_en, usage_list (jsonb [strings]), display_order, created_at, updated_at
```

---

## Environment Variables

### Cloud Run (API)
| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `IMAGES_BUCKET` | GCS bucket for image uploads |
| `CDN_BASE_URL` | Public base URL for GCS images |
| `DB_NAME` | PostgreSQL database name |
| `INSTANCE_UNIX_SOCKET` | Cloud SQL Unix socket path |
| `DB_USER` | DB user (from Secret Manager) |
| `DB_PASSWORD` | DB password (from Secret Manager) |
| `PORT` | HTTP port (default 8080) |

### GitHub Actions / Frontend build
| Variable/Secret | Description |
|----------------|-------------|
| `GCP_SA_KEY` | GCP deployment SA JSON (secret) |
| `GCP_AI_TEAMMATE_SA_KEY` | Read-only AI Teammate SA JSON (secret) |
| `PAT_TOKEN` | GitHub PAT for submodule + PR creation (secret) |
| `DB_USER`, `DB_PASSWORD` | Database credentials (secrets) |
| `FIREBASE_API_KEY` | Firebase web API key (secret) |
| `FIREBASE_TEST_EMAIL`, `FIREBASE_TEST_PASSWORD` | CI test Firebase user (secrets) |
| `GCP_PROJECT_ID`, `GCP_REGION` | GCP project (vars) |
| `CLOUD_SQL_CONNECTION_NAME` | Cloud SQL connection name (var) |
| `FIREBASE_PROJECT_ID`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_APP_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID` | Firebase web config (vars) |
| `IMAGES_BUCKET`, `CDN_BASE_URL`, `API_URL` | Runtime config (vars) |
| `AI_AGENT_PROVIDER` | `cursor`, `codemie`, or `copilot` (var) |

---

## Coding Patterns

### Go API
- All handlers follow the pattern in `api/internal/handler/`. Public GET methods at the top, auth-protected mutations dispatched via `authMiddleware(...)`.
- `writeJSON(w, status, v)` and `writeError(w, status, msg)` helpers are in `handler/dishes.go` and reused across all handlers.
- Repository functions use `context.Context` and `*sql.DB` directly — no ORM.
- Migrations are numbered SQL files embedded in the binary (`//go:embed migrations/*.sql`).
- CORS origin is `https://nightfixed.github.io` — update `api/internal/middleware/cors.go` if the domain changes.

### Frontend
- All pages are in `web/src/app/` using Next.js App Router.
- API calls go through `web/src/lib/api.ts` — never call `fetch` directly in components.
- Firebase auth state is managed via `web/src/lib/firebase.ts`.
- The build is a static export (`output: "export"` in `next.config.ts`). No SSR, no server actions.
- For GitHub Pages deployment, `basePath` is `/atelier-private-chef` when `GITHUB_PAGES=true`.

### AI Agent
- Agents read Jira tickets via DMTools and write code changes.
- Always run `go test ./...` from `api/` and `npm test` from `web/` before committing.
- Create PRs with descriptive titles matching the Jira ticket key (e.g., `APC-42: Add recipe detail page`).
- Do NOT commit `dmtools.env`, `gcp-key.json`, or `ai-teammate-gcp-key.json`.
