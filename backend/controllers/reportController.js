const {
  createReport,
  getMyReports,
  getAllReports,
  updateReport,
} = require("../models/reportModel");

exports.submitReport = async (req, res) => {
  try {
    const reportData = {
      user_id: req.user.id,

      reporting_date: req.body.reporting_date,

      week_from: req.body.week_from,

      week_to: req.body.week_to,

      status: req.body.status || "Submitted",

      client_name: req.body.client_name,

      team: req.body.team,

      client_spoc: req.body.client_spoc,

      project_name: req.body.project_name,

      work_details: req.body.work_details,
    };

    await createReport(reportData);

    return res.status(201).json({
      success: true,

      message: "Weekly Report Submitted Successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
exports.updateReport = async (req, res) => {
  try {
    console.log("========== UPDATE REQUEST ==========");
    console.log(req.body);
    console.log("===================================");

    await updateReport(req.params.id, req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Report updated successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.myReports = async (req, res) => {
  try {
    console.log("User ID:", req.user.id);

    const reports = await getMyReports(req.user.id);

    console.log("Reports:", reports);

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("MY REPORT ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.allReports = async (req, res) => {
  try {
    const reports = await getAllReports();

    return res.status(200).json({
      success: true,

      count: reports.length,

      reports,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

