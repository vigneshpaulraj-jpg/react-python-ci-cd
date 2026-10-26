export interface Task {
  id: number;
  title: string;
  done: boolean;
}

// Read the backend URL from the environment. Falls back to localhost for dev.
const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error(`Failed to load tasks (${res.status})`);
  return res.json();
}

export async function createTask(title: string): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Failed to create task (${res.status})`);
  return res.json();
}
