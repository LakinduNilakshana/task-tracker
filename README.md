![CI](https://github.com/LakinduNilakshana/task-tracker/actions/workflows/ci.yml/badge.svg)

# task-tracker

**Task Tracker** — a simple full-stack app: static web UI, REST API, and Postgres. Run locally with Docker Compose.

## Architecture

```mermaid
flowchart LR
  Browser -->|:8080| FE[nginx frontend]
  FE -->|"/api/* proxy"| API[Node API]
  API --> DB[(Postgres)]
  DB --- V[(pgdata volume)]
```

The browser only talks to the frontend. nginx serves the UI and proxies `/api/*` to the API over the Compose network — no CORS, and Postgres stays off the public host. Only the frontend is published; `api` and `db` resolve by Compose service name on the embedded network.

| Service  | Image / tech       | Host access | Role                                        |
|----------|--------------------|-------------|---------------------------------------------|
| frontend | nginx:alpine       | `:8080`     | Static UI, reverse proxy for `/api`         |
| api      | node:24-alpine     | internal    | Task CRUD, DB retry loop on startup         |
| db       | postgres:16-alpine | internal    | Persistent storage (`pgdata` named volume) |

## Quick start

```bash
git clone https://github.com/LakinduNilakshana/task-tracker.git
cd task-tracker
cp .env.example .env   # set POSTGRES_PASSWORD
docker compose up -d --build
docker compose ps
open http://localhost:8080
```

Verify the API through the nginx proxy:

```bash
curl -s http://localhost:8080/api/tasks
```

## Persistence

Task data survives a normal restart:

```bash
docker compose down && docker compose up -d
curl -s http://localhost:8080/api/tasks   # tasks still there
```

Wipe the database:

```bash
docker compose down -v
```

## CI/CD

On push to `main`, [GitHub Actions](.github/workflows/ci.yml) builds and pushes both images to GHCR:

| Image    | Registry path                                      |
|----------|----------------------------------------------------|
| API      | `ghcr.io/lakindunilakshana/task-tracker-api`       |
| Frontend | `ghcr.io/lakindunilakshana/task-tracker-frontend`  |

**Tags:** `main`, `sha-<commit>` (immutable deploy pin).

**Gates:** Trivy scan (CRITICAL CVEs fail the build).

Registry-only deploy (no local build):

```bash
echo $(gh auth token) | docker login ghcr.io -u LakinduNilakshana --password-stdin
docker compose -f compose.yaml -f compose.ghcr.yaml pull
docker compose -f compose.yaml -f compose.ghcr.yaml up -d --no-build
```

Private GHCR packages require `docker login ghcr.io` before pull. On Apple Silicon, CI images are `linux/amd64` — `compose.ghcr.yaml` sets `platform: linux/amd64`.

## API

| Method | Path          | Body                 | Response             |
|--------|---------------|----------------------|----------------------|
| GET    | `/health`     | —                    | `{ "status": "ok" }` |
| GET    | `/api/tasks`  | —                    | Array of tasks       |
| POST   | `/api/tasks`  | `{ "title": "..." }` | Created task         |

## Project layout

```
task-tracker/
  backend/              Express API, Dockerfile
  frontend/             HTML/CSS/JS, nginx.conf, Dockerfile
  compose.yaml          Local dev (build from source)
  compose.ghcr.yaml     Optional GHCR override (registry deploy)
  .github/workflows/    CI matrix build, push, Trivy
  .env.example
```

## License

ISC
