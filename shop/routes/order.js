const {
  createOrder,
  getOrdersList,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/order");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const {
  createOrderSchema,
  updateOrderStatusSchema,
} = require("../validators/order");

const router = require("express").Router();

router.use(authMiddleware);

router.post("/", validate(createOrderSchema), createOrder);

router.get("/", getOrdersList);

router.get("/:id", getOrderById);

router.patch(
  "/:id/status",
  roleMiddleware(["admin"]),
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);

module.exports = router;
