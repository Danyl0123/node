const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/auth");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/auth");

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), loginUser);

router.use(authMiddleware);

router.get("/me", getCurrentUser);

module.exports = router;
