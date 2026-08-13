const router = require("express").Router();
const authRoutes = require("./auth");
const productRouter = require("./product");

router.use("/auth", authRoutes);

router.use("/products", productRouter);

module.exports = router;
