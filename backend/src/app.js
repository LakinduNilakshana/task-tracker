const express = require("express");
const { initWithRetry, listTasks, createTask } = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.get("/api/tasks", async (_req, res) => {
  try {
    res.status(200).json(await listTasks());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  const title = (req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });

  try {
    res.status(201).json(await createTask(title));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

initWithRetry()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`task-tracker-api listening on 0.0.0.0:${PORT}, DB_HOST=${process.env.DB_HOST || "db"}`);
    });
  })
  .catch((err) => {
    console.error("failed to initialize database:", err.message);
    process.exit(1);
  });
