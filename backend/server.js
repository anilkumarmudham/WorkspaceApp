require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

// Start Cron Jobs
require("./cron");

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await db.query("SELECT 1");

    console.log("✅ MySQL Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error);
  }
}

startServer();