const db = require("../config/db");

/* ==========================================
   Get Pending Reports
========================================== */

exports.getPendingUsers = async (weekFrom, weekTo) => {
  const [rows] = await db.query(
    `
    SELECT
      wrs.user_id,
      u.name,
      u.email,
      wrs.week_from,
      wrs.week_to
    FROM weekly_report_status wrs
    INNER JOIN users u
      ON wrs.user_id = u.id
    WHERE
      wrs.status = 'Pending'
      AND wrs.week_from = ?
      AND wrs.week_to = ?
      AND u.role = 'contractor'
      AND u.status = 'Active'
    `,
    [weekFrom, weekTo]
  );

  return rows;
};

/* ==========================================
   Get Overdue Reports
========================================== */

exports.getOverdueUsers = async () => {
  const [rows] = await db.query(
    `
    SELECT
      wrs.id,
      wrs.user_id,
      u.name,
      u.email,
      wrs.week_from,
      wrs.week_to
    FROM weekly_report_status wrs
    INNER JOIN users u
      ON wrs.user_id = u.id
    WHERE
      wrs.status = 'Overdue'
      AND u.role = 'contractor'
      AND u.status = 'Active'
    ORDER BY
      u.name,
      wrs.week_from
    `
  );

  return rows;
};

/* ==========================================
   Mark Pending -> Overdue
========================================== */

exports.markPendingAsOverdue = async () => {
  const [result] = await db.query(
    `
    UPDATE weekly_report_status
    SET status='Overdue'
    WHERE status='Pending'
    `
  );

  return result;
};