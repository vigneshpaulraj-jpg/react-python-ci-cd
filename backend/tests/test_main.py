from fastapi.testclient import TestClient

import app.main as main_module
from app.main import app

client = TestClient(app)


def reset_store():
    """Reset the in-memory store so tests don't leak state into each other."""
    main_module._tasks = []
    main_module._next_id = 1


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_list_tasks_starts_empty():
    reset_store()
    resp = client.get("/tasks")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_task():
    reset_store()
    resp = client.post("/tasks", json={"title": "Learn CI/CD"})
    assert resp.status_code == 201
    body = resp.json()
    assert body == {"id": 1, "title": "Learn CI/CD", "done": False}

    # The created task should now appear in the list.
    list_resp = client.get("/tasks")
    assert list_resp.json() == [{"id": 1, "title": "Learn CI/CD", "done": False}]


def test_create_task_rejects_empty_title():
    reset_store()
    resp = client.post("/tasks", json={"title": ""})
    assert resp.status_code == 422  # validation error from Pydantic
