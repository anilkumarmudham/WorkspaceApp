const cron = require("node-cron");

const pendingReminderJob = require("./jobs/pendingReminderJob");
const overdueReminderJob = require("./jobs/overdueReminderJob");

const {
  processWeeklyRollover,
} = require("./services/weeklyStatusService");

/*
====================================================
Thursday - 6:00 PM IST
Send Pending Reminder Emails
====================================================
*/
cron.schedule(
  "0 18 * * 4",
  async () => {
    console.log("=====================================");
    console.log("Thursday Pending Reminder Started");
    console.log("=====================================");

    await pendingReminderJob();
  },
  {
    timezone: "Asia/Kolkata",
  }
);

/*
====================================================
Monday - 12:00 AM IST
1. Move Pending -> Overdue
2. Create New Pending Week
3. Send Overdue Emails
====================================================
*/
cron.schedule(
  "0 0 * * 1",
  async () => {
    console.log("=====================================");
    console.log("Monday Weekly Rollover Started");
    console.log("=====================================");

    // Step 1
    await processWeeklyRollover();

    // Step 2
    await overdueReminderJob();
  },
  {
    timezone: "Asia/Kolkata",
  }
);

console.log("=====================================");
console.log("Cron Jobs Started");
console.log("Pending Reminder : Thursday 6:00 PM IST");
console.log("Weekly Rollover  : Monday 12:00 AM IST");
console.log("=====================================");