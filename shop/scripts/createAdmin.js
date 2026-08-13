require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../configs/db.config");
const User = require("../models/user");
const { registerSchema } = require("../validators/auth");

const credentialsSchema = registerSchema.omit({ role: true, name: true });

async function createAdmin() {
  const [emailArg, passwordArg, nameArg] = process.argv.slice(2);

  const email = emailArg || process.env.ADMIN_EMAIL;
  const password = passwordArg || process.env.ADMIN_PASSWORD;
  const name = nameArg || process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.error("Email and password are required\n" + USAGE);
    process.exitCode = 1;
    return;
  }

  const result = credentialsSchema.safeParse({ email, password });
  if (!result.success) {
    console.error("Validation failed:");
    result.error.issues.forEach((issue) => {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    });
    process.exitCode = 1;
    return;
  }

  await connectDB();

  try {
    const existingUser = await User.findOne({ email: result.data.email });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log(`User ${existingUser.email} is already an admin`);
        return;
      }

      existingUser.role = "admin";
      await existingUser.save();
      console.log(`User ${existingUser.email} promoted to admin`);
      return;
    }

    const admin = await User.create({ ...result.data, name, role: "admin" });
    console.log(`Admin created: ${admin.email} `);
  } catch (e) {
    if (e.code === 11000) {
      console.error("User with this email already exists");
    } else {
      console.error("Failed to create admin:", e.message);
    }
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
