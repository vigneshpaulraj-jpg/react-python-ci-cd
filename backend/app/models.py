from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Shape of the request body when creating a task."""

    title: str = Field(min_length=1, max_length=200)


class Task(BaseModel):
    """A task as stored and returned by the API."""

    id: int
    title: str
    done: bool = False
