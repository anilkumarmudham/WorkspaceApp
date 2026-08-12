const express = require("express");

const router = express.Router();

const {
  submitReport,
  myReports,
  allReports,
  updateReport,
} = require("../controllers/reportController");

const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, submitReport);

router.get("/my", verifyToken, myReports);
router.put("/:id", verifyToken, updateReport);

router.get("/", verifyToken, allReports);

module.exports = router;
