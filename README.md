# Task Tracker — React + FastAPI CI/CD Practice

A small monorepo for learning CI/CD with GitHub Actions. A React (Vite + TypeScript)
frontend talks to a FastAPI backend that stores tasks in memory.

```
.
├── frontend/   # React + TypeScript + Vite
├── backend/    # FastAPI + Uvicorn
└── .github/workflows/ci.yml   # GitHub Actions CI
```

## Prerequisites

- Node.js 20+ (CI pins Node 20 LTS)
- Python 3.11 (CI pins 3.11)
- [uv](https://docs.astral.sh/uv/) for the Python environment (optional but used below)

## Run the backend

```bash
cd backend
uv venv --python 3.11 .venv
uv pip install --python .venv/bin/python -e ".[dev]"
.venv/bin/uvicorn app.main:app --reload --port 8000
```

API: <http://127.0.0.1:8000> — docs at `/docs`.

Endpoints:
- `GET /health` → `{"status": "ok"}`
- `GET /tasks` → list of tasks
- `POST /tasks` with `{"title": "..."}` → created task

## Run the frontend

```bash
cd frontend
npm install
cp .env.example .env   # sets VITE_API_URL
npm run dev
```

App: <http://localhost:5173>. The frontend reads the backend URL from `VITE_API_URL`.

> Networking note: if `localhost` and `127.0.0.1` behave differently on your machine
> (IPv6 vs IPv4), match the address your server bound to.

## Run the checks locally

Backend:
```bash
cd backend
.venv/bin/ruff check .
.venv/bin/pytest -q
```

Frontend:
```bash
cd frontend
npm run lint
npm run test
npm run build
```

## Continuous Integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`. Two
independent jobs:

- **frontend**: `npm ci` → ESLint → Vitest → production build
- **backend**: install pinned deps → Ruff → pytest

Any failing step fails the pipeline, blocking a merge until it's green.

## Note on `npm audit`

`npm install` may report advisories in transitive dev/build dependencies. They do not
ship in the production bundle. Review before applying `npm audit fix --force`, which can
introduce breaking major-version bumps.
