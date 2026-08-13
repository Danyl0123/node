const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const productSchema = require("../validators/product");

const router = require("express").Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(productSchema),
  createProduct,
);

router.put(
  "/:id",
  roleMiddleware(["admin"]),
  validate(productSchema),
  updateProduct,
);

router.delete("/:id", roleMiddleware(["admin"]), deleteProduct);

module.exports = router;
