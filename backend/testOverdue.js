require("dotenv").config();

const runOverdueReminderJob = require("./jobs/overdueReminderJob");

async function test() {
  try {
    console.log("==================================");
    console.log("Testing Overdue Reminder Job");
    console.log("==================================");

    await runOverdueReminderJob();

    console.log("==================================");
    console.log("✅ Overdue Reminder Test Completed");
    console.log("==================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Overdue Reminder Test Failed");
    console.error(error);

    process.exit(1);
  }
}

test();