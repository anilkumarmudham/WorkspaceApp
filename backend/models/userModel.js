const db = require("../config/db");

/* ==========================================
   CREATE USER
========================================== */

const createUser = async (userData) => {
  const {
    name,
    email,
    password,
    role,
    team_id,
    phone,
    designation,
    status,
  } = userData;

  const query = `
    INSERT INTO users
    (
      name,
      email,
      password,
      role,
      team_id,
      phone,
      designation,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    name,
    email,
    password,
    role,
    team_id,
    phone,
    designation,
    status,
  ]);

  return result;
};

/* ==========================================
   FIND USER BY EMAIL
========================================== */

const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM users
    WHERE email = ?
    `,
    [email]
  );

  return rows[0];
};

/* ==========================================
   GET USER BY ID
========================================== */

const getUserById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.phone,
      u.role,
      u.team_id,
      u.designation,
      u.status,
      t.team_name
    FROM users u
    LEFT JOIN teams t
      ON u.team_id = t.id
    WHERE u.id = ?
    `,
    [id]
  );

  return rows[0];
};

/* ==========================================
   UPDATE USER
========================================== */

const updateUser = async (userData) => {

  const {
    id,
    name,
    email,
    role,
    team_id,
    phone,
    designation,
    status,
    password,
  } = userData;

  let query = `
    UPDATE users
    SET
      name = ?,
      email = ?,
      role = ?,
      team_id = ?,
      phone = ?,
      designation = ?,
      status = ?
  `;

  const values = [
    name,
    email,
    role,
    team_id,
    phone,
    designation,
    status,
  ];

  if (password) {
    query += `, password = ?`;
    values.push(password);
  }

  query += ` WHERE id = ?`;

  values.push(id);

  const [result] = await db.query(query, values);

  return result;
};
const getPasswordById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT password
    FROM users
    WHERE id = ?
    `,
    [id]
  );

  return rows[0];
};

const updatePassword = async (id, password) => {
  const [result] = await db.query(
    `
    UPDATE users
    SET password = ?
    WHERE id = ?
    `,
    [password, id]
  );

  return result;
};
module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  updateUser,
  getPasswordById,
  updatePassword,
};