require("dotenv").config();

const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

async function createContractor() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const hashedPassword = await bcrypt.hash("Contractor@123", 10);

  await connection.execute(
    `INSERT INTO users
      (name, email, password, role, team_id, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Anil Kumar",
      "anil@aptimized.com",
      hashedPassword,
      "contractor",
      1,
      "Active",
    ]
  );

  console.log("✅ Contractor created successfully.");

  await connection.end();
}

createContractor().catch(console.error);