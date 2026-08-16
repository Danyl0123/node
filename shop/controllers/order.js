const Order = require("../models/orders");
const Product = require("../models/product");

function restoreStock(items) {
  return Promise.all(
    items.map((item) =>
      Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
      ),
    ),
  );
}

async function createOrder(req, res) {
  const userId = req.user.id;

  const quantityByProductId = new Map();
  for (const { productId, quantity } of req.body) {
    const alreadyRequested = quantityByProductId.get(productId) || 0;
    quantityByProductId.set(productId, alreadyRequested + quantity);
  }

  const productIds = [...quantityByProductId.keys()];

  try {
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((product) => product.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));
      return res.status(404).json({
        message: `Products with this id are not found: ${missingIds.join(", ")}`,
      });
    }

    const items = [];
    let total = 0;

    for (const product of products) {
      const quantity = quantityByProductId.get(product.id);

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${product.title}"`,
          requested: quantity,
          available: product.stock,
        });
      }

      items.push({
        product: product._id,
        quantity,
        priceAtPurchase: product.price,
      });
      total += product.price * quantity;
    }

    const decrementedItems = [];

    for (const item of items) {
      const result = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
      );

      if (result.modifiedCount !== 1) {
        await restoreStock(decrementedItems);
        const product = products.find((candidate) =>
          candidate._id.equals(item.product),
        );
        return res
          .status(400)
          .json({ message: `Not enough stock for "${product.title}"` });
      }

      decrementedItems.push(item);
    }

    try {
      const order = await Order.create({ user: userId, items, total });
      res.status(201).json(order);
    } catch (e) {
      await restoreStock(decrementedItems);
      throw e;
    }
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(400).json({ message: "Not valid id" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getOrdersList(req, res) {
  const user = req.user;
  const filter = user.role === "admin" ? {} : { user: user.id };
  try {
    const ordersList = await Order.find(filter).populate(
      "items.product",
      "title price",
    );
    res.status(200).json(ordersList);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getOrderById(req, res) {
  const orderId = req.params.id;
  const user = req.user;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order with this id is not found" });
    }

    if (user.id !== order.user.toString() && user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(200).json(order);
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(400).json({ message: "Not valid id" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateOrderStatus(req, res) {
  const orderId = req.params.id;
  const newStatus = req.body.status;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true, runValidators: true },
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order with this id is not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(400).json({ message: "Not valid id" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createOrder,
  getOrdersList,
  getOrderById,
  updateOrderStatus,
};
