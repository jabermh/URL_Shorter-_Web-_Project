const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const useSsl =
  process.env.NODE_ENV === "production" ||
  connectionString.toLowerCase().includes("sslmode=require");

const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

module.exports = { pool };