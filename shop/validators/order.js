const { z } = require("zod");

const createOrderSchema = z
  .array(
    z.object({
      productId: z.string().trim().min(1, "productId is require"),
      quantity: z.number().int().min(1, "Quantity must be at least 1"),
    }),
  )
  .min(1);

const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "cancelled"]),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
