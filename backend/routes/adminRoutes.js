const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  getUsers,
  getReports,
  getDashboard,
  createUser,
  updateUser,
} = require("../controllers/adminController");

/* ==========================================
   USERS
========================================== */

router.get("/users", verifyToken, getUsers);

router.post("/users", verifyToken, createUser);

router.put("/users/:id", verifyToken, updateUser);

/* ==========================================
   DASHBOARD
========================================== */

router.get("/dashboard", verifyToken, getDashboard);

/* ==========================================
   WEEKLY REPORTS
========================================== */

router.get("/reports", verifyToken, getReports);

module.exports = router;