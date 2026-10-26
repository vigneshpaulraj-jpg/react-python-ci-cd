# Task Tracker — CI/CD Practice Project

A small React + FastAPI app used to learn CI/CD with GitHub Actions hands-on.

## 1. Requirements

### Functional
- A React page displays a list of tasks.
- Users can add a task via a form.
- FastAPI exposes:
  - `GET /health` — liveness check, returns `{"status": "ok"}`.
  - `GET /tasks` — returns all tasks.
  - `POST /tasks` — creates a task from a JSON body `{"title": "..."}`.
- Frontend reads the backend base URL from an environment variable (`VITE_API_URL`).
- Data is stored in memory (no database initially).

### Non-functional
- Simple, readable, beginner-friendly.
- Frontend and backend tested independently.
- CI validates every push and PR to `main`.

## 2. Design

### Architecture
```
Browser ──HTTP──> React (Vite dev server :5173)
                      │  fetch(VITE_API_URL)
                      ▼
                  FastAPI (Uvicorn :8000)
                      │
                  in-memory list[Task]
```

### Backend (`backend/`)
- `app/main.py` — FastAPI app, CORS, routes, in-memory store.
- `app/models.py` — Pydantic models (`Task`, `TaskCreate`).
- `tests/test_main.py` — pytest covering all three endpoints.
- `pyproject.toml` — pinned deps, Ruff + pytest config.
- Python **3.11** (local venv via `uv`, matches CI).

**Data model**
- `Task`: `{ id: int, title: str, done: bool }`
- `TaskCreate`: `{ title: str }`

**CORS**: allow the Vite dev origin so the browser can call the API.

### Frontend (`frontend/`)
- Vite + React + TypeScript.
- `src/api.ts` — typed fetch wrapper using `import.meta.env.VITE_API_URL`.
- `src/App.tsx` — list + add-task form.
- `src/App.test.tsx` — Vitest + Testing Library render/interaction test.
- `.env.example` — documents `VITE_API_URL`.
- ESLint (flat config) + Vitest (jsdom).

### CI (`.github/workflows/ci.yml`)
- Triggers: `push` and `pull_request` on `main`.
- `permissions: contents: read` (least privilege).
- Two independent jobs:
  - **frontend**: Node 20 LTS → `npm ci` → ESLint → Vitest → `npm run build`.
  - **backend**: Python 3.11 → install pinned deps → Ruff → pytest.
- Any failing step fails the workflow.

## 3. Staged implementation plan

Each stage is explained before we proceed. We do NOT jump ahead to deployment.

1. **Scaffold + run locally** — build both apps, confirm they run.
2. **Tests** — add and run frontend + backend tests locally.
3. **Git + GitHub** — init repo, push to GitHub.
4. **CI** — add GitHub Actions workflow.
5. **Verify pipeline** — make a small change, watch CI run green.
6. **Break it** — introduce a failing test, observe red pipeline.
7. **Fix it** — restore the test, confirm green again.
8. **CD (explanation only)** — how to extend to deployment once CI is solid.

## 4. Completion criteria
- App runs locally (frontend + backend).
- Frontend & backend tests pass.
- Linting passes (ESLint + Ruff).
- Frontend production build succeeds.
- GitHub Actions validates each push and PR.
