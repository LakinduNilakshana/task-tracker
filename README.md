# task-tracker

Full-stack task tracker — Node/Express API, Postgres, nginx frontend — containerized with Docker Compose.

## Stack

| Service  | Tech              | Role                          |
|----------|-------------------|-------------------------------|
| API      | Node / Express    | REST endpoints, DB retry loop |
| Database | Postgres 16       | Persistent task storage       |
| Frontend | nginx *(coming)*  | Static UI, `/api` proxy       |

## Quick start

```bash
git clone https://github.com/LakinduNilakshana/task-tracker.git
cd task-tracker
cp .env.example .env   # edit POSTGRES_PASSWORD
docker compose up -d --build
docker compose ps
curl http://localhost:3000/health
curl http://localhost:3000/api/tasks
```

Course capstone milestones (M3 frontend, M4 full stack, M7 CI) are built in this repo.

## API

| Method | Path          | Description        |
|--------|---------------|--------------------|
| GET    | `/health`     | `{ "status": "ok" }` |
| GET    | `/api/tasks`  | List all tasks     |
| POST   | `/api/tasks`  | `{ "title": "..." }` → create |

Postgres data persists in the `pgdata` named volume across `docker compose down` (not `down -v`).

## License

ISC
