const Product = require("../models/productModel");
const cache = require("../utils/cache");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 100;

function parsePositiveInt(value, fallback, max) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return max ? Math.min(parsed, max) : parsed;
}

function productNotFound() {
  const err = new Error("Product not found");
  err.statusCode = 404;

  return err;
}

async function getProducts(req, res) {
  const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
  const limit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT, MAX_LIMIT);

  const cacheKey = `products:page=${page}:limit=${limit}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`дані з кешу`);

    return res.status(200).json(cached);
  }

  const [products, total] = await Promise.all([
    Product.find()
      .sort({ _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(),
  ]);

  const payload = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    products,
  };

  cache.set(cacheKey, payload);
  console.log(`дані з MongoDB`);

  res.status(200).json(payload);
}

async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw productNotFound();
  }

  res.status(200).json(product);
}

async function createProduct(req, res) {
  const product = await Product.create(req.body);

  res.status(201).json(product);
}

async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw productNotFound();
  }

  res.status(200).json(product);
}

async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw productNotFound();
  }

  res.status(200).json({ message: "Product deleted successfully" });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
