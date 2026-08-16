const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true, index: true },
    items: [
      {
        _id: false,
        product: { type: ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true, min: 0 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "cancelled", "paid", "shipped"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.methods.toJSON = function () {
  const { __v, updatedAt, ...order } = this.toObject();

  return order;
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
