const mongoose = require("mongoose");
const Product = require("../models/productModel");
const User = require("../models/userModel");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Promise.all([Product.init(), User.init()]);

    const productIndexes = await Product.listIndexes();
    const userIndexes = await User.listIndexes();

    console.log("User indexes:", userIndexes);
    console.log("Product indexes:", productIndexes);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
