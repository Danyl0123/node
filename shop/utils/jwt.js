const jwt = require("jsonwebtoken");

function generateToken(payload) {
  const { id, role } = payload;
  if (!id || !role) {
    throw new Error("Payload must contain id and role");
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
