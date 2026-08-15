const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const { pool } = require("./db");

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
      : ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

function respondError(res, statusCode, code, message) {
  return res.status(statusCode).json({ success: false, code, error: message });
}

function respondSuccess(res, statusCode, data) {
  return res.status(statusCode).json({ success: true, data });
}

function validateEmail(email) {
  const valid = typeof email === "string" && email.length > 5 && /@/.test(email);
  return valid;
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 6;
}

function validateUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function generateShortId(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return respondError(res, 401, "UNAUTHORIZED", "Missing or invalid authorization header");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return respondError(res, 401, "UNAUTHORIZED", "Invalid or expired token");
  }
}

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return respondError(res, 400, "INVALID_EMAIL", "Invalid email address");
  }

  if (!validatePassword(password)) {
    return respondError(res, 400, "INVALID_PASSWORD", "Password must be at least 6 characters");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await pool.query(
      `INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)`,
      [userId, email, hashedPassword]
    );

    return respondSuccess(res, 201, {
      user_id: userId,
      message: "User registered successfully",
    });
  } catch (error) {
    if (error.code === "23505") {
      return respondError(res, 400, "EMAIL_EXISTS", "Email already registered");
    }
    console.error(error);
    return respondError(res, 500, "REGISTRATION_ERROR", "Failed to register user");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email) || !validatePassword(password)) {
    return respondError(res, 400, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  try {
    const result = await pool.query(
      `SELECT id, email, password_hash FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (result.rowCount === 0) {
      return respondError(res, 401, "LOGIN_FAILED", "Invalid email or password");
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return respondError(res, 401, "LOGIN_FAILED", "Invalid email or password");
    }

    const token = jwt.sign({ user_id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return respondSuccess(res, 200, {
      token,
      user_id: user.id,
    });
  } catch (error) {
    console.error(error);
    return respondError(res, 500, "LOGIN_ERROR", "Unable to sign in");
  }
});

app.post("/shorten", authMiddleware, async (req, res) => {
  const { url } = req.body;
  const userId = req.user && req.user.user_id;

  if (!userId) {
    return respondError(res, 401, "UNAUTHORIZED", "Invalid user token");
  }

  if (!validateUrl(url)) {
    return respondError(res, 400, "INVALID_URL", "URL must start with http:// or https://");
  }

  try {
    const existing = await pool.query(
      `SELECT id FROM urls WHERE original_url = $1 AND user_id = $2 LIMIT 1`,
      [url, userId]
    );

    let shortId;
    if (existing.rowCount > 0) {
      shortId = existing.rows[0].id;
    } else {
      do {
        shortId = generateShortId(8);
        const collision = await pool.query(`SELECT 1 FROM urls WHERE id = $1`, [shortId]);
        if (collision.rowCount === 0) break;
      } while (true);

      await pool.query(
        `INSERT INTO urls (id, original_url, user_id) VALUES ($1, $2, $3)`,
        [shortId, url, userId]
      );
    }

    return respondSuccess(res, 201, {
      short_url: `${BASE_URL}/r/${shortId}`,
    });
  } catch (error) {
    console.error(error);
    return respondError(res, 500, "SHORTEN_ERROR", "Failed to create short URL");
  }
});

app.get("/r/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return respondError(res, 400, "INVALID_URL_ID", "Invalid URL ID");
  }

  try {
    const result = await pool.query(
      `SELECT original_url FROM urls WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (result.rowCount === 0) {
      return respondError(res, 404, "URL_NOT_FOUND", "Short URL not found");
    }

    const originalUrl = result.rows[0].original_url;
    await pool.query(`UPDATE urls SET clicks = clicks + 1 WHERE id = $1`, [id]);
    return res.redirect(302, originalUrl);
  } catch (error) {
    console.error(error);
    return respondError(res, 500, "REDIRECT_ERROR", "Failed to redirect");
  }
});

app.get("/user/urls", authMiddleware, async (req, res) => {
  const userId = req.user && req.user.user_id;
  if (!userId) {
    return respondError(res, 401, "UNAUTHORIZED", "Invalid user token");
  }

  try {
    const result = await pool.query(
      `SELECT id, original_url AS url, user_id, created_at, clicks FROM urls WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return respondSuccess(res, 200, result.rows);
  } catch (error) {
    console.error(error);
    return respondError(res, 500, "FETCH_URLS_ERROR", "Unable to fetch user URLs");
  }
});

app.delete("/user/urls/:id", authMiddleware, async (req, res) => {
  const userId = req.user && req.user.user_id;
  const { id } = req.params;

  if (!userId) {
    return respondError(res, 401, "UNAUTHORIZED", "Invalid user token");
  }

  if (!id) {
    return respondError(res, 400, "INVALID_URL_ID", "Invalid URL ID");
  }

  try {
    const result = await pool.query(
      `SELECT user_id FROM urls WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (result.rowCount === 0) {
      return respondError(res, 404, "URL_NOT_FOUND", "URL not found");
    }

    if (result.rows[0].user_id !== userId) {
      return respondError(res, 401, "UNAUTHORIZED", "You can only delete your own URLs");
    }

    await pool.query(`DELETE FROM urls WHERE id = $1`, [id]);
    return respondSuccess(res, 200, { message: "URL deleted successfully" });
  } catch (error) {
    console.error(error);
    return respondError(res, 500, "DELETE_ERROR", "Failed to delete URL");
  }
});

async function startServer() {
  try {
    await pool.query("SELECT 1");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1);
  }
}

startServer();