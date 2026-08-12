require("dotenv").config();

const runPendingReminderJob = require("./jobs/pendingReminderJob");

async function test() {
  try {
    console.log("==================================");
    console.log("Testing Pending Reminder Job");
    console.log("==================================");

    await runPendingReminderJob();

    console.log("==================================");
    console.log("✅ Pending Reminder Test Completed");
    console.log("==================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Pending Reminder Test Failed");
    console.error(error);

    process.exit(1);
  }
}

test();