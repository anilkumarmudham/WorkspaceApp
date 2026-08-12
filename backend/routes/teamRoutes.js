const express = require("express");
const router = express.Router();

const {
    getTeams,
    createTeam,
    deleteTeams,
} = require("../controllers/teamController");

const {
    verifyToken,
    isAdmin,
} = require("../middleware/authMiddleware");

router.get("/", verifyToken, isAdmin, getTeams);
router.post("/", verifyToken, isAdmin, createTeam);
router.delete("/", verifyToken, isAdmin, deleteTeams);

module.exports = router;