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

## Quick start (API + database)

```bash
git clone https://github.com/LakinduNilakshana/task-tracker.git
cd task-tracker
cp .env.example .env   # set POSTGRES_PASSWORD
docker compose up -d --build
docker compose ps
curl -s http://localhost:3000/health
curl -s http://localhost:3000/api/tasks
```

## Frontend (standalone test)

With the API stack running:

```bash
docker build -t task-tracker-frontend:0.1.0 ./frontend
docker run -d --name task-tracker-fe --network task-tracker_default -p 8080:80 task-tracker-frontend:0.1.0
```

Open **http://localhost:8080** — add a task in the UI.

```bash
curl -s http://localhost:8080/api/tasks
docker rm -f task-tracker-fe
```

> **Next:** wire `frontend` into `compose.yaml` so one `docker compose up` serves the UI on `:8080` and unpublishes the API port.

## Persistence

Task data survives a normal restart:

```bash
docker compose down && docker compose up -d
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
