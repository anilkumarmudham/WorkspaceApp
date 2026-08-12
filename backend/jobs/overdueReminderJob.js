const { sendEmail } = require("../services/emailService");
const { getOverdueUsers } = require("../models/weeklyStatusModel");

const runOverdueReminderJob = async () => {
  try {
    console.log("=====================================");
    console.log("Running Overdue Reminder Job...");
    console.log("=====================================");

    const users = await getOverdueUsers();

    console.log(`Found ${users.length} overdue reports.`);

    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: "Weekly Report Overdue",
        html: `
  <div style="font-family:Arial,sans-serif;background:#f4f6f9;padding:30px;">

    <div style="max-width:650px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">

      <div style="background:#dc2626;color:white;padding:20px;text-align:center;">
        <h2 style="margin:0;">APTIMIZED Internal Portal</h2>
      </div>

      <div style="padding:30px;">

        <h3>Hello ${user.name},</h3>

        <p>
          Our records indicate that your weekly report is now
          <strong>Overdue.</strong>
        </p>

        <table style="width:100%;margin:25px 0;">
          <tr>
            <td style="padding:10px;font-weight:bold;">Reporting Week</td>
            <td style="padding:10px;">
              ${user.week_from} to ${user.week_to}
            </td>
          </tr>
        </table>

        <p>
          Please submit your report as soon as possible.
        </p>

        <div style="text-align:center;margin:35px 0;">

          <a href="http://localhost:5174"
             style="
               background:#dc2626;
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

      console.log(`Overdue email sent to ${user.email}`);
    }

    console.log("Overdue Reminder Job Finished.");
  } catch (error) {
    console.error(error);
  }
};

module.exports = runOverdueReminderJob;
