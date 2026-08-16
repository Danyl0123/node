const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    user: { type: ObjectId, ref: "User", required: true, index: true },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true },
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken;
