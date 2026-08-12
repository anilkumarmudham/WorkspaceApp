require("dotenv").config();

const {
  processWeeklyRollover,
} = require("./services/weeklyStatusService");

async function test() {
  try {
    console.log("==================================");
    console.log("Testing Weekly Rollover");
    console.log("==================================");

    await processWeeklyRollover();

    console.log("==================================");
    console.log("Weekly Rollover Complete");
    console.log("==================================");
  } catch (error) {
    console.error(error);
  }

  process.exit();
}

test();