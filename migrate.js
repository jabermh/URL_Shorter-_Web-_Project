const fs = require("fs");
const path = require("path");
const { pool } = require("./db");

const migrationsPath = path.join(__dirname, "db", "migrations");

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function migrationApplied(client, filename) {
  const result = await client.query(
    `SELECT 1 FROM migrations WHERE name = $1 LIMIT 1`,
    [filename]
  );
  return result.rowCount > 0;
}

function splitStatements(sql) {
  return sql
    .split(/;\s*\n/)
    .map((stmt) => stmt.trim())
    .filter(Boolean);
}

async function runMigrations() {
  const client = await pool.connect();
  try {
    await ensureMigrationsTable(client);

    const files = fs
      .readdirSync(migrationsPath)
      .filter((name) => name === "initial.sql")
      .sort();

    for (const file of files) {
      const already = await migrationApplied(client, file);
      if (already) continue;

      const sql = fs.readFileSync(path.join(migrationsPath, file), "utf8");
      const statements = splitStatements(sql);
      for (const statement of statements) {
        await client.query(statement);
      }

      await client.query(`INSERT INTO migrations (name) VALUES ($1)`, [file]);
      console.log(`Applied migration: ${file}`);
    }
  } finally {
    client.release();
  }
}

runMigrations()
  .then(() => {
    console.log("Migrations completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });