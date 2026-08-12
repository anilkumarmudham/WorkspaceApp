const db = require("../config/db");

/* ==========================================
   GET ALL TEAMS
========================================== */

const getAllTeams = async () => {
  const [rows] = await db.query(`
    SELECT
      id,
      team_name,
      created_at
    FROM teams
    ORDER BY team_name ASC
  `);

  return rows;
};

/* ==========================================
   CREATE TEAM
========================================== */

const createTeam = async (team_name) => {
  const [result] = await db.query(
    `
    INSERT INTO teams
    (team_name)
    VALUES (?)
    `,
    [team_name]
  );

  return result;
};

/* ==========================================
   DELETE TEAMS
========================================== */

const deleteTeams = async (ids) => {
  const placeholders = ids.map(() => "?").join(",");

  const [result] = await db.query(
    `
    DELETE FROM teams
    WHERE id IN (${placeholders})
    `,
    ids
  );

  return result;
};

/* ==========================================
   FIND TEAM
========================================== */

const findTeamByName = async (team_name) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM teams
    WHERE team_name = ?
    `,
    [team_name]
  );

  return rows[0];
};

module.exports = {
  getAllTeams,
  createTeam,
  deleteTeams,
  findTeamByName,
};