const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
  getClients,
  createClient,
  deleteClients,
} = require("../controllers/clientController");

// Everyone who is logged in can fetch clients
router.get("/", verifyToken, getClients);

// Only admin should create/delete (you can add admin middleware later)
router.post("/", verifyToken, createClient);
router.delete("/", verifyToken, deleteClients);

module.exports = router;