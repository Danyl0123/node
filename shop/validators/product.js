const { z } = require("zod");

const productSchema = z.object({
  title: z.string().trim().min(1, "Title is require"),
  description: z.string().trim().min(1, "Description is require"),
  price: z.number().min(0, "Price is require"),
  stock: z.number().min(0).optional(),
  category: z.string().trim().min(1, "Category is require"),
});

module.exports = productSchema;
