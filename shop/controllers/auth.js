const User = require("../models/user");
const { generateToken } = require("../utils/jwt");

async function registerUser(req, res) {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const user = await User.create({ email, password, name });
    const accessToken = generateToken({ id: user._id, role: user.role });
    res.status(201).json({ user, accessToken });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }
    console.error("registerUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateToken({ id: user._id, role: user.role });

    res.status(200).json({ user, accessToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getCurrentUser(req, res) {
  const userId = req.user.id;
  console.log(userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
