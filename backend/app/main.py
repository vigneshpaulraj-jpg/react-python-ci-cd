from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import Task, TaskCreate

app = FastAPI(title="Task Tracker API")

# Allow the Vite dev server to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store (resets on restart). No database initially.
_tasks: list[Task] = []
_next_id = 1


@app.get("/health")
def health() -> dict[str, str]:
    """Liveness check used by humans and, later, by deploy platforms."""
    return {"status": "ok"}


@app.get("/tasks")
def list_tasks() -> list[Task]:
    return _tasks


@app.post("/tasks", status_code=201)
def create_task(payload: TaskCreate) -> Task:
    global _next_id
    task = Task(id=_next_id, title=payload.title)
    _tasks.append(task)
    _next_id += 1
    return task
