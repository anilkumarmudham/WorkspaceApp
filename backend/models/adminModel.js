const db = require("../config/db");

/* ==========================================
   GET ALL USERS
========================================== */

exports.getAllUsers = async () => {
  const [rows] = await db.query(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.phone,
      u.designation,
      u.role,
      u.status,
      u.team_id,
      u.created_at,
      t.team_name

    FROM users u

    LEFT JOIN teams t
      ON u.team_id = t.id

    ORDER BY u.created_at DESC
  `);

  return rows;
};

/* ==========================================
   GET ALL WEEKLY REPORTS
========================================== */

exports.getAllReports = async (from, to) => {
  let query = `
SELECT
    wr.id,
    wr.reporting_date,
    wr.created_at,
    wr.updated_at,
    wr.week_from,
    wr.week_to,
    wr.status,

    wr.client_name,
    wr.client_spoc,
    wr.project_name,
    wr.work_details,

    wr.is_edited,
    wr.edit_count,
    wr.last_edited_at,

    u.id AS user_id,
    u.name AS employee_name,
    u.email,

    t.team_name

FROM weekly_reports wr

LEFT JOIN users u
    ON wr.user_id = u.id

LEFT JOIN teams t
    ON wr.team = t.team_name
`;

  const params = [];

  if (from && to) {
    query += `
        WHERE
            DATE(wr.reporting_date) BETWEEN ? AND ?
    `;

    params.push(from, to);
  }

  query += `
    ORDER BY wr.reporting_date DESC, wr.created_at DESC
  `;

  console.log(query);
  console.log(params);
  const [rows] = await db.query(query, params);

  return rows;
};

/* ==========================================
   DASHBOARD STATS
========================================== */

exports.getDashboardStats = async () => {
  // Total Users
  const [[totalUsers]] = await db.query(`
    SELECT COUNT(*) AS count
    FROM users
  `);

  // Contractors
  const [[contractors]] = await db.query(`
    SELECT COUNT(*) AS count
    FROM users
    WHERE role = 'Contractor'
  `);

  // Employees
  const [[employees]] = await db.query(`
    SELECT COUNT(*) AS count
    FROM users
    WHERE role = 'Employee'
  `);

  // Clients
  const [[clients]] = await db.query(`
    SELECT COUNT(*) AS count
    FROM users
    WHERE role = 'Client'
  `);

  // Submitted Reports
  const [[submitted]] = await db.query(`
    SELECT COUNT(*) AS count
    FROM weekly_report_status
    WHERE status='Submitted'
`);

  // Pending Reports
  const [[pending]] = await db.query(`
    SELECT COUNT(*) AS count
    FROM weekly_report_status
    WHERE status='Pending'
`);

  // Overdue Reports
  const [[overdue]] = await db.query(`
    SELECT COUNT(*) AS count
    FROM weekly_report_status
    WHERE status='Overdue'
`);

  return {
    totalUsers: totalUsers.count || 0,
    contractors: contractors.count || 0,
    employees: employees.count || 0,
    clients: clients.count || 0,

    submitted: submitted.count || 0,
    pending: pending.count || 0,
    overdue: overdue.count || 0,
  };
};
