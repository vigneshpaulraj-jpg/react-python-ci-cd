import { useEffect, useState } from "react";

import { createTask, fetchTasks, type Task } from "./api";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((e: Error) => setError(e.message));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      const created = await createTask(trimmed);
      setTasks((prev) => [...prev, created]);
      setTitle("");
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Task Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          aria-label="New task title"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>

      {tasks.length === 0 && !error && <p>No tasks yet. Add one above.</p>}
    </main>
  );
}
