const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("./db");
const dotenv = require("dotenv");

dotenv.config();

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log("Starting database seeding...");

    // Clear existing dataa
    await client.query("DELETE FROM urls");
    await client.query("DELETE FROM users");
    console.log("Cleared existing data");

    // Create sample users
    const users = [
      {
        id: uuidv4(),
        email: "john@example.com",
        password: "password123",
      },
      {
        id: uuidv4(),
        email: "jane@example.com",
        password: "password456",
      },
      {
        id: uuidv4(),
        email: "demo@example.com",
        password: "demo1234",
      },
    ];

    // Hash passwords and insert users
    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await client.query(
        "INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)",
        [user.id, user.email, passwordHash]
      );
      console.log(`Created user: ${user.email}`);
      user.hashedId = user.id; // Store for later use
    }

    // Create sample URLs
    const sampleUrls = [
      {
        user_id: users[0].hashedId,
        original_url: "https://www.github.com",
      },
      {
        user_id: users[0].hashedId,
        original_url: "https://www.google.com",
      },
      {
        user_id: users[1].hashedId,
        original_url: "https://www.stackoverflow.com",
      },
      {
        user_id: users[1].hashedId,
        original_url: "https://www.npmjs.com",
      },
      {
        user_id: users[2].hashedId,
        original_url: "https://www.youtube.com",
      },
    ];

    for (const urlData of sampleUrls) {
      const urlId = uuidv4();
      await client.query(
        "INSERT INTO urls (id, original_url, user_id, clicks) VALUES ($1, $2, $3, $4)",
        [urlId, urlData.original_url, urlData.user_id, Math.floor(Math.random() * 100)]
      );
      console.log(`Created URL: ${urlData.original_url}`);
    }

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\nSample credentials:");
    users.forEach((user) => {
      console.log(`  Email: ${user.email} | Password: ${user.password}`);
    });
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();