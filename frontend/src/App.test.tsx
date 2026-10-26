import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import * as api from "./api";

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the heading and empty state", async () => {
    vi.spyOn(api, "fetchTasks").mockResolvedValue([]);
    render(<App />);
    expect(screen.getByRole("heading", { name: /task tracker/i })).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument(),
    );
  });

  it("shows tasks loaded from the API", async () => {
    vi.spyOn(api, "fetchTasks").mockResolvedValue([
      { id: 1, title: "Learn CI/CD", done: false },
    ]);
    render(<App />);
    expect(await screen.findByText("Learn CI/CD")).toBeInTheDocument();
  });

  it("adds a task through the form", async () => {
    vi.spyOn(api, "fetchTasks").mockResolvedValue([]);
    vi.spyOn(api, "createTask").mockResolvedValue({
      id: 2,
      title: "Write tests",
      done: false,
    });

    render(<App />);
    await screen.findByText(/no tasks yet/i);

    await userEvent.type(
      screen.getByLabelText(/new task title/i),
      "Write tests",
    );
    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(await screen.findByText("Write tests")).toBeInTheDocument();
    expect(api.createTask).toHaveBeenCalledWith("Write tests");
  });
});
