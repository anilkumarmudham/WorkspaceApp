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
    console.log("========== ADMIN REPORT DEBUG ==========");
    console.log("REPORT COUNT:", reports.length);
    console.log("FIRST REPORT FROM MODEL:", reports[0]);
    console.log("FIRST REPORT TEAM:", reports[0]?.team);
    console.log("========================================");
    const formattedReports = reports.map((report) => ({
      id: report.id,

      employee: report.employee,
      email: report.email,

      reportingDate:
        report.edited && report.last_edited_at
          ? report.last_edited_at
          : report.reportingDate,

      submittedAt: report.last_edited_at || report.submittedAt,

      weekFrom: report.weekFrom,
      weekTo: report.weekTo,

      client: report.client,
      spoc: report.spoc,
      team: report.team,
      project: report.project,
      work: report.work,

      status: report.status,
      edited: report.edited,
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
