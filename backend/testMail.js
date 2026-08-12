require("dotenv").config();

const { sendEmail } = require("./services/emailService");

async function test() {
  try {
    console.log("==================================");
    console.log("Testing Email Service");
    console.log("==================================");

    if (!process.env.MAIL_USER) {
      throw new Error("MAIL_USER is missing in .env");
    }

    await sendEmail({
      to: process.env.MAIL_USER,
      subject: "Workspace Portal - Email Test",
      html: `
        <div style="font-family:Arial,sans-serif;padding:30px;">
          <h2>✅ Email Service Working</h2>
          <p>Your Workspace Portal email configuration is working correctly.</p>
        </div>
      `,
    });

    console.log("✅ Test email sent successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Email test failed:");
    console.error(err);
    process.exit(1);
  }
}

test();