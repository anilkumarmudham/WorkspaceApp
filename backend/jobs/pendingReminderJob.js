const { sendEmail } = require("../services/emailService");
const { getPendingUsers } = require("../models/weeklyStatusModel");

const runPendingReminderJob = async () => {
  try {
    console.log("=====================================");
    console.log("Running Pending Reminder Job...");
    console.log("=====================================");

    // -----------------------------
    // Calculate Current Week
    // (Friday -> Thursday)
    // -----------------------------

    const today = new Date();

    const day = today.getDay();

    let diffToFriday;

    if (day >= 5) {
      diffToFriday = day - 5;
    } else {
      diffToFriday = day + 2;
    }

    const weekFrom = new Date(today);
    weekFrom.setDate(today.getDate() - diffToFriday);

    const weekTo = new Date(weekFrom);
    weekTo.setDate(weekFrom.getDate() + 6);

    const formatDate = (date) => {
      const d = new Date(date);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const users = await getPendingUsers(
      formatDate(weekFrom),
      formatDate(weekTo),
    );

    console.log(`Found ${users.length} pending contractors.`);

    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: "Reminder: Weekly Report Submission Due Today",
        html: `
  <div style="font-family:Arial,sans-serif;background:#f4f6f9;padding:30px;">

    <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">

      <div style="background:#1d4ed8;color:white;padding:20px;text-align:center;">
        <h2 style="margin:0;">APTIMIZED Internal Portal</h2>
      </div>

      <div style="padding:30px;">

        <h3>Hello ${user.name},</h3>

        <p>
          This is a friendly reminder that your
          <strong>Weekly Report</strong>
          has not yet been submitted.
        </p>

        <table style="width:100%;margin:25px 0;border-collapse:collapse;">
          <tr>
            <td style="padding:10px;font-weight:bold;">Reporting Week</td>
            <td style="padding:10px;">
              ${user.week_from} to ${user.week_to}
            </td>
          </tr>
        </table>

        <p>
          Please submit your report before
          <strong>6:00 PM today</strong>.
        </p>

        <div style="text-align:center;margin:35px 0;">

          <a href="http://localhost:5174"
             style="
               background:#2563eb;
               color:white;
               text-decoration:none;
               padding:14px 30px;
               border-radius:6px;
               display:inline-block;
               font-weight:bold;
             ">
             Submit Weekly Report
          </a>

        </div>

        <p>
          If you have already submitted your report,
          please ignore this email.
        </p>

      </div>

      <div style="
          background:#f5f5f5;
          padding:15px;
          text-align:center;
          color:#666;
          font-size:13px;
      ">
        © 2026 APTIMIZED Internal Portal
      </div>

    </div>

  </div>
  `,
      });

      console.log(`Reminder sent to ${user.email}`);
    }

    console.log("Pending Reminder Job Finished.");
  } catch (error) {
    console.error(error);
  }
};

module.exports = runPendingReminderJob;
