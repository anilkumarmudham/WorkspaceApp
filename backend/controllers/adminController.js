const bcrypt = require("bcrypt");

const {
  getAllUsers,
  getAllReports,
  getDashboardStats,
} = require("../models/adminModel");

const {
  createUser,
  findUserByEmail,
  updateUser,
} = require("../models/userModel");

/* ==========================================
   GET ALL USERS
========================================== */

exports.getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET ALL WEEKLY REPORTS
========================================== */

exports.getReports = async (req, res) => {
  try {
    const { from, to } = req.query;

    console.log("From:", from);
    console.log("To:", to);

    const reports = await getAllReports(from, to);

    const formattedReports = reports.map((report) => ({
      id: report.id,

      employee: report.employee_name,
      email: report.email,

      reportingDate:
        report.is_edited && report.last_edited_at
          ? report.last_edited_at
          : report.reporting_date,

      submittedAt:
        report.last_edited_at || report.updated_at || report.created_at,

      weekFrom: report.week_from,
      weekTo: report.week_to,

      client: report.client_name,
      spoc: report.client_spoc,
      team: report.team_name,
      project: report.project_name,
      work: report.work_details,

      status: report.status,
      edited: report.is_edited,
    }));

    return res.status(200).json({
      success: true,
      reports: formattedReports,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET DASHBOARD STATS
========================================== */

exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await getDashboardStats();

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   CREATE USER
========================================== */

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, team_id, phone, designation, status } =
      req.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      name,
      email,
      password: hashedPassword,
      role,
      team_id,
      phone,
      designation,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   UPDATE USER
========================================== */

exports.updateUser = async (req, res) => {
  try {
    console.log("========== UPDATE REQUEST ==========");
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("====================================");

    const { id } = req.params;

    const { name, email, role, team_id, phone, designation, status, password } =
      req.body;

    let hashedPassword = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await updateUser({
      id,
      name,
      email,
      role,
      team_id,
      phone,
      designation,
      status,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
