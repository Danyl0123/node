const router = require("express").Router();
const authRoutes = require("./auth");
const productRouter = require("./product");
const orderRouter = require("./order");

router.use("/auth", authRoutes);

router.use("/products", productRouter);

router.use("/orders", orderRouter);

module.exports = router;
