const {
  getAllClients,
  createClient,
  deleteClients,
  findClientByName,
} = require("../models/clientModel");

/* ==========================================
   GET CLIENTS
========================================== */

exports.getClients = async (req, res) => {
  try {
    const clients = await getAllClients();

    return res.status(200).json({
      success: true,
      clients,
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
   CREATE CLIENT
========================================== */

exports.createClient = async (req, res) => {
  try {
    const { client_name } = req.body;

    if (!client_name) {
      return res.status(400).json({
        success: false,
        message: "Client name is required.",
      });
    }

    const existing = await findClientByName(client_name);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Client already exists.",
      });
    }

    await createClient(client_name);

    return res.status(201).json({
      success: true,
      message: "Client added successfully.",
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
   DELETE CLIENTS
========================================== */

exports.deleteClients = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No clients selected.",
      });
    }

    await deleteClients(ids);

    return res.status(200).json({
      success: true,
      message: "Selected clients deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};