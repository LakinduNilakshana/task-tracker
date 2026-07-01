# task-tracker

**Task Tracker** — a simple full-stack app: static web UI, REST API, and Postgres. Run locally with Docker Compose.

## Architecture

```
Browser  →  nginx (frontend)  →  Node/Express API  →  Postgres
              :8080                  internal              pgdata volume
```

The browser only talks to the frontend. nginx serves the UI and proxies `/api/*` to the API over the Compose network — no CORS, and Postgres stays off the public host.

| Service  | Tech           | Role                                       |
|----------|----------------|--------------------------------------------|
| Frontend | nginx (Alpine) | Static UI, reverse proxy for `/api`        |
| API      | Node / Express | Task CRUD, DB retry loop on startup        |
| Database | Postgres 16    | Persistent storage (`pgdata` named volume) |

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

Only the frontend is published (`8080`). The API and Postgres are internal to the Compose network.

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

## API

| Method | Path          | Body                 | Response             |
|--------|---------------|----------------------|----------------------|
| GET    | `/health`     | —                    | `{ "status": "ok" }` |
| GET    | `/api/tasks`  | —                    | Array of tasks       |
| POST   | `/api/tasks`  | `{ "title": "..." }` | Created task         |

## Project layout

```
task-tracker/
  backend/     Express API, Dockerfile
  frontend/    HTML/CSS/JS, nginx.conf, Dockerfile
  compose.yaml
  .env.example
```

## License

ISC
