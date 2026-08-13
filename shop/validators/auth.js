const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().trim().min(1, "Name is required"),
  role: z
    .string()
    .toLowerCase()
    .optional()
    .refine((role) => role !== "admin", {
      message: "Role cannot be set to admin",
    }),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };
