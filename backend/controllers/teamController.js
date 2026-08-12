const {
  getAllTeams,
  createTeam,
  deleteTeams,
  findTeamByName,
} = require("../models/teamModel");

/* ==========================================
   GET TEAMS
========================================== */

exports.getTeams = async (req, res) => {
  try {
    const teams = await getAllTeams();

    return res.status(200).json({
      success: true,
      teams,
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
   CREATE TEAM
========================================== */

exports.createTeam = async (req, res) => {
  try {
    const { team_name } = req.body;

    if (!team_name) {
      return res.status(400).json({
        success: false,
        message: "Team name is required.",
      });
    }

    const existing = await findTeamByName(team_name);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Team already exists.",
      });
    }

    await createTeam(team_name);

    return res.status(201).json({
      success: true,
      message: "Team added successfully.",
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
   DELETE TEAMS
========================================== */

exports.deleteTeams = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No teams selected.",
      });
    }

    await deleteTeams(ids);

    return res.status(200).json({
      success: true,
      message: "Selected teams deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};