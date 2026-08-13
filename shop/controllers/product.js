const Product = require("../models/product");

async function getAllProducts(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 2, 1); //оставлю так ибо у меня всего 5 айтемов
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const skip = (page - 1) * limit;

  try {
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    ]);
    res.status(200).json({ total, products });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createProduct(req, res) {
  const payload = req.body;
  try {
    const product = new Product(payload);
    await product.save();
    res.status(201).json(product);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: "Product is already exist" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getProductById(req, res) {
  const productId = req.params["id"];
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json("Product with this id is not found");
    }
    res.status(200).json(product);
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(400).json({ message: "Not valid id" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateProduct(req, res) {
  const productId = req.params["id"];
  const payload = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json("Product with this id is not found");
    }
    product.set(payload);
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(400).json({ message: "Not valid id" });
    }

    res.status(500).json("Internal server error");
  }
}

async function deleteProduct(req, res) {
  const productId = req.params["id"];

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json("Product with this id is not found");
    }

    await Product.deleteOne({ _id: productId });
    res.status(200).json();
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(400).json({ message: "Not valid id" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
