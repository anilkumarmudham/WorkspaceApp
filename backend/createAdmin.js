require("dotenv").config();

const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await connection.execute(
    `
    INSERT INTO users
    (
      name,
      email,
      password,
      role,
      team_id,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      "Administrator",
      "admin@workspace.com",
      hashedPassword,
      "Admin",
      1,
      "Active",
    ]
  );

  console.log("✅ Admin user created successfully.");

  await connection.end();
}

createAdmin().catch(console.error);