const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const REFRESH_COOKIE_NAME = "refreshToken";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/auth",
};

async function issueTokens(res, user) {
  const accessToken = generateToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  const { exp } = verifyRefreshToken(refreshToken);
  const expiresAt = new Date(exp * 1000);

  await RefreshToken.create({ token: refreshToken, user: user._id, expiresAt });
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...refreshCookieOptions,
    expires: expiresAt,
  });

  return accessToken;
}

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
    const accessToken = await issueTokens(res, user);
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

    const accessToken = await issueTokens(res, user);

    res.status(200).json({ user, accessToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function refreshTokens(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }

  try {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (e) {
      await RefreshToken.deleteOne({ token });
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      const message =
        e.name === "TokenExpiredError"
          ? "Refresh token expired"
          : "Invalid refresh token";
      return res.status(401).json({ message });
    }

    const storedToken = await RefreshToken.findOneAndDelete({ token });
    if (!storedToken) {
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      return res.status(401).json({ message: "Refresh token is revoked" });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = await issueTokens(res, user);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("refreshTokens error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutUser(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];

  try {
    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getCurrentUser(req, res) {
  const userId = req.user.id;

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
  refreshTokens,
  logoutUser,
  getCurrentUser,
};
