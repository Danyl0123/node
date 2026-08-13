const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, min: 0, default: 0 },
    category: { type: String, required: true },
  },
  { timestamps: true },
);

productSchema.methods.toJSON = function () {
  const { __v, updatedAt, ...product } = this.toObject();
  return product;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
