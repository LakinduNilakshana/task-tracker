const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "secret",
  database: process.env.DB_NAME || "appdb",
  port: Number(process.env.DB_PORT || 5432),
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

async function initWithRetry(retries = 10, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query(SCHEMA_SQL);
      console.log("database ready, schema ensured");
      return;
    } catch (err) {
      console.warn(`db not ready (attempt ${attempt}/${retries}): ${err.message}`);
      if (attempt === retries) throw err;
      await sleep(delayMs);
    }
  }
}

async function listTasks() {
  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY created_at DESC"
  );
  return result.rows;
}

async function createTask(title) {
  const result = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    [title]
  );
  return result.rows[0];
}

module.exports = { initWithRetry, listTasks, createTask };
