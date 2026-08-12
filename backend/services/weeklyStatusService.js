const db = require("../config/db");

exports.processWeeklyRollover = async () => {
  try {
    const today = new Date();

    // ==========================================
    // Calculate Current Week (Friday → Thursday)
    // (We'll change this to Monday → Sunday later)
    // ==========================================

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

    const formatDate = (date) => date.toISOString().split("T")[0];

    const weekFromStr = formatDate(weekFrom);
    const weekToStr = formatDate(weekTo);

    console.log("=====================================");
    console.log("Weekly Rollover");
    console.log(weekFromStr, "->", weekToStr);
    console.log("=====================================");

    // ==========================================
    // Already created?
    // ==========================================

    const [existing] = await db.query(
      `
SELECT id
FROM weekly_report_status
WHERE week_from = ?
LIMIT 1
`,
      [weekFromStr],
    );

    if (existing.length > 0) {
      console.log("Weekly records already exist.");
      return;
    }

    // ==========================================
    // Previous Pending -> Overdue
    // ==========================================

    const [updateResult] = await db.query(`
      UPDATE weekly_report_status
      SET status='Overdue'
      WHERE status='Pending'
    `);

    console.log(
      `${updateResult.affectedRows} Pending reports moved to Overdue.`,
    );

    // ==========================================
    // Active Contractors
    // ==========================================

    const [contractors] = await db.query(`
      SELECT id, name
      FROM users
      WHERE role='contractor'
      AND status='Active'
    `);

    console.log(`Found ${contractors.length} active contractors.`);

    // ==========================================
    // Create New Pending Records
    // ==========================================

    for (const contractor of contractors) {
      await db.query(
        `
        INSERT INTO weekly_report_status
        (
          user_id,
          week_from,
          week_to,
          status
        )
        VALUES (?, ?, ?, 'Pending')
        `,
        [contractor.id, weekFromStr, weekToStr],
      );

      console.log(`Created Pending record for ${contractor.name}`);
    }

    console.log("Weekly rollover completed successfully.");
  } catch (error) {
    console.error("Weekly rollover failed:");
    console.error(error);
  }
};
