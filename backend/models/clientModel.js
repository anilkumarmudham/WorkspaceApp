const db = require("../config/db");

/* ==========================================
   GET ALL CLIENTS
========================================== */

const getAllClients = async () => {
  const [rows] = await db.query(`
    SELECT
      id,
      client_name,
      created_at
    FROM clients
    ORDER BY client_name ASC
  `);

  return rows;
};

/* ==========================================
   CREATE CLIENT
========================================== */

const createClient = async (client_name) => {
  const [result] = await db.query(
    `
    INSERT INTO clients
    (client_name)
    VALUES (?)
    `,
    [client_name]
  );

  return result;
};

/* ==========================================
   DELETE CLIENTS
========================================== */

const deleteClients = async (ids) => {
  const placeholders = ids.map(() => "?").join(",");

  const [result] = await db.query(
    `
    DELETE FROM clients
    WHERE id IN (${placeholders})
    `,
    ids
  );

  return result;
};

/* ==========================================
   CHECK EXISTING CLIENT
========================================== */

const findClientByName = async (client_name) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM clients
    WHERE client_name = ?
    `,
    [client_name]
  );

  return rows[0];
};

module.exports = {
  getAllClients,
  createClient,
  deleteClients,
  findClientByName,
};