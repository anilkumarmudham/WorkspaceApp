const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const {
  createUser,
  findUserByEmail,
  getUserById,
  getPasswordById,
  updatePassword,
} = require("../models/userModel");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, team_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      name,
      email,
      password: hashedPassword,
      role,
      team_id,
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
   

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ===============================
    // Block inactive users
    // ===============================
    if (user.status && user.status.toLowerCase() !== "active") {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact the administrator.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    

    // ==========================
    // JWT DEBUG START
    // ==========================

    console.log("====================================");
    console.log("JWT DEBUG");
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("JWT_SECRET TYPE:", typeof process.env.JWT_SECRET);
    console.log("USER OBJECT:", user);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    console.log("PAYLOAD:", payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    console.log("TOKEN CREATED SUCCESSFULLY");
    console.log(token);
    console.log("====================================");

    // ==========================
    // JWT DEBUG END
    // ==========================

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.test = (req, res) => {
  res.json({
    success: true,
    message: "Authentication Route Working Successfully!",
  });
};
exports.profile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await getPasswordById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const matched = await bcrypt.compare(currentPassword, user.password);

    if (!matched) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await updatePassword(req.user.id, hashed);

    return res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
