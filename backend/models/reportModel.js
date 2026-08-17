const db = require("../config/db");

exports.createReport = async (reportData) => {
  const {
    user_id,
    reporting_date,
    week_from,
    week_to,
    status,
    client_name,
    team,
    client_spoc,
    project_name,
    work_details,
  } = reportData;

  const [result] = await db.query(
    `INSERT INTO weekly_reports
    (
        user_id,
        reporting_date,
        week_from,
        week_to,
        status,
        client_name,
        team,
        client_spoc,
        project_name,
        work_details
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

    [
      user_id,
      reporting_date,
      week_from,
      week_to,
      status,
      client_name,
      team,
      client_spoc,
      project_name,
      work_details,
    ],
  );

  // Mark this week's pending record as submitted
  await db.query(
    `UPDATE weekly_report_status
     SET
        status = 'Submitted',
        report_id = ?
     WHERE
        user_id = ?
        AND week_from = ?
        AND week_to = ?`,

    [result.insertId, user_id, week_from, week_to],
  );

  return result;
};

exports.getMyReports = async (userId) => {
  const [rows] = await db.query(
    `
SELECT *
FROM weekly_reports
WHERE user_id = ?
ORDER BY reporting_date DESC, created_at DESC
`,
    [userId],
  );

  return rows;
};
exports.getAllReports = async () => {
  console.log("========== DATABASE DEBUG ==========");

  // Check which database the backend is actually connected to
  const [dbInfo] = await db.query(`
    SELECT
      DATABASE() AS database_name,
      @@hostname AS hostname
  `);

  console.log("DATABASE INFO:", dbInfo);

  // Check the actual Team values coming from the database
  const [teamRows] = await db.query(`
    SELECT
      id,
      client_name,
      team,
      client_spoc,
      project_name
    FROM weekly_reports
    ORDER BY id DESC
    LIMIT 10
  `);

  console.log("TEAM DATA FROM DATABASE:", teamRows);

  // Actual reports query
  const [rows] = await db.query(`
    SELECT
      wr.id,

      u.name AS employee,
      u.email,

      wr.reporting_date AS reportingDate,
      wr.week_from AS weekFrom,
      wr.week_to AS weekTo,

      wr.client_name AS client,
      wr.team,
      wr.client_spoc AS spoc,
      wr.project_name AS project,
      wr.work_details AS work,

      wr.created_at AS submittedAt,

      wr.is_edited AS edited,
      wr.edit_count,
      wr.last_edited_at

    FROM weekly_reports wr

    JOIN users u
      ON wr.user_id = u.id

    ORDER BY wr.reporting_date DESC
  `);

  console.log("FINAL REPORT DATA:", rows);

  return rows;
};

exports.updateReport = async (reportId, userId, reportData) => {
  const {
    week_from,
    week_to,
    client_name,
    team,
    client_spoc,
    project_name,
    work_details,
  } = reportData;

  const [rows] = await db.query(
    `
    SELECT *
    FROM weekly_reports
    WHERE id = ?
      AND user_id = ?
    `,
    [reportId, userId],
  );

  if (!rows.length) {
    throw new Error("Report not found.");
  }

  const report = rows[0];

  // Allow editing until the end of the day after Week To
  const editableUntil = new Date(report.week_to);
  editableUntil.setDate(editableUntil.getDate() + 1);
  editableUntil.setHours(23, 59, 59, 999);

  if (new Date() > editableUntil) {
    throw new Error("Editing period has expired.");
  }

  await db.query(
    `
    UPDATE weekly_reports
    SET
      reporting_date = CURDATE(),

      week_from = ?,
      week_to = ?,

      client_name = ?,
      team = ?,
      client_spoc = ?,
      project_name = ?,
      work_details = ?,

      is_edited = TRUE,
      edit_count = edit_count + 1,
      updated_at = NOW(),
      last_edited_at = NOW()

    WHERE id = ?
    `,
    [
      week_from,
      week_to,
      client_name,
      team,
      client_spoc,
      project_name,
      work_details,
      reportId,
    ],
  );

  return true;
};
